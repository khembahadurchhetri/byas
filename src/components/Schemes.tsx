import Link from "next/link";
import {
  PiggyBank,
  HandCoins,
  FileText,
  ArrowRight,
} from "lucide-react";

const schemes = [
  {
    name: "Saving Schemes",
    description:
      "Explore flexible saving options designed for different member needs.",
    href: "/services/deposit",
    icon: PiggyBank,
  },
  {
    name: "Loan Scheme",
    description:
      "Find loan products and financial support available to our members.",
    href: "/services/loans",
    icon: HandCoins,
  },
  {
    name: "Other Services",
    description:
      "Discover digital services, required documents and additional facilities.",
    href: "/services",
    icon: FileText,
  },
];

export default function Schemes() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      {/* SOFT BACKGROUND SHAPES */}

      <div className="pointer-events-none absolute -left-24 top-12 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#EEF4FF] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* HEADING */}

        <div className="mb-10">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#1F3C88]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
              Schemes
            </p>
          </div>

          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Explore Our{" "}
                <span className="text-[#1F3C88]">
                  Schemes
                </span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                Savings, loans and member services
                designed to support your financial
                goals.
              </p>
            </div>
          </div>
        </div>

        {/* CARDS */}

        <div className="grid gap-6 md:grid-cols-3">
          {schemes.map(
            ({
              name,
              description,
              href,
              icon: Icon,
            }) => (
              <article
                key={name}
                className="group relative overflow-hidden rounded-[26px] border border-blue-100 bg-gradient-to-br from-white via-white to-[#F4F7FF] p-6 shadow-[0_14px_40px_rgba(31,60,136,0.07)] transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_22px_55px_rgba(31,60,136,0.14)] sm:p-7"
              >
                {/* TOP ACCENT */}

                <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#1F3C88] via-[#3157B7] to-blue-300" />

                {/* ICON */}

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F3C88] text-white shadow-md transition duration-300 group-hover:scale-110 group-hover:rotate-1">
                  <Icon
                    size={25}
                    strokeWidth={1.8}
                  />
                </div>

                {/* TEXT */}

                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {name}
                </h3>

                <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-500">
                  {description}
                </p>

                {/* CTA */}

                <Link
                  href={href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1F3C88]"
                >
                  Explore More

                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1.5"
                  />
                </Link>

                {/* DECORATIVE CIRCLE */}

                <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-blue-100/50 transition duration-300 group-hover:scale-125" />
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}