"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type GeoapifyResponse = {
  results: {
    lat: number;
    lon: number;
    formatted?: string;
  }[];
};

type PropertyLocationPreviewProps = {
  location: string;
};

const PropertyLocationPreviewClient = dynamic(
  () => import("./PropertyLocationPreviewClient"),
  {
    ssr: false,
  },
);

const API_URL = "https://api.geoapify.com/v1/geocode/search";

export default function PropertyLocationPreview({
  location,
}: PropertyLocationPreviewProps) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  useEffect(() => {
    const value = location.trim();

    if (value.length < 3 || !apiKey) {
      return;
    }

    const controller = new AbortController();

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setError("");
        setCoordinates(null);

        const params = new URLSearchParams({
          text: value,
          filter: "countrycode:ua",
          lang: "uk",
          limit: "1",
          format: "json",
          apiKey,
        });

        const response = await fetch(`${API_URL}?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to find property location.");
        }

        const data: GeoapifyResponse = await response.json();

        const result = data.results?.[0];

        if (!result) {
          setError("Location not found.");
          setCoordinates(null);
          return;
        }

        const latitude = Number(result.lat);
        const longitude = Number(result.lon);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          setError("Invalid location coordinates.");
          setCoordinates(null);
          return;
        }

        setCoordinates({
          latitude,
          longitude,
        });
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        console.error("Property location preview error:", requestError);

        setCoordinates(null);
        setError("Unable to find this location.");
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [location, apiKey]);

  if (!location.trim()) {
    return null;
  }

  if (location.trim().length < 3) {
    return null;
  }

  if (!apiKey) {
    return (
      <p className="mt-4 text-sm text-red-600">
        NEXT_PUBLIC_GEOAPIFY_API_KEY is not configured.
      </p>
    );
  }

  return (
    <div className="mt-4">
      {isLoading && (
        <p className="mb-2 text-sm text-secondary">
          Finding location on map...
        </p>
      )}

      {error && !isLoading && (
        <p className="mb-2 text-sm text-red-600">{error}</p>
      )}

      {coordinates && !error && (
        <PropertyLocationPreviewClient
          latitude={coordinates.latitude}
          longitude={coordinates.longitude}
        />
      )}
    </div>
  );
}
