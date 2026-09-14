import type { CreatePropertyDTO } from "../dto/create-property.dto.js";
import type { Types } from "mongoose";

import Property from "../models/Property.js";

export const createProperty = async (
  data: CreatePropertyDTO & { owner: Types.ObjectId },
) => {
  return Property.create(data);
};

export const findProperties = async (
  filters: Record<string, unknown>,
  sort: Record<string, 1 | -1> = {},
  skip = 0,
  limit = 6,
) => {
  return Property.find(filters).sort(sort).skip(skip).limit(limit).lean();
};

export const countProperties = async (filters: Record<string, unknown>) => {
  return Property.countDocuments(filters);
};

export const findPropertiesByOwner = async (owner: string) => {
  return Property.find({ owner });
};

export const findPropertyById = async (id: string) => {
  return Property.findById(id).populate("owner", "name phone avatar");
};

export const findPropertyByIdWithoutOwner = async (id: string) => {
  return Property.findById(id);
};

export const updateProperty = async (id: string, owner: string, data: any) => {
  return Property.findOneAndUpdate(
    {
      _id: id,
      owner,
    },
    data,
    {
      returnDocument: "after",
    },
  );
};

export const deleteProperty = async (id: string, owner: string) => {
  return Property.findOneAndDelete({
    _id: id,
    owner,
  });
};
