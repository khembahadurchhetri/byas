import Link from "next/link";

import {
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

import ServiceSidebar from "@/components/ServiceSidebar";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

interface Section {
  heading: string;
  content: string;
  order: number;
}

interface Service {
  _id: string;
  title: string;
  titleHtml?: string;
  slug: string;

  group: string;

  type:
    | "content"
    | "image"
    | "external-link";

  subtitle: string;

  sections: Section[];

  imageUrl: string;

  externalUrl: string;

  buttonText: string;

  order: number;

  published: boolean;
}

const categories = {
  deposit: {
    group: "savings",
    title: "Deposit",
  },

  loans: {
    group: "loans",
    title: "Loans",
  },

  "loan-documents": {
    group: "loan-documents",
    title: "Loan Required Documents",
  },

  digital: {
    group: "digital",
    title: "Digital Services",
  },
} as const;

/*
  Makes Unicode comparison safer.

  Example:
  नियमित-मासिक-बचत
  and its decoded browser version
  will compare consistently.
*/
function normalizeSlug(
  value: string
) {
  try {
    return decodeURIComponent(
      value
    )
      .normalize("NFC")
      .trim();
  } catch {
    return value
      .normalize("NFC")
      .trim();
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}) {
  const {
    category,
    slug,
  } = await params;

  const config =
    categories[
      category as keyof typeof categories
    ];

  if (!config) {
    notFound();
  }

  /*
    IMPORTANT:
    We no longer request:

    /api/services/:slug

    That was the fragile Unicode lookup.

    We load the category once and find
    the service locally.
  */

  const response =
    await fetch(
      `${API_URL}/api/services?group=${config.group}`,
      {
        cache: "no-store",
      }
    );

  if (!response.ok) {
    throw new Error(
      "Could not load services."
    );
  }

  const allServices: Service[] =
    await response.json();

  const publishedServices =
    allServices
      .filter(
        (item) =>
          item.published
      )
      .sort(
        (a, b) =>
          a.order - b.order
      );

  const requestedSlug =
    normalizeSlug(slug);

  const service =
    publishedServices.find(
      (item) =>
        normalizeSlug(
          item.slug
        ) ===
        requestedSlug
    );

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7]">

      {/* PAGE HEADER */}

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <Link
            href={`/services/${category}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-800"
          >
            <ArrowLeft
              size={15}
            />

            {config.title}
          </Link>

          <div
            className="
              mt-4
              max-w-4xl
              text-3xl
              font-bold
              leading-tight
              text-gray-950
              sm:text-4xl

              [&_h1]:m-0
              [&_h1]:text-4xl
              [&_h1]:font-bold

              [&_h2]:m-0
              [&_h2]:text-3xl
              [&_h2]:font-bold

              [&_p]:m-0
            "
            dangerouslySetInnerHTML={{
              __html:
                service.titleHtml ||
                `<p>${service.title}</p>`,
            }}
          />

          {service.subtitle && (
            <p className="mt-4 max-w-3xl text-base leading-7 text-gray-500">
              {service.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* BODY */}

      <div className="mx-auto grid max-w-7xl gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)]">

        {/* LEFT NAV */}

        <ServiceSidebar
          title={config.title}
          category={category}
          services={
            publishedServices
          }
          activeSlug={
            service.slug
          }
        />

        {/* CONTENT */}

        <article className="min-w-0">

          {/* TEXT / CONTENT */}

          {service.type ===
            "content" && (
            <>
              {service.sections?.length >
              0 ? (
                <div className="space-y-4">
                  {[...service.sections]
                    .sort(
                      (a, b) =>
                        a.order -
                        b.order
                    )
                    .map(
                      (
                        section,
                        index
                      ) => (
                        <section
                          key={`${section.heading}-${index}`}
                          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
                        >
                          {section.heading && (
                            <h2 className="mb-3 text-xl font-bold text-gray-900 sm:text-2xl">
                              {
                                section.heading
                              }
                            </h2>
                          )}

                          <div
                            className="
                              text-[15px]
                              leading-8
                              text-gray-700

                              [&_h1]:mb-3
                              [&_h1]:mt-5
                              [&_h1]:text-3xl
                              [&_h1]:font-bold
                              [&_h1]:text-gray-950

                              [&_h2]:mb-3
                              [&_h2]:mt-5
                              [&_h2]:text-2xl
                              [&_h2]:font-bold
                              [&_h2]:text-gray-900

                              [&_h3]:mb-2
                              [&_h3]:mt-4
                              [&_h3]:text-xl
                              [&_h3]:font-bold

                              [&_p]:my-2

                              [&_strong]:font-bold

                              [&_ul]:my-3
                              [&_ul]:list-disc
                              [&_ul]:space-y-1
                              [&_ul]:pl-6

                              [&_ol]:my-3
                              [&_ol]:list-decimal
                              [&_ol]:space-y-1
                              [&_ol]:pl-6

                              [&_li]:pl-1

                              [&_blockquote]:my-4
                              [&_blockquote]:rounded-r-xl
                              [&_blockquote]:border-l-4
                              [&_blockquote]:border-green-600
                              [&_blockquote]:bg-green-50
                              [&_blockquote]:px-4
                              [&_blockquote]:py-3
                            "
                            dangerouslySetInnerHTML={{
                              __html:
                                section.content,
                            }}
                          />
                        </section>
                      )
                    )}
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">
                  Service information
                  will be added soon.
                </div>
              )}
            </>
          )}

          {/* IMAGE / POSTER */}

          {service.type ===
            "image" && (
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-3 shadow-sm">
              {service.imageUrl ? (
                <img
                  src={`${API_URL}${service.imageUrl}`}
                  alt={
                    service.title
                  }
                  className="mx-auto max-h-[720px] w-full rounded-2xl object-contain"
                />
              ) : (
                <div className="p-16 text-center text-sm text-gray-400">
                  No image has been
                  uploaded for this
                  service yet.
                </div>
              )}
            </div>
          )}

          {/* EXTERNAL LINK */}

          {service.type ===
            "external-link" && (
            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                External Service
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                Continue to service
              </h2>

              {service.subtitle && (
                <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
                  {
                    service.subtitle
                  }
                </p>
              )}

              <a
                href={
                  service.externalUrl
                }
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
              >
                {service.buttonText ||
                  "Open Link"}

                <ExternalLink
                  size={16}
                />
              </a>
            </div>
          )}
        </article>
      </div>
    </main>
  );
}