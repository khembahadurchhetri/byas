"use client";

import Link from "next/link";
import {
  Copy,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [copied, setCopied] =
    useState("");

  async function copyText(
    value: string,
    label: string
  ) {
    await navigator.clipboard.writeText(
      value
    );

    setCopied(label);

    setTimeout(() => {
      setCopied("");
    }, 1500);
  }

  return (
    <>
      <footer className="bg-green-700 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">

          {/* FACEBOOK */}

          <div className="w-full overflow-hidden">
            <h3 className="mb-5 text-xl font-bold">
              Facebook
            </h3>

            <div className="max-w-[340px] overflow-hidden rounded-xl bg-white">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmahilasaccositahari&tabs=timeline&width=340&height=260&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
                width="340"
                height="260"
                className="block w-full max-w-full border-0 bg-white"
                title="Mahila SACCOS Facebook Page"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          {/* QUICK LINKS */}

          <div>
            <h3 className="mb-5 text-xl font-bold">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-sm text-green-50">
              <Link
                href="/about"
                className="w-fit transition hover:text-yellow-300"
              >
                About Us
              </Link>

              <Link
                href="/services/deposit"
                className="w-fit transition hover:text-yellow-300"
              >
                Deposit
              </Link>

              <Link
                href="/services/loans"
                className="w-fit transition hover:text-yellow-300"
              >
                Loans
              </Link>

              <Link
                href="/gallery"
                className="w-fit transition hover:text-yellow-300"
              >
                Gallery
              </Link>

              <Link
                href="/news"
                className="w-fit transition hover:text-yellow-300"
              >
                Latest News
              </Link>

              <Link
                href="/contact"
                className="w-fit transition hover:text-yellow-300"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* USEFUL LINKS */}

          <div>
            <h3 className="mb-5 text-xl font-bold">
              Useful Links
            </h3>

            <div className="flex flex-col gap-3 text-sm leading-6 text-green-50">
              <a
                href="https://www.nefscun.org.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit transition hover:text-yellow-300 hover:underline"
              >
                NEFSCUN
              </a>

              <a
                href="https://ncfnepal.com.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit transition hover:text-yellow-300 hover:underline"
              >
                National Cooperative Federation of Nepal
              </a>

              <a
                href="https://www.deoc.gov.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit transition hover:text-yellow-300 hover:underline"
              >
                Department of Cooperative
              </a>

              <a
                href="https://mof.gov.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit transition hover:text-yellow-300 hover:underline"
              >
                Ministry of Finance
              </a>

              <a
                href="https://www.moald.gov.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit transition hover:text-yellow-300 hover:underline"
              >
                Ministry of Agriculture, Forest and Environment
              </a>

              <a
                href="https://ncbl.coop/html/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit transition hover:text-yellow-300 hover:underline"
              >
                National Cooperative Bank Limited
              </a>
            </div>
          </div>

          {/* HEAD OFFICE */}

          <div>
            <h3 className="mb-5 text-xl font-bold">
              Head Office
            </h3>

            <div className="space-y-4 text-sm text-green-50">

              {/* ADDRESS */}

              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-yellow-300"
                />

                <p>
                  इटहरी उपमहानगरपालिका वडा नं. ४, आइतबारे, सुनसरी
                </p>
              </div>

              {/* PHONE */}

              <div className="flex flex-wrap items-center gap-2">
                <Phone
                  size={17}
                  className="shrink-0 text-yellow-300"
                />

                <a
                  href="tel:+97725582217"
                  className="hover:text-yellow-300 hover:underline"
                >
                  +977-025-582217
                </a>

                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      "+977-025-582217",
                      "phone"
                    )
                  }
                  title="Copy phone number"
                  className="rounded p-1.5 transition hover:bg-white/10"
                >
                  <Copy
                    size={14}
                  />
                </button>

                {copied === "phone" && (
                  <span className="text-xs text-yellow-300">
                    Copied
                  </span>
                )}
              </div>

              {/* EMAIL */}

              <div className="flex flex-wrap items-center gap-2">
                <Mail
                  size={17}
                  className="shrink-0 text-yellow-300"
                />

                <a
                  href="mailto:info@mahilasaccos.coop.np"
                  className="break-all hover:text-yellow-300 hover:underline"
                >
                  info@mahilasaccos.coop.np
                </a>

                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      "info@mahilasaccos.coop.np",
                      "email"
                    )
                  }
                  title="Copy email"
                  className="rounded p-1.5 transition hover:bg-white/10"
                >
                  <Copy
                    size={14}
                  />
                </button>

                {copied === "email" && (
                  <span className="text-xs text-yellow-300">
                    Copied
                  </span>
                )}
              </div>
            </div>

            {/* FACEBOOK BUTTON */}

            <a
              href="https://www.facebook.com/mahilasaccositahari"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm transition hover:bg-white/20"
            >
              <Globe
                size={18}
              />
              Facebook
            </a>
          </div>
        </div>
      </footer>

      {/* COPYRIGHT */}

      <div className="bg-white px-4 py-4 text-center text-xs text-gray-500 sm:text-sm">
        © Mahila SACCOS. All Rights Reserved. Design & Developed by{" "}
        <span className="font-semibold text-gray-700">
          Mahila SACCOS
        </span>
      </div>
    </>
  );
}