import Link from "next/link";

import {
  ArrowUpRight,
  Calculator,
  CalendarDays,
  Newspaper,
  Smartphone,
} from "lucide-react";

const links = [
  {
    title:
      "EMI Calculator",
    description:
      "Estimate your loan installments.",
    icon: Calculator,
    href: "/services/emi-calculator",
  },
  {
    title:
      "Date Converter",
    description:
      "Convert dates quickly and easily.",
    icon: CalendarDays,
    href: "/services/emi-calculator#date-converter",
  },
  {
    title:
      "Get Mobile App",
    description:
      "Access Byas services on your phone.",
    icon: Smartphone,
    href: "https://play.google.com/store/apps/details?id=com.devanasoft.vyas",
    external: true,
  },
  {
    title: "News",
    description:
      "Read our latest announcements.",
    icon: Newspaper,
    href: "/news",
  },
];

export default function ImportantLinks() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* HEADER */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#1F3C88]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
              Quick Access
            </p>
          </div>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Important Links
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-7 text-gray-600">
            Frequently used
            services and useful
            resources in one
            place.
          </p>
        </div>

        {/* LINKS */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map(
            ({
              title,
              description,
              icon: Icon,
              href,
              external,
            }) => {
              const content = (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#1F3C88] transition duration-300 group-hover:bg-[#1F3C88] group-hover:text-white">
                      <Icon
                        size={
                          21
                        }
                      />
                    </div>

                    <ArrowUpRight
                      size={
                        17
                      }
                      className="text-gray-300 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#1F3C88]"
                    />
                  </div>

                  <h3 className="mt-5 font-bold text-gray-900">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {
                      description
                    }
                  </p>
                </>
              );

              const className =
                "group rounded-2xl border border-gray-200 bg-[#F8FAFF] p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-md";

              if (external) {
                return (
                  <a
                    key={
                      title
                    }
                    href={
                      href
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      className
                    }
                  >
                    {
                      content
                    }
                  </a>
                );
              }

              return (
                <Link
                  key={title}
                  href={href}
                  className={
                    className
                  }
                >
                  {content}
                </Link>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}