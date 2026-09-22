interface GalleryItem {
  _id: string;
  title: string;
  imageUrl: string;
}

async function getGallery(): Promise<GalleryItem[]> {
  const response = await fetch(
    "http://localhost:5000/api/gallery",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load gallery");
  }

  return response.json();
}

export default async function GalleryPage() {
  const images = await getGallery();

  return (
    <main className="min-h-screen bg-gray-100 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {images.length === 0 ? (
          <p className="py-20 text-center text-gray-500">
            No gallery images available.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {images.map((item) => (
              <div
                key={item._id}
                className="overflow-hidden bg-white shadow-sm"
              >
                <img
                  src={`http://localhost:5000${item.imageUrl}`}
                  alt={item.title || "Mahila SACCOS gallery"}
                  className="h-auto w-full object-cover"
                />

                {item.title && (
                  <div className="p-4">
                    <p className="font-medium text-gray-700">
                      {item.title}
                    </p>
                  </div>
                )}
              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}