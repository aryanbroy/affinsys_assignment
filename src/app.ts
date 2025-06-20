import express, { Request, Response } from "express";
import { authRoute } from "./routes/auth.route";

const app = express();

app.use(express.json());

app.use("/auth", authRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello theere!");
});

export default app;
