import { Request, Response, NextFunction } from "express";
import * as propertyService from "../services/property.service.js";
import { uploadPropertyImage } from "../utils/upload-property-images.js";

export const getProperties = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const properties = await propertyService.getProperties();

    res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProperties = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const properties = await propertyService.getMyProperties(req.user.userId);

    res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const property = await propertyService.getPropertyById(id as string);

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const mainImageFile = files?.mainImage?.[0];

    const additionalImageFiles = files?.images ?? [];

    let mainImage = "";

    if (mainImageFile) {
      const result = await uploadPropertyImage(mainImageFile.buffer);

      mainImage = result.url;
    }

    const images = await Promise.all(
      additionalImageFiles.map(async (file) => {
        const result = await uploadPropertyImage(file.buffer);

        return result.url;
      }),
    );

    const property = await propertyService.createProperty({
      ...req.body,
      owner: req.user.userId,
      mainImage,
      images,
    });

    res.status(201).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};
