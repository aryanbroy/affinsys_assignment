import { Router } from "express";
import {
  addProduct,
  buyProduct,
  listProducts,
} from "../controllers/product.controller";
import { authenticate } from "../middleware/auth.middleware";

const productRouter = Router();

productRouter.route("/").post(authenticate, addProduct);
productRouter.route("/").get(listProducts);
productRouter.route("/buy").post(authenticate, buyProduct);
export const productRoute = productRouter;
