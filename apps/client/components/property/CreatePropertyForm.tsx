"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../ui/Button";
import Input from "../ui/Input";
import BackButton from "../ui/BackButton";
export default function CreatePropertyForm() {
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

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const mainImagePreviewRef = useRef<string | null>(null);
  const imagePreviewsRef = useRef<string[]>([]);

  // ==========================================
  // Main Image Preview
  // ==========================================

  // ==========================================
  // Additional Images Preview
  // ==========================================

  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setIsLoading(true);

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

    if (mainImage) {
      formData.append("mainImage", mainImage);
    }

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        setMessage("Authentication required.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/properties", {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create property.");
        return;
      }

      setMessage("Property created successfully!");

      console.log(data);

      router.push(`/property/${data.data._id}`);
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
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
            min="50"
            step="5"
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
        <label htmlFor="mainImage" className="mb-2 block text-sm font-medium">
          Main Image
        </label>

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
          required
          onChange={(e) => {
            const file = e.target.files?.[0] || null;

            if (mainImagePreviewRef.current) {
              URL.revokeObjectURL(mainImagePreviewRef.current);
            }

            if (file) {
              const previewUrl = URL.createObjectURL(file);

              mainImagePreviewRef.current = previewUrl;
              setMainImagePreview(previewUrl);
            } else {
              mainImagePreviewRef.current = null;
              setMainImagePreview(null);
            }

            setMainImage(file);
          }}
          className="hidden"
        />

        {/* Main Image Preview */}
        {mainImagePreview && (
          <div className="mt-4">
            <div className="relative h-32 w-48 overflow-hidden rounded-lg border border-border">
              <Image
                src={mainImagePreview}
                alt="Main property preview"
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>

            <p className="mt-2 text-xs text-secondary">{mainImage?.name}</p>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* Additional Images */}
      {/* ========================================== */}

      <div>
        <label htmlFor="images" className="mb-2 block text-sm font-medium">
          Additional Images
        </label>

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
          onChange={(e) => {
            const files = Array.from(e.target.files || []);

            imagePreviewsRef.current.forEach((url) => {
              URL.revokeObjectURL(url);
            });

            const previewUrls = files.map((file) => URL.createObjectURL(file));

            imagePreviewsRef.current = previewUrls;

            setImages(files);
            setImagePreviews(previewUrls);
          }}
          className="hidden"
        />

        {/* Additional Images Preview */}
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {imagePreviews.map((preview, index) => (
              <div
                key={`${preview}-${index}`}
                className="relative h-24 overflow-hidden rounded-lg border border-border"
              >
                <Image
                  src={preview}
                  alt={`Additional property image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 33vw, 180px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <p className="mt-2 text-xs text-secondary">
            {images.length} {images.length === 1 ? "photo" : "photos"} selected
          </p>
        )}
      </div>

      {/* Message */}
      {message && <p className="text-sm text-secondary">{message}</p>}

      {/* Submit */}
      <div className="flex flex-wrap justify-end gap-3">
        <BackButton />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating Property..." : "Create Property"}
        </Button>
      </div>
    </form>
  );
}
