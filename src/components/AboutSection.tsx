import Link from "next/link";

import {
  ArrowRight,
} from "lucide-react";

export default function AboutSection() {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-[26px] border border-gray-200 bg-[#f7f9fc] p-6 sm:p-8 lg:p-10">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#1F3C88]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
              About Us
            </p>
          </div>

          <h2 className="mt-4 max-w-2xl text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Growing Together Through Cooperative Values
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
            Byas Saving & Credit Co-Operative Ltd.
            is committed to responsible financial
            services, member development and
            building a stronger community.
          </p>

          <Link
            href="/about/introduction"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1F3C88] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#162E6A]"
          >
            Discover Our Story

            <ArrowRight
              size={16}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}