"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Image from "next/image";
import BackButton from "../ui/BackButton";

type Property = {
  _id: string;
  title: string;
  description: string;
  price: number;
  currency: "UAH" | "USD";
  listingType: "sale" | "rent";
  location: string;
  propertyType: string;
  bedrooms: number;
  kitchenArea: number;
  area: number;
  mainImage: string;
  images: string[];
};

type EditPropertyFormProps = {
  propertyId: string;
};

export default function EditPropertyForm({
  propertyId,
}: EditPropertyFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState<"UAH" | "USD">("USD");
  const [listingType, setListingType] = useState<"sale" | "rent">("sale");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [kitchenArea, setKitchenArea] = useState("");
  const [area, setArea] = useState("");

  // ==========================================
  // Existing Images
  // ==========================================

  const [mainImage, setMainImage] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // ==========================================
  // New Images
  // ==========================================

  const [newMainImage, setNewMainImage] = useState<File | null>(null);
  const [newMainImagePreview, setNewMainImagePreview] = useState<string | null>(
    null,
  );

  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // ==========================================
  // Loading / Message
  // ==========================================

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ==========================================
  // Load Property
  // ==========================================

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/properties/${propertyId}`,
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to load property.");
          return;
        }

        const property: Property = data.data;

        setTitle(property.title);
        setDescription(property.description);
        setPrice(String(property.price));
        setCurrency(property.currency);
        setListingType(property.listingType);
        setLocation(property.location);
        setPropertyType(property.propertyType);
        setBedrooms(String(property.bedrooms));
        setKitchenArea(String(property.kitchenArea));
        setArea(String(property.area));

        setMainImage(property.mainImage || "");
        setImages(property.images || []);
      } catch {
        setMessage("Unable to connect to the server. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  // ==========================================
  // Main Image Preview Cleanup
  // ==========================================

  useEffect(() => {
    return () => {
      if (newMainImagePreview) {
        URL.revokeObjectURL(newMainImagePreview);
      }
    };
  }, [newMainImagePreview]);

  // ==========================================
  // Additional Images Preview Cleanup
  // ==========================================

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [newImagePreviews]);

  // ==========================================
  // Main Image
  // ==========================================

  const handleMainImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] || null;

    if (newMainImagePreview) {
      URL.revokeObjectURL(newMainImagePreview);
    }

    if (file) {
      const previewUrl = URL.createObjectURL(file);

      setNewMainImage(file);
      setNewMainImagePreview(previewUrl);
    } else {
      setNewMainImage(null);
      setNewMainImagePreview(null);
    }
  };

  // ==========================================
  // Additional Images
  // ==========================================

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    newImagePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setNewImages(files);
    setNewImagePreviews(previewUrls);
  };

  // ==========================================
  // Remove Existing Image
  // ==========================================

  const handleRemoveImage = (index: number) => {
    setImages((currentImages) =>
      currentImages.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  // ==========================================
  // Remove New Image
  // ==========================================

  const handleRemoveNewImage = (index: number) => {
    const preview = newImagePreviews[index];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setNewImages((currentImages) =>
      currentImages.filter((_, imageIndex) => imageIndex !== index),
    );

    setNewImagePreviews((currentPreviews) =>
      currentPreviews.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setIsSaving(true);

    try {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        setMessage("Authentication required.");
        return;
      }

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", String(Number(price)));
      formData.append("currency", currency);
      formData.append("listingType", listingType);
      formData.append("location", location);
      formData.append("propertyType", propertyType);
      formData.append("bedrooms", String(Number(bedrooms)));
      formData.append("kitchenArea", String(Number(kitchenArea)));
      formData.append("area", String(Number(area)));

      // New main image
      if (newMainImage) {
        formData.append("mainImage", newMainImage);
      }

      // Existing additional images that were not removed
      formData.append("remainingImages", JSON.stringify(images));

      // New additional images
      newImages.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch(
        `http://localhost:5000/api/properties/${propertyId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update property.");
        return;
      }

      setMessage("Property updated successfully!");

      router.push(`/property/${propertyId}`);
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (isLoading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <p className="font-serif text-2xl text-secondary">
          Loading property...
        </p>
      </div>
    );
  }

  // ==========================================
  // Form
  // ==========================================

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}

      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium">
          Property Title
        </label>

        <Input
          name="title"
          type="text"
          placeholder="Write Title the property"
          maxLength={15}
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p className="mt-1 text-right text-xs text-secondary">
          {title.length}/15
        </p>
      </div>

      {/* Description */}

      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          id="description"
          name="description"
          placeholder="Describe the property"
          maxLength={350}
          required
          rows={5}
          className="w-full resize-none rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p className="mt-1 text-right text-xs text-secondary">
          {description.length}/350
        </p>
      </div>

      {/* Price + Currency */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Price
          </label>

          <Input
            name="price"
            type="number"
            placeholder="price the Property"
            min="100"
            step="100"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="currency" className="mb-2 block text-sm font-medium">
            Currency
          </label>

          <select
            id="currency"
            name="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as "UAH" | "USD")}
            className="h-12 w-full rounded-lg border border-border bg-white px-4 text-sm outline-none transition focus:border-primary"
          >
            <option value="USD">USD ($)</option>
            <option value="UAH">UAH (₴)</option>
          </select>
        </div>
      </div>

      {/* Listing Type */}

      <div>
        <label htmlFor="listingType" className="mb-2 block text-sm font-medium">
          Listing Type
        </label>

        <select
          id="listingType"
          name="listingType"
          value={listingType}
          onChange={(e) => setListingType(e.target.value as "sale" | "rent")}
          className="h-12 w-full rounded-lg border border-border bg-white px-4 text-sm outline-none transition focus:border-primary"
        >
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
      </div>

      {/* Location */}

      <div>
        <label htmlFor="location" className="mb-2 block text-sm font-medium">
          Location
        </label>

        <Input
          name="location"
          type="text"
          placeholder="Location"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Property Type */}

      <div>
        <label
          htmlFor="propertyType"
          className="mb-2 block text-sm font-medium"
        >
          Property Type
        </label>

        <select
          id="propertyType"
          name="propertyType"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="h-12 w-full rounded-lg border border-border bg-white px-4 text-sm outline-none transition focus:border-primary"
          required
        >
          <option value="">Select property type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="commercial">Commercial</option>
          <option value="land">Land</option>
        </select>
      </div>

      {/* Bedrooms */}

      <div>
        <label htmlFor="bedrooms" className="mb-2 block text-sm font-medium">
          Bedrooms
        </label>

        <Input
          name="bedrooms"
          type="number"
          placeholder="1..  2..  3.."
          min="1"
          step="1"
          required
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
        />
      </div>

      {/* Kitchen Area + Total Area */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="kitchenArea"
            className="mb-2 block text-sm font-medium"
          >
            Kitchen Area (m²)
          </label>

          <Input
            name="kitchenArea"
            type="number"
            placeholder="Kitchen area"
            min="4"
            step="1"
            required
            value={kitchenArea}
            onChange={(e) => setKitchenArea(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="area" className="mb-2 block text-sm font-medium">
            Total Area (m²)
          </label>

          <Input
            name="area"
            type="number"
            placeholder="Total area"
            min="10"
            step="1"
            required
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>
      </div>

      {/* ========================================== */}
      {/* Main Image */}
      {/* ========================================== */}

      <div>
        <p className="mb-2 text-sm font-medium">Main Image</p>

        {newMainImagePreview ? (
          <div className="mb-4">
            <div className="relative h-48 w-full overflow-hidden rounded-xl border border-border bg-gray-100 sm:w-72">
              <Image
                src={newMainImagePreview}
                alt="New main property preview"
                fill
                sizes="(max-width: 640px) 100vw, 288px"
                className="object-cover"
              />
            </div>

            <p className="mt-2 text-xs text-secondary">
              New main image: {newMainImage?.name}
            </p>
          </div>
        ) : mainImage ? (
          <div className="mb-4">
            <div className="relative h-48 w-full overflow-hidden rounded-xl border border-border bg-gray-100 sm:w-72">
              <Image
                src={mainImage}
                alt="Current main property"
                fill
                sizes="(max-width: 640px) 100vw, 288px"
                className="object-cover"
              />
            </div>

            <p className="mt-2 text-xs text-secondary">Current main image</p>
          </div>
        ) : null}

        <label
          htmlFor="mainImage"
          className="inline-flex cursor-pointer items-center rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
        >
          Choose Photo
        </label>

        <input
          id="mainImage"
          name="mainImage"
          type="file"
          accept="image/*"
          onChange={handleMainImageChange}
          className="hidden"
        />
      </div>

      {/* ========================================== */}
      {/* Additional Images */}
      {/* ========================================== */}

      <div>
        <p className="mb-2 text-sm font-medium">Additional Images</p>

        {/* Existing Images */}

        {images.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative h-24 overflow-hidden rounded-lg border border-border"
              >
                <Image
                  src={image}
                  alt={`Property image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 33vw, 180px"
                  className="object-cover"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  aria-label={`Remove property image ${index + 1}`}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white transition hover:bg-black"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New Images */}

        {newImagePreviews.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs text-secondary">New Images</p>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {newImagePreviews.map((preview, index) => (
                <div
                  key={`${preview}-${index}`}
                  className="relative h-24 overflow-hidden rounded-lg border border-border"
                >
                  <Image
                    src={preview}
                    alt={`New property image ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 33vw, 180px"
                    className="object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    aria-label={`Remove new property image ${index + 1}`}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white transition hover:bg-black"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <label
          htmlFor="images"
          className="inline-flex cursor-pointer items-center rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
        >
          Choose Photos
        </label>

        <input
          id="images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          className="hidden"
        />

        {newImages.length > 0 && (
          <p className="mt-2 text-xs text-secondary">
            {newImages.length}{" "}
            {newImages.length === 1 ? "new photo" : "new photos"} selected
          </p>
        )}
      </div>

      {/* Message */}

      {message && <p className="text-sm text-secondary">{message}</p>}

      {/* Submit */}

      <div className="flex flex-wrap justify-end gap-3">
        <BackButton />

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving Changes..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
