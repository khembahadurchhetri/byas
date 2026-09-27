import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const execFileAsync = promisify(execFile);

const TARGET_SIZE =
  9.5 * 1024 * 1024;

function getGhostscriptCommand() {
  return (
    process.env.GHOSTSCRIPT_PATH ||
    (process.platform === "win32"
      ? "gswin64c"
      : "gs")
  );
}

function formatMb(bytes: number) {
  return (
    bytes /
    1024 /
    1024
  ).toFixed(2);
}

async function runGhostscript(
  inputBuffer: Buffer,
  settings: {
    preset?: string;
    dpi?: number;
  }
): Promise<Buffer> {
  const id = crypto.randomUUID();

  const inputPath = path.join(
    os.tmpdir(),
    `${id}-input.pdf`
  );

  const outputPath = path.join(
    os.tmpdir(),
    `${id}-output.pdf`
  );

  try {
    await fs.writeFile(
      inputPath,
      inputBuffer
    );

    const args = [
      "-sDEVICE=pdfwrite",
      "-dCompatibilityLevel=1.4",

      "-dNOPAUSE",
      "-dQUIET",
      "-dBATCH",

      "-dDetectDuplicateImages=true",
      "-dCompressFonts=true",
      "-dSubsetFonts=true",

      ...(settings.preset
        ? [
            `-dPDFSETTINGS=${settings.preset}`,
          ]
        : []),

      ...(settings.dpi
        ? [
            "-dDownsampleColorImages=true",
            "-dColorImageDownsampleType=/Bicubic",
            `-dColorImageResolution=${settings.dpi}`,

            "-dDownsampleGrayImages=true",
            "-dGrayImageDownsampleType=/Bicubic",
            `-dGrayImageResolution=${settings.dpi}`,

            "-dDownsampleMonoImages=true",
            "-dMonoImageDownsampleType=/Subsample",
            `-dMonoImageResolution=${Math.max(
              settings.dpi * 2,
              150
            )}`,
          ]
        : []),

      `-sOutputFile=${outputPath}`,
      inputPath,
    ];

    await execFileAsync(
      getGhostscriptCommand(),
      args,
      {
        maxBuffer:
          20 * 1024 * 1024,
      }
    );

    return await fs.readFile(
      outputPath
    );
  } finally {
    await Promise.allSettled([
      fs.unlink(inputPath),
      fs.unlink(outputPath),
    ]);
  }
}

export async function compressPdf(
  inputBuffer: Buffer
): Promise<Buffer> {
  console.log(
    `Original PDF: ${formatMb(
      inputBuffer.length
    )} MB`
  );

  // Level 1: better quality
  let result =
    await runGhostscript(
      inputBuffer,
      {
        preset: "/ebook",
        dpi: 150,
      }
    );

  console.log(
    `PDF after level 1: ${formatMb(
      result.length
    )} MB`
  );

  if (
    result.length <= TARGET_SIZE
  ) {
    return result;
  }

  // Level 2: stronger compression
  result =
    await runGhostscript(
      inputBuffer,
      {
        preset: "/screen",
        dpi: 110,
      }
    );

  console.log(
    `PDF after level 2: ${formatMb(
      result.length
    )} MB`
  );

  if (
    result.length <= TARGET_SIZE
  ) {
    return result;
  }

  // Level 3: aggressive compression
  result =
    await runGhostscript(
      inputBuffer,
      {
        dpi: 80,
      }
    );

  console.log(
    `PDF after level 3: ${formatMb(
      result.length
    )} MB`
  );

  return result;
}