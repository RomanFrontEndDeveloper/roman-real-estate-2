import { Request, Response, NextFunction } from "express";

import * as propertyService from "../services/property.service.js";

import { uploadPropertyImage } from "../utils/upload-property-images.js";

const getUserId = (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });

    return null;
  }

  return req.user.userId;
};

export const getProperties = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      location,
      propertyType,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      minKitchenArea,
      maxKitchenArea,
      bedrooms,
      listingType,
      sortBy,
    } = req.query;

    const filters: Record<string, unknown> = {};

    if (typeof location === "string" && location) {
      filters.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (typeof propertyType === "string" && propertyType) {
      filters.propertyType = propertyType;
    }

    if (typeof listingType === "string" && listingType) {
      filters.listingType = listingType;
    }

    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};

      if (minPrice) {
        priceFilter.$gte = Number(minPrice);
      }

      if (maxPrice) {
        priceFilter.$lte = Number(maxPrice);
      }

      filters.price = priceFilter;
    }

    if (minArea || maxArea) {
      const areaFilter: Record<string, number> = {};

      if (minArea) {
        areaFilter.$gte = Number(minArea);
      }

      if (maxArea) {
        areaFilter.$lte = Number(maxArea);
      }

      filters.area = areaFilter;
    }

    if (minKitchenArea || maxKitchenArea) {
      const kitchenAreaFilter: Record<string, number> = {};

      if (minKitchenArea) {
        kitchenAreaFilter.$gte = Number(minKitchenArea);
      }

      if (maxKitchenArea) {
        kitchenAreaFilter.$lte = Number(maxKitchenArea);
      }

      filters.kitchenArea = kitchenAreaFilter;
    }

    if (bedrooms) {
      filters.bedrooms = Number(bedrooms);
    }

    const sort: Record<string, 1 | -1> = {};

    if (sortBy === "price-asc") {
      sort.price = 1;
    }

    if (sortBy === "price-desc") {
      sort.price = -1;
    }

    if (sortBy === "area-asc") {
      sort.area = 1;
    }

    if (sortBy === "area-desc") {
      sort.area = -1;
    }

    if (sortBy === "newest") {
      sort.createdAt = -1;
    }

    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(req.query.limit) || 6, 1), 50);

    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      propertyService.getProperties(filters, sort, skip, limit),
      propertyService.countProperties(filters),
    ]);

    res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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
    const userId = getUserId(req, res);

    if (!userId) {
      return;
    }

    const properties = await propertyService.getMyProperties(userId);

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
    const userId = getUserId(req, res);

    if (!userId) {
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
      owner: userId,
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
    const userId = getUserId(req, res);

    if (!userId) {
      return;
    }

    const { id } = req.params;

    const existingProperty = await propertyService.getPropertyByIdWithoutOwner(
      id as string,
    );

    if (existingProperty.owner.toString() !== userId) {
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
      userId,
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
    const userId = getUserId(req, res);

    if (!userId) {
      return;
    }

    const { id } = req.params;

    const existingProperty = await propertyService.getPropertyByIdWithoutOwner(
      id as string,
    );

    if (existingProperty.owner.toString() !== userId) {
      res.status(403).json({
        message: "You are not allowed to delete this property",
      });

      return;
    }

    const property = await propertyService.deleteProperty(id as string, userId);

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
