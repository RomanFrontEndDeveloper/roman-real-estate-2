import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import {
  createDirectMessage,
  getConversationMessages,
  getMyConversations,
  getUsersForChat,
} from "../controllers/message.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Private messaging between authenticated users
 */

/**
 * @swagger
 * /api/messages/users:
 *   get:
 *     summary: Get users available for private chat
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users returned successfully
 *       401:
 *         description: Authentication required
 */
router.get("/users", authenticate, getUsersForChat);

/**
 * @swagger
 * /api/messages/conversations:
 *   get:
 *     summary: Get the current user's conversations
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conversations returned successfully
 *       401:
 *         description: Authentication required
 */
router.get("/conversations", authenticate, getMyConversations);

/**
 * @swagger
 * /api/messages/conversations/{userId}:
 *   get:
 *     summary: Get messages exchanged with a specific user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the other user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation messages returned successfully
 *       400:
 *         description: Invalid user ID or conversation
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found or blocked
 */
router.get("/conversations/:userId", authenticate, getConversationMessages);

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a private message to another user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *               - text
 *             properties:
 *               recipientId:
 *                 type: string
 *                 description: ID of the message recipient
 *               text:
 *                 type: string
 *                 maxLength: 5000
 *                 description: Message text
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Invalid message data
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Sender or recipient not found or blocked
 */
router.post("/", authenticate, createDirectMessage);

export default router;
