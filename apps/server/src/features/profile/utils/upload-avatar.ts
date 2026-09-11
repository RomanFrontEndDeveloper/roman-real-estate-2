import { Readable } from "node:stream";

import cloudinary from "../../../shared/utils/cloudinary.js";

type UploadAvatarResult = {
  url: string;
  publicId: string;
};

export const uploadAvatar = (buffer: Buffer): Promise<UploadAvatarResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "roman-real-estate/avatars", //Це вказує, що завантажені аватари будуть зберігатися в папці "roman-real-estate/avatars" на Cloudinary.
        resource_type: "image", //Це вказує, що завантажений файл є зображенням.
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));

          return;
        }

        resolve({
          url: result.secure_url, //Це URL-адреса завантаженого зображення на Cloudinary.
          publicId: result.public_id, //Це унікальний ідентифікатор завантаженого зображення на Cloudinary, який можна використовувати для подальших операцій з цим зображенням (наприклад, видалення або оновлення).
        });
      },
    );

    Readable.from(buffer).pipe(uploadStream); //Це створює Readable stream з буфера та передає його в uploadStream для завантаження файлу на Cloudinary.
  });
};
