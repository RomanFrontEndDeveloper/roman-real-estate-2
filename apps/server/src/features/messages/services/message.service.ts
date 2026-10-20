import mongoose from "mongoose";
import { ApiError } from "../../auth/utils/api-error.js";

import {
  createMessage,
  getConversation,
  getUserConversations,
} from "../repository/message.repository.js";

import User from "../../auth/models/User.js";

type SendMessageInput = {
  senderId: string;
  recipientId: string;
  text: string;
};

const normalizeUserId = (id: string): mongoose.Types.ObjectId => {
    
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError("Invalid user ID", 400);
  }

  return new mongoose.Types.ObjectId(id);
};

export const sendMessage = async ({
  senderId,
  recipientId,
  text,
}: SendMessageInput) => {
  const sender = normalizeUserId(senderId);
  const recipient = normalizeUserId(recipientId);

  if (sender.equals(recipient)) {
    throw new ApiError("You cannot send a message to yourself", 400);
  }

  const [senderExists, recipientExists] = await Promise.all([
    User.exists({ _id: sender, isBlocked: { $ne: true } }),
    User.exists({ _id: recipient, isBlocked: { $ne: true } }),
  ]);

  if (!senderExists) {
    throw new ApiError("Sender not found or blocked", 404);
  }

  if (!recipientExists) {
    throw new ApiError("Recipient not found or blocked", 404);
  }

  const normalizedText = text.trim();
  if (!normalizedText) {
    throw new ApiError("Message cannot be empty", 400);
  }

  if (normalizedText.length > 5000) {
    throw new ApiError("Message cannot exceed 5000 characters", 400);
  }

  return createMessage({
    sender,
    recipient,
    text: normalizedText,
  });
};

export const loadConversation = async (
  currentUserId: string,
  otherUserId: string,
) => {
  const userId = normalizeUserId(currentUserId);
  const otherId = normalizeUserId(otherUserId);

  if (userId.equals(otherId)) {
    throw new ApiError("Invalid conversation", 400);
  }

  const otherUser = await User.findOne({
    _id: otherId,
    isBlocked: { $ne: true },
  }).select("_id");

  if (!otherUser) {
    throw new ApiError("User not found or blocked", 404);
  }

  return getConversation(userId, otherId);
};

export const loadUserConversations = async (currentUserId: string) => {
  const userId = normalizeUserId(currentUserId);

  return getUserConversations(userId);
};
