import Link from "next/link";

import {
  Calculator,
  CalendarDays,
  Newspaper,
  Smartphone,
} from "lucide-react";

const links = [
  {
    title: "EMI Calculator",
    icon: Calculator,
    href: "/services/emi-calculator",
  },
  {
    title: "Date Converter",
    icon: CalendarDays,
    href: "/services/emi-calculator#date-converter",
  },
{
  title: "Get Mobile App",
  icon: Smartphone,
  href: "https://play.google.com/store/apps/details?id=com.devanasoft.vyas",
},
  {
    title: "News",
    icon: Newspaper,
    href: "/news",
  },
];

export default function ImportantLinks() {
  return (
    <section className="bg-gray-100 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-8 text-2xl font-bold text-[#1F3C88] sm:mb-10 sm:text-3xl">
          Important Links
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
          {links.map(
            ({
              title,
              icon: Icon,
              href,
            }) => (
              <Link
                key={title}
                href={href}
                className="group flex min-h-[150px] flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF4FF] transition group-hover:bg-blue-100">
                  <Icon
                    size={28}
                    strokeWidth={1.8}
                    className="text-[#1F3C88]"
                  />
                </div>

                <span className="text-sm font-semibold text-gray-700 transition group-hover:text-[#1F3C88]">
                  {title}
                </span>
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}