import mongoose, { Document, Schema } from "mongoose";

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  currency: "UAH" | "USD";
  listingType: "sale" | "rent";
  location: string;
  propertyType: string;
  bedrooms: number;
  kitchenArea: number;
  area: number;
  owner: mongoose.Types.ObjectId;
  mainImage: string;
  images: string[];
}

const propertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      enum: ["UAH", "USD"],
      required: true,
    },

    listingType: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    propertyType: {
      type: String,
      required: true,
      trim: true,
    },

    bedrooms: {
      type: Number,
      required: true,
    },

    kitchenArea: {
      type: Number,
      required: true,
    },

    area: {
      type: Number,
      required: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mainImage: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Property = mongoose.model<IProperty>("Property", propertySchema);

export default Property;
