import type { CreatePropertyDTO } from "../dto/create-property.dto.js";
import type { Types } from "mongoose";

import Property from "../models/Property.js";

export const createProperty = async (
  data: CreatePropertyDTO & { owner: Types.ObjectId },
) => {
  return Property.create(data);
};

export const findProperties = async () => {
  return Property.find();
};

export const findPropertiesByOwner = async (owner: string) => {
  return Property.find({ owner });
};

export const findPropertyById = async (id: string) => {
  return Property.findById(id);
};

export const updateProperty = async (id: string, data: any) => {
  return Property.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export const deleteProperty = async (id: string) => {
  return Property.findByIdAndDelete(id);
};
