"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Button from "../ui/Button";
import Input from "../ui/Input";
import BackButton from "../ui/BackButton";

type PropertyForm = {
  title: string;
  description: string;
  price: string;
  currency: "UAH" | "USD";
  listingType: "sale" | "rent";
  location: string;
  propertyType: string;
  bedrooms: string;
  kitchenArea: string;
  area: string;
};

export default function CreatePropertyForm() {
  const router = useRouter();

  const [form, setForm] = useState<PropertyForm>({
    title: "",
    description: "",
    price: "",
    currency: "USD",
    listingType: "sale",
    location: "",
    propertyType: "",
    bedrooms: "",
    kitchenArea: "",
    area: "",
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      if (mainImagePreview) {
        URL.revokeObjectURL(mainImagePreview);
      }

      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [mainImagePreview, imagePreviews]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleMainImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] || null;

    if (mainImagePreview) {
      URL.revokeObjectURL(mainImagePreview);
    }

    if (!file) {
      setMainImage(null);
      setMainImagePreview(null);
      return;
    }

    const preview = URL.createObjectURL(file);

    setMainImage(file);
    setMainImagePreview(preview);
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    imagePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    const previews = files.map((file) => URL.createObjectURL(file));

    setImages(files);
    setImagePreviews(previews);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setIsSubmitting(true);

    try {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        setMessage("Authentication required.");
        return;
      }

      const data = new FormData();

      data.append("title", form.title);
      data.append("description", form.description);
      data.append("price", String(Number(form.price)));
      data.append("currency", form.currency);
      data.append("listingType", form.listingType);
      data.append("location", form.location);
      data.append("propertyType", form.propertyType);
      data.append("bedrooms", String(Number(form.bedrooms)));
      data.append("kitchenArea", String(Number(form.kitchenArea)));
      data.append("area", String(Number(form.area)));

      if (mainImage) {
        data.append("mainImage", mainImage);
      }

      images.forEach((image) => {
        data.append("images", image);
      });

      const response = await fetch("http://localhost:5000/api/properties", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Failed to create property.");
        return;
      }

      setMessage("Property created successfully!");

      router.push(`/property/${result.data._id}`);
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          maxLength={15}
          required
          value={form.title}
          onChange={handleChange}
        />

        <p className="mt-1 text-right text-xs text-secondary">
          {form.title.length}/15
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
          value={form.description}
          onChange={handleChange}
        />

        <p className="mt-1 text-right text-xs text-secondary">
          {form.description.length}/350
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
            step="10"
            required
            value={form.price}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="currency" className="mb-2 block text-sm font-medium">
            Currency
          </label>

          <select
            id="currency"
            name="currency"
            value={form.currency}
            onChange={handleChange}
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
          value={form.listingType}
          onChange={handleChange}
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
          value={form.location}
          onChange={handleChange}
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
          value={form.propertyType}
          onChange={handleChange}
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
          placeholder="1.. 2.. 3.."
          min="1"
          step="1"
          required
          value={form.bedrooms}
          onChange={handleChange}
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
            value={form.kitchenArea}
            onChange={handleChange}
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
            value={form.area}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Main Image */}

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
          onChange={handleMainImageChange}
          className="hidden"
        />

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

      {/* Additional Images */}

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
          onChange={handleImagesChange}
          className="hidden"
        />

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

      {/* Buttons */}

      <div className="flex flex-wrap justify-end gap-3">
        <BackButton />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Property..." : "Create Property"}
        </Button>
      </div>
    </form>
  );
}
