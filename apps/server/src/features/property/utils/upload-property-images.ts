import { Readable } from "node:stream";

import cloudinary from "../../../shared/utils/cloudinary.js";

type UploadPropertyImageResult = {
  url: string;
  publicId: string;
};

export const uploadPropertyImage = (
  buffer: Buffer,
): Promise<UploadPropertyImageResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "roman-real-estate/properties",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  }); // Readable.from(buffer) створює потік читання з даних фотографії..pipe(uploadStream)
  //  передає дані цього потоку до потоку завантаження Cloudinary.
};

// Ця функція завантажує фотографію нерухомості з Express backend у Cloudinary
// та повертає посилання на зображення й унікальний ідентифікатор файлу.
// У Roman Real Estate 2 вона може використовуватися, коли користувач створює
// оголошення й додає фотографії квартири або будинку.
