import {
  CalendarDays,
  Download,
  FileText,
} from "lucide-react";

interface Report {
  _id: string;
  title: string;
  fileUrl: string;
  reportDate?: string;
  createdAt?: string;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

async function getReports(): Promise<Report[]> {
  const response = await fetch(
    `${BACKEND_URL}/api/reports`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch reports"
    );
  }

  return response.json();
}

function formatDate(
  value?: string
) {
  if (!value) return "—";

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }
  );
}

export default async function ReportPage() {
  const reports =
    await getReports();

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      {/* HEADER */}

      <section className="border-b border-blue-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#1F3C88]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
              Our Updates
            </p>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Reports
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            View and download published
            reports from Byas Saving &
            Credit Co-Operative Ltd.
          </p>
        </div>
      </section>

      {/* REPORTS */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {reports.length ===
        0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#1F3C88]">
              <FileText
                size={24}
              />
            </div>

            <p className="mt-4 text-sm font-medium text-gray-600">
              No reports
              available.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(
              (report) => (
                <article
                  key={
                    report._id
                  }
                  className="group flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-6"
                >
                  {/* LEFT */}

                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#1F3C88] transition group-hover:bg-[#1F3C88] group-hover:text-white">
                      <FileText
                        size={20}
                      />
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-base font-bold leading-6 text-gray-900 sm:text-lg">
                        {
                          report.title
                        }
                      </h2>

                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                        <CalendarDays
                          size={14}
                        />

                        <span>
                          {formatDate(
                            report.reportDate ||
                              report.createdAt
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* DOWNLOAD */}

                  <div className="shrink-0">
                    {report.fileUrl ? (
                      <a
                        href={`${BACKEND_URL}${report.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F3C88] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#162E6A] sm:w-auto"
                      >
                        <Download
                          size={
                            16
                          }
                        />

                        View PDF
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">
                        No file
                      </span>
                    )}
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}