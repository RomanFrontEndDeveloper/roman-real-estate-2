import type { CreatePropertyDTO } from "../dto/create-property.dto.js";
import type { Types } from "mongoose";
import type { UpdatePropertyDTO } from "../dto/update-property.dto.js";

import Property from "../models/Property.js";
import User from "../../auth/models/User.js";

const getBlockedOwnerIds = async () => {
  const blockedUsers = await User.find({
    isBlocked: true,
  })
    .select("_id")
    .lean();

  return blockedUsers.map((user) => user._id);
};

export const createProperty = async (
  data: CreatePropertyDTO & {
    owner: Types.ObjectId;
    latitude: number;
    longitude: number;
  },
) => Property.create(data);

export const findProperties = async (
  filters: Record<string, unknown>,
  sort: Record<string, 1 | -1> = {},
  skip = 0,
  limit = 6,
) => {
  const blockedOwnerIds = await getBlockedOwnerIds();

  return Property.find({
    $and: [
      filters,
      {
        owner: {
          $nin: blockedOwnerIds,
        },
      },
    ],
  })
    .select(
      "_id title description price currency listingType location latitude longitude propertyType bedrooms kitchenArea area owner mainImage images createdAt updatedAt",
    )
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();
};

export const countProperties = async (filters: Record<string, unknown>) => {
  const blockedOwnerIds = await getBlockedOwnerIds();

  return Property.countDocuments({
    $and: [
      filters,
      {
        owner: {
          $nin: blockedOwnerIds,
        },
      },
    ],
  });
};

// Внутрішній список оголошень користувача.
// Публічний доступ до цієї функції потрібно контролювати окремо.
export const findPropertiesByOwner = async (owner: string) => {
  return Property.find({ owner });
};

// Отримання оголошення для публічного перегляду.
export const findPropertyById = async (id: string) => {
  const blockedOwnerIds = await getBlockedOwnerIds();

  return Property.findOne({
    _id: id,
    owner: {
      $nin: blockedOwnerIds,
    },
  }).populate("owner", "name phone avatar");
};

// Внутрішнє отримання оголошення без populate.
// Не використовується як перевірка публічного доступу.
export const findPropertyByIdWithoutOwner = async (id: string) => {
  return Property.findById(id);
};

export const updateProperty = async (
  id: string,
  owner: string,
  data: UpdatePropertyDTO,
) => {
  return Property.findOneAndUpdate(
    {
      _id: id,
      owner,
    },
    data,
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
};

export const deleteProperty = async (id: string, owner: string) => {
  return Property.findOneAndDelete({
    _id: id,
    owner,
  });
};
