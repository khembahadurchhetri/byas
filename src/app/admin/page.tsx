"use client";

import Link from "next/link";

import {
  Award,
  FileText,
  Images,
  Mail,
  Newspaper,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Users,
  GalleryHorizontal,
  ArrowUpRight,
  Eye,
  CircleCheck,
  Clock3,
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
  published: boolean;
  createdAt?: string;
}

interface MessageItem {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface DashboardCounts {
  news: number;
  reports: number;
  gallery: number;
  stories: number;
  messages: number;
  team: number;
  achievements: number;
  services: number;
}

const emptyCounts: DashboardCounts = {
  news: 0,
  reports: 0,
  gallery: 0,
  stories: 0,
  messages: 0,
  team: 0,
  achievements: 0,
  services: 0,
};

async function fetchArray<T>(
  endpoint: string
): Promise<T[]> {
  try {
    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        cache: "no-store",
        credentials: "include",
      }
    );

    if (!response.ok) {
      return [];
    }

    const data =
      await response.json();

    return Array.isArray(data)
      ? data
      : [];
  } catch {
    return [];
  }
}

export default function AdminDashboardPage() {
  const [counts, setCounts] =
    useState<DashboardCounts>(
      emptyCounts
    );

  const [news, setNews] =
    useState<NewsItem[]>([]);

  const [
    messages,
    setMessages,
  ] = useState<MessageItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadDashboard() {
    setLoading(true);

    try {
      const [
        newsData,
        reportsData,
        galleryData,
        storiesData,
        messagesData,
        teamData,
        achievementsData,
        servicesData,
      ] = await Promise.all([
        fetchArray<NewsItem>(
          "/api/news/admin/all"
        ),

        fetchArray(
          "/api/reports"
        ),

        fetchArray(
          "/api/gallery"
        ),

        fetchArray(
          "/api/success-stories"
        ),

        fetchArray<MessageItem>(
          "/api/messages"
        ),

        fetchArray(
          "/api/team"
        ),

        fetchArray(
          "/api/achievements"
        ),

        fetchArray(
          "/api/services"
        ),
      ]);

      setCounts({
        news: newsData.length,
        reports:
          reportsData.length,
        gallery:
          galleryData.length,
        stories:
          storiesData.length,
        messages:
          messagesData.length,
        team: teamData.length,
        achievements:
          achievementsData.length,
        services:
          servicesData.length,
      });

      setNews(newsData);
      setMessages(
        messagesData
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const unreadMessages =
    useMemo(
      () =>
        messages.filter(
          (item) =>
            !item.read
        ).length,
      [messages]
    );

  const publishedNews =
    useMemo(
      () =>
        news.filter(
          (item) =>
            item.published
        ).length,
      [news]
    );

  const hiddenNews =
    news.length -
    publishedNews;

  const recentMessages = [
    ...messages,
  ]
    .sort(
      (
        a,
        b
      ) =>
        new Date(
          b.createdAt
        ).getTime() -
        new Date(
          a.createdAt
        ).getTime()
    )
    .slice(
      0,
      4
    );

  const recentNews = [
    ...news,
  ]
    .sort(
      (
        a,
        b
      ) =>
        new Date(
          b.createdAt ||
            0
        ).getTime() -
        new Date(
          a.createdAt ||
            0
        ).getTime()
    )
    .slice(
      0,
      4
    );

  const stats = [
    {
      label: "News",
      value:
        counts.news,
      href:
        "/admin/news",
      icon:
        Newspaper,
      description: `${publishedNews} published`,
    },

    {
      label:
        "Messages",
      value:
        counts.messages,
      href:
        "/admin/messages",
      icon:
        Mail,
      description: `${unreadMessages} unread`,
    },

    {
      label:
        "Services",
      value:
        counts.services,
      href:
        "/admin/services",
      icon:
        ShoppingBag,
      description:
        "Deposit, loans & digital",
    },

    {
      label:
        "Reports",
      value:
        counts.reports,
      href:
        "/admin/reports",
      icon:
        FileText,
      description:
        "Published reports",
    },

    {
      label:
        "Gallery",
      value:
        counts.gallery,
      href:
        "/admin/gallery",
      icon:
        Images,
      description:
        "Gallery items",
    },

    {
      label:
        "Success Stories",
      value:
        counts.stories,
      href:
        "/admin/success-stories",
      icon:
        GalleryHorizontal,
      description:
        "Member stories",
    },

    {
      label:
        "Team",
      value:
        counts.team,
      href:
        "/admin/team",
      icon:
        Users,
      description:
        "People listed",
    },

    {
      label:
        "Achievements",
      value:
        counts.achievements,
      href:
        "/admin/achievements",
      icon:
        Award,
      description:
        "Awards & milestones",
    },
  ];

  const totalContent =
    counts.news +
    counts.reports +
    counts.gallery +
    counts.stories +
    counts.services +
    counts.achievements;

  return (
    <main className="min-h-screen bg-[#f6f8fc] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        {/* TOP */}

        <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#162E6A] via-[#1F3C88] to-[#3157B7] p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-100">
                <Sparkles
                  size={17}
                />

                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Byas SACCOS CMS
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Admin Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50/90 sm:text-base">
                Manage website
                content,
                services,
                reports and
                member
                communication
                from one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/news"
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#1F3C88] shadow-sm transition hover:bg-[#EEF4FF]"
              >
                + Add News
              </Link>

              <button
                type="button"
                onClick={
                  loadDashboard
                }
                disabled={
                  loading
                }
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>
            </div>
          </div>

          {/* HERO SUMMARY */}

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <TopSummary
              icon={
                CircleCheck
              }
              label="Website Content"
              value={
                totalContent
              }
            />

            <TopSummary
              icon={Mail}
              label="Unread Messages"
              value={
                unreadMessages
              }
            />

            <TopSummary
              icon={Eye}
              label="Hidden News"
              value={
                hiddenNews
              }
            />
          </div>
        </div>

        {/* STAT CARDS */}

        <section className="mt-7">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Content
                Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Live
                quantities
                from your
                website.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map(
              (
                item
              ) => {
                const Icon =
                  item.icon;

                return (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#1F3C88] transition group-hover:bg-[#1F3C88] group-hover:text-white">
                        <Icon
                          size={
                            20
                          }
                        />
                      </div>

                      <ArrowUpRight
                        size={
                          18
                        }
                        className="text-gray-300 transition group-hover:text-[#1F3C88]"
                      />
                    </div>

                    <p className="mt-5 text-3xl font-bold tracking-tight text-gray-900">
                      {loading
                        ? "—"
                        : item.value}
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {
                        item.label
                      }
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {
                        item.description
                      }
                    </p>
                  </Link>
                );
              }
            )}
          </div>
        </section>

        {/* LOWER DASHBOARD */}

        <div className="mt-7 grid gap-6 xl:grid-cols-2">
          {/* MESSAGES */}

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-bold text-gray-900">
                  Recent
                  Messages
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Latest
                  contact
                  submissions
                </p>
              </div>

              <Link
                href="/admin/messages"
                className="text-sm font-semibold text-[#1F3C88] hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="divide-y">
              {recentMessages.length >
              0 ? (
                recentMessages.map(
                  (
                    message
                  ) => (
                    <Link
                      key={
                        message._id
                      }
                      href="/admin/messages"
                      className="flex gap-4 px-5 py-4 transition hover:bg-[#F8FAFF] sm:px-6"
                    >
                      <div
                        className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                          message.read
                            ? "bg-gray-300"
                            : "bg-amber-400"
                        }`}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-sm font-semibold text-gray-800">
                            {
                              message.name
                            }
                          </p>

                          {!message.read && (
                            <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                              NEW
                            </span>
                          )}
                        </div>

                        <p className="mt-1 truncate text-xs font-medium text-gray-500">
                          {
                            message.subject
                          }
                        </p>

                        <p className="mt-1 line-clamp-1 text-xs text-gray-400">
                          {
                            message.message
                          }
                        </p>
                      </div>
                    </Link>
                  )
                )
              ) : (
                <EmptyArea text="No messages yet." />
              )}
            </div>
          </section>

          {/* NEWS */}

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-bold text-gray-900">
                  Recent News
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Recently
                  created
                  articles
                </p>
              </div>

              <Link
                href="/admin/news"
                className="text-sm font-semibold text-[#1F3C88] hover:underline"
              >
                Manage
              </Link>
            </div>

            <div className="divide-y">
              {recentNews.length >
              0 ? (
                recentNews.map(
                  (
                    item
                  ) => (
                    <Link
                      key={
                        item._id
                      }
                      href="/admin/news"
                      className="flex items-center gap-4 px-5 py-4 transition hover:bg-[#F8FAFF] sm:px-6"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#1F3C88]">
                        <Newspaper
                          size={
                            18
                          }
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {
                            item.title
                          }
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              item.published
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {item.published
                              ? "Published"
                              : "Hidden"}
                          </span>

                          {item.createdAt && (
                            <span className="flex items-center gap-1 text-[11px] text-gray-400">
                              <Clock3
                                size={
                                  11
                                }
                              />

                              {new Date(
                                item.createdAt
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <ArrowUpRight
                        size={
                          16
                        }
                        className="text-gray-300"
                      />
                    </Link>
                  )
                )
              ) : (
                <EmptyArea text="No news added yet." />
              )}
            </div>
          </section>
        </div>

        {/* QUICK ACTIONS */}

        <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="font-bold text-gray-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Jump
              directly to
              common
              administrative
              tasks.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <QuickAction
              href="/admin/news"
              text="Create News"
            />

            <QuickAction
              href="/admin/services"
              text="Manage Services"
            />

            <QuickAction
              href="/admin/gallery"
              text="Upload Gallery"
            />

            <QuickAction
              href="/admin/team"
              text="Manage Team"
            />

            <QuickAction
              href="/admin/account"
              text="Account Settings"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function TopSummary({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
          <Icon size={18} />
        </div>

        <div>
          <p className="text-2xl font-bold">
            {value}
          </p>

          <p className="text-xs text-blue-100">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  text,
}: {
  href: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-[#EEF4FF] hover:text-[#1F3C88]"
    >
      {text}

      <ArrowUpRight
        size={14}
        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  );
}

function EmptyArea({
  text,
}: {
  text: string;
}) {
  return (
    <div className="px-6 py-10 text-center text-sm text-gray-400">
      {text}
    </div>
  );
}