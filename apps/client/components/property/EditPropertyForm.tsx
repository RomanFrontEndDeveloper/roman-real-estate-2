"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Button from "../ui/Button";
import Input from "../ui/Input";
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

type EditPropertyFormProps = {
  propertyId: string;
};

export default function EditPropertyForm({
  propertyId,
}: EditPropertyFormProps) {
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

  const [mainImage, setMainImage] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [newMainImage, setNewMainImage] = useState<File | null>(null);
  const [newMainImagePreview, setNewMainImagePreview] = useState<string | null>(
    null,
  );

  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const newImagePreviewsRef = useRef<string[]>([]);

  useEffect(() => {
    newImagePreviewsRef.current = newImagePreviews;
  }, [newImagePreviews]);

  useEffect(() => {
    return () => {
      if (newMainImagePreview) {
        URL.revokeObjectURL(newMainImagePreview);
      }

      newImagePreviewsRef.current.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [newMainImagePreview]);

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

        setForm({
          title: property.title,
          description: property.description,
          price: String(property.price),
          currency: property.currency,
          listingType: property.listingType,
          location: property.location,
          propertyType: property.propertyType,
          bedrooms: String(property.bedrooms),
          kitchenArea: String(property.kitchenArea),
          area: String(property.area),
        });

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

    if (newMainImagePreview) {
      URL.revokeObjectURL(newMainImagePreview);
    }

    if (!file) {
      setNewMainImage(null);
      setNewMainImagePreview(null);
      return;
    }

    const preview = URL.createObjectURL(file);

    setNewMainImage(file);
    setNewMainImagePreview(preview);
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    newImagePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    const previews = files.map((file) => URL.createObjectURL(file));

    setNewImages(files);
    setNewImagePreviews(previews);
  };

  const handleRemoveImage = (index: number) => {
    setImages((currentImages) =>
      currentImages.filter((_, imageIndex) => imageIndex !== index),
    );
  };

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

      if (newMainImage) {
        data.append("mainImage", newMainImage);
      }

      data.append("remainingImages", JSON.stringify(images));

      newImages.forEach((image) => {
        data.append("images", image);
      });

      const response = await fetch(
        `http://localhost:5000/api/properties/${propertyId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Failed to update property.");
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

  if (isLoading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <p className="font-serif text-2xl text-secondary">
          Loading property...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <div>
        <p className="mb-2 text-sm font-medium">Additional Images</p>

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

      {message && <p className="text-sm text-secondary">{message}</p>}

      <div className="flex flex-wrap justify-end gap-3">
        <BackButton />

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving Changes..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
