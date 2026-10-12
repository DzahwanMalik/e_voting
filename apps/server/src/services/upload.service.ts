import { cloudinary } from "../lib/cloudinary";
import { AppError } from "../utils/app-error";

const CLOUDINARY_FOLDER = "e-voting/candidates";

const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string = CLOUDINARY_FOLDER,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder,
      },
      (error, result) => {
        if (error) {
          reject(new AppError("Gagal mengunggah foto ke Cloudinary.", 500));
          return;
        }
        if (!result || !result.secure_url) {
          reject(new AppError("Gagal mengunggah foto ke Cloudinary.", 500));
          return;
        }
        resolve(result.secure_url);
      },
    );

    uploadStream.end(buffer);
  });
};

export { uploadToCloudinary };