import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

import { Post } from "../../db/entities/Post";
import { PostMedia } from "../../db/entities/PostMedia";
import { AppDataSource } from "../../db/connection";
import { User } from "../../db/entities/User";

const postRepository = AppDataSource.getRepository(Post);
const postMediaRepository = AppDataSource.getRepository(PostMedia);
const userRepository = AppDataSource.getRepository(User);

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

export const createPostService = async (
  userId: number,
  description: string,
  files: Express.Multer.File[]
) => {
  try {
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const newPost = postRepository.create({
      user,
      description,
      likes_count: 0,
      comments_count: 0,
    });

    const savedPost = await postRepository.save(newPost);

    let mediaUrls: string[] = [];

    if (files?.length) {
      for (const file of files) {
        try {
          const { url, path } = await uploadFile(file);

          const postMedia = postMediaRepository.create({
            post: savedPost,
            media_type: file.mimetype.startsWith("image/") ? "image" : "video",
            media_url: url,
            storage_path: path,
          });

          await postMediaRepository.save(postMedia);

          mediaUrls.push(url);
        } catch (error) {
          console.error("Error processing file:", error);
          throw error;
        }
      }
    }

    const completePost = await postRepository.findOne({
      where: { id: savedPost.id },
      relations: ["user"],
    });

    if (!completePost) {
      throw new Error("Failed to retrieve created post");
    }

    return {
      success: true,
      message: "Post created successfully",
      data: {
        user_id: completePost.user.id,
        user_name: completePost.user.name,
        id: completePost.id,
        description: completePost.description,
        likes_count: completePost.likes_count,
        comments_count: completePost.comments_count,
        media: mediaUrls,
      },
    };
  } catch (error) {
    console.error("Error in createPostService:", error);
    throw error;
  }
};
