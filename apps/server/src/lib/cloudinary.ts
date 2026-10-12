import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

const cloudinaryConfig: {
  cloud_name?: string;
  api_key?: string;
  api_secret?: string;
  secure: boolean;
} = {
  secure: true,
};

if (CLOUDINARY_CLOUD_NAME) {
  cloudinaryConfig.cloud_name = CLOUDINARY_CLOUD_NAME;
}
if (CLOUDINARY_API_KEY) {
  cloudinaryConfig.api_key = CLOUDINARY_API_KEY;
}
if (CLOUDINARY_API_SECRET) {
  cloudinaryConfig.api_secret = CLOUDINARY_API_SECRET;
}

cloudinary.config(cloudinaryConfig);

export { cloudinary };
