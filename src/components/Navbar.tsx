"use client";

import Link from "next/link";

import {
  ChevronDown,
  Menu,
  Smartphone,
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
    name: "Gallery",
    href: "/gallery",
  },
  {
    name: "Success Story",
    href: "/success-story",
  },
  {
    name: "News",
    href: "/news",
  },
  {
    name: "Report",
    href: "/reports",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

const appUrl =
  "https://play.google.com/store/apps/details?id=com.devanasoft.vyas";

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
    <nav className="relative z-50">
      {/* ========================= */}
      {/* MOBILE NAVBAR */}
      {/* ========================= */}

      <div className="border-b border-gray-200 bg-white shadow-sm lg:hidden">
        <div className="flex h-[72px] items-center justify-between px-4">
          {/* LOGO */}

          <Link
            href="/"
            onClick={closeMobileMenu}
            className="min-w-0"
          >
            <img
              src="/images/schemes/headerwithlogo.jpg"
              alt="Byas Saving & Credit Co-Operative Ltd."
              className="h-auto max-h-[50px] w-auto max-w-[220px] object-contain"
            />
          </Link>

          {/* MENU BUTTON */}

          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                (current) =>
                  !current
              )
            }
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#1F3C88] transition active:scale-95"
          >
            {mobileOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}

        <div
          className={`overflow-hidden bg-white transition-all duration-300 ${
            mobileOpen
              ? "max-h-[900px] border-t border-gray-100"
              : "max-h-0"
          }`}
        >
          <div className="px-4 pb-5 pt-3">
            {/* HOME */}

            <Link
              href="/"
              onClick={
                closeMobileMenu
              }
              className="flex min-h-12 items-center rounded-xl px-4 text-sm font-semibold text-gray-800 transition hover:bg-[#EEF4FF] hover:text-[#1F3C88]"
            >
              Home
            </Link>

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
              className="flex min-h-12 w-full items-center justify-between rounded-xl px-4 text-left text-sm font-semibold text-gray-800 transition hover:bg-[#EEF4FF] hover:text-[#1F3C88]"
            >
              About Us

              <ChevronDown
                size={17}
                className={`transition-transform duration-200 ${
                  mobileAboutOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {mobileAboutOpen && (
              <div className="mb-2 ml-3 border-l-2 border-blue-100 pl-3">
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
                      className="block rounded-lg px-3 py-2.5 text-[13px] leading-5 text-gray-600 transition hover:bg-[#EEF4FF] hover:text-[#1F3C88]"
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
              className="flex min-h-12 w-full items-center justify-between rounded-xl px-4 text-left text-sm font-semibold text-gray-800 transition hover:bg-[#EEF4FF] hover:text-[#1F3C88]"
            >
              Services

              <ChevronDown
                size={17}
                className={`transition-transform duration-200 ${
                  mobileServicesOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {mobileServicesOpen && (
              <div className="mb-2 ml-3 border-l-2 border-blue-100 pl-3">
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
                      className="block rounded-lg px-3 py-2.5 text-[13px] leading-5 text-gray-600 transition hover:bg-[#EEF4FF] hover:text-[#1F3C88]"
                    >
                      {
                        item.name
                      }
                    </Link>
                  )
                )}
              </div>
            )}

            {/* NORMAL LINKS */}

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
                  className="flex min-h-12 items-center rounded-xl px-4 text-sm font-semibold text-gray-800 transition hover:bg-[#EEF4FF] hover:text-[#1F3C88]"
                >
                  {
                    item.name
                  }
                </Link>
              )
            )}

            {/* APP */}

            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1F3C88] px-5 text-sm font-bold text-white transition hover:bg-[#162E6A]"
            >
              <Smartphone
                size={17}
              />

              Get Mobile App
            </a>
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* DESKTOP NAVBAR */}
      {/* ========================= */}

      <div className="hidden bg-[#1F3C88] text-white shadow-sm lg:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-center">
            <Link
              href="/"
              className="whitespace-nowrap px-3 py-4 text-[11px] font-medium tracking-wide transition hover:bg-[#162E6A] xl:px-5"
            >
              HOME
            </Link>

            {/* ABOUT */}

            <div className="group relative">
              <Link
                href="/about"
                className="flex items-center gap-1 whitespace-nowrap px-3 py-4 text-[11px] font-medium tracking-wide transition hover:bg-[#162E6A] xl:px-5"
              >
                ABOUT US
                <ChevronDown
                  size={12}
                />
              </Link>

              <div className="invisible absolute left-0 top-full z-50 min-w-[235px] translate-y-2 overflow-hidden rounded-b-xl bg-white text-gray-700 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {aboutLinks.map(
                  (item) => (
                    <Link
                      key={
                        item.href
                      }
                      href={
                        item.href
                      }
                      className="block border-b border-gray-100 px-5 py-3 text-sm transition hover:bg-[#EEF4FF] hover:text-[#1F3C88]"
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
                className="flex items-center gap-1 whitespace-nowrap px-3 py-4 text-[11px] font-medium tracking-wide transition hover:bg-[#162E6A] xl:px-5"
              >
                SERVICES
                <ChevronDown
                  size={12}
                />
              </button>

              <div className="invisible absolute left-0 top-full z-50 min-w-[255px] translate-y-2 overflow-hidden rounded-b-xl bg-white text-gray-700 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {serviceLinks.map(
                  (item) => (
                    <Link
                      key={
                        item.href
                      }
                      href={
                        item.href
                      }
                      className="block border-b border-gray-100 px-5 py-3 text-sm transition hover:bg-[#EEF4FF] hover:text-[#1F3C88]"
                    >
                      {
                        item.name
                      }
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* LINKS */}

            {mainLinks.map(
              (item) => (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  className="whitespace-nowrap px-3 py-4 text-[11px] font-medium uppercase tracking-wide transition hover:bg-[#162E6A] xl:px-5"
                >
                  {
                    item.name
                  }
                </Link>
              )
            )}

            {/* APP */}

            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-[11px] font-bold tracking-wide text-[#1F3C88] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#EEF4FF]"
            >
              <Smartphone
                size={15}
              />

              GET APP
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}