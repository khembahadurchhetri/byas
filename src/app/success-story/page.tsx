import Link from "next/link";

import {
  ArrowRight,
  Quote,
} from "lucide-react";

interface SuccessStory {
  _id: string;
  name: string;
  title: string;
  story: string;
  imageUrl: string;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

async function getStories(): Promise<SuccessStory[]> {
  const response = await fetch(
    `${BACKEND_URL}/api/success-stories`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load success stories"
    );
  }

  return response.json();
}

export default async function SuccessStoryPage() {
  const stories =
    await getStories();

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      {/* HEADER */}

      <section className="border-b border-blue-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#1F3C88]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
              Member Stories
            </p>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Success Stories
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Read inspiring experiences
            and achievements shared by
            our members.
          </p>
        </div>
      </section>

      {/* STORIES */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {stories.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              No success stories
              available.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map(
              (item) => (
                <article
                  key={
                    item._id
                  }
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  {/* IMAGE */}

                  {item.imageUrl ? (
                    <div className="overflow-hidden bg-gray-100">
                      <img
                        src={`${BACKEND_URL}${item.imageUrl}`}
                        alt={
                          item.name
                        }
                        className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-[#EEF4FF] text-[#1F3C88]">
                      <Quote
                        size={42}
                        strokeWidth={
                          1.5
                        }
                      />
                    </div>
                  )}

                  {/* CONTENT */}

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#1F3C88]">
                      <Quote
                        size={18}
                      />
                    </div>

                    <h2 className="text-lg font-bold text-gray-900">
                      {
                        item.name
                      }
                    </h2>

                    {item.title && (
                      <p className="mt-1 text-sm font-semibold text-[#1F3C88]">
                        {
                          item.title
                        }
                      </p>
                    )}

                    {item.story && (
                      <p className="mt-4 line-clamp-4 text-sm leading-7 text-gray-600">
                        {
                          item.story
                        }
                      </p>
                    )}

                    <div className="mt-auto pt-5">
                      <Link
                        href={`/success-story/${item._id}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#1F3C88] transition hover:text-[#162E6A]"
                      >
                        Read Full Story

                        <ArrowRight
                          size={
                            15
                          }
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
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