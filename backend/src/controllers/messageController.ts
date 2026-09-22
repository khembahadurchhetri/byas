import type { Request, Response } from "express";
import Message from "../models/Message.js";

export async function createMessage(
  req: Request,
  res: Response
) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Create message error:", error);

    return res.status(500).json({
      message: "Failed to send message",
    });
  }
}

export async function getMessages(
  _req: Request,
  res: Response
) {
  try {
    const messages = await Message.find().sort({
      createdAt: -1,
    });

    return res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      message: "Failed to load messages",
    });
  }
}

export async function toggleMessageRead(
  req: Request,
  res: Response
) {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    message.read = !message.read;

    await message.save();

    return res.json(message);
  } catch (error) {
    console.error("Update message error:", error);

    return res.status(500).json({
      message: "Failed to update message",
    });
  }
}

export async function deleteMessage(
  req: Request,
  res: Response
) {
  try {
    const message = await Message.findByIdAndDelete(
      req.params.id
    );

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    return res.json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete message error:", error);

    return res.status(500).json({
      message: "Failed to delete message",
    });
  }
}