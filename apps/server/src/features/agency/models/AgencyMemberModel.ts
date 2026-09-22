import mongoose, { Document, Schema } from "mongoose";

export type AgencyMemberStatus = "pending" | "active" | "rejected";

export interface IAgencyMember extends Document {
  agency: mongoose.Types.ObjectId;
  agent: mongoose.Types.ObjectId;
  status: AgencyMemberStatus;
}

const agencyMemberSchema = new Schema<IAgencyMember>(
  {
    agency: {
      type: Schema.Types.ObjectId,
      ref: "Agency",
      required: true,
    },

    agent: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "active", "rejected"],
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

agencyMemberSchema.index(
  {
    agency: 1,
    agent: 1,
  },
  {
    unique: true,
  },
);

const AgencyMember = mongoose.model<IAgencyMember>(
  "AgencyMember",
  agencyMemberSchema,
);

export default AgencyMember;
