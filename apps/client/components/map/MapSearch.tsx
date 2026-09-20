"use client";

import { useEffect, useState } from "react";

import { useMap } from "react-leaflet";

import Input from "../ui/Input";

type Suggestion = {
  place_id: string;
  formatted?: string;
  city?: string;
  street?: string;
  housenumber?: string;
  lat: number;
  lon: number;
};

type GeoapifyResponse = {
  results: Suggestion[];
};

const API_URL =
  "https://api.geoapify.com/v1/geocode/autocomplete";

export default function MapSearch() {
  const map = useMap();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    Suggestion[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const value = query.trim();

    if (value.length < 2) {
      return;
    }

    const apiKey =
      process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

    if (!apiKey) {
      console.error(
        "NEXT_PUBLIC_GEOAPIFY_API_KEY is not configured.",
      );
      return;
    }

    const controller = new AbortController();

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);

        const params = new URLSearchParams({
          text: value,
          filter: "countrycode:ua",
          lang: "uk",
          limit: "5",
          format: "json",
          apiKey,
        });

        const response = await fetch(
          `${API_URL}?${params.toString()}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load map search results.",
          );
        }

        const data: GeoapifyResponse =
          await response.json();

        setSuggestions(data.results ?? []);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Map search error:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  const handleSelect = (suggestion: Suggestion) => {
    const latitude = Number(suggestion.lat);
    const longitude = Number(suggestion.lon);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return;
    }

    const label =
      suggestion.formatted ||
      [
        suggestion.city,
        suggestion.street,
        suggestion.housenumber,
      ]
        .filter(Boolean)
        .join(", ");

    setQuery(label);
    setSuggestions([]);
    setIsFocused(false);

    map.flyTo(
      [latitude, longitude],
      16,
      {
        duration: 1,
      },
    );
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setIsLoading(false);
    setIsFocused(false);
  };

  return (
    <div className="absolute left-3 right-3 top-3 z-[1000] sm:left-4 sm:right-auto sm:w-[380px]">
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Search address on map..."
          value={query}
          autoComplete="off"
          onFocus={() => setIsFocused(true)}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          onBlur={() => {
            window.setTimeout(() => {
              setIsFocused(false);
            }, 150);
          }}
          className="h-8 w-full rounded-lg bg-white px-4 pr-10 shadow-lg "
        />

        {query && (
          <button
            type="button"
            aria-label="Clear map search"
            title="Clear"
            onMouseDown={(event) => {
              event.preventDefault();
              handleClear();
            }}
            className="absolute right-2 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-lg leading-none text-secondary transition hover:bg-gray-100 hover:text-primary"
          >
            ×
          </button>
        )}

        {isFocused &&
          query.trim().length >= 2 &&
          (suggestions.length > 0 || isLoading) && (
            <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-lg border border-border bg-white shadow-xl">
              {isLoading ? (
                <div className="px-4 py-3 text-sm text-secondary">
                  Searching...
                </div>
              ) : (
                suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    type="button"
                    className="block w-full px-4 py-3 text-left text-sm transition hover:bg-gray-100"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSelect(suggestion);
                    }}
                  >
                    {suggestion.formatted ||
                      "Unknown location"}
                  </button>
                ))
              )}
            </div>
          )}
      </div>
    </div>
  );
}