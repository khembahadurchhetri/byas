import Link from "next/link";

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
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="border-b border-blue-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#1F3C88]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
              Services
            </p>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Our Services
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Explore the savings, loan, document and digital service options
            available through Byas Saving & Credit Co-Operative Ltd.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {services.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={title}
              href={href}
              className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#1F3C88] transition group-hover:bg-[#1F3C88] group-hover:text-white">
                <Icon size={22} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-gray-900 transition group-hover:text-[#1F3C88]">
                {title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {description}
              </p>

              <div className="mt-auto pt-5">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1F3C88]">
                  View details
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
