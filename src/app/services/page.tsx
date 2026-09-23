import Link from "next/link";
import PageHero from "@/components/PageHero";

import { FileCheck2, HandCoins, PiggyBank, Smartphone } from "lucide-react";

const services = [
  {
    title: "Deposit",
    description:
      "Saving and deposit schemes designed to support members in building secure and regular saving habits.",
    href: "/services/deposit",
    icon: PiggyBank,
  },

  {
    title: "Loans",
    description:
      "Member-focused loan facilities for household, personal and productive financial needs.",
    href: "/services/loans",
    icon: HandCoins,
  },

  {
    title: "Loan Required Documents",
    description:
      "Check the documents and requirements needed before applying for different loan services.",
    href: "/services/loan-documents",
    icon: FileCheck2,
  },

  {
    title: "Digital Services",
    description:
      "Digital facilities designed to make cooperative services faster and easier to access.",
    href: "/services/digital",
    icon: Smartphone,
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero title="Our Services" />

      <section className="bg-[#f7f9f7] py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ title, description, href, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-[#1F3C88] transition group-hover:bg-[#1F3C88] group-hover:text-white">
                  <Icon size={22} />
                </div>

                <h2 className="mt-5 text-lg font-bold text-gray-900 group-hover:text-[#1F3C88]">
                  {title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {description}
                </p>

                <span className="mt-5 inline-block text-sm font-bold text-[#1F3C88]">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
