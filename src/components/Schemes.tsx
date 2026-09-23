import Link from "next/link";
import {
  PiggyBank,
  HandCoins,
  FileText,
} from "lucide-react";

const schemes = [
  {
    name: "Saving Schemes",
    href: "/services/deposit",
    icon: PiggyBank,
  },
  {
    name: "Loan Scheme",
    href: "/services/loans",
    icon: HandCoins,
  },
  {
    name: "Other Services",
    href: "/services",
    icon: FileText,
  },
];

export default function Schemes() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1F3C88]">
            Schemes
          </span>

          <div className="h-px w-12 bg-[#1F3C88]" />
        </div>

        <h2 className="mb-10 mt-2 text-3xl font-bold text-gray-900">
          Our{" "}
          <span className="font-normal text-[#1F3C88]">
            Schemes
          </span>
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {schemes.map(
            ({
              name,
              href,
              icon: Icon,
            }) => (
              <article
                key={name}
                className="group flex min-h-60 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF4FF] text-[#1F3C88] transition group-hover:bg-[#1F3C88] group-hover:text-white">
                  <Icon
                    size={30}
                    strokeWidth={1.8}
                  />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-gray-800">
                  {name}
                </h3>

                <Link
                  href={href}
                  className="mt-4 rounded-full border border-[#1F3C88] px-6 py-2 text-sm font-medium text-[#1F3C88] transition hover:bg-[#1F3C88] hover:text-white"
                >
                  Read More
                </Link>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}