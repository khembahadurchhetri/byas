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

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-green-700" />
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Vision + Mission */}
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <Eye size={24} />
              </div>

              <p className="text-xs font-semibold uppercase tracking-widest text-green-700">
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
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <Gem size={23} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-green-700">
                  Corporate Values
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-800">
                  संस्थागत मूल्य मान्यताहरु
                </h2>
              </div>
            </div>
            <div className="mt-6 rounded-xl bg-yellow-50 px-5 py-4 text-sm leading-7 text-gray-600">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>जवाफदेहीता:</strong> संस्थाको परिकल्पना, ध्येय तथा
                  रणनैतिक लक्ष्यहरूको प्राप्तिका लागि आवश्यक निर्णय लिन र जवाफ
                  दिन सम्बन्धित सदस्य, सञ्चालक, कर्मचारीहरूलाई जिम्मेवार बनाइनेछ
                  ।
                </li>

                <li>
                  <strong>विश्वसनीयता:</strong> संस्थाका काम-कारबाहि,
                  कार्यसम्पादन प्रक्रिया, सेवा तथा सुविधा हरू प्रदान गर्दा
                  अविच्छिन्न तथा अविचलित रूपमा एकरूपता कायम गरिनेछ ।
                </li>

                <li>
                  <strong>पारदर्शिता:</strong> संस्थागत पारदर्शिता कायम गर्न
                  सम्बन्धित सम्पूर्ण सरोकारवाला लाई संस्था सञ्चालन सम्बन्धमा
                  जानकारी गराइनेछ ।
                </li>

                <li>
                  <strong>पेशागत व्यवसायिकता:</strong> साकोस सञ्चालनका मापदण्ड,
                  विवेकि अभ्यास, नीति, विधिको पूर्ण कार्यान्वयन तथा प्रयोग
                  मार्फत सदस्य, समाज र स्थानिय अर्थतन्त्रको उत्पादकत्वमा योगदान
                  पु¥याउन ।
                </li>

                <li>
                  <strong>वित्तीय दिगोपना:</strong> वित्तीय सम्पत्ति तथा
                  दायित्वको सन्तुलित व्यवस्थापन मार्फत सामाजिक-वातावरणीय पक्ष,
                  स्थानीय अर्थतन्त्रको उत्पादकत्वमा वृद्धि र वित्तीय सुशासनलाई
                  प्राथमिकतामा राखी वित्तीय व्यवस्थापन गरिनेछ ।
                </li>

                <li>
                  <strong>समता:</strong> सहकारी संस्थामा सदस्य, सञ्चालक,
                  कर्मचारी तथा सम्पूर्ण सरोकारवाला बिच आन्तरिक तथा बाह्य स्रोत
                  तथा साधनको सापेक्षिक वितरणको रूपमा बुझिनेछ । साथै विभिन्न
                  क्षेत्र, जात, धर्म, वर्ण, लिङ्ग तथा वर्गको प्रतिनिधित्व गर्ने
                  सदस्य, सञ्चालक तथा कर्मचारीहरूलाई सम हुनाको भाव वा अवस्थाको
                  महसुस रहने गरी, निष्पक्षिरूपमा संस्थागत अवसरहरूमा समावेश
                  गराइनेछ ।
                </li>

                <li>
                  <strong>ऐक्यबद्धता:</strong> महिला साकोस र यस अन्तर्गतका
                  सदस्यहरूको समृद्धि, सहकारी अभियानको विकास तथा प्रवर्द्धन,
                  स्थानीय अर्थतन्त्रको प्रवर्द्धन तथा विकास, स्थानीय तथा
                  राष्ट्रिय समस्याहरूको समाधानका लागि संस्थामा आबद्ध सम्पूर्ण
                  सदस्यहरूबाट संस्थागत रूपमा ऐक्यबद्धता जनाइनेछ । बहुमत रूपमा
                  गरेको निर्णयलाई सामूहिक निर्णयका रूपमा स्वीकार गरिनेछ । निर्णय
                  प्रक्रियामा साझा विन्दु अवलम्बन गरिनेछ । संस्थामा कुनै गट वा
                  उपगटको संलग्नतालाई स्वीकार गरिनेछैन ।
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
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-700 text-sm font-bold text-white">
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
