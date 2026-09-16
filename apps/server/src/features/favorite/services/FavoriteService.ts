import {
  createFavorite,
  deleteFavorite,
} from "../repository/favorite.repository.js";

export async function addFavorite(userId: string, propertyId: string) {
  const favorite = await createFavorite(userId, propertyId);

  return favorite;
}

export async function removeFavorite(userId: string, propertyId: string) {
  const favorite = await deleteFavorite(userId, propertyId);

  return favorite;
}
