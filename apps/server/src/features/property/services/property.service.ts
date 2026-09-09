import type { CreatePropertyDTO } from "../dto/create-property.dto.js";
import type { Types } from "mongoose";

import * as propertyRepository from "../repository/property.repository.js";

export const createProperty = async (
  data: CreatePropertyDTO & { owner: Types.ObjectId },
) => {
  return propertyRepository.createProperty(data);
};

export const getProperties = async () => {
  return propertyRepository.findProperties();
};

export const getPropertyById = async (id: string) => {
  return propertyRepository.findPropertyById(id);
};

export const updateProperty = async (id: string, data: any) => {
  return propertyRepository.updateProperty(id, data);
};

export const deleteProperty = async (id: string) => {
  return propertyRepository.deleteProperty(id);
};
