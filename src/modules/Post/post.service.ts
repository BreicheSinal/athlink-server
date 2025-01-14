import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// Ensuring that upload directory exists
const initializeUploadDir = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
};

// Initializing on service start
initializeUploadDir();

const processImage = async (file: Express.Multer.File): Promise<Buffer> => {
  if (file.mimetype.startsWith("image/")) {
    return sharp(file.buffer)
      .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
  }
  return file.buffer;
};

const uploadFile = async (file: Express.Multer.File) => {
  try {
    const processedBuffer = await processImage(file);
    const fileExtension = file.originalname.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join("posts", fileName);
    const fullPath = path.join(UPLOAD_DIR, filePath);

    // Ensuring that posts subdirectory exists
    const postsDir = path.join(UPLOAD_DIR, "posts");
    await fs.mkdir(postsDir, { recursive: true });

    // Saving the file
    await fs.writeFile(fullPath, processedBuffer);

    return {
      url: `/uploads/${filePath}`,
      path: filePath,
    };
  } catch (error) {
    console.error("File upload error:", error);
    throw new Error("Failed to upload file");
  }
};
