import { Router } from "express";
import multer from "multer";
import { createPlan, uploadPlan } from "../controllers/plansController";
import { schemaValidate } from "../middleware/schema.validate";
import { fileUploadSchema, planSchema } from "../schemas/plansSchemas";

const PlansRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

PlansRouter.post(
  "",
  upload.single("file"),
  schemaValidate(planSchema),
  createPlan
).post(
  "/upload",
  upload.single("file"),
  schemaValidate(fileUploadSchema),
  uploadPlan
);

export default PlansRouter;
