"use client";

import {
  X,
  ZoomIn,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

interface GalleryItem {
  _id: string;
  title: string;
  imageUrl: string;
}

export default function GalleryPage() {
  const [
    images,
    setImages,
  ] = useState<GalleryItem[]>([]);

  const [
    selectedImage,
    setSelectedImage,
  ] =
    useState<GalleryItem | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const response =
          await fetch(
            `${API_URL}/api/gallery`,
            {
              cache:
                "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load gallery"
          );
        }

        const data =
          await response.json();

        setImages(
          Array.isArray(
            data
          )
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load gallery:",
          error
        );

        setImages([]);
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);

  useEffect(() => {
    if (!selectedImage) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setSelectedImage(
          null
        );
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        "";
    };
  }, [selectedImage]);

  return (
    <>
      <main className="min-h-screen bg-[#f7f9fc]">
        {/* HEADER */}

        <section className="border-b border-blue-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-10 bg-[#1F3C88]" />

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
                Byas SACCOS
              </p>
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Gallery
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              Moments,
              activities and
              community events
              from Byas Saving &
              Credit
              Co-Operative Ltd.
            </p>
          </div>
        </section>

        {/* GALLERY CONTENT */}

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          {/* LOADING */}

          {loading && (
            <div className="py-24 text-center text-sm text-gray-400">
              Loading
              gallery...
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            images.length ===
              0 && (
              <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
                <p className="text-sm text-gray-500">
                  No gallery
                  images
                  available.
                </p>
              </div>
            )}

          {/* MASONRY GALLERY */}

          {!loading &&
            images.length >
              0 && (
              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                {images.map(
                  (
                    item
                  ) => (
                    <button
                      key={
                        item._id
                      }
                      type="button"
                      onClick={() =>
                        setSelectedImage(
                          item
                        )
                      }
                      className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                    >
                      <img
                        src={`${API_URL}${item.imageUrl}`}
                        alt={
                          item.title ||
                          "Byas SACCOS gallery"
                        }
                        loading="lazy"
                        className="h-auto w-full transition duration-500 group-hover:scale-[1.03]"
                      />

                      {/* HOVER OVERLAY */}

                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition duration-300 group-hover:bg-black/25 group-hover:opacity-100">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#1F3C88] shadow-lg">
                          <ZoomIn
                            size={
                              20
                            }
                          />
                        </div>
                      </div>
                    </button>
                  )
                )}
              </div>
            )}
        </section>
      </main>

      {/* LIGHTBOX */}

      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={() =>
            setSelectedImage(
              null
            )
          }
        >
          <button
            type="button"
            onClick={() =>
              setSelectedImage(
                null
              )
            }
            aria-label="Close image"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg transition hover:bg-gray-100 sm:right-7 sm:top-7"
          >
            <X
              size={
                22
              }
            />
          </button>

          <div
            className="flex max-h-full max-w-6xl flex-col items-center"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <img
              src={`${API_URL}${selectedImage.imageUrl}`}
              alt={
                selectedImage.title ||
                "Byas SACCOS gallery"
              }
              className="max-h-[82vh] max-w-full rounded-xl object-contain shadow-2xl"
            />

            {selectedImage.title?.trim() && (
              <p className="mt-4 max-w-3xl text-center text-sm font-medium text-white sm:text-base">
                {
                  selectedImage.title
                }
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}