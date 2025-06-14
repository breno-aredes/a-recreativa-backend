import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import { extractPlanInfo } from "../utils/extractPlanInfo";

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
