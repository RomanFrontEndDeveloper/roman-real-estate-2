import { Schema, model, type InferSchemaType } from "mongoose";

const favoriteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId, //У цьому полі буде MongoDB ObjectId.
      ref: "User", // На документ якої Mongoose-моделі посилається цей ObjectId?
      required: true,
    },

    property: {
      // property — це поле, яке містить ID документа з колекції Property.
      type: Schema.Types.ObjectId, // У цьому полі буде MongoDB ObjectId.
      ref: "Property",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

favoriteSchema.index({ user: 1, property: 1 }, { unique: true });
// Створи індекс у MongoDB для цих полів.
//  1  → ascending-1  → descending

export type Favorite = InferSchemaType<typeof favoriteSchema>;
// Створити TypeScript-тип Favorite автоматично на основі нашої Mongoose schema.

export const FavoriteModel = model("Favorite", favoriteSchema);
