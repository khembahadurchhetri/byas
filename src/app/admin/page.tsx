import Link from "next/link";
import {
  Award,
  Download,
  FileText,
  GalleryHorizontal,
  Images,
  Mail,
  Newspaper,
  ShoppingBag,
  Users,
} from "lucide-react";

const cards = [
  {
    title: "News",
    description:
      "Create and manage news posts.",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    title: "Reports",
    description:
      "Upload and manage reports.",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Downloads",
    description:
      "Manage downloadable files.",
    href: "/admin/downloads",
    icon: Download,
  },
  {
    title: "Gallery",
    description:
      "Manage gallery photos.",
    href: "/admin/gallery",
    icon: Images,
  },
  {
    title: "Success Stories",
    description:
      "Manage success stories.",
    href: "/admin/success-stories",
    icon: GalleryHorizontal,
  },
  {
    title: "Messages",
    description:
      "Read contact messages.",
    href: "/admin/messages",
    icon: Mail,
  },
  {
    title: "Team",
    description:
      "Manage board, audit and management members.",
    href: "/admin/team",
    icon: Users,
  },
  {
    title: "Achievements",
    description:
      "Manage awards and achievements.",
    href: "/admin/achievements",
    icon: Award,
  },
  {
    title: "Services",
    description:
      "Manage savings, loans and other services.",
    href: "/admin/services",
    icon: ShoppingBag,
  },
];

export default function AdminPage() {
  return (
    <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-green-700">
            Mahila SACCOS
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Manage website content
            from one place.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map(
            (card) => {
              const Icon =
                card.icon;

              return (
                <Link
                  key={
                    card.href
                  }
                  href={
                    card.href
                  }
                  className="group rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700 transition group-hover:bg-green-700 group-hover:text-white">
                    <Icon
                      size={23}
                    />
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-gray-900">
                    {
                      card.title
                    }
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {
                      card.description
                    }
                  </p>

                  <p className="mt-5 text-sm font-semibold text-green-700">
                    Manage →
                  </p>
                </Link>
              );
            }
          )}
        </div>
      </div>
    </main>
  );
}