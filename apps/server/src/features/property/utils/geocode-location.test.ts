import { afterEach, describe, expect, it, vi } from "vitest";
import { geocodeLocation } from "./geocode-location.js";

describe("geocodeLocation", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("повертає координати, якщо адресу знайдено", async () => {
    vi.stubEnv("GEOAPIFY_API_KEY", "test-api-key");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [{ lat: 49.4216, lon: 26.9965 }],
        }),
      }),
    );

    const result = await geocodeLocation("Хмельницький");

    expect(result).toEqual({
      latitude: 49.4216,
      longitude: 26.9965,
    });

    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("api.geoapify.com/v1/geocode/search"),
    );
  });

  it("викидає помилку, якщо API-ключ відсутній", async () => {
    vi.stubEnv("GEOAPIFY_API_KEY", "");

    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(geocodeLocation("Хмельницький")).rejects.toThrow(
      "GEOAPIFY_API_KEY is not configured.",
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("викидає помилку, якщо HTTP-відповідь невдала", async () => {
    vi.stubEnv("GEOAPIFY_API_KEY", "test-api-key");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    );

    await expect(geocodeLocation("Хмельницький")).rejects.toThrow(
      "Failed to geocode property location.",
    );
  });

  it("викидає помилку, якщо адресу не знайдено", async () => {
    vi.stubEnv("GEOAPIFY_API_KEY", "test-api-key");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: [] }),
      }),
    );

    await expect(geocodeLocation("Невідома адреса")).rejects.toThrow(
      "Could not determine coordinates for this location.",
    );
  });
});
