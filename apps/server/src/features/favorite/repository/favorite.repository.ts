import { FavoriteModel } from "../models/FavoriteModel.js";

export async function createFavorite(userId: string, propertyId: string) {
  return FavoriteModel.create({
    user: userId,
    property: propertyId,
  });
}

export async function deleteFavorite(userId: string, propertyId: string) {
  return FavoriteModel.findOneAndDelete({
    user: userId,
    property: propertyId,
  });
}

export async function findFavoritesByUser(userId: string) {
  return FavoriteModel.find({
    user: userId,
  });
}

export async function findFavoritePropertiesByUser(userId: string) {
  return FavoriteModel.find({
    user: userId,
  }).populate("property");
}
