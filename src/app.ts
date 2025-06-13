import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.send("OK!");
});

export function init(): Promise<express.Express> {
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  return Promise.resolve();
}

export default app;
