import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Newspaper,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

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
  const response = await fetch(
    `${API_URL}/api/news`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Could not load news."
    );
  }

  return response.json();
}

function formatDate(value: string) {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export default async function NewsPage() {
  const news =
    await getNews();

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      {/* HEADER */}

      <section className="border-b border-blue-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#1F3C88]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
              Byas SACCOS
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                News & Updates
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
                Latest news,
                activities,
                announcements and
                updates from Byas
                Saving & Credit
                Co-Operative Ltd.
              </p>
            </div>

            {news.length > 0 && (
              <p className="text-sm text-gray-400">
                {news.length}{" "}
                {news.length === 1
                  ? "article"
                  : "articles"}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* NEWS LIST */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {news.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#1F3C88]">
              <Newspaper
                size={24}
              />
            </div>

            <p className="mt-4 text-sm font-medium text-gray-600">
              No news
              available yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {news.map(
              (
                item,
                index
              ) => (
                <article
                  key={
                    item._id
                  }
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:border-blue-200 hover:shadow-md"
                >
                  <Link
                    href={`/news/${item.slug}`}
                    className={`grid ${
                      item.imageUrl
                        ? "md:grid-cols-[280px_minmax(0,1fr)]"
                        : "grid-cols-1"
                    }`}
                  >
                    {/* IMAGE */}

                    {item.imageUrl && (
                      <div className="overflow-hidden bg-gray-100">
                        <img
                          src={`${API_URL}${item.imageUrl}`}
                          alt={
                            item.title
                          }
                          className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03] md:h-full md:min-h-[210px]"
                        />
                      </div>
                    )}

                    {/* CONTENT */}

                    <div className="flex flex-col justify-center p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#1F3C88]">
                          <CalendarDays
                            size={
                              14
                            }
                          />

                          {formatDate(
                            item.createdAt
                          )}
                        </div>

                        {index ===
                          0 && (
                          <span className="rounded-full bg-[#1F3C88] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                            Latest
                          </span>
                        )}
                      </div>

                      <div
                        className="mt-3 text-xl font-bold leading-8 text-gray-900 transition group-hover:text-[#1F3C88] sm:text-2xl [&_h1]:m-0 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:m-0 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:m-0 [&_h3]:text-lg [&_p]:m-0"
                        dangerouslySetInnerHTML={{
                          __html:
                            item.titleHtml ||
                            `<p>${item.title}</p>`,
                        }}
                      />

                      {item.summary && (
                        <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-7 text-gray-500">
                          {
                            item.summary
                          }
                        </p>
                      )}

                      <div className="mt-5">
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-[#1F3C88]">
                          Read Full Story

                          <ArrowRight
                            size={
                              15
                            }
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}