export default function IntroductionPage() {
  const history = [
    {
      number: "01",
      title: "The Beginning",
      text:
        "After the People’s Movement of 2062/63 B.S. (2005/2006 A.D.), establishing cooperative organizations in Damauli became something of a trend. Certain individuals began operating cooperatives with the sole aim of making profit, disregarding the principles, laws, and regulations that govern cooperatives. Amidst this wave, the editorial team of Lokvani Weekly — Prem Prasad Paudel, Pradeep Raj Adhikari, Prakash Chandra Bhattarai, Tribhuwan Shrestha, and Dhanraj Nepali — initiated discussions on running a cooperative institution.",
    },
    {
      number: "02",
      title: "A Common Vision",
      text:
        "At the same time, prominent local traders and entrepreneurs such as Banshi Kumar Shrestha, Mangal Prasad Shrestha, Ranjan Lal Shrestha, and Dwarika Shrestha were also engaged in talks about starting a cooperative. Rather than establishing two similar types of cooperatives simultaneously, discussions were held between both groups to unify efforts and run a single cooperative organization in accordance with cooperative values, principles, and the prevailing laws and regulations. Consensus was eventually reached on this matter.",
    },
    {
      number: "03",
      title: "Foundation of Byas SACCOS",
      text:
        "An informal discussion held in the open grounds of Damauli during the sunny days of the month of Magh yielded meaningful conclusions. It was agreed that each member would contribute NPR 10,000 to register the cooperative. The name “Byas Savings and Credit Cooperative Society” was also unanimously agreed upon.",
    },
    {
      number: "04",
      title: "Formal Establishment",
      text:
        "Prior to officially starting operations, a preliminary assembly and cooperative orientation training were conducted at the office of the Lokvani Weekly. The assembly formed an 11-member ad hoc management committee under the chairmanship of Banshi Kumar Shrestha and an audit supervision committee led by Mangal Prasad Shrestha. Thus, the cooperative formally began its operations from Padmachowk, Ward No. 2, Byas Municipality, Damauli.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      {/* HERO */}

      <section className="relative overflow-hidden border-b border-blue-100 bg-white">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-[#EEF4FF] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-10 bg-[#1F3C88]" />

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
                About Us
              </p>
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
              Welcome to{" "}
              <span className="text-[#1F3C88]">
                Byas Saving & Credit
                Co-Operative Ltd.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              A cooperative founded on
              shared responsibility,
              community trust and the
              principles of cooperative
              service.
            </p>
          </div>
        </div>
      </section>

      {/* HISTORY */}

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1F3C88]">
              Our History
            </p>

            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              How Byas SACCOS Began
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              The journey from an
              informal discussion among
              community members to the
              establishment of a
              cooperative institution.
            </p>
          </div>

          <div className="relative">
            {/* DESKTOP TIMELINE LINE */}

            <div className="absolute left-[31px] top-8 hidden h-[calc(100%-64px)] w-px bg-blue-100 md:block" />

            <div className="space-y-5">
              {history.map((item) => (
                <article
                  key={item.number}
                  className="relative grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md md:grid-cols-[64px_minmax(0,1fr)] md:p-6"
                >
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F3C88] text-sm font-bold text-white shadow-sm">
                    {item.number}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-[15px] leading-8 text-gray-600 sm:text-base sm:leading-8">
                      {item.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* CLOSING NOTE */}

          <div className="mt-8 rounded-2xl border border-blue-100 bg-[#EEF4FF] px-5 py-5 sm:px-6">
            <p className="text-sm leading-7 text-gray-700">
              From its beginnings in
              Damauli, Byas SACCOS was
              formed through cooperation,
              shared commitment and the
              intention to operate in
              accordance with cooperative
              values, principles and
              prevailing laws.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}