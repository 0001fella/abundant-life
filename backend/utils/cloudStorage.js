import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload buffer to Cloudinary
export const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

// Delete using full public_id (must extract correctly)
export const deleteFile = async (url) => {
  try {
    const segments = url.split('/');
    const fileWithExtension = segments.slice(-1)[0]; // e.g., abc123.jpg
    const folderPath = segments.slice(segments.indexOf('upload') + 1, -1).join('/');
    const publicId = folderPath
      ? `${folderPath}/${fileWithExtension.split('.')[0]}`
      : fileWithExtension.split('.')[0];

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting file:', error.message);
  }
};
