import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response.util";

export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (
    [username, password].some(
      (value) => value === null || value === undefined || value.trim() === ""
    )
  ) {
    return sendErrorResponse(res, 400, "All fields are required", null);
  }

  return sendSuccessResponse(res, 200, "User registered successfully");
};
