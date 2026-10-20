import { Schema, model, Types } from "mongoose";

export type MessageDocument = {
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  text: string;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const messageSchema = new Schema<MessageDocument>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, sender: 1, createdAt: -1 });

const Message = model<MessageDocument>("Message", messageSchema);

export default Message;
