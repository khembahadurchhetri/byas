"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

const slides = [
  "/images/hero/Hero.jpg",
  "/images/hero/hero2.jpg",
  "/images/hero/hero3.jpg",
  "/images/hero/hero4.jpg",
];

export default function Hero() {
  const [current, setCurrent] =
    useState(0);

  const touchStartX =
    useRef<number | null>(
      null
    );

  function previousSlide() {
    setCurrent(
      (prev) =>
        (prev - 1 + slides.length) %
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
      window.setInterval(() => {
        nextSlide();
      }, 5000);

    return () =>
      window.clearInterval(
        timer
      );
  }, []);

  function handleTouchStart(
    event: React.TouchEvent
  ) {
    touchStartX.current =
      event.touches[0]
        .clientX;
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
      if (
        difference > 0
      ) {
        nextSlide();
      } else {
        previousSlide();
      }
    }

    touchStartX.current =
      null;
  }

  return (
    <section className="w-full bg-white">
      <div
        className="relative h-[240px] w-full overflow-hidden sm:h-[330px] md:h-[430px] lg:h-[500px]"
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
              alt={`Mahila SACCOS slide ${
                index + 1
              }`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                index ===
                current
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            />
          )
        )}

        {/* DARK OVERLAY */}

        <div className="pointer-events-none absolute inset-0 bg-black/10" />

        {/* LEFT */}

        <button
          type="button"
          aria-label="Previous slide"
          onClick={
            previousSlide
          }
          className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-3xl text-white backdrop-blur-sm transition hover:bg-black/50 sm:left-5"
        >
          ‹
        </button>

        {/* RIGHT */}

        <button
          type="button"
          aria-label="Next slide"
          onClick={
            nextSlide
          }
          className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-3xl text-white backdrop-blur-sm transition hover:bg-black/50 sm:right-5"
        >
          ›
        </button>

        {/* DOTS */}

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map(
            (
              _,
              index
            ) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${
                  index + 1
                }`}
                onClick={() =>
                  setCurrent(
                    index
                  )
                }
                className={`h-2.5 w-2.5 rounded-full border border-white transition ${
                  index ===
                  current
                    ? "bg-white"
                    : "bg-white/20"
                }`}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}