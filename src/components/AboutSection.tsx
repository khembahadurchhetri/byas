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

            <p className="mt-6 text-sm leading-8 text-green-700">
              महिला बचत तथा ऋण सहकारी संस्था लि. प्रदेश नं. १
              सुनसरी जिल्लाको इटहरीमा महिलाहरूद्वारा स्थापित महिला
              बचत तथा ऋण सहकारी संस्था हो। महिलाको आर्थिक तथा
              सामाजिक सशक्तीकरण गर्दै समृद्ध समुदाय निर्माणमा संस्था
              निरन्तर क्रियाशील रहेको छ।
            </p>

            <Link
              href="/about"
              className="mt-6 inline-block rounded bg-green-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-green-700"
            >
              Read More
            </Link>
          </div>

          {/* About photo */}
          <div className="overflow-hidden">
            <img
              src="/images/about/about-us.jpg"
              alt="Mahila SACCOS members"
              className="h-[260px] w-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT ANNUAL IMAGE */}
        <div className="flex items-center justify-center bg-white p-3">
          <img
            src="/images/about/aboutus-annual.jpg"
            alt="Mahila SACCOS annual information"
            className="h-auto w-full object-contain"
          />
        </div>

      </div>
    </section>
  );
}