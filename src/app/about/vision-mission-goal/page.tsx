import { Eye, Flag, Gem, Target } from "lucide-react";

export default function VisionMissionGoalPage() {
  const pillars = [
    "सदस्य सेवा",
    "संस्थागत विकास",
    "शिक्षा, तालिम तथा सूचना संचार",
    "नविनतम प्रविधि",
    "मानव संशाधन",
    "सामुदायिक विकास",
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Heading */}
      <section className="border-b border-gray-100 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-700">
            About Us
          </span>

          <h1 className="mt-4 text-3xl font-bold text-gray-800 sm:text-4xl">
            Vision, Mission and Objectives
          </h1>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#1F3C88]" />
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Vision + Mission */}
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-[#1F3C88]">
                <Eye size={24} />
              </div>

              <p className="text-xs font-semibold uppercase tracking-widest text-[#1F3C88]">
                Vision
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                परिकल्पना
              </h2>

              <p className="mt-5 text-lg font-medium text-gray-700">
                समृद्ध समुदाय, दिगो विकास
              </p>

              <p className="mt-2 text-sm leading-7 text-gray-500">
                Prosperous Community, Sustainable Development
              </p>
            </article>

            <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                <Flag size={24} />
              </div>

              <p className="text-xs font-semibold uppercase tracking-widest text-yellow-600">
                Mission
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-800">ध्येय</h2>

              <p className="mt-5 leading-8 text-gray-700">
                सदस्यहरुलाई नवीनतम प्रविधिको प्रयोगद्वारा प्रभावकारी वित्तीय
                सेवा प्रदान गरी दिगो र समृद्ध समुदाय निर्माणमा योगदान गर्ने ।
              </p>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                To contribute for the formation of sustainable &amp; prosperous
                community providing effective financial services using latest
                technologies to the members.
              </p>
            </article>
          </div>

          {/* Corporate Values */}
          <article className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#1F3C88]">
                <Gem size={23} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1F3C88]">
                  Our Objectives
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-800">
                  संस्थागत मूल्य मान्यताहरु
                </h2>
              </div>
            </div>
            <div className="mt-6 rounded-xl bg-yellow-50 px-5 py-4 text-sm leading-7 text-gray-600">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  To instill the spirit of frugality among the members of the
                  organization and develop the habit of regular saving.
                </li>

                <li>
                  To identify the primary needs and income-generating capacities
                  of the members, promote investment through members in
                  productive and income-generating sectors, and increase the
                  utilization of dispersed national capital.
                </li>

                <li>
                  To acquire, transfer, mortgage, or pledge movable and
                  immovable properties as needed for daily operations in
                  accordance with the Cooperative Act, regulations, standards,
                  and the provisions of this statute, with the utmost focus on
                  the collective and developmental interests of the members.
                </li>

                <li>
                  To enhance both the individual and collective capacities of
                  the members and contribute to building a self-reliant and
                  independent society.
                </li>

                <li>
                  To support the economic and social upliftment of the
                  marginalized and low-income individuals or groups in the
                  society.
                </li>

                <li>
                  To promote social, cultural, educational, health, and
                  environmental protection activities within the community.
                </li>
              </ul>
            </div>
          </article>

          {/* Strategic Pillars */}
          <article className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                <Target size={23} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-yellow-600">
                  Strategic Pillars
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-800">
                  रणनीतिक स्तम्भ
                </h2>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pillars.map((pillar, index) => (
                <div
                  key={pillar}
                  className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1F3C88] text-sm font-bold text-white">
                    {index + 1}
                  </span>

                  <span className="font-medium text-gray-700">{pillar}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
