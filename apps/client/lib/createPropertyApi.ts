// propertyApi.ts

import { apiFetch } from "@/lib/apiFetch";

export const createProperty = (data: FormData) => {
  return apiFetch("/api/properties", {
    method: "POST",
    body: data,
  });
};