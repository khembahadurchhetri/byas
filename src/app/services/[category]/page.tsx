import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Service {
  _id: string;
  title: string;
  titleHtml?: string;
  slug: string;
  group: string;
  subtitle: string;
  published: boolean;
  order: number;
}

const categories = {
  deposit: {
    group: "savings",
    title: "Deposit",
    intro:
      "Byas Saving and Credit Cooperative Ltd. offers secure and flexible saving options to help our members build a strong financial future. Whether you are saving for personal goals, emergencies, or long-term investments, our savings plans are designed to meet your needs with attractive returns and trustworthy service savings options.",
  },
  loans: {
    group: "loans",
    title: "Loans",
    intro:
      "Explore loan products and financial facilities available to our members.",
  },
  "loan-documents": {
    group: "loan-documents",
    title: "Loan Required Documents",
    intro:
      "Find the documents and requirements needed when applying for a loan.",
  },
  digital: {
    group: "digital",
    title: "Digital Services",
    intro: "Explore digital facilities and services available to our members.",
  },
} as const;

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{
    category: string;
  }>;
}) {
  const { category } = await params;

  const config = categories[category as keyof typeof categories];

  if (!config) {
    notFound();
  }

  const response = await fetch(
    `${API_URL}/api/services?group=${config.group}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Could not load services.");
  }

  const all: Service[] = await response.json();

  const services = all
    .filter((item) => item.published)
    .sort((a, b) => a.order - b.order);

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="border-b border-blue-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#1F3C88]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
              Services
            </p>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            {config.title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            {config.intro}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {services.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#1F3C88]">
              <FileText size={24} />
            </div>

            <p className="mt-4 font-semibold text-gray-700">
              No services available yet.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Please check again later.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service._id}
                href={`/services/${category}/${service.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#1F3C88] transition group-hover:bg-[#1F3C88] group-hover:text-white">
                  <FileText size={19} />
                </div>

                <div
                  className="mt-4 text-lg font-bold leading-7 text-gray-900 transition group-hover:text-[#1F3C88] [&_h1]:m-0 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:m-0 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:m-0 [&_h3]:text-base [&_h3]:font-semibold [&_p]:m-0"
                  dangerouslySetInnerHTML={{
                    __html: service.titleHtml || `<p>${service.title}</p>`,
                  }}
                />

                {service.subtitle && (
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                    {service.subtitle}
                  </p>
                )}

                <div className="mt-auto pt-5">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1F3C88]">
                    View details
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
