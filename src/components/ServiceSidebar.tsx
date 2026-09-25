import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Service {
  _id: string;
  title: string;
  slug: string;
}

export default function ServiceSidebar({
  title,
  category,
  services,
  activeSlug,
}: {
  title: string;
  category: string;
  services: Service[];
  activeSlug?: string;
}) {
  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b bg-[#1F3C88] px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
            Services
          </p>

          <h2 className="mt-1 text-lg font-bold text-white">{title}</h2>
        </div>

        <nav className="p-2">
          {services.map((service) => {
            const active = service.slug === activeSlug;

            return (
              <Link
                key={service._id}
                href={`/services/${category}/${service.slug}`}
                className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-[#EEF4FF] font-bold text-[#1F3C88]"
                    : "text-gray-600 hover:bg-[#EEF4FF] hover:text-[#1F3C88]"
                }`}
              >
                <span>{service.title}</span>

                <ChevronRight size={15} className="shrink-0" />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
