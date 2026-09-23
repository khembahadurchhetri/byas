import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="bg-gray-100 pb-14">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[2fr_1fr]">
        {/* LEFT ABOUT BOX */}
        <div className="grid items-center gap-8 bg-white p-7 md:grid-cols-[1fr_1.1fr]">
          {/* About text */}
          <div>
            <h2 className="text-3xl font-bold text-gray-700 underline">
              About Us
            </h2>

            <p className="mt-6 text-sm leading-8 text-[#1F3C88]">
              After the People’s Movement of 2062/63 B.S. (2005/2006 A.D.),
              establishing cooperative organizations in Damauli became something
              of a trend. Certain individuals began operating cooperatives with
              the sole aim of making profit, disregarding the principles, laws,
              and regulations that govern cooperatives. Amidst this wave, the
              editorial team of Lokvani Weekly — Prem Prasad Paudel, Pradeep Raj
              Adhikari, Prakash Chandra Bhattarai, Tribhuwan Shrestha, and
              Dhanraj Nepali — initiated discussions on running a cooperative
              institution.
            </p>

            <Link
              href="/about"
              className="mt-6 inline-block rounded bg-green-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-[#1F3C88]"
            >
              Read More
            </Link>
          </div>

          {/* About photo */}
          <div className="overflow-hidden">
            <img
              src="/images/about/about-us.jpg"
              alt="Credits and Savings
Vyas
Credits and Savings
 members"
              className="h-[260px] w-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT ANNUAL IMAGE */}
        <div className="flex items-center justify-center bg-white p-3">
          <img
            src="/images/about/aboutus-annual.jpg"
            alt="Credits and Savings
Vyas
Credits and Savings
 annual information"
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
