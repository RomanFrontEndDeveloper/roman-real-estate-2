import type { CreatePropertyDTO } from "../dto/create-property.dto.js";
import type { Types } from "mongoose";

import * as propertyRepository from "../repository/property.repository.js";

export const createProperty = async (
  data: CreatePropertyDTO & { owner: Types.ObjectId },
) => {
  return propertyRepository.createProperty(data);
};

export const getProperties = async (
  filters: Record<string, unknown>,
  sort: Record<string, 1 | -1> = {},
  skip = 0,
  limit = 6,
) => {
  return propertyRepository.findProperties(filters, sort, skip, limit);
};

export const countProperties = async (filters: Record<string, unknown>) => {
  return propertyRepository.countProperties(filters);
};

export const getMyProperties = async (userId: string) => {
  return propertyRepository.findPropertiesByOwner(userId);
};

export const getPropertyById = async (id: string) => {
  const property = await propertyRepository.findPropertyById(id);

  if (!property) {
    throw new Error("Property not found");
  }

  return property;
};

export const updateProperty = async (id: string, owner: string, data: any) => {
  return propertyRepository.updateProperty(id, owner, data);
};

export const deleteProperty = async (id: string, owner: string) => {
  return propertyRepository.deleteProperty(id, owner);
};

export const getPropertyByIdWithoutOwner = async (id: string) => {
  const property = await propertyRepository.findPropertyByIdWithoutOwner(id);

  if (!property) {
    throw new Error("Property not found");
  }

  return property;
};
