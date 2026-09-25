import { Eye, Flag, Gem, Target } from "lucide-react";

export default function VisionMissionGoalPage() {
  const pillars = [
    "Member Service",
    "Institutional Development",
    "Education, Training and Information Communication",
    "Modern Technology",
    "Human Resources",
    "Community Development",
  ];

  const objectives = [
    "To instill the spirit of frugality among the members of the organization and develop the habit of regular saving.",

    "To identify the primary needs and income-generating capacities of the members, promote investment through members in productive and income-generating sectors, and increase the utilization of dispersed national capital.",

    "To acquire, transfer, mortgage, or pledge movable and immovable properties as needed for daily operations in accordance with the Cooperative Act, regulations, standards, and the provisions of this statute, with the utmost focus on the collective and developmental interests of the members.",

    "To enhance both the individual and collective capacities of the members and contribute to building a self-reliant and independent society.",

    "To support the economic and social upliftment of marginalized and low-income individuals or groups in society.",

    "To promote social, cultural, educational, health, and environmental protection activities within the community.",
  ];

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      {/* HEADER */}
<section className="relative overflow-hidden border-b border-blue-100 bg-white">
  <div className="pointer-events-none absolute -right-20 top-0 z-0 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl" />

  <div className="pointer-events-none absolute -left-16 bottom-0 z-0 h-52 w-52 rounded-full bg-[#EEF4FF] blur-3xl" />

  <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#1F3C88]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
              About Us
            </p>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Vision, Mission and Objectives
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Our direction, purpose and strategic priorities for sustainable
            cooperative growth.
          </p>
        </div>
      </section>

      {/* CONTENT */}

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* VISION + MISSION */}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* VISION */}

            <article className="group relative overflow-hidden rounded-[26px] border border-blue-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-100/50 blur-2xl" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#1F3C88] transition group-hover:bg-[#1F3C88] group-hover:text-white">
                  <Eye size={23} />
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#1F3C88]">
                  Vision
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  Prosperous Community, Sustainable Development
                </h2>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  To build a prosperous, inclusive and sustainable community
                  through responsible cooperative practices.
                </p>
              </div>
            </article>

            {/* MISSION */}

            <article className="group relative overflow-hidden rounded-[26px] border border-blue-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-100/50 blur-2xl" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#1F3C88] transition group-hover:bg-[#1F3C88] group-hover:text-white">
                  <Flag size={23} />
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#1F3C88]">
                  Mission
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  Effective Financial Services
                </h2>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  To contribute to the development of a sustainable and
                  prosperous community by providing effective financial services
                  to members through the use of modern technology.
                </p>
              </div>
            </article>
          </div>

          {/* OBJECTIVES */}

          <article className="mt-6 rounded-[26px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#1F3C88]">
                <Gem size={23} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1F3C88]">
                  Our Objectives
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Institutional Objectives
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  Key objectives that guide the cooperative in serving members
                  and supporting community development.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {objectives.map((objective, index) => (
                <div
                  key={objective}
                  className="flex gap-4 rounded-2xl border border-gray-100 bg-[#F8FAFF] p-5 transition hover:border-blue-200 hover:bg-[#EEF4FF]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1F3C88] text-xs font-bold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="text-sm leading-7 text-gray-600">{objective}</p>
                </div>
              ))}
            </div>
          </article>

          {/* STRATEGIC PILLARS */}

          <article className="mt-6 rounded-[26px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#1F3C88]">
                <Target size={23} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1F3C88]">
                  Strategic Pillars
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Areas of Strategic Focus
                </h2>
              </div>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pillars.map((pillar, index) => (
                <div
                  key={pillar}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-[#F8FAFF] p-4 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-[#EEF4FF]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1F3C88] text-sm font-bold text-white transition group-hover:scale-105">
                    {index + 1}
                  </span>

                  <span className="text-sm font-semibold leading-6 text-gray-700">
                    {pillar}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
