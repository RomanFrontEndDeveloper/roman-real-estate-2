import type { Types } from "mongoose";

import Message from "../models/MessageModel.js";

type CreateMessageInput = {
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  text: string;
};

export const createMessage = async (input: CreateMessageInput) => {
  return Message.create(input);
};

export const getConversation = async (
  userId: Types.ObjectId,
  otherUserId: Types.ObjectId,
  limit = 50,
) => {
  return Message.find({
    $or: [
      { sender: userId, recipient: otherUserId },
      { sender: otherUserId, recipient: userId },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("sender", "name avatar.url")
    .populate("recipient", "name avatar.url")
    .lean();
};

export const getUserConversations = async (userId: Types.ObjectId) => {
  const messages = await Message.find({
    $or: [{ sender: userId }, { recipient: userId }],
  })
    .sort({ createdAt: -1 })
    .lean();

  const conversations = new Map<string, (typeof messages)[number]>();

  for (const message of messages) {
    const senderId = message.sender.toString();
    const recipientId = message.recipient.toString();

    const otherUserId = senderId === userId.toString() ? recipientId : senderId;

    if (!conversations.has(otherUserId)) {
      conversations.set(otherUserId, message);
    }
  }

  return Array.from(conversations.values());
};
