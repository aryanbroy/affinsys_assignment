import express, { Request, Response } from "express";
import "dotenv/config";
import app from "./app";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
