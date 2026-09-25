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

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

  const firstMember = members[0];

  const remainingMembers = members.slice(1);

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
            {title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            {subtitle}
          </p>
        </div>
      </section>

      {/* MEMBERS */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {members.length > 0 ? (
          <>
            {/* FIRST MEMBER */}

            {firstMember && (
              <div className="mb-10 flex justify-center">
                <TeamCard member={firstMember} />
              </div>
            )}

            {/* REMAINING MEMBERS */}

            {remainingMembers.length > 0 && (
              <div className="flex flex-wrap justify-center gap-6">
                {remainingMembers.map((member) => (
                  <TeamCard key={member._id} member={member} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-16 text-center shadow-sm">
            <p className="text-gray-500">No members have been published yet.</p>
          </div>
        )}
      </section>
    </main>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="w-full max-w-[290px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
      <div className="aspect-[4/4.5] overflow-hidden bg-gray-100">
        {member.imageUrl ? (
          <img
            src={`${BACKEND_URL}${member.imageUrl}`}
            alt={member.name}
            className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-400">
            No photo available
          </div>
        )}
      </div>

      <div className="p-5 text-center">
        <h2 className="break-words text-lg font-bold text-gray-900">
          {member.name}
        </h2>

        <p className="mt-1 break-words text-sm font-semibold text-[#1F3C88]">
          {member.position}
        </p>
      </div>
    </article>
  );
}
