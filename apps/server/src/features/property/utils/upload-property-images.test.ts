import { afterEach, describe, expect, it, vi } from "vitest";
import { Writable } from "node:stream";

const { uploadStreamMock } = vi.hoisted(() => ({
  uploadStreamMock: vi.fn(),
}));

vi.mock("../../../shared/utils/cloudinary.js", () => ({
  default: {
    uploader: {
      upload_stream: uploadStreamMock,
    },
  },
}));

import { uploadPropertyImage } from "./upload-property-images.js";

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("uploadPropertyImage", () => {
  it("повертає URL та publicId після успішного завантаження", async () => {
    uploadStreamMock.mockImplementation((_options, callback) => {
      const stream = new Writable({
        write(_chunk, _encoding, done) {
          done();
        },
      });

      queueMicrotask(() => {
        callback(null, {
          secure_url: "https://res.cloudinary.com/demo/property.jpg",
          public_id: "roman-real-estate/properties/property-123",
        });
      });

      return stream;
    });

    const buffer = Buffer.from("fake-image-data");

    await expect(uploadPropertyImage(buffer)).resolves.toEqual({
      url: "https://res.cloudinary.com/demo/property.jpg",
      publicId: "roman-real-estate/properties/property-123",
    });

    expect(uploadStreamMock).toHaveBeenCalledOnce();
    expect(uploadStreamMock).toHaveBeenCalledWith(
      {
        folder: "roman-real-estate/properties",
        resource_type: "image",
      },
      expect.any(Function),
    );
  });

  it("відхиляє Promise, якщо Cloudinary повертає помилку", async () => {
    const uploadError = new Error("Cloudinary upload failed");

    uploadStreamMock.mockImplementation((_options, callback) => {
      const stream = new Writable({
        write(_chunk, _encoding, done) {
          done();
        },
      });

      queueMicrotask(() => {
        callback(uploadError, undefined);
      });

      return stream;
    });

    await expect(
      uploadPropertyImage(Buffer.from("fake-image-data")),
    ).rejects.toThrow("Cloudinary upload failed");
  });

  it("відхиляє Promise, якщо Cloudinary не повертає результат", async () => {
    uploadStreamMock.mockImplementation((_options, callback) => {
      const stream = new Writable({
        write(_chunk, _encoding, done) {
          done();
        },
      });

      queueMicrotask(() => {
        callback(null, undefined);
      });

      return stream;
    });

    await expect(
      uploadPropertyImage(Buffer.from("fake-image-data")),
    ).rejects.toThrow("Cloudinary upload failed");
  });
});
