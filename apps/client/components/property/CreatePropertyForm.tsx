"use client";

import { useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";

export default function CreatePropertyForm() {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setIsLoading(true);

    const propertyData = {
      title,
      description,
      price: Number(price),
      currency,
      listingType,
      location,
      propertyType,
      bedrooms: Number(bedrooms),
      kitchenArea: Number(kitchenArea),
      area: Number(area),
    };

    try {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        setMessage("Authentication required.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(propertyData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create property.");
        return;
      }

      setMessage("Property created successfully!");

      console.log(data);
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
          required
          rows={5}
          className="w-full resize-none rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Price + Currency */}
      <div className="grid grid-cols-2 gap-4">
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
          placeholder="1..   2..   3.."
          min="1"
          step="1"
          required
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
        />
      </div>

      {/* Kitchen Area + Total Area */}
      <div className="grid grid-cols-2 gap-4">
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

      {/* Submit */}
      {message && <p className="text-sm text-secondary">{message}</p>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating Property..." : "Create Property"}
      </Button>
    </form>
  );
}
