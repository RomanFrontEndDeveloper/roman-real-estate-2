import type { RequestHandler } from "express";
import { fileTypeFromBuffer } from "file-type";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export const validateImageUploads: RequestHandler = async (req, res, next) => {
  try {
    const uploadedFiles = req.files;

    let files: Express.Multer.File[] = [];

    if (req.file) {
      files = [req.file];
    } else if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles;
    } else if (uploadedFiles) {
      files = Object.values(uploadedFiles).flat();
    }

    for (const file of files) {
      const detectedType = await fileTypeFromBuffer(file.buffer);

      if (!detectedType || !ALLOWED_IMAGE_TYPES.has(detectedType.mime)) {
        res.status(400).json({
          message: "Invalid image file. Only JPEG, PNG and WebP are allowed.",
        });
        return;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// middleware validateImageUploads у твоєму Roman Real Estate 2. Воно перевіряє справжній
// формат завантажених файлів і дозволяє лише JPEG, PNG та WebP перед тим, як запит піде
// далі до контролера.

// 1) Усі зображення правильного формату → next() передає запит наступному
// middleware або
// контролеру.

// 2) Формат неправильний → res.status(400).json(...) повертає клієнту
//  HTTP-відповідь
// із помилкою
