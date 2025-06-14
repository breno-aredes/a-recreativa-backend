import { Request, Response } from "express";
import {
  createPlanService,
  extractPlanFromFile,
} from "../services/plansService";

export async function createPlan(req: Request, res: Response) {
  try {
    const planData = { ...req.body, file: req.file };
    const plan = await createPlanService(planData);
    res.status(201).json({ plan });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

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
