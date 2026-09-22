import Link from "next/link";
import { notFound } from "next/navigation";

interface Section {
  heading: string;
  content: string;
  order: number;
}

interface Service {
  _id: string;
  title: string;
  slug: string;

  group:
    | "savings"
    | "loans"
    | "loan-documents"
    | "digital"
    | "other";

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

const BACKEND_URL =
  "http://localhost:5000";

async function getService(
  slug: string
) {
  try {
    const response =
      await fetch(
        `${BACKEND_URL}/api/services/${encodeURIComponent(
          slug
        )}`,
        {
          cache:
            "no-store",
        }
      );

    if (
      !response.ok
    ) {
      return null;
    }

    const service: Service =
      await response.json();

    if (
      !service.published ||
      !["savings", "loans", "loan-documents", "digital", "other"].includes(service.group)
    ) {
      return null;
    }

    return service;
  } catch {
    return null;
  }
}

async function getGroupServices(
  group: string
) {
  try {
    const response =
      await fetch(
        `${BACKEND_URL}/api/services?group=${group}`,
        {
          cache:
            "no-store",
        }
      );

    if (
      !response.ok
    ) {
      return [];
    }

    const services: Service[] =
      await response.json();

    return services
      .filter(
        (service) =>
          service.published
      )
      .sort(
        (a, b) =>
          a.order -
          b.order
      );
  } catch {
    return [];
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } =
    await params;

  if (["remittance", "membership", "membershipform", "membership-form", "memebershipform"].includes(slug)) {
    notFound();
  }

  const service =
    await getService(slug);

  if (!service) {
    notFound();
  }

  const siblings =
    await getGroupServices(
      service.group
    );

  const sections =
    [...service.sections].sort(
      (a, b) =>
        a.order -
        b.order
    );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER */}

      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-green-700">
            Mahila SACCOS
          </p>

          <h1 className="mt-2 break-words text-3xl font-bold text-gray-900 sm:text-4xl">
            {service.title}
          </h1>

          {service.subtitle && (
            <p className="mt-4 max-w-4xl whitespace-pre-line text-base leading-8 text-gray-600">
              {
                service.subtitle
              }
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:py-12">
        {/* LEFT SIDEBAR */}

        {siblings.length >
          1 && (
          <aside>
            <div className="sticky top-24 overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="bg-green-700 px-5 py-4 font-bold text-white">
                Services
              </div>

              <nav className="divide-y">
                {siblings.map(
                  (item) => (
                    <Link
                      key={
                        item._id
                      }
                      href={`/services/${item.slug}`}
                      className={`block break-words px-5 py-4 text-sm transition ${
                        item.slug ===
                        service.slug
                          ? "bg-green-50 font-semibold text-green-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-green-700"
                      }`}
                    >
                      {
                        item.title
                      }
                    </Link>
                  )
                )}
              </nav>
            </div>
          </aside>
        )}

        {/* CONTENT */}

        <div
          className={
            siblings.length <=
            1
              ? "lg:col-span-2"
              : ""
          }
        >
          {/* TEXT CONTENT */}

          {service.type ===
            "content" && (
            <article className="rounded-2xl border bg-white p-5 shadow-sm sm:p-8 lg:p-10">
              {sections.length >
              0 ? (
                <div className="space-y-10">
                  {sections.map(
                    (
                      section,
                      index
                    ) => (
                      <section
                        key={
                          index
                        }
                      >
                        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                          {
                            section.heading
                          }
                        </h2>

                        <div className="mt-4 whitespace-pre-line break-words text-[15px] leading-8 text-gray-700 sm:text-base">
                          {
                            section.content
                          }
                        </div>
                      </section>
                    )
                  )}
                </div>
              ) : (
                <p className="text-gray-500">
                  Content
                  coming soon.
                </p>
              )}
            </article>
          )}

          {/* IMAGE / POSTER */}

          {service.type ===
            "image" && (
            <article className="overflow-hidden rounded-2xl border bg-white p-3 shadow-sm sm:p-6">
              {service.imageUrl ? (
                <img
                  src={`${BACKEND_URL}${service.imageUrl}`}
                  alt={
                    service.title
                  }
                  className="mx-auto h-auto max-h-[1100px] w-full object-contain"
                />
              ) : (
                <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                  No image
                  uploaded yet.
                </div>
              )}
            </article>
          )}

          {/* EXTERNAL LINK */}

          {service.type ===
            "external-link" && (
            <article className="rounded-2xl border bg-white px-6 py-12 text-center shadow-sm sm:px-10 sm:py-16">
              <h2 className="text-2xl font-bold text-gray-900">
                {
                  service.title
                }
              </h2>

              {service.subtitle && (
                <p className="mx-auto mt-4 max-w-2xl whitespace-pre-line leading-7 text-gray-600">
                  {
                    service.subtitle
                  }
                </p>
              )}

              {service.externalUrl && (
                <a
                  href={
                    service.externalUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex rounded-xl bg-green-700 px-7 py-3 font-semibold text-white transition hover:bg-green-800"
                >
                  {service.buttonText ||
                    "Open Form"}
                </a>
              )}
            </article>
          )}
        </div>
      </section>
    </main>
  );
}
