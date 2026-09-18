import {
  createFavorite,
  deleteFavorite,
  findFavoritesByUser,
  findFavoritePropertiesByUser,
} from "../repository/favorite.repository.js";

export async function addFavorite(userId: string, propertyId: string) {
  const favorite = await createFavorite(userId, propertyId);

  return favorite;
}

export async function removeFavorite(userId: string, propertyId: string) {
  const favorite = await deleteFavorite(userId, propertyId);

  return favorite;
}

export async function getFavorites(userId: string) {
  const favorites = await findFavoritesByUser(userId);

  return favorites;
}

export async function getFavoriteProperties(userId: string) {
  const favorites = await findFavoritePropertiesByUser(userId);

  return favorites;
}
