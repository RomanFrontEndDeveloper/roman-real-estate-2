"use client";

import Image from "next/image";
import { useState } from "react";

type PropertyGalleryProps = {
  mainImage: string;
  images: string[];
};

export default function PropertyGallery({
  mainImage,
  images,
}: PropertyGalleryProps) {
  const galleryImages = [...(mainImage ? [mainImage] : []), ...images];

  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const closeGallery = () => {
    setSelectedImage(null);
  };

  const showPrevious = () => {
    if (selectedImage === null) return;

    setSelectedImage(
      selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1,
    );
  };

  const showNext = () => {
    if (selectedImage === null) return;

    setSelectedImage(
      selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1,
    );
  };

  return (
    <>
      <div className="w-full">
        {/* Main Image */}
        <div
          className="relative h-[450px] w-full cursor-pointer overflow-hidden rounded-xl bg-gray-100"
          onClick={() => setSelectedImage(0)}
        >
          {mainImage ? (
            <Image
              src={mainImage}
              alt="Property"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="eager"
              className="object-cover border-r-8 transition-transform duration-300 hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-secondary">Property Image</span>
            </div>
          )}
        </div>

        {/* 4 Thumbnails */}
        {galleryImages.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {galleryImages.slice(0, 4).map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(index)}
                className="relative h-24 w-full overflow-hidden rounded-lg bg-gray-100"
              >
                <Image
                  src={image}
                  alt={`Property ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 25vw, 120px"
                  className="object-cover border-r-2 transition-transform duration-300 hover:scale-105"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6"
          onClick={closeGallery}
        >
          {/* Close */}
          <button
            type="button"
            onClick={closeGallery}
            className="absolute right-6 top-6 z-10 text-3xl text-white hover:opacity-70"
          >
            ×
          </button>

          {/* Previous */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            className="absolute left-6 top-1/2 z-10 -translate-y-1/2 text-5xl text-white hover:opacity-70"
          >
            ‹
          </button>

          {/* Large Image */}
          <div
            className="relative h-[80vh] w-[80vw] max-w-6xl overflow-hidden rounded-2xl border-2 border-white"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={galleryImages[selectedImage]}
              alt={`Property ${selectedImage + 1}`}
              fill
              sizes="80vw"
              className="object-contain border-r-2"
            />
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute right-6 top-1/2 z-10 -translate-y-1/2 text-5xl text-white hover:opacity-70"
          >
            ›
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white">
            {selectedImage + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </>
  );
}
