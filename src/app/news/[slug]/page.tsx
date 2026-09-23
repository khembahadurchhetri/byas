import {
  notFound,
} from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

interface NewsItem {
  title: string;
  titleHtml?: string;
  summary: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

async function getNews(
  slug: string
): Promise<NewsItem | null> {
  const response = await fetch(
    `${API_URL}/api/news/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      "Could not load article."
    );
  }

  return response.json();
}

function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(new Date(value));
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } =
    await params;

  const news =
    await getNews(slug);

  if (!news) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] py-10">
      <article className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700">
              News
            </span>

            <time className="text-sm text-gray-400">
              {formatDate(
                news.createdAt
              )}
            </time>
          </div>

          <div
            className="mt-5 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl lg:text-5xl [&_h1]:text-5xl [&_h1]:font-bold [&_h2]:text-4xl [&_h2]:font-bold [&_p]:m-0"
            dangerouslySetInnerHTML={{
              __html:
                news.titleHtml ||
                `<p>${news.title}</p>`,
            }}
          />

          {news.summary && (
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-gray-500 sm:text-lg">
              {news.summary}
            </p>
          )}
        </header>

        {news.imageUrl && (
          <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl border bg-white p-2 shadow-sm">
            <img
              src={`${API_URL}${news.imageUrl}`}
              alt={news.title}
              className="max-h-[480px] w-full rounded-2xl object-cover"
            />
          </div>
        )}

        <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-gray-200 bg-white px-6 py-8 shadow-sm sm:px-9">
          <div
            className="text-base leading-8 text-gray-700 [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:text-xl [&_h3]:font-bold [&_p]:my-4 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-7 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-7 [&_li]:my-2 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-green-600 [&_blockquote]:bg-green-50 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic"
            dangerouslySetInnerHTML={{
              __html:
                news.content,
            }}
          />
        </div>
      </article>
    </main>
  );
}