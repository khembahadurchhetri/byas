import {
  Award,
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
  "http://localhost:5000";

async function getAchievements() {
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
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 sm:py-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
            <Award size={28} />
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
            Mahila SACCOS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Achievements
          </h1>

          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-yellow-500" />
        </div>
      </section>

      {/* Achievements */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {achievements.length >
        0 ? (
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
                  className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
                >
                  <div className="grid items-center lg:grid-cols-2">
                    {/* Image */}
                    <div
                      className={
                        index % 2 === 1
                          ? "bg-gray-50 p-5 sm:p-8 lg:order-2 lg:p-10"
                          : "bg-gray-50 p-5 sm:p-8 lg:p-10"
                      }
                    >
                      {achievement.imageUrl ? (
                        <div className="flex min-h-[260px] items-center justify-center overflow-hidden rounded-2xl border bg-white p-3 shadow-sm sm:min-h-[360px]">
                          <img
                            src={`${BACKEND_URL}${achievement.imageUrl}`}
                            alt={
                              achievement.title
                            }
                            className="max-h-[500px] w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex min-h-[260px] items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Text */}
                    <div
                      className={
                        index % 2 === 1
                          ? "p-6 sm:p-8 lg:order-1 lg:p-12"
                          : "p-6 sm:p-8 lg:p-12"
                      }
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                        <Medal
                          size={25}
                        />
                      </div>

                      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-yellow-600">
                        Achievement
                      </p>

                      <h2 className="mt-2 break-words text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
                        {
                          achievement.title
                        }
                      </h2>

                      {achievement.description && (
                        <p className="mt-5 whitespace-pre-line break-words text-base leading-8 text-gray-600">
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
          <div className="rounded-2xl border bg-white px-5 py-16 text-center text-gray-500">
            No achievements
            published yet.
          </div>
        )}
      </section>
    </main>
  );
}