import Link from "next/link";
import {
  PiggyBank,
  HandCoins,
  FileText,
} from "lucide-react";

const schemes = [
  {
    name: "Saving Schemes",
    href: "/services/savings",
    icon: PiggyBank,
  },
  {
    name: "Loan Scheme",
    href: "/services/loans",
    icon: HandCoins,
  },
  {
    name: "Others",
    href: "/services",
    icon: FileText,
  },
];

export default function Schemes() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl mt-1 mb-3 ">
        <div className="flex items-center gap-2">
  <span className="text-xs text-green-700 font-medium">Schemes</span>
  <div className="w-12 h-[1px] bg-green-700"></div>
</div>

        <h2 className="mb-10 text-3xl font-bold">
          Our <span className="font-normal text-green-600">Schemes</span>
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {schemes.map(({ name, href, icon: Icon }) => (
            <article
              key={name}
              className="flex min-h-60 flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-lg"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
                <Icon size={30} />
              </div>

              <h3 className="mt-5 text-lg text-gray-700">
                {name}
              </h3>

              <Link
                href={href}
                className="mt-4 rounded-full border border-green-600 px-6 py-2 text-sm text-green-700 transition hover:bg-green-600 hover:text-white"
              >
                Read More
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
