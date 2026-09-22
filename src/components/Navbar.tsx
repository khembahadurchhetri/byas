"use client";

import Link from "next/link";
import {
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const aboutLinks = [
  {
    name: "Introduction",
    href: "/about/introduction",
  },
  {
    name: "Our Vision, Mission, Goal",
    href: "/about/vision-mission-goal",
  },
  {
    name: "Board of Directors",
    href: "/about/board",
  },
  {
    name: "Audit Committee",
    href: "/about/audit-committee",
  },
  {
    name: "Management Team",
    href: "/about/management",
  },
  {
    name: "Our Achievements",
    href: "/about/achievements",
  },
];

const serviceLinks = [
  {
    name: "Deposit",
    href: "/services/deposit",
  },
  {
    name: "Loans",
    href: "/services/loans",
  },
  {
    name: "Loans Required Document",
    href: "/services/loan-documents",
  },
  {
    name: "Digital Services",
    href: "/services/digital",
  },
  {
    name: "EMI Calculator",
    href: "/services/emi-calculator",
  },
];

const mainLinks = [
  {
    name: "DOWNLOAD",
    href: "/downloads",
  },
  {
    name: "GALLERY",
    href: "/gallery",
  },
  {
    name: "SUCCESS STORY",
    href: "/success-story",
  },
  {
    name: "NEWS",
    href: "/news",
  },
  {
    name: "REPORT",
    href: "/reports",
  },
  {
    name: "CONTACT",
    href: "/contact",
  },
];

export default function Navbar() {
  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    mobileAboutOpen,
    setMobileAboutOpen,
  ] = useState(false);

  const [
    mobileServicesOpen,
    setMobileServicesOpen,
  ] = useState(false);

  function closeMobileMenu() {
    setMobileOpen(false);
    setMobileAboutOpen(false);
    setMobileServicesOpen(false);
  }

  return (
    <nav className="relative z-50 bg-green-600 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* MOBILE TOP BAR */}

        <div className="flex h-14 items-center justify-between lg:hidden">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="text-sm font-semibold tracking-wide"
          >
            HOME
          </Link>

          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                (current) =>
                  !current
              )
            }
            aria-label="Toggle navigation menu"
            aria-expanded={
              mobileOpen
            }
            className="rounded-md p-2 transition hover:bg-green-700"
          >
            {mobileOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* DESKTOP */}

        <div className="hidden items-center justify-center lg:flex">

          <Link
            href="/"
            className="whitespace-nowrap px-3 py-4 text-[11px] font-medium tracking-wide transition hover:bg-green-700 xl:px-5"
          >
            HOME
          </Link>

          {/* ABOUT */}

          <div className="group relative">
            <Link
              href="/about"
              className="flex items-center gap-1 whitespace-nowrap px-3 py-4 text-[11px] font-medium tracking-wide transition hover:bg-green-700 xl:px-5"
            >
              ABOUT US

              <ChevronDown
                size={12}
              />
            </Link>

            <div className="invisible absolute left-0 top-full z-50 min-w-[235px] translate-y-2 bg-white text-gray-700 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {aboutLinks.map(
                (item) => (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className="block border-b border-gray-100 px-5 py-3 text-sm transition hover:bg-green-50 hover:text-green-700"
                  >
                    {
                      item.name
                    }
                  </Link>
                )
              )}
            </div>
          </div>

          {/* SERVICES */}

          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 whitespace-nowrap px-3 py-4 text-[11px] font-medium tracking-wide transition hover:bg-green-700 xl:px-5"
            >
              SERVICES

              <ChevronDown
                size={12}
              />
            </button>

            <div className="invisible absolute left-0 top-full z-50 min-w-[255px] translate-y-2 bg-white text-gray-700 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {serviceLinks.map(
                (item) => (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className="block border-b border-gray-100 px-5 py-3 text-sm transition hover:bg-green-50 hover:text-green-700"
                  >
                    {
                      item.name
                    }
                  </Link>
                )
              )}
            </div>
          </div>

          {/* MAIN LINKS */}

          {mainLinks.map(
            (item) => (
              <Link
                key={
                  item.href
                }
                href={
                  item.href
                }
                className="whitespace-nowrap px-3 py-4 text-[11px] font-medium tracking-wide transition hover:bg-green-700 xl:px-5"
              >
                {
                  item.name
                }
              </Link>
            )
          )}
        </div>

        {/* MOBILE MENU */}

        {mobileOpen && (
          <div className="border-t border-green-500 pb-3 lg:hidden">

            {/* ABOUT */}

            <button
              type="button"
              aria-expanded={
                mobileAboutOpen
              }
              onClick={() =>
                setMobileAboutOpen(
                  (current) =>
                    !current
                )
              }
              className="flex w-full items-center justify-between border-b border-green-500/60 py-3 text-left text-sm font-medium"
            >
              ABOUT US

              <ChevronDown
                size={16}
                className={`transition-transform ${
                  mobileAboutOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {mobileAboutOpen && (
              <div className="bg-green-700/50">
                {aboutLinks.map(
                  (item) => (
                    <Link
                      key={
                        item.href
                      }
                      href={
                        item.href
                      }
                      onClick={
                        closeMobileMenu
                      }
                      className="block border-b border-green-500/40 py-3 pl-5 pr-2 text-sm"
                    >
                      {
                        item.name
                      }
                    </Link>
                  )
                )}
              </div>
            )}

            {/* SERVICES */}

            <button
              type="button"
              aria-expanded={
                mobileServicesOpen
              }
              onClick={() =>
                setMobileServicesOpen(
                  (current) =>
                    !current
                )
              }
              className="flex w-full items-center justify-between border-b border-green-500/60 py-3 text-left text-sm font-medium"
            >
              SERVICES

              <ChevronDown
                size={16}
                className={`transition-transform ${
                  mobileServicesOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {mobileServicesOpen && (
              <div className="bg-green-700/50">
                {serviceLinks.map(
                  (item) => (
                    <Link
                      key={
                        item.href
                      }
                      href={
                        item.href
                      }
                      onClick={
                        closeMobileMenu
                      }
                      className="block border-b border-green-500/40 py-3 pl-5 pr-2 text-sm"
                    >
                      {
                        item.name
                      }
                    </Link>
                  )
                )}
              </div>
            )}

            {/* NORMAL */}

            {mainLinks.map(
              (item) => (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  onClick={
                    closeMobileMenu
                  }
                  className="block border-b border-green-500/60 py-3 text-sm font-medium"
                >
                  {
                    item.name
                  }
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
}