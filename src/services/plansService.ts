import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import { extractPlanInfo } from "../utils/extractPlanInfo";
import { Plan } from "../../generated/prisma";
import path from "path";
import fs from "fs";
import planRepositories from "../repositories/planRepositories";

interface CreatePlanInput extends Omit<Plan, "filePath"> {
  file?: Express.Multer.File;
}

export async function getPlansService() {
  return planRepositories.findAll();
}

export async function createPlanService(planData: CreatePlanInput) {
  let filePath: string | undefined = undefined;

  if (planData.file) {
    const uploadsDir = path.resolve(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const fileName = `${Date.now()}-${planData.file.originalname}`;
    filePath = `uploads/${fileName}`;
    const absoluteFilePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(absoluteFilePath, planData.file.buffer);
  }

  const { file, ...planDataWithoutFile } = planData;

  const planToSave: Plan = {
    ...planDataWithoutFile,
    filePath: filePath ?? null,
  };

  await planRepositories.create(planToSave);
}

export async function extractFromDocx(buffer: Buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return extractPlanInfo(result.value);
}

export async function extractFromPdf(buffer: Buffer) {
  const data = await pdfParse(buffer);
  return extractPlanInfo(data.text);
}

export async function extractFromDoc(_buffer: Buffer) {
  throw new Error(
    "Formato .doc não suportado no momento. Envie arquivos .pdf ou .docx."
  );
}

export async function extractPlanFromFile(file: Express.Multer.File) {
  const { mimetype, buffer } = file;

  if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return await extractFromDocx(buffer);
  } else if (mimetype === "application/pdf") {
    return await extractFromPdf(buffer);
  } else if (mimetype === "application/msword") {
    return await extractFromDoc(buffer);
  } else {
    throw new Error("Formato de arquivo não suportado.");
  }
}
