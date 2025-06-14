import { Request, Response } from "express";
import { extractPlanFromFile } from "../services/plansService";

export async function uploadPlan(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Arquivo não enviado." });
      return;
    }
    const info = await extractPlanFromFile(req.file);
    res.json({ plan: info });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}
