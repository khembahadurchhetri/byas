"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  FileText,
  Newspaper,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

interface NewsItem {
  _id: string;
  title: string;
  slug?: string;
  createdAt?: string;
  published?: boolean;
}

interface ReportItem {
  _id: string;
  title: string;
  createdAt?: string;
  published?: boolean;
}

type TabType = "news" | "reports";

function formatDate(value?: string) {
  if (!value) return "";

  return new Date(value).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }
  );
}

export default function LatestUpdates() {
  const [activeTab, setActiveTab] =
    useState<TabType>("news");

  const [news, setNews] =
    useState<NewsItem[]>([]);

  const [reports, setReports] =
    useState<ReportItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadUpdates() {
      try {
        const [
          newsResponse,
          reportsResponse,
        ] = await Promise.all([
          fetch(
            `${API_URL}/api/news`,
            {
              cache: "no-store",
            }
          ),
          fetch(
            `${API_URL}/api/reports`,
            {
              cache: "no-store",
            }
          ),
        ]);

        const newsData =
          newsResponse.ok
            ? await newsResponse.json()
            : [];

        const reportsData =
          reportsResponse.ok
            ? await reportsResponse.json()
            : [];

        setNews(
          Array.isArray(newsData)
            ? newsData
            : []
        );

        setReports(
          Array.isArray(reportsData)
            ? reportsData
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load updates:",
          error
        );

        setNews([]);
        setReports([]);
      } finally {
        setLoading(false);
      }
    }

    loadUpdates();
  }, []);

  const latestNews = useMemo(
    () =>
      [...news]
        .filter(
          (item) =>
            item.published !== false
        )
        .sort(
          (a, b) =>
            new Date(
              b.createdAt || 0
            ).getTime() -
            new Date(
              a.createdAt || 0
            ).getTime()
        )
        .slice(0, 4),
    [news]
  );

  const latestReports = useMemo(
    () =>
      [...reports]
        .filter(
          (item) =>
            item.published !== false
        )
        .sort(
          (a, b) =>
            new Date(
              b.createdAt || 0
            ).getTime() -
            new Date(
              a.createdAt || 0
            ).getTime()
        )
        .slice(0, 4),
    [reports]
  );

  const items =
    activeTab === "news"
      ? latestNews
      : latestReports;

  const pageHref =
    activeTab === "news"
      ? "/news"
      : "/reports";

  return (
    <section className="relative overflow-hidden bg-[#f7f9fc] py-16 sm:py-20">
      {/* DECORATION */}

      <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-[#EEF4FF] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* HEADING */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-10 bg-[#1F3C88]" />

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
                Stay Informed
              </p>
            </div>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Latest{" "}
              <span className="text-[#1F3C88]">
                Updates
              </span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
              Keep up with the latest
              news, activities and
              reports from Byas SACCOS.
            </p>
          </div>

          <Link
            href={pageHref}
            className="group hidden items-center gap-2 text-sm font-bold text-[#1F3C88] md:flex"
          >
            View all

            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* MAIN CARD */}

        <div className="overflow-hidden rounded-[26px] border border-blue-100 bg-white shadow-[0_18px_60px_rgba(31,60,136,0.08)]">
          <div className="grid lg:grid-cols-[230px_minmax(0,1fr)]">
            {/* LEFT PANEL */}

            <div className="bg-gradient-to-b from-[#1F3C88] to-[#162E6A] p-4 text-white sm:p-5">
              <p className="mb-4 px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-200">
                Browse Updates
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab("news")
                  }
                  className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition-all duration-300 ${
                    activeTab === "news"
                      ? "bg-white text-[#1F3C88] shadow-lg"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                      activeTab === "news"
                        ? "bg-[#EEF4FF]"
                        : "bg-white/10"
                    }`}
                  >
                    <Newspaper
                      size={19}
                    />
                  </div>

                  <div>
                    <p className="font-bold">
                      News
                    </p>

                    <p
                      className={`mt-0.5 text-[11px] ${
                        activeTab ===
                        "news"
                          ? "text-gray-400"
                          : "text-blue-200"
                      }`}
                    >
                      Latest stories
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      "reports"
                    )
                  }
                  className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition-all duration-300 ${
                    activeTab ===
                    "reports"
                      ? "bg-white text-[#1F3C88] shadow-lg"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                      activeTab ===
                      "reports"
                        ? "bg-[#EEF4FF]"
                        : "bg-white/10"
                    }`}
                  >
                    <FileText
                      size={19}
                    />
                  </div>

                  <div>
                    <p className="font-bold">
                      Reports
                    </p>

                    <p
                      className={`mt-0.5 text-[11px] ${
                        activeTab ===
                        "reports"
                          ? "text-gray-400"
                          : "text-blue-200"
                      }`}
                    >
                      Publications
                    </p>
                  </div>
                </button>
              </div>

              <div className="mt-8 hidden border-t border-white/10 pt-5 lg:block">
                <p className="text-xs leading-5 text-blue-200">
                  Official updates and
                  publications from Byas
                  Saving & Credit
                  Co-Operative Ltd.
                </p>
              </div>
            </div>

            {/* RIGHT CONTENT */}

            <div
              key={activeTab}
              className="animate-[fadeIn_.45s_ease-out]"
            >
              {loading ? (
                <div className="flex min-h-[360px] items-center justify-center text-sm text-gray-400">
                  Loading updates...
                </div>
              ) : items.length === 0 ? (
                <div className="flex min-h-[360px] items-center justify-center text-sm text-gray-400">
                  No updates available
                  yet.
                </div>
              ) : (
                <div>
                  {items.map(
                    (
                      item,
                      index
                    ) => {
                      const href =
                        activeTab ===
                        "news" &&
                        "slug" in item &&
                        item.slug
                          ? `/news/${item.slug}`
                          : pageHref;

                      return (
                        <Link
                          key={
                            item._id
                          }
                          href={href}
                          className="group relative flex gap-4 border-b border-gray-100 px-5 py-5 transition-all duration-300 last:border-b-0 hover:bg-[#F8FAFF] sm:px-7"
                        >
                          {/* NUMBER */}

                          <span className="mt-1 hidden w-8 shrink-0 text-xs font-bold text-blue-200 sm:block">
                            {String(
                              index +
                                1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          {/* ICON */}

                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#1F3C88] transition duration-300 group-hover:bg-[#1F3C88] group-hover:text-white">
                            <CalendarDays
                              size={
                                17
                              }
                            />
                          </div>

                          {/* TEXT */}

                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                              {formatDate(
                                item.createdAt
                              )}
                            </p>

                            <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-6 text-gray-800 transition duration-300 group-hover:text-[#1F3C88] sm:text-base">
                              {
                                item.title
                              }
                            </h3>
                          </div>

                          {/* ARROW */}

                          <div className="flex shrink-0 items-center">
                            <ArrowUpRight
                              size={
                                17
                              }
                              className="text-gray-300 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#1F3C88]"
                            />
                          </div>
                        </Link>
                      );
                    }
                  )}
                </div>
              )}

              {/* MOBILE VIEW ALL */}

              <div className="border-t border-gray-100 p-4 md:hidden">
                <Link
                  href={pageHref}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#EEF4FF] px-4 py-3 text-sm font-bold text-[#1F3C88]"
                >
                  View all{" "}
                  {activeTab === "news"
                    ? "News"
                    : "Reports"}

                  <ArrowUpRight
                    size={15}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOCAL ANIMATION */}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}