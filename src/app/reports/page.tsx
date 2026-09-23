interface Report {
  _id: string;
  title: string;
  fileUrl: string;
}

async function getReports(): Promise<Report[]> {
  const response = await fetch("http://localhost:5000/api/reports", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reports");
  }

  return response.json();
}

export default async function ReportPage() {
  const reports = await getReports();

  return (
    <main className="min-h-screen bg-gray-100 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="font-semibold uppercase text-yellow-500">Our Update</p>

          <h1 className="mt-2 text-3xl font-semibold text-gray-700">Report</h1>

          <p className="mt-2 text-gray-500">More Reports View</p>
        </div>

        <div className="overflow-x-auto bg-white shadow-sm">
          <table className="w-full min-w-[600px]">
            <thead className="bg-yellow-50">
              <tr>
                <th className="px-6 py-4 text-left">Particular Description</th>

                <th className="px-6 py-4 text-center">Download</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={report._id} className="border-t border-gray-200">
                  <td className="px-6 py-4 text-gray-700">{report.title}</td>

                  <td className="px-6 py-4 text-center">
                    {report.fileUrl ? (
                      <a
                        href={`http://localhost:5000${report.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-green-600 px-5 py-2 text-sm text-white hover:bg-[#1F3C88]"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-400">No file</span>
                    )}
                  </td>
                </tr>
              ))}

              {reports.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No reports available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
