import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface NewsItem {
  _id: string;
  title: string;
  titleHtml?: string;
  slug: string;
  summary: string;
  imageUrl: string;
  createdAt: string;
}

async function getNews(): Promise<NewsItem[]> {
  const response = await fetch(`${API_URL}/api/news`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load news.");
  }

  return response.json();
}

function date(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function NewsPage() {
  const news = await getNews();

  const featured = news[0];

  const remaining = news.slice(1);

  return (
    <main className="min-h-screen bg-[#f7f9f7]">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
            Vyas Credits and Savings
          </p>

          <div className="mt-2 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-950 sm:text-4xl">
                News & Updates
              </h1>

              <p className="mt-3 text-sm text-gray-500">
                Latest announcements, activities and updates from Credits and
                Savings Vyas Credits and Savings .
              </p>
            </div>

            <p className="hidden text-sm text-gray-400 sm:block">
              {news.length} articles
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {featured && (
          <section>
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
                Latest News
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                Latest Update
              </h2>
            </div>

            <Link
              href={`/news/${featured.slug}`}
              className={`group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg ${
                featured.imageUrl ? "grid lg:grid-cols-[0.9fr_1.1fr]" : "block"
              }`}
            >
              {featured.imageUrl && (
                <div className="max-h-[340px] overflow-hidden bg-gray-100">
                  <img
                    src={`${API_URL}${featured.imageUrl}`}
                    alt={featured.title}
                    className="h-full min-h-[260px] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              )}

              <div
                className={`flex flex-col justify-center ${
                  featured.imageUrl ? "p-7 sm:p-9" : "p-7 sm:p-10"
                }`}
              >
                <time className="text-xs font-bold uppercase tracking-wider text-[#1F3C88]">
                  {date(featured.createdAt)}
                </time>

                <div
                  className="mt-4 text-2xl font-bold leading-tight text-gray-950 transition group-hover:text-[#1F3C88] sm:text-3xl [&_h1]:text-4xl [&_h1]:font-bold [&_h2]:text-3xl [&_h2]:font-bold [&_p]:m-0"
                  dangerouslySetInnerHTML={{
                    __html: featured.titleHtml || `<p>${featured.title}</p>`,
                  }}
                />

                {featured.summary && (
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-500 sm:text-base">
                    {featured.summary}
                  </p>
                )}

                <span className="mt-6 text-sm font-bold text-[#1F3C88]">
                  Read full story →
                </span>
              </div>
            </Link>
          </section>
        )}

        {remaining.length > 0 && (
          <section className="mt-10">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
                More Updates
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                Recent News
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {remaining.map((item) => (
                <Link
                  href={`/news/${item.slug}`}
                  key={item._id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {item.imageUrl && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={`${API_URL}${item.imageUrl}`}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div
                    className={`flex flex-1 flex-col ${
                      item.imageUrl ? "p-5" : "p-6"
                    }`}
                  >
                    <time className="text-xs font-bold uppercase tracking-wider text-[#1F3C88]">
                      {date(item.createdAt)}
                    </time>

                    <div
                      className="mt-3 line-clamp-3 text-lg font-bold leading-7 text-gray-950 group-hover:text-[#1F3C88] [&_h1]:text-xl [&_h2]:text-lg [&_p]:m-0"
                      dangerouslySetInnerHTML={{
                        __html: item.titleHtml || `<p>${item.title}</p>`,
                      }}
                    />

                    {item.summary && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                        {item.summary}
                      </p>
                    )}

                    <span className="mt-auto pt-5 text-sm font-bold text-[#1F3C88]">
                      Read more →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
