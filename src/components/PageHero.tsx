import Link from "next/link";

type PageHeroProps = {
  title: string;
};

export default function PageHero({ title }: PageHeroProps) {
  return (
    <section className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          {title}
        </h1>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="text-green-600 hover:underline">
            Home
          </Link>

          <span>/</span>

          <span>{title}</span>
        </div>
      </div>
    </section>
  );
}