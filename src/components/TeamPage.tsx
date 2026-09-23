interface TeamMember {
  _id: string;
  name: string;
  position: string;
  imageUrl: string;
  group: "board" | "audit" | "management";
  order: number;
  published: boolean;
}

interface TeamPageProps {
  group: TeamMember["group"];
  title: string;
  subtitle: string;
}

const BACKEND_URL = "http://localhost:5000";

export default async function TeamPage({
  group,
  title,
  subtitle,
}: TeamPageProps) {
  let members: TeamMember[] = [];

  try {
    const response = await fetch(`${BACKEND_URL}/api/team?group=${group}`, {
      cache: "no-store",
    });

    if (response.ok) {
      const data: TeamMember[] = await response.json();

      members = data
        .filter((member) => member.published)
        .sort((a, b) => a.order - b.order);
    }
  } catch (error) {
    console.error(`Failed to load ${group} members:`, error);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Heading */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1F3C88]">
            Vyas Credits and Savings
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            {title}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Members */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {members.length > 0 ? (
          <>
            {/* FIRST MEMBER / CHAIRPERSON */}
            {members[0] && (
              <div className="mb-10 flex justify-center">
                <article className="w-full max-w-[280px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="aspect-[4/4.5] overflow-hidden bg-gray-100">
                    {members[0].imageUrl ? (
                      <img
                        src={`${BACKEND_URL}${members[0].imageUrl}`}
                        alt={members[0].name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No photo available
                      </div>
                    )}
                  </div>

                  <div className="p-5 text-center">
                    <h2 className="break-words text-lg font-bold text-gray-900">
                      {members[0].name}
                    </h2>

                    <p className="mt-1 break-words text-sm font-medium text-[#1F3C88]">
                      {members[0].position}
                    </p>
                  </div>
                </article>
              </div>
            )}

            {/* REMAINING MEMBERS */}
            {members.length > 1 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {members.slice(1).map((member) => (
                  <article
                    key={member._id}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="aspect-[4/4.5] overflow-hidden bg-gray-100">
                      {member.imageUrl ? (
                        <img
                          src={`${BACKEND_URL}${member.imageUrl}`}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                          No photo available
                        </div>
                      )}
                    </div>

                    <div className="p-5 text-center">
                      <h2 className="break-words text-lg font-bold text-gray-900">
                        {member.name}
                      </h2>

                      <p className="mt-1 break-words text-sm font-medium text-[#1F3C88]">
                        {member.position}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-16 text-center">
            <p className="text-gray-500">No members have been published yet.</p>
          </div>
        )}
      </section>
    </main>
  );
}
