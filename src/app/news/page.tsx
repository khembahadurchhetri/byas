import Link from "next/link";

interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl: string;
  createdAt: string;
}

async function getNews(): Promise<
  NewsItem[]
> {
  const response =
    await fetch(
      "http://localhost:5000/api/news",
      {
        cache: "no-store",
      }
    );

  if (!response.ok) {
    throw new Error(
      "Failed to load news."
    );
  }

  return response.json();
}

export default async function NewsPage() {
  const news =
    await getNews();

  return (
    <main className="min-h-screen bg-gray-50 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-green-700">
            Mahila SACCOS
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            News
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Latest news and
            updates from Mahila
            SACCOS.
          </p>
        </div>

        {news.length === 0 ? (
          <div className="rounded-2xl border bg-white p-12 text-center text-gray-500">
            No news available.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map(
              (item) => (
                <article
                  key={
                    item._id
                  }
                  className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {item.imageUrl && (
                    <Link
                      href={`/news/${item.slug}`}
                    >
                      <img
                        src={`http://localhost:5000${item.imageUrl}`}
                        alt={
                          item.title
                        }
                        className="h-52 w-full object-cover"
                      />
                    </Link>
                  )}

                  <div className="p-5">
                    {item.createdAt && (
                      <p className="text-xs text-gray-400">
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}
                      </p>
                    )}

                    <Link
                      href={`/news/${item.slug}`}
                    >
                      <h2 className="mt-2 text-lg font-bold leading-7 text-gray-900 transition hover:text-green-700">
                        {
                          item.title
                        }
                      </h2>
                    </Link>

                    {item.summary && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                        {
                          item.summary
                        }
                      </p>
                    )}

                    <Link
                      href={`/news/${item.slug}`}
                      className="mt-5 inline-block text-sm font-semibold text-green-700 hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}