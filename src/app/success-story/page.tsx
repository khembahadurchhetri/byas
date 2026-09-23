import Link from "next/link";
interface SuccessStory {
  _id: string;
  name: string;
  title: string;
  story: string;
  imageUrl: string;
}

async function getStories(): Promise<SuccessStory[]> {
  const response = await fetch("http://localhost:5000/api/success-stories", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load success stories");
  }

  return response.json();
}

export default async function SuccessStoryPage() {
  const stories = await getStories();

  return (
    <main className="min-h-screen bg-gray-100 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Videos will be added here next */}

        <div className="mb-10 text-center">
          <h1 className="text-2xl font-semibold text-[#1F3C88] underline underline-offset-8 sm:text-3xl">
            What Our Successful Members Say?
          </h1>
        </div>

        {stories.length === 0 ? (
          <p className="py-16 text-center text-gray-500">
            No success stories available.
          </p>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((item) => (
              <article
                key={item._id}
                className="overflow-hidden bg-white shadow-sm"
              >
                {item.imageUrl && (
                  <img
                    src={`http://localhost:5000${item.imageUrl}`}
                    alt={item.name}
                    className="h-64 w-full object-cover"
                  />
                )}

                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h2>

                  {item.title && (
                    <p className="mt-1 text-sm font-medium text-[#1F3C88]">
                      {item.title}
                    </p>
                  )}

                  {item.story && (
                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-gray-600">
                      {item.story}
                    </p>
                  )}

                  <Link
                    href={`/success-story/${item._id}`}
                    className="mt-5 inline-block bg-[#1F3C88] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#162E6A]"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
