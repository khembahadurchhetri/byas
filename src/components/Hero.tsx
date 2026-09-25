"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

const slides = [
  "/images/hero/hero.jpeg",
  "/images/hero/hero2.jpg",
  "/images/hero/hero3.jpg",
  "/images/hero/hero4.jpg",
];

export default function Hero() {
  const [current, setCurrent] =
    useState(0);

  const touchStartX =
    useRef<number | null>(null);

  function previousSlide() {
    setCurrent(
      (prev) =>
        (prev -
          1 +
          slides.length) %
        slides.length
    );
  }

  function nextSlide() {
    setCurrent(
      (prev) =>
        (prev + 1) %
        slides.length
    );
  }

  useEffect(() => {
    const timer =
      window.setInterval(
        nextSlide,
        5500
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, []);

  function handleTouchStart(
    event: React.TouchEvent
  ) {
    touchStartX.current =
      event.touches[0].clientX;
  }

  function handleTouchEnd(
    event: React.TouchEvent
  ) {
    if (
      touchStartX.current ===
      null
    ) {
      return;
    }

    const endX =
      event.changedTouches[0]
        .clientX;

    const difference =
      touchStartX.current -
      endX;

    if (
      Math.abs(
        difference
      ) > 50
    ) {
      if (difference > 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }

    touchStartX.current =
      null;
  }

  return (
    <section className="relative bg-white">
      <div
        className="relative h-[235px] w-full overflow-hidden sm:h-[340px] md:h-[430px] lg:h-[500px]"
        onTouchStart={
          handleTouchStart
        }
        onTouchEnd={
          handleTouchEnd
        }
      >
        {slides.map(
          (
            image,
            index
          ) => (
            <img
              key={image}
              src={image}
              alt={`Byas Saving & Credit Co-Operative Ltd. slide ${
                index + 1
              }`}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out ${
                index ===
                current
                  ? "scale-100 opacity-100"
                  : "scale-[1.04] opacity-0"
              }`}
            />
          )
        )}

        {/* OVERLAY */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* PREVIOUS */}

        <button
          type="button"
          aria-label="Previous slide"
          onClick={
            previousSlide
          }
          className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-md transition hover:bg-black/45 sm:left-5 sm:h-11 sm:w-11"
        >
          <ChevronLeft
            size={21}
          />
        </button>

        {/* NEXT */}

        <button
          type="button"
          aria-label="Next slide"
          onClick={nextSlide}
          className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-md transition hover:bg-black/45 sm:right-5 sm:h-11 sm:w-11"
        >
          <ChevronRight
            size={21}
          />
        </button>

        {/* DOTS */}

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-md">
          {slides.map(
            (
              _,
              index
            ) => (
              <button
                key={
                  index
                }
                type="button"
                aria-label={`Go to slide ${
                  index + 1
                }`}
                onClick={() =>
                  setCurrent(
                    index
                  )
                }
                className={`h-2 rounded-full transition-all duration-300 ${
                  index ===
                  current
                    ? "w-6 bg-white"
                    : "w-2 bg-white/50"
                }`}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}