import Link from "next/link";

import {
  ArrowUpRight,
  ExternalLink,
  Globe,
  Smartphone,
} from "lucide-react";

const facebookUrl =
  "https://www.facebook.com/vyas.saving";

const appUrl =
  "https://play.google.com/store/apps/details?id=com.devanasoft.vyas";

const quickLinks = [
  {
    name: "About Us",
    href: "/about",
  },
  {
    name: "Deposit",
    href: "/services/deposit",
  },
  {
    name: "Loans",
    href: "/services/loans",
  },
  {
    name: "Gallery",
    href: "/gallery",
  },
  {
    name: "News",
    href: "/news",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

const usefulLinks = [
  {
    name: "NEFSCUN",
    href: "https://www.nefscun.org.np/",
  },
  {
    name: "National Cooperative Federation",
    href: "https://ncfnepal.com.np/",
  },
  {
    name: "Department of Cooperative",
    href: "https://www.deoc.gov.np/",
  },
  {
    name: "Ministry of Finance",
    href: "https://mof.gov.np/",
  },
  {
    name: "National Cooperative Bank",
    href: "https://ncbl.coop/html/",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#162E6A] text-white">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}

          <div>
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 bg-blue-300" />

              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-200">
                Byas SACCOS
              </p>
            </div>

            <h2 className="mt-3 text-lg font-bold leading-7 sm:text-xl">
              Byas Saving & Credit
              Co-Operative Ltd.
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100/75">
              Supporting members through savings,
              credit services and cooperative values.
            </p>
          </div>

          
            <div className="grid grid-cols-2 gap-7 sm:col-span-2 lg:col-span-2 lg:grid-cols-2 lg:gap-16">
          {/* QUICK LINKS */}

          <div>
            <h3 className="text-sm font-bold sm:text-base">
              Quick Links
            </h3>

            <div className="mt-3 flex flex-col gap-2">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex w-fit items-center gap-1.5 text-sm text-blue-100/80 transition hover:text-white"
                >
                  {item.name}

                  <ArrowUpRight
                    size={12}
                    className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* USEFUL LINKS */}

          <div>
            <h3 className="text-sm font-bold sm:text-base">
              Useful Links
            </h3>

            <div className="mt-3 flex flex-col gap-2">
              {usefulLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-fit items-start gap-1.5 text-sm leading-5 text-blue-100/80 transition hover:text-white"
                >
                  <span>{item.name}</span>

                  <ExternalLink
                    size={11}
                    className="mt-1 shrink-0 opacity-50"
                  />
                </a>
              ))}
            </div>
          </div>
          </div>


          {/* CONNECT */}

          <div>
            <h3 className="text-sm font-bold sm:text-base">
              Connect
            </h3>

            <div className="mt-3 space-y-2.5">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 transition hover:bg-white/15"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#1F3C88]">
                  <Globe size={16} />
                </div>

                <div>
                  <p className="text-[11px] text-blue-200">
                    Follow us on
                  </p>

                  <p className="text-sm font-semibold">
                    Facebook
                  </p>
                </div>
              </a>

              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 transition hover:bg-white/15"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#1F3C88]">
                  <Smartphone size={16} />
                </div>

                <div>
                  <p className="text-[11px] text-blue-200">
                    Mobile Banking
                  </p>

                  <p className="text-sm font-semibold">
                    Get App
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}

      <div className="border-t border-white/10 bg-[#10275E]">
        <div className="mx-auto grid max-w-7xl gap-1 px-4 py-3 text-center text-[11px] leading-5 text-blue-100/70 sm:px-6 md:grid-cols-3 md:items-center md:text-left">
          <p>
            © 2026 Byas Saving & Credit Co-Operative Ltd.
          </p>

          <p className="md:text-center">
            Vyas-3, Parasar Tole, Damauli, Tanahun,
            Gandaki Province, Nepal
          </p>

          <p className="md:text-right">
            Design & Developed by{" "}
            <span className="font-semibold text-white">
              Lumino Technology Pvt. Ltd.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}