import { notFound } from "next/navigation";

interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

async function getNews(
  slug: string
): Promise<NewsItem | null> {
  const response = await fetch(
    `http://localhost:5000/api/news/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      "Failed to load news"
    );
  }

  return response.json();
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  const news =
    await getNews(slug);

  if (!news) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 sm:py-14">
      <article className="mx-auto max-w-4xl px-4 sm:px-6">

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

          {news.imageUrl && (
            <img
              src={`http://localhost:5000${news.imageUrl}`}
              alt={news.title}
              className="max-h-[480px] w-full object-cover"
            />
          )}

          <div className="p-6 sm:p-8 lg:p-10">

            {news.createdAt && (
              <p className="text-sm text-gray-400">
                {new Date(
                  news.createdAt
                ).toLocaleDateString()}
              </p>
            )}

            <h1 className="mt-2 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
              {news.title}
            </h1>

            {news.summary && (
              <p className="mt-5 text-lg leading-8 text-gray-600">
                {news.summary}
              </p>
            )}

            <div className="my-7 border-t border-gray-200" />

            <div
              className="
                text-base
                leading-8
                text-gray-700

                [&_h2]:mb-3
                [&_h2]:mt-8
                [&_h2]:text-2xl
                [&_h2]:font-bold
                [&_h2]:text-gray-900

                [&_h3]:mb-3
                [&_h3]:mt-7
                [&_h3]:text-xl
                [&_h3]:font-bold
                [&_h3]:text-gray-900

                [&_p]:my-4

                [&_strong]:font-bold
                [&_strong]:text-gray-900

                [&_ul]:my-4
                [&_ul]:list-disc
                [&_ul]:pl-6

                [&_ol]:my-4
                [&_ol]:list-decimal
                [&_ol]:pl-6

                [&_li]:my-1

                [&_blockquote]:my-6
                [&_blockquote]:border-l-4
                [&_blockquote]:border-green-600
                [&_blockquote]:bg-green-50
                [&_blockquote]:px-5
                [&_blockquote]:py-3
                [&_blockquote]:italic
              "
              dangerouslySetInnerHTML={{
                __html:
                  news.content,
              }}
            />
          </div>
        </div>

      </article>
    </main>
  );
}