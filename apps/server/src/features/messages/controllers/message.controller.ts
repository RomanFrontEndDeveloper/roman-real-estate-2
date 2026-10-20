import type { Request, Response, NextFunction } from "express";

import User from "../../auth/models/User.js";
import {
  loadConversation,
  loadUserConversations,
  sendMessage,
} from "../services/message.service.js";
import {
  conversationParamsSchema,
  sendMessageSchema,
} from "../dto/message.dto.js";

export const getUsersForChat = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const currentUserId = req.user!.userId;

    const users = await User.find({
      _id: { $ne: currentUserId },
      isBlocked: { $ne: true },
    })
      .select("_id name email role avatar.url")
      .sort({ name: 1 })
      .lean();

    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

export const getMyConversations = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const conversations = await loadUserConversations(req.user!.userId);

    res.status(200).json({ conversations });
  } catch (error) {
    next(error);
  }
};

export const getConversationMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = conversationParamsSchema.safeParse(req.params);

    if (!params.success) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const messages = await loadConversation(
      req.user!.userId,
      params.data.userId,
    );

    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

export const createDirectMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsed = sendMessageSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        message: "Invalid message data",
        errors: parsed.error.flatten(),
      });
      return;
    }

    const message = await sendMessage({
      senderId: req.user!.userId,
      recipientId: parsed.data.recipientId,
      text: parsed.data.text,
    });

    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
};
