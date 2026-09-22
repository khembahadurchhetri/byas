import PageHero from "@/components/PageHero";

type EmptyContentPageProps = {
  title: string;
  subtitle: string;
  description: string;
};

export default function EmptyContentPage({
  title,
  subtitle,
  description,
}: EmptyContentPageProps) {
  return (
    <>
      <PageHero title={title} />

      <section className="bg-gray-50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
              {subtitle}
            </p>

            <h2 className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">
              {title}
            </h2>

            <p className="mt-5 max-w-3xl leading-8 text-gray-600">
              {description}
            </p>

            <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
              Content will be published here.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}