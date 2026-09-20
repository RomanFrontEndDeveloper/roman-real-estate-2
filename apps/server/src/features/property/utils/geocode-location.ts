const GEOCODING_API_URL = "https://api.geoapify.com/v1/geocode/search";

type GeoapifyGeocodingResponse = {
  results: {
    lat: number;
    lon: number;
    formatted?: string;
  }[];
};

export const geocodeLocation = async (location: string) => {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    throw new Error("GEOAPIFY_API_KEY is not configured.");
  }

  const params = new URLSearchParams({
    text: location,
    filter: "countrycode:ua",
    lang: "uk",
    limit: "1",
    format: "json",
    apiKey,
  });

  const response = await fetch(`${GEOCODING_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to geocode property location.");
  }

  const data: GeoapifyGeocodingResponse = await response.json();

  const result = data.results?.[0];

  if (!result) {
    throw new Error("Could not determine coordinates for this location.");
  }

  return {
    latitude: result.lat,
    longitude: result.lon,
  };
};
