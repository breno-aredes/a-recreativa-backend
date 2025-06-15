type PlanExtracted = {
  title: string;
  subject: string;
  grade: string;
  duration: string;
  objectives: string;
  activities: string;
  resources: string;
  evaluation: string;
  homework: string;
  notes: string;
};

const FIELD_LABELS: Record<keyof PlanExtracted, string[]> = {
  title: [
    "t[íi]tulo",
    "t[óo]pico",
    "tema",
    "plano de aula",
    "tópico",
    "assunto",
  ],
  subject: ["disciplina", "mat[ée]ria", "área"],
  grade: ["ano\\/s[ée]rie", "ano", "s[ée]rie", "turma", "ano escolar", "série"],
  duration: ["dura[çc][ãa]o", "tempo", "minutos", "data", "carga hor[áa]ria"],
  objectives: [
    "foco e objetivos da aula",
    "objetivos da aula",
    "objetivos de aprendizagem",
    "objetivos",
    "foco",
    "foco e objetivos",
    "objetivo",
  ],
  activities: [
    "estrutura \\/ atividade",
    "atividades desenvolvidas",
    "atividades",
    "estrutura",
    "atividade",
    "desenvolvimento",
    "metodologia",
  ],
  resources: [
    "materiais necess[áa]rios",
    "recursos necess[áa]rios",
    "recursos",
    "materiais",
    "materiais did[áa]ticos",
    "materiais utilizados",
  ],
  evaluation: ["avalia[çc][ãa]o", "critérios de avalia[çc][ãa]o"],
  homework: [
    "tarefa de casa",
    "tarefa",
    "dever de casa",
    "atividade complementar",
    "atividade para casa",
  ],
  notes: [
    "observa[çc][õo]es adicionais?",
    "observa[çc][õo]es",
    "notas",
    "considera[çc][õo]es finais",
  ],
};

const FIELD_ORDER: (keyof PlanExtracted)[] = [
  "title",
  "subject",
  "grade",
  "duration",
  "objectives",
  "activities",
  "resources",
  "evaluation",
  "homework",
  "notes",
];

function getLabelRegex(label: string): RegExp {
  return new RegExp(`^\\s*${label}:?\\s*$`, "i");
}

function getInlineLabelRegex(label: string): RegExp {
  return new RegExp(`^\\s*${label}:?\\s+(.+)`, "i");
}

function parseHeaderLine(line: string): Partial<PlanExtracted> {
  const result: Partial<PlanExtracted> = {};

  // Trata o caso especial onde tudo vem no título
  if (line.includes("Título:")) {
    const titleParts = line.split(/\n/);
    for (const part of titleParts) {
      if (part.startsWith("Título:")) {
        result.title = part.replace("Título:", "").trim();
      }
      if (part.startsWith("Disciplina:")) {
        result.subject = part.replace("Disciplina:", "").trim();
      }
      if (part.match(/Ano\/S[ée]rie:/i)) {
        result.grade = part.replace(/Ano\/S[ée]rie:/i, "").trim();
      }
      if (part.startsWith("Duração:")) {
        result.duration = part.replace("Duração:", "").trim();
      }
    }
    return result;
  }

  // Trata o formato original
  if (/(série|ano):\s*(\d{1,2}[A-Za-z]?)/i.test(line)) {
    const match = line.match(/(série|ano):\s*(\d{1,2}[A-Za-z]?)/i);
    if (match) result.grade = match[2].trim();
  }

  if (
    /(disciplina|matéria):\s*([^:]+?)(?=\s+(?:série|ano|duração|data):|$)/i.test(
      line
    )
  ) {
    const match = line.match(
      /(disciplina|matéria):\s*([^:]+?)(?=\s+(?:série|ano|duração|data):|$)/i
    );
    if (match) result.subject = match[2].trim();
  }

  if (
    /(duração|data):\s*([^:]+?)(?=\s+(?:série|ano|disciplina|matéria):|$)/i.test(
      line
    )
  ) {
    const match = line.match(
      /(duração|data):\s*([^:]+?)(?=\s+(?:série|ano|disciplina|matéria):|$)/i
    );
    if (match) result.duration = match[2].trim();
  }

  if (
    !result.duration &&
    /duração:\s*(\d+h|\d{2}\/\d{2}\/\d{4}|\d+\s*minutos)/i.test(line)
  ) {
    const match = line.match(
      /duração:\s*(\d+h|\d{2}\/\d{2}\/\d{4}|\d+\s*minutos)/i
    );
    if (match) result.duration = match[1].trim();
  }

  return result;
}

export function extractPlanInfo(text: string): PlanExtracted {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l);

  const result: Partial<PlanExtracted> = {};
  let currentField: keyof PlanExtracted | null = null;
  let buffer: string[] = [];
  let headerProcessed = false;

  function saveBuffer() {
    if (currentField && buffer.length) {
      const value = buffer.join("\n").trim();
      if (value && (!headerProcessed || !result[currentField])) {
        result[currentField] = value;
      }
    }
    buffer = [];
  }

  // Primeira passada: processa apenas o cabeçalho
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    // Detecta linha de cabeçalho mais rigorosamente
    if (/(?:título|série|ano|disciplina|matéria|duração|data):/i.test(line)) {
      const headerValues = parseHeaderLine(line);
      if (Object.keys(headerValues).length > 0) {
        Object.assign(result, headerValues);
        headerProcessed = true;
      }
    }
  }

  // Segunda passada: processa o resto do documento
  for (const line of lines) {
    let foundLabel = false;

    if (
      line.startsWith("•") ||
      line.startsWith("-") ||
      /^\d+[\.)]\s+/.test(line)
    ) {
      if (currentField) buffer.push(line);
      continue;
    }

    for (const key of FIELD_ORDER) {
      for (const label of FIELD_LABELS[key]) {
        const inlineMatch = line.match(getInlineLabelRegex(label));
        if (inlineMatch) {
          saveBuffer();
          currentField = key;
          if (!headerProcessed || !result[key]) {
            buffer = [inlineMatch[1]];
          }
          foundLabel = true;
          break;
        }

        if (getLabelRegex(label).test(line)) {
          saveBuffer();
          currentField = key;
          foundLabel = true;
          break;
        }
      }
      if (foundLabel) break;
    }

    if (!foundLabel && currentField) {
      buffer.push(line);
    }
  }

  saveBuffer();

  // Pós-processamento
  if (result.evaluation) {
    const homeworkMatch = result.evaluation.match(
      /(?:^|\n)(?:tarefa|dever)[^.]*$/im
    );
    if (homeworkMatch) {
      result.homework = homeworkMatch[0].trim();
      result.evaluation = result.evaluation
        .replace(/(?:^|\n)(?:tarefa|dever)[^.]*$/im, "")
        .trim();
    }
  }

  // Garantir que todos os campos existam
  FIELD_ORDER.forEach((k) => {
    result[k] = result[k] || "";
  });

  return result as PlanExtracted;
}
