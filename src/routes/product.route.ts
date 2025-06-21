import { Router } from "express";
import { addProduct } from "../controllers/product.controller";
import { authenticate } from "../middleware/auth.middleware";

const productRouter = Router();

productRouter.route("/product").post(authenticate, addProduct);

export const productRoute = productRouter;
