"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function PropertySearch() {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");

  const [minKitchenArea, setMinKitchenArea] = useState("");
  const [maxKitchenArea, setMaxKitchenArea] = useState("");

  const [bedrooms, setBedrooms] = useState("");
  const [listingType, setListingType] = useState<"sale" | "rent">("sale");

  const [propertyType, setPropertyType] = useState("");

  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocation(location);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [location]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (debouncedLocation) {
      params.set("location", debouncedLocation);
    }

    if (propertyType) {
      params.set("propertyType", propertyType);
    }

    if (minPrice) {
      params.set("minPrice", minPrice);
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    }

    if (minArea) {
      params.set("minArea", minArea);
    }

    if (maxArea) {
      params.set("maxArea", maxArea);
    }

    if (minKitchenArea) {
      params.set("minKitchenArea", minKitchenArea);
    }

    if (maxKitchenArea) {
      params.set("maxKitchenArea", maxKitchenArea);
    }

    if (bedrooms) {
      params.set("bedrooms", bedrooms);
    }

    params.set("listingType", listingType);

    if (sortBy) {
      params.set("sortBy", sortBy);
    }

    router.push(`/?${params.toString()}`);
  };

  const handleReset = () => {
    setLocation("");
    setDebouncedLocation("");

    setMinPrice("");
    setMaxPrice("");

    setMinArea("");
    setMaxArea("");

    setMinKitchenArea("");
    setMaxKitchenArea("");

    setBedrooms("");
    setPropertyType("");
    setSortBy("");

    setListingType("sale");

    router.push("/");
  };

  return (
    <section className="mx-auto max-w-7xl px-6 mt-6">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="font-serif text-2xl">Find Your Property</h2>

          <p className="mt-2 text-secondary">
            Search properties by location, type, and price.
          </p>
        </div>

        {/* Property Purpose */}
        <div className="mb-6 flex gap-3">
          <Button
            variant={listingType === "sale" ? "primary" : "outline"}
            onClick={() => setListingType("sale")}
          >
            For Sale
          </Button>

          <Button
            variant={listingType === "rent" ? "primary" : "outline"}
            onClick={() => setListingType("rent")}
          >
            For Rent
          </Button>
        </div>

        {/* Search Filters */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Input
            placeholder="Location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
          <select
            className="h-12 rounded-lg border border-border bg-white px-4 text-sm outline-none transition focus:border-primary"
            value={propertyType}
            onChange={(event) => setPropertyType(event.target.value)}
          >
            <option value="">Property Type</option>

            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="land">Land</option>
          </select>

          <Input
            placeholder="Min Price"
            type="number"
            value={minPrice}
            min="50"
            step="50"
            onChange={(event) => setMinPrice(event.target.value)}
          />

          <Input
            placeholder="Max Price"
            type="number"
            value={maxPrice}
            min="200"
            step="200"
            onChange={(event) => setMaxPrice(event.target.value)}
          />

          <Input
            placeholder="Min Area"
            type="number"
            value={minArea}
            min="5"
            step="5"
            onChange={(event) => setMinArea(event.target.value)}
          />

          <Input
            placeholder="Max Area"
            type="number"
            value={maxArea}
            min="10"
            step="10"
            onChange={(event) => setMaxArea(event.target.value)}
          />

          <Input
            placeholder="Min Kitchen Area"
            type="number"
            value={minKitchenArea}
            min="3"
            onChange={(event) => setMinKitchenArea(event.target.value)}
          />

          <Input
            placeholder="Max Kitchen Area"
            type="number"
            value={maxKitchenArea}
            min="5"
            onChange={(event) => setMaxKitchenArea(event.target.value)}
          />

          <select
            className="h-12 rounded-lg border border-border bg-white px-4 text-sm outline-none transition focus:border-primary"
            value={bedrooms}
            onChange={(event) => setBedrooms(event.target.value)}
          >
            <option value="">Bedrooms</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
            <option value="4">4 Bedrooms</option>
            <option value="5">5+ Bedrooms</option>
          </select>

          <select
            className="h-12 rounded-lg border border-border bg-white px-4 text-sm outline-none transition focus:border-primary"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="area-asc">Area: Small to Large</option>
            <option value="area-desc">Area: Large to Small</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>

          <Button onClick={handleSearch}>Search Properties</Button>
        </div>
      </div>
    </section>
  );
}
