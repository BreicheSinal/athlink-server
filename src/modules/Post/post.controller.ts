import { Request, Response } from "express";
import { createPostService } from "./post.service";
import { createPostSchema } from "../../utils/schemas/generalSchema";
import { throwError } from "../../utils/error";

export const createPost = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { description } = req.body;
    const { userId } = req.params;

    const parsedUserId = parseInt(userId);

    await createPostSchema.parseAsync({ description });

    const post = await createPostService(parsedUserId, description, files);

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return throwError({
      message: errorMessage,
      res,
    });
  }
};
