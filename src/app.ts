import express, { Request, Response } from "express";
import { authRoute } from "./routes/auth.route";
import { transactionRoute } from "./routes/transaction.route";
import { productRoute } from "./routes/product.route";

const app = express();

app.use(express.json());

app.use("/auth", authRoute);
app.use("/transaction", transactionRoute);
app.use("/", productRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello theere!");
});

export default app;
