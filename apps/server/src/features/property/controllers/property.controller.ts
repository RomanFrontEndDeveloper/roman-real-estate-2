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

export const updateProperty = async (
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

    const { id } = req.params;

    const existingProperty = await propertyService.getPropertyByIdWithoutOwner(
      id as string,
    );

    if (existingProperty.owner.toString() !== req.user.userId) {
      res.status(403).json({
        message: "You are not allowed to update this property",
      });
      return;
    }

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const mainImageFile = files?.mainImage?.[0];
    const additionalImageFiles = files?.images ?? [];

    // ==========================================
    // Main Image
    // ==========================================

    let mainImage: string | undefined;

    if (mainImageFile) {
      const result = await uploadPropertyImage(mainImageFile.buffer);
      mainImage = result.url;
    }

    // ==========================================
    // Existing Additional Images
    // ==========================================

    let remainingImages: string[] = [];

    if (req.body.remainingImages) {
      try {
        const parsedImages = JSON.parse(req.body.remainingImages);

        if (Array.isArray(parsedImages)) {
          remainingImages = parsedImages.filter(
            (image): image is string => typeof image === "string",
          );
        }
      } catch {
        res.status(400).json({
          message: "Invalid remainingImages format",
        });
        return;
      }
    }

    // ==========================================
    // New Additional Images
    // ==========================================

    const newImages = await Promise.all(
      additionalImageFiles.map(async (file) => {
        const result = await uploadPropertyImage(file.buffer);
        return result.url;
      }),
    );

    // ==========================================
    // Update Data
    // ==========================================

    const updateData: Record<string, unknown> = {
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      currency: req.body.currency,
      listingType: req.body.listingType,
      location: req.body.location,
      propertyType: req.body.propertyType,
      bedrooms: Number(req.body.bedrooms),
      kitchenArea: Number(req.body.kitchenArea),
      area: Number(req.body.area),

      images: [...remainingImages, ...newImages],
    };

    if (mainImage) {
      updateData.mainImage = mainImage;
    }

    // ==========================================
    // Update Property
    // ==========================================

    const property = await propertyService.updateProperty(
      id as string,
      req.user.userId,
      updateData,
    );

    if (!property) {
      res.status(404).json({
        message: "Property not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (
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

    const { id } = req.params;

    const existingProperty = await propertyService.getPropertyByIdWithoutOwner(
      id as string,
    );

    if (existingProperty.owner.toString() !== req.user.userId) {
      res.status(403).json({
        message: "You are not allowed to delete this property",
      });
      return;
    }

    const property = await propertyService.deleteProperty(
      id as string,
      req.user.userId,
    );

    if (!property) {
      res.status(404).json({
        message: "Property not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
