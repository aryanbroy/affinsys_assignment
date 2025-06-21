import { Request, Response } from "express";
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

export const listProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
      },
    });
    sendSuccessResponse(res, 200, "Products listed", {
      data: {
        products,
      },
    });
  } catch (error) {
    sendErrorResponse(
      res,
      500,
      "Internal server error, Error listing products",
      error
    );
  }
};

export const buyProduct = async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return sendErrorResponse(res, 400, "Unauthorized to buy product");
    }

    const { product_id } = req.body;

    if (!product_id || typeof product_id !== "number") {
      return sendErrorResponse(res, 400, "Invalid product id!");
    }

    const product = await prisma.product.findUnique({
      where: {
        id: product_id,
      },
    });
    if (!product) {
      return sendErrorResponse(res, 400, "Product not found");
    }
    if (product.price > user.balance) {
      return sendErrorResponse(res, 400, "Insufficient balance");
    }

    const updatedBalance = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          balance: {
            decrement: product.price,
          },
        },
      });

      await tx.transaction.create({
        data: {
          kind: "PURCHASE",
          amt: product.price,
          updated_bal: updatedUser.balance,
          senderId: user.id,
          productId: product.id,
        },
      });
      return updatedUser.balance;
    });

    sendSuccessResponse(res, 200, "Product purchased", {
      data: {
        balance: updatedBalance,
      },
    });
  } catch (error) {
    sendErrorResponse(
      res,
      500,
      "Internal server error, Error buying product",
      error
    );
  }
};
