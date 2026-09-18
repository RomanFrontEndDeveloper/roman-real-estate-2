const API_URL = "http://localhost:5000";

export async function addFavorite(propertyId: string) {
  const token = sessionStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/api/favorites/${propertyId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add favorite");
  }

  return data;
}

export async function removeFavorite(propertyId: string) {
  const token = sessionStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/api/favorites/${propertyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to remove favorite");
  }

  return data;
}

export async function getFavorites() {
  const token = sessionStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/api/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load favorites");
  }

  return data;
}

export async function getFavoriteProperties() {
  const token = sessionStorage.getItem("accessToken");

  const response = await fetch(
    `${API_URL}/api/favorites/properties`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load favorite properties",
    );
  }

  return data;
}
