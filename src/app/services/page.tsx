import Link from "next/link";
import PageHero from "@/components/PageHero";
import {
  PiggyBank,
  HandCoins,
  Smartphone,
} from "lucide-react";

const services = [
  {
    title: "Saving Schemes",
    description:
      "Saving products designed to support members in developing regular and secure saving habits.",
    href: "/services/savings",
    icon: PiggyBank,
  },
  {
    title: "Loan Schemes",
    description:
      "Member-focused credit facilities for personal, household and productive financial needs.",
    href: "/services/loans",
    icon: HandCoins,
  },
 
  {
    title: "Digital Services",
    description:
      "Digital facilities designed to make cooperative services easier to access.",
    href: "/services/digital",
    icon: Smartphone,
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero title="Our Services" />

      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ title, description, href, icon: Icon }) => (
              <article
                key={title}
                className="flex flex-col rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
                  <Icon size={26} />
                </div>

                <h2 className="mt-5 text-xl font-semibold">
                  {title}
                </h2>

                <p className="mt-3 flex-1 text-sm leading-7 text-gray-600">
                  {description}
                </p>

                <Link
                  href={href}
                  className="mt-5 text-sm font-semibold text-green-700 hover:underline"
                >
                  Read More →
                </Link>
              </article>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
