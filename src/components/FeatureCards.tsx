export default function FeatureCards() {
  const images = [
    {
      src: "/images/gallery/gallery1.png",
      alt: "Vyas credits and savings",
    },
    {
      src: "/images/gallery/gallery2.png",
      alt: "Vyas credits and savings",
    },
    {
      src: "/images/gallery/gallery3.png",
      alt: "Vyas credits and savings",
    },
  ];

  return (
    <section className="bg-gray-100 py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <div
            key={image.src}
            className="overflow-hidden bg-white shadow-sm"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-auto w-full object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}