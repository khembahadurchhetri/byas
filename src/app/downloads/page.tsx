interface DownloadItem {
  _id: string;
  title: string;
  fileUrl: string;
  published: boolean;
}

async function getDownloads(): Promise<DownloadItem[]> {
  const response = await fetch(
    "http://localhost:5000/api/downloads",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load downloads");
  }

  return response.json();
}

export default async function DownloadsPage() {
  const downloads = await getDownloads();

  return (
    <main className="min-h-screen bg-gray-100 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-gray-700">
            Downloads
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            More Reports View
          </p>
        </div>

        <div className="overflow-x-auto bg-white shadow-sm">
          <table className="w-full min-w-[600px] border-collapse">

            <thead>
              <tr className="bg-yellow-100">
                <th className="border border-gray-200 px-5 py-4 text-left font-semibold text-gray-700">
                  Particular
                </th>

                <th className="w-40 border border-gray-200 px-5 py-4 text-center font-semibold text-gray-700">
                  Download
                </th>
              </tr>
            </thead>

            <tbody>
              {downloads.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="border border-gray-200 px-5 py-10 text-center text-gray-500"
                  >
                    No downloads available.
                  </td>
                </tr>
              ) : (
                downloads.map((item) => (
                  <tr key={item._id}>
                    <td className="border border-gray-200 px-5 py-4 text-gray-700">
                      {item.title}
                    </td>

                    <td className="border border-gray-200 px-5 py-4 text-center">
                      {item.fileUrl ? (
                        <a
                          href={`http://localhost:5000${item.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-block bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">
                          No file
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

      </div>
    </main>
  );
}