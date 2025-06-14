import { Router } from "express";
import multer from "multer";
import { uploadPlan } from "../controllers/plansController";
import { schemaValidate } from "../middleware/schema.validate";
import { fileUploadSchema } from "../schemas/plansSchemas";

const PlansRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

PlansRouter.post(
  "/upload",
  upload.single("file"),
  schemaValidate(fileUploadSchema),
  uploadPlan
);

export default PlansRouter;
