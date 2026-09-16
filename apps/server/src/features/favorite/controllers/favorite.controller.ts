import type { Request, Response } from "express";

import { addFavorite, removeFavorite } from "../services/FavoriteService.js";

export async function addFavoriteController(
  req: Request<{ propertyId: string }>,
  res: Response,
) {
  const propertyId = req.params.propertyId;

  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const userId = req.user.userId;

  const favorite = await addFavorite(userId, propertyId);

  return res.status(201).json({
    message: "Property added to favorites",
    favorite,
  });
}

export async function removeFavoriteController(
  req: Request<{ propertyId: string }>,
  res: Response,
) {
  const { propertyId } = req.params;

  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const userId = req.user.userId;

  const favorite = await removeFavorite(userId, propertyId);

  if (!favorite) {
    return res.status(404).json({
      message: "Favorite not found",
    });
  }

  return res.status(200).json({
    message: "Property removed from favorites",
  });
}
