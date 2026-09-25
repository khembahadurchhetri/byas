import {
  Medal,
} from "lucide-react";

interface Achievement {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  published: boolean;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

async function getAchievements(): Promise<Achievement[]> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/achievements`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const data: Achievement[] =
      await response.json();

    return data
      .filter(
        (achievement) =>
          achievement.published
      )
      .sort(
        (a, b) =>
          a.order - b.order
      );
  } catch (error) {
    console.error(
      "Failed to load achievements:",
      error
    );

    return [];
  }
}

export default async function AchievementsPage() {
  const achievements =
    await getAchievements();

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      {/* HEADER */}

      <section className="border-b border-blue-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#1F3C88]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
              About Us
            </p>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Our Achievements
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Milestones, recognitions
            and notable achievements
            of Byas Saving & Credit
            Co-Operative Ltd.
          </p>
        </div>
      </section>

      {/* ACHIEVEMENTS */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {achievements.length > 0 ? (
          <div className="space-y-8">
            {achievements.map(
              (
                achievement,
                index
              ) => (
                <article
                  key={
                    achievement._id
                  }
                  className="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="grid items-center lg:grid-cols-2">
                    {/* IMAGE */}

                    <div
                      className={
                        index % 2 === 1
                          ? "bg-[#F8FAFF] p-5 sm:p-8 lg:order-2 lg:p-10"
                          : "bg-[#F8FAFF] p-5 sm:p-8 lg:p-10"
                      }
                    >
                      {achievement.imageUrl ? (
                        <div className="flex min-h-[260px] items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:min-h-[360px]">
                          <img
                            src={`${BACKEND_URL}${achievement.imageUrl}`}
                            alt={
                              achievement.title
                            }
                            className="max-h-[500px] w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-gray-200 bg-white text-sm text-gray-400 sm:min-h-[360px]">
                          No image
                          available
                        </div>
                      )}
                    </div>

                    {/* TEXT */}

                    <div
                      className={
                        index % 2 === 1
                          ? "p-6 sm:p-8 lg:order-1 lg:p-12"
                          : "p-6 sm:p-8 lg:p-12"
                      }
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#1F3C88]">
                        <Medal
                          size={23}
                        />
                      </div>

                      <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#1F3C88]">
                        Achievement
                      </p>

                      <h2 className="mt-2 break-words text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
                        {
                          achievement.title
                        }
                      </h2>

                      {achievement.description && (
                        <p className="mt-5 whitespace-pre-line break-words text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                          {
                            achievement.description
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-16 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              No achievements
              published yet.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}