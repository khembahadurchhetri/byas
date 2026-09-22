import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";

type ServiceGroup =
  | "savings"
  | "loans"
  | "loan-documents"
  | "digital"
  | "other";

type ServiceType =
  | "content"
  | "image"
  | "external-link";

interface Section {
  heading: string;
  content: string;
  order: number;
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  group: ServiceGroup;
  type: ServiceType;
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

async function getServices(
  group: ServiceGroup
): Promise<Service[]> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/services?group=${group}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const data: Service[] =
      await response.json();

    return data
      .filter(
        (service) =>
          service.published &&
          service.group === group
      )
      .sort(
        (a, b) =>
          a.order - b.order
      );
  } catch (error) {
    console.error(
      `Failed to load ${group} services:`,
      error
    );

    return [];
  }
}

export default async function ServiceGroupPage({
  group,
  title,
  basePath,
  slug,
}: {
  group: ServiceGroup;
  title: string;
  basePath: string;
  slug?: string;
}) {
  const services =
    await getServices(group);

  /*
   * Category page:
   * choose first published service.
   *
   * Detail page:
   * choose the requested slug.
   */
  const selectedService = slug
    ? services.find(
        (service) =>
          service.slug === slug
      )
    : services[0];

  if (slug && !selectedService) {
    notFound();
  }

  return (
    <>
      <PageHero title={title} />

      <section className="bg-gray-50 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {services.length === 0 ? (
            <div className="rounded-2xl border bg-white px-5 py-16 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800">
                No published services yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Service information will
                appear here once it is
                published.
              </p>
            </div>
          ) : (
            <div className="grid gap-7 lg:grid-cols-[280px_minmax(0,1fr)]">
              {/* SERVICE LIST */}

              <aside>
                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm lg:sticky lg:top-24">
                  <div className="bg-green-700 px-5 py-4 text-lg font-bold text-white">
                    {title}
                  </div>

                  <nav className="divide-y">
                    {services.map(
                      (service) => {
                        const active =
                          selectedService?._id ===
                          service._id;

                        return (
                          <Link
                            key={
                              service._id
                            }
                            href={`${basePath}/${service.slug}`}
                            className={`block break-words px-5 py-4 text-sm transition ${
                              active
                                ? "bg-green-50 font-semibold text-green-700"
                                : "text-gray-700 hover:bg-gray-50 hover:text-green-700"
                            }`}
                          >
                            {
                              service.title
                            }
                          </Link>
                        );
                      }
                    )}
                  </nav>
                </div>
              </aside>

              {/* SELECTED SERVICE */}

              {selectedService && (
                <div className="min-w-0">
                  <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm sm:p-7">
                    <h1 className="break-words text-2xl font-bold text-gray-900 sm:text-3xl">
                      {
                        selectedService.title
                      }
                    </h1>

                    {selectedService.subtitle && (
                      <p className="mt-3 whitespace-pre-line break-words leading-7 text-gray-600">
                        {
                          selectedService.subtitle
                        }
                      </p>
                    )}
                  </div>

                  {/* TEXT CONTENT */}

                  {selectedService.type ===
                    "content" && (
                    <article className="rounded-2xl border bg-white p-5 shadow-sm sm:p-8">
                      {selectedService
                        .sections
                        ?.length ? (
                        <div className="space-y-9">
                          {[
                            ...selectedService.sections,
                          ]
                            .sort(
                              (
                                a,
                                b
                              ) =>
                                a.order -
                                b.order
                            )
                            .map(
                              (
                                section,
                                index
                              ) => (
                                <section
                                  key={
                                    index
                                  }
                                >
                                  {section.heading && (
                                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                      {
                                        section.heading
                                      }
                                    </h2>
                                  )}

                                  {section.content && (
                                    <div className="mt-4 whitespace-pre-line break-words text-[15px] leading-8 text-gray-700 sm:text-base">
                                      {
                                        section.content
                                      }
                                    </div>
                                  )}
                                </section>
                              )
                            )}
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          Content coming
                          soon.
                        </p>
                      )}
                    </article>
                  )}

                  {/* IMAGE / POSTER */}

                  {selectedService.type ===
                    "image" && (
                    <article className="overflow-hidden rounded-2xl border bg-white p-4 shadow-sm sm:p-7">
                      {selectedService.imageUrl ? (
                        <img
                          src={`${BACKEND_URL}${selectedService.imageUrl}`}
                          alt={
                            selectedService.title
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

                  {selectedService.type ===
                    "external-link" && (
                    <article className="rounded-2xl border bg-white px-6 py-12 text-center shadow-sm">
                      {selectedService.externalUrl ? (
                        <a
                          href={
                            selectedService.externalUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex rounded-xl bg-green-700 px-7 py-3 font-semibold text-white transition hover:bg-green-800"
                        >
                          {selectedService.buttonText ||
                            "Open Link"}
                        </a>
                      ) : (
                        <p className="text-gray-500">
                          Link not
                          available.
                        </p>
                      )}
                    </article>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}