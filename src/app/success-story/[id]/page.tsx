import Link from "next/link";
import { notFound } from "next/navigation";

interface SuccessStory {
  _id: string;
  name: string;
  title: string;
  story: string;
  imageUrl: string;
}

async function getStory(id: string): Promise<SuccessStory | null> {
  const response = await fetch(
    `http://localhost:5000/api/success-stories/${id}`,
    {
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load success story");
  }

  return response.json();
}

export default async function SuccessStoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await getStory(id);

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100 py-14">
      <article className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="overflow-hidden bg-white shadow-sm">
          {item.imageUrl && (
            <img
              src={`http://localhost:5000${item.imageUrl}`}
              alt={item.name}
              className="max-h-[520px] w-full object-cover"
            />
          )}

          <div className="p-6 sm:p-8 lg:p-10">
            <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
              {item.name}
            </h1>

            {item.title && (
              <h2 className="mt-2 text-lg font-medium text-green-700">
                {item.title}
              </h2>
            )}

            <div className="my-6 border-t border-gray-200" />

            <div className="whitespace-pre-line text-base leading-8 text-gray-700">
              {item.story}
            </div>
            <Link
              href="/success-story"
              className="mt-8 inline-block bg-green-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-800"
            >
              ← Back to Success Stories
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
