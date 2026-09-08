"use client";

const API_URL = "http://localhost:5000";

type ApiFetchOptions = RequestInit & {
  skipRefresh?: boolean;
};

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      sessionStorage.removeItem("accessToken");
      window.dispatchEvent(new Event("auth-change"));
      return null;
    }

    const data: { accessToken?: string } = await response.json();

    if (!data.accessToken) {
      sessionStorage.removeItem("accessToken");
      window.dispatchEvent(new Event("auth-change"));
      return null;
    }

    sessionStorage.setItem("accessToken", data.accessToken);

    return data.accessToken;
  } catch {
    sessionStorage.removeItem("accessToken");
    window.dispatchEvent(new Event("auth-change"));
    return null;
  }
};

export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Response> {
  const { skipRefresh = false, ...fetchOptions } = options;

  const accessToken = sessionStorage.getItem("accessToken");

  const headers = new Headers(fetchOptions.headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  if (response.status !== 401 || skipRefresh) {
    return response;
  }

  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  const newAccessToken = await refreshPromise;

  if (!newAccessToken) {
    return response;
  }

  headers.set("Authorization", `Bearer ${newAccessToken}`);

  response = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  return response;
}
