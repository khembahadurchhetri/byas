import Link from "next/link";
import {
  ArrowRight,
  FileText,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

const API_URL =
  process.env
    .NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

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
      "Explore saving and deposit schemes offered by Mahila SACCOS.",
  },

  loans: {
    group: "loans",
    title: "Loans",
    intro:
      "Loan products and financial facilities for our members.",
  },

  "loan-documents": {
    group:
      "loan-documents",
    title:
      "Loan Required Documents",
    intro:
      "Find the documents and requirements needed for loan applications.",
  },

  digital: {
    group: "digital",
    title:
      "Digital Services",
    intro:
      "Digital facilities and services available to our members.",
  },
} as const;

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{
    category: string;
  }>;
}) {
  const {
    category,
  } = await params;

  const config =
    categories[
      category as keyof typeof categories
    ];

  if (!config) {
    notFound();
  }

  const response =
    await fetch(
      `${API_URL}/api/services?group=${config.group}`,
      {
        cache:
          "no-store",
      }
    );

  if (!response.ok) {
    throw new Error(
      "Could not load services."
    );
  }

  const all: Service[] =
    await response.json();

  const services =
    all
      .filter(
        (item) =>
          item.published
      )
      .sort(
        (a, b) =>
          a.order - b.order
      );

  return (
    <main className="min-h-screen bg-[#f7f9f7]">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
            Mahila SACCOS
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            {config.title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            {config.intro}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {services.length ===
        0 ? (
          <div className="rounded-3xl border bg-white p-12 text-center">
            <p className="font-semibold text-gray-700">
              No services
              available yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(
              (service) => (
                <Link
                  key={
                    service._id
                  }
                  href={`/services/${category}/${service.slug}`}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
                    <FileText
                      size={19}
                    />
                  </div>

                  <div
                    className="mt-4 text-lg font-bold leading-7 text-gray-900 group-hover:text-green-700 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_p]:m-0"
                    dangerouslySetInnerHTML={{
                      __html:
                        service.titleHtml ||
                        `<p>${service.title}</p>`,
                    }}
                  />

                  {service.subtitle && (
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
                      {
                        service.subtitle
                      }
                    </p>
                  )}

                  <span className="mt-5 flex items-center gap-1 text-sm font-bold text-green-700">
                    View details
                    <ArrowRight
                      size={
                        14
                      }
                    />
                  </span>
                </Link>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}