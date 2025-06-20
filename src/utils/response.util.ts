import { Response } from "express";

export type ErrorResponse = {
  success: false;
  message: string;
  error?: any;
};

export type SuccessResponse = {
  success: true;
  message: string;
  data?: any;
};

export const sendSuccessResponse = (
  res: Response,
  statusCode: number = 200,
  message: string,
  data?: any
): void => {
  const response: SuccessResponse = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

export const sendErrorResponse = (
  res: Response,
  statusCode: number = 400,
  message: string,
  error?: any
): void => {
  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (error !== null) {
    response.error = error;
  }

  res.status(statusCode).json(response);
};
