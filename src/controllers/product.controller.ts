import { Response } from "express";
import { CustomRequest } from "../utils/authenticate.util";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response.util";
import { prisma } from "../lib/prisma";

export const addProduct = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendErrorResponse(res, 400, "Unauthorized to add product");
    }

    const { name, price, description } = req.body;

    if (
      !name ||
      !price ||
      !description ||
      typeof price !== "number" ||
      price <= 0 ||
      name === "" ||
      description === ""
    ) {
      return sendErrorResponse(res, 400, "Invalid product details provided!");
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        createdById: req.user.id,
      },
    });

    sendSuccessResponse(res, 201, "Product added", {
      data: {
        id: product.id,
      },
    });
  } catch (error) {
    sendErrorResponse(
      res,
      500,
      "Internal server error, Error adding product",
      error
    );
  }
};
