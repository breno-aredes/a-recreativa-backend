import { Request, Response } from "express";
import {
  createPlanService,
  extractPlanFromFile,
  getPlansService,
} from "../services/plansService";

export async function getAllPlans(req: Request, res: Response) {
  try {
    const plans = await getPlansService();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function createPlan(req: Request, res: Response) {
  try {
    const planData = { ...req.body, file: req.file };

    await createPlanService(planData);
    res.status(201).json({ message: "Plano criado com sucesso" });
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
