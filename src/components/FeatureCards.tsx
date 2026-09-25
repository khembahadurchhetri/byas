"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

const images = [
  {
    src: "/images/gallery/gallery1.png",
    title: "Vision",
    alt: "Vision of Byas Saving & Credit Co-Operative Ltd.",
  },
  {
    src: "/images/gallery/gallery2.png",
    title: "Mission",
    alt: "Mission of Byas Saving & Credit Co-Operative Ltd.",
  },
  {
    src: "/images/gallery/gallery3.png",
    title:
      "Strategic Pillars",
    alt: "Strategic pillars of Byas Saving & Credit Co-Operative Ltd.",
  },
];

export default function FeatureCards() {
  const sliderRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const [
    interacting,
    setInteracting,
  ] = useState(false);

  function goToSlide(
    index: number
  ) {
    const slider =
      sliderRef.current;

    if (!slider) return;

    const nextIndex =
      (index +
        images.length) %
      images.length;

    slider.scrollTo({
      left:
        slider.clientWidth *
        nextIndex,
      behavior: "smooth",
    });

    setActiveIndex(
      nextIndex
    );
  }

  useEffect(() => {
    if (interacting) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          goToSlide(
            activeIndex + 1
          );
        },
        5500
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, [
    activeIndex,
    interacting,
  ]);

  function handleScroll() {
    const slider =
      sliderRef.current;

    if (!slider) return;

    const index =
      Math.round(
        slider.scrollLeft /
          slider.clientWidth
      );

    if (
      index >= 0 &&
      index <
        images.length
    ) {
      setActiveIndex(
        index
      );
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#f7f9fc] py-10 sm:py-16">
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute -right-32 top-0 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* SECTION HEADER */}

        <div className="mb-6 sm:mb-9">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#1F3C88]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
              Our Direction
            </p>
          </div>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl lg:text-4xl">
            Vision, Mission &
            Strategic Focus
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            The principles and
            priorities that guide
            Byas Saving & Credit
            Co-Operative Ltd.
          </p>
        </div>

        {/* MOBILE SLIDER */}

        <div className="-mx-4 sm:hidden">
          <div
            ref={sliderRef}
            onScroll={
              handleScroll
            }
            onTouchStart={() =>
              setInteracting(
                true
              )
            }
            onTouchEnd={() => {
              window.setTimeout(
                () =>
                  setInteracting(
                    false
                  ),
                2500
              );
            }}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map(
              (
                image
              ) => (
                <div
                  key={
                    image.src
                  }
                  className="w-full shrink-0 snap-center px-4"
                >
                  <div className="overflow-hidden rounded-[24px] border border-gray-200 bg-white p-2 shadow-[0_12px_35px_rgba(31,60,136,0.08)]">
                    <img
                      src={
                        image.src
                      }
                      alt={
                        image.alt
                      }
                      className="h-auto w-full rounded-[18px] object-contain"
                    />
                  </div>
                </div>
              )
            )}
          </div>

          {/* DOTS */}

          <div className="mt-5 flex items-center justify-center gap-2">
            {images.map(
              (
                image,
                index
              ) => (
                <button
                  key={
                    image.src
                  }
                  type="button"
                  onClick={() =>
                    goToSlide(
                      index
                    )
                  }
                  aria-label={`View ${
                    image.title
                  }`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index ===
                    activeIndex
                      ? "w-7 bg-[#1F3C88]"
                      : "w-2 bg-blue-200"
                  }`}
                />
              )
            )}
          </div>
        </div>

        {/* DESKTOP */}

        <div className="hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {images.map(
            (
              image
            ) => (
              <article
                key={
                  image.src
                }
                className="group overflow-hidden rounded-[26px] border border-gray-200 bg-white p-2 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <img
                  src={
                    image.src
                  }
                  alt={
                    image.alt
                  }
                  className="h-auto w-full rounded-[20px] object-contain transition duration-500 group-hover:scale-[1.015]"
                />
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}