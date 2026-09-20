"use client";

import { useEffect, useRef, useState } from "react";

import Input from "../ui/Input";

type AddressAutocompleteProps = {
  city: string;
  street: string;
  houseNumber: string;
  resolveInitialCity?: boolean;
  onCityChange: (value: string) => void;
  onStreetChange: (value: string) => void;
  onHouseNumberChange: (value: string) => void;
};

type Suggestion = {
  place_id: string;
  city?: string;
  street?: string;
  housenumber?: string;
  formatted?: string;
};

type GeoapifyResponse = {
  results: Suggestion[];
};

const API_URL = "https://api.geoapify.com/v1/geocode/autocomplete";

export default function AddressAutocomplete({
  city,
  street,
  houseNumber,
  resolveInitialCity = false,
  onCityChange,
  onStreetChange,
  onHouseNumberChange,
}: AddressAutocompleteProps) {
  const [citySuggestions, setCitySuggestions] = useState<Suggestion[]>([]);

  const [streetSuggestions, setStreetSuggestions] = useState<Suggestion[]>([]);

  const [selectedCityPlaceId, setSelectedCityPlaceId] = useState<string | null>(
    null,
  );

  const [isCityLoading, setIsCityLoading] = useState(false);
  const [isStreetLoading, setIsStreetLoading] = useState(false);

  const [cityFocused, setCityFocused] = useState(false);
  const [streetFocused, setStreetFocused] = useState(false);

  const initialCityResolvedRef = useRef(false);

  /*
   * Resolve existing city when EditPropertyForm loads.
   */
  useEffect(() => {
    if (
      !resolveInitialCity ||
      initialCityResolvedRef.current ||
      city.trim().length < 2
    ) {
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

    if (!apiKey) {
      console.error("NEXT_PUBLIC_GEOAPIFY_API_KEY is not configured.");
      return;
    }

    const controller = new AbortController();

    const resolveCity = async () => {
      try {
        const params = new URLSearchParams({
          text: city.trim(),
          type: "city",
          filter: "countrycode:ua",
          lang: "uk",
          limit: "5",
          format: "json",
          apiKey,
        });

        const response = await fetch(`${API_URL}?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to resolve city.");
        }

        const data: GeoapifyResponse = await response.json();

        const normalizedCity = city.trim().toLowerCase();

        const cityResult =
          data.results.find(
            (result) => result.city?.trim().toLowerCase() === normalizedCity,
          ) ?? data.results[0];

        if (cityResult) {
          setSelectedCityPlaceId(cityResult.place_id);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Initial city resolve error:", error);
      } finally {
        initialCityResolvedRef.current = true;
      }
    };

    resolveCity();

    return () => {
      controller.abort();
    };
  }, [city, resolveInitialCity]);

  /*
   * City autocomplete.
   */
  useEffect(() => {
    const value = city.trim();

    if (value.length < 2) {
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

    if (!apiKey) {
      console.error("NEXT_PUBLIC_GEOAPIFY_API_KEY is not configured.");
      return;
    }

    const controller = new AbortController();

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsCityLoading(true);

        const params = new URLSearchParams({
          text: value,
          type: "city",
          filter: "countrycode:ua",
          lang: "uk",
          limit: "5",
          format: "json",
          apiKey,
        });

        const response = await fetch(`${API_URL}?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load cities.");
        }

        const data: GeoapifyResponse = await response.json();

        setCitySuggestions(data.results ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("City autocomplete error:", error);

        setCitySuggestions([]);
      } finally {
        setIsCityLoading(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [city]);

  /*
   * Street autocomplete.
   */
  useEffect(() => {
    const value = street.trim();

    if (value.length < 2 || !selectedCityPlaceId) {
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

    if (!apiKey) {
      console.error("NEXT_PUBLIC_GEOAPIFY_API_KEY is not configured.");
      return;
    }

    const controller = new AbortController();

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsStreetLoading(true);

        const params = new URLSearchParams({
          text: value,
          type: "street",
          filter: `place:${selectedCityPlaceId}|countrycode:ua`,
          lang: "uk",
          limit: "7",
          format: "json",
          apiKey,
        });

        const response = await fetch(`${API_URL}?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load streets.");
        }

        const data: GeoapifyResponse = await response.json();

        setStreetSuggestions(data.results ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Street autocomplete error:", error);

        setStreetSuggestions([]);
      } finally {
        setIsStreetLoading(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [street, selectedCityPlaceId]);

  /*
   * Select city.
   */
  const handleCitySelect = (suggestion: Suggestion) => {
    const selectedCity = suggestion.city || suggestion.formatted || "";

    onCityChange(selectedCity);

    setSelectedCityPlaceId(suggestion.place_id);

    setCitySuggestions([]);
    setIsCityLoading(false);

    onStreetChange("");
    onHouseNumberChange("");

    setStreetSuggestions([]);
    setIsStreetLoading(false);
  };

  /*
   * Select street.
   */
  const handleStreetSelect = (suggestion: Suggestion) => {
    const selectedStreet = suggestion.street || suggestion.formatted || "";

    onStreetChange(selectedStreet);

    setStreetSuggestions([]);
    setIsStreetLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* City */}

      <div className="relative">
        <label htmlFor="city" className="mb-2 block text-sm font-medium">
          City
        </label>

        <Input
          id="city"
          name="city"
          type="text"
          placeholder="Start typing city..."
          required
          value={city}
          autoComplete="off"
          onFocus={() => setCityFocused(true)}
          onChange={(event) => {
            const value = event.target.value;

            onCityChange(value);

            setSelectedCityPlaceId(null);

            setCitySuggestions([]);
            setStreetSuggestions([]);

            setIsCityLoading(value.trim().length >= 2);

            setIsStreetLoading(false);

            onStreetChange("");
            onHouseNumberChange("");
          }}
          onBlur={() => {
            window.setTimeout(() => {
              setCityFocused(false);
            }, 150);
          }}
        />

        {cityFocused &&
          city.trim().length >= 2 &&
          (citySuggestions.length > 0 || isCityLoading) && (
            <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-white shadow-lg">
              {isCityLoading ? (
                <div className="px-4 py-3 text-sm text-secondary">
                  Searching cities...
                </div>
              ) : (
                citySuggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    type="button"
                    className="block w-full px-4 py-3 text-left text-sm transition hover:bg-gray-100"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleCitySelect(suggestion);
                    }}
                  >
                    {suggestion.formatted || suggestion.city || "Unknown city"}
                  </button>
                ))
              )}
            </div>
          )}
      </div>

      {/* Street */}

      <div className="relative">
        <label htmlFor="street" className="mb-2 block text-sm font-medium">
          Street
        </label>

        <Input
          id="street"
          name="street"
          type="text"
          placeholder={
            selectedCityPlaceId ? "Start typing street..." : "Select city first"
          }
          required
          disabled={!selectedCityPlaceId}
          value={street}
          autoComplete="off"
          onFocus={() => setStreetFocused(true)}
          onChange={(event) => {
            const value = event.target.value;

            onStreetChange(value);

            setStreetSuggestions([]);

            setIsStreetLoading(value.trim().length >= 2);
          }}
          onBlur={() => {
            window.setTimeout(() => {
              setStreetFocused(false);
            }, 150);
          }}
        />

        {streetFocused &&
          selectedCityPlaceId &&
          street.trim().length >= 2 &&
          (streetSuggestions.length > 0 || isStreetLoading) && (
            <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-white shadow-lg">
              {isStreetLoading ? (
                <div className="px-4 py-3 text-sm text-secondary">
                  Searching streets...
                </div>
              ) : (
                streetSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    type="button"
                    className="block w-full px-4 py-3 text-left text-sm transition hover:bg-gray-100"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleStreetSelect(suggestion);
                    }}
                  >
                    {suggestion.formatted ||
                      suggestion.street ||
                      "Unknown street"}
                  </button>
                ))
              )}
            </div>
          )}
      </div>

      {/* House Number */}

      <div>
        <label htmlFor="houseNumber" className="mb-2 block text-sm font-medium">
          House Number
        </label>

        <Input
          id="houseNumber"
          name="houseNumber"
          type="text"
          placeholder="House number"
          required
          disabled={!street}
          value={houseNumber}
          onChange={(event) => {
            onHouseNumberChange(event.target.value);
          }}
        />
      </div>
    </div>
  );
}
