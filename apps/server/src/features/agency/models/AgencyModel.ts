import mongoose, { Document, Schema } from "mongoose";

export interface IAgency extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
}

const agencySchema = new Schema<IAgency>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const Agency = mongoose.model<IAgency>("Agency", agencySchema);

export default Agency;
