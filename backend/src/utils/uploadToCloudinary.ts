import sharp from "sharp";

import cloudinary from "../config/cloudinary.js";

const MAX_IMAGE_INPUT_SIZE = 25 * 1024 * 1024;
const MAX_IMAGE_OUTPUT_SIZE = 10 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 1920;
const IMAGE_QUALITY = 82;

const TOO_LARGE_IMAGE_MESSAGE =
  "Image is still too large after optimization. Please upload a smaller image.";

async function optimizeImageBuffer(buffer: Buffer) {
  const metadata = await sharp(buffer).metadata();

  const pipeline = sharp(buffer).rotate().resize({
    width: MAX_IMAGE_WIDTH,
    height: 9999,
    fit: "inside",
    withoutEnlargement: true,
  });

  const optimized = await pipeline
    .webp({
      quality: IMAGE_QUALITY,
      effort: 6,
    })
    .toBuffer();

  if (optimized.length > MAX_IMAGE_OUTPUT_SIZE) {
    throw new Error(TOO_LARGE_IMAGE_MESSAGE);
  }

  if (metadata.format === "png" || metadata.format === "jpeg") {
    const fallback = await sharp(buffer)
      .rotate()
      .resize({
        width: MAX_IMAGE_WIDTH,
        height: 9999,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: IMAGE_QUALITY,
        progressive: true,
        mozjpeg: true,
      })
      .toBuffer();

    if (
      fallback.length <= optimized.length &&
      fallback.length <= MAX_IMAGE_OUTPUT_SIZE
    ) {
      return fallback;
    }
  }

  return optimized;
}

export function uploadFileToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: "image" | "raw" = "image",
) {
  return new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          if (
            typeof error === "object" &&
            error !== null &&
            "http_code" in error &&
            error.http_code === 413
          ) {
            reject(new Error(TOO_LARGE_IMAGE_MESSAGE));
            return;
          }

          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    uploadStream.end(buffer);
  });
}

export async function uploadImageToCloudinary(buffer: Buffer, folder: string) {
  if (buffer.length > MAX_IMAGE_INPUT_SIZE) {
    throw new Error("Image exceeds the 25MB upload limit.");
  }

  const optimizedBuffer = await optimizeImageBuffer(buffer);

  return uploadFileToCloudinary(optimizedBuffer, folder, "image");
}
