"use client";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  Award,
  Download,
  FileText,
  GalleryHorizontal,
  Home,
  Images,
  KeyRound,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Settings,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

const API_URL =
  process.env
    .NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const AUTH_URL =
  `${API_URL}/api/auth`;

const adminLinks = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    name: "News",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    name: "Downloads",
    href: "/admin/downloads",
    icon: Download,
  },
  {
    name: "Gallery",
    href: "/admin/gallery",
    icon: Images,
  },
  {
    name: "Success Stories",
    href: "/admin/success-stories",
    icon: GalleryHorizontal,
  },
  {
    name: "Messages",
    href: "/admin/messages",
    icon: Mail,
  },
  {
    name: "Team",
    href: "/admin/team",
    icon: Users,
  },
  {
    name: "Achievements",
    href: "/admin/achievements",
    icon: Award,
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: ShoppingBag,
  },
  {
    name: "Account",
    href: "/admin/account",
    icon: KeyRound,
  },
];

export default function AdminSidebar() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const [open, setOpen] =
    useState(false);

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  function isActive(
    href: string
  ) {
    if (href === "/admin") {
      return (
        pathname === "/admin"
      );
    }

    return pathname.startsWith(
      href
    );
  }

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch(
        `${AUTH_URL}/logout`,
        {
          method: "POST",
          credentials:
            "include",
        }
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      router.replace(
        "/admin/login"
      );

      router.refresh();

      setLoggingOut(false);
    }
  }

  return (
    <>
      {/* MOBILE TOP BAR */}

      <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-white px-4 py-3 lg:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
            Mahila SACCOS
          </p>

          <h1 className="font-bold text-gray-900">
            Admin Panel
          </h1>
        </div>

        <button
          type="button"
          onClick={() =>
            setOpen(true)
          }
          className="rounded-lg border p-2 text-gray-700"
          aria-label="Open admin menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() =>
            setOpen(false)
          }
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-white transition-transform duration-200 lg:translate-x-0 ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* TITLE */}

        <div className="flex h-20 items-center justify-between border-b px-5">
          <Link
            href="/admin"
            onClick={() =>
              setOpen(false)
            }
          >
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-green-700">
              Mahila SACCOS
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              Admin Panel
            </h2>
          </Link>

          <button
            type="button"
            onClick={() =>
              setOpen(false)
            }
            className="rounded-lg border p-2 lg:hidden"
            aria-label="Close admin menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAV */}

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {adminLinks.map(
              (item) => {
                const Icon =
                  item.icon;

                const active =
                  isActive(
                    item.href
                  );

                return (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    onClick={() =>
                      setOpen(
                        false
                      )
                    }
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-green-700 text-white"
                        : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    <Icon
                      size={19}
                    />

                    <span>
                      {
                        item.name
                      }
                    </span>
                  </Link>
                );
              }
            )}
          </div>
        </nav>

        {/* BOTTOM */}

        <div className="space-y-2 border-t p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <Home size={18} />

            View Website
          </Link>

          <button
            type="button"
            onClick={
              handleLogout
            }
            disabled={
              loggingOut
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <LogOut
              size={18}
            />

            {loggingOut
              ? "Logging out..."
              : "Logout"}
          </button>

          <div className="flex items-center gap-2 px-2 pt-1 text-xs text-gray-400">
            <Settings
              size={14}
            />

            Admin tools
          </div>
        </div>
      </aside>
    </>
  );
}