import multer from "multer";

const storage = multer.memoryStorage();

export const MAX_FILE_SIZE_MB = 10;

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
});
