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

const FIELD_LABELS: Record<keyof PlanExtracted, RegExp[]> = {
  title: [/^t[íi]tulo:/i, /^t[óo]pico:/i, /^plano de aula$/i],
  subject: [/^disciplina:/i, /^mat[ée]ria:/i],
  grade: [/^(ano\/s[ée]rie|ano|s[ée]rie|turma):/i],
  duration: [/^dura[çc][ãa]o:/i, /^data:/i, /^tempo:/i, /^minutos:/i],
  objectives: [
    /^foco e objetivos da aula:/i,
    /^objetivos da aula:/i,
    /^objetivos de aprendizagem:/i,
    /^objetivos:/i,
  ],
  activities: [
    /^estrutura \/ atividade:/i,
    /^atividades desenvolvidas:/i,
    /^atividades:/i,
    /^estrutura:/i,
  ],
  resources: [
    /^materiais necess[áa]rios:/i,
    /^recursos necess[áa]rios:/i,
    /^recursos:/i,
    /^materiais:/i,
  ],
  evaluation: [/^avalia[çc][ãa]o:/i],
  homework: [/^tarefa de casa:/i, /^tarefa:/i],
  notes: [
    /^observa[çc][õo]es adicionais?:/i,
    /^observa[çc][õo]es:/i,
    /^notas:/i,
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

function matchField(line: string): {
  field: keyof PlanExtracted | null;
  label: RegExp | null;
} {
  for (const key of FIELD_ORDER) {
    for (const label of FIELD_LABELS[key]) {
      if (label.test(line.trim())) return { field: key, label };
    }
  }
  return { field: null, label: null };
}

export function extractPlanInfo(text: string): PlanExtracted {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !/^[_\-\*=]+$/.test(l));

  const result: Partial<PlanExtracted> = {};
  let currentField: keyof PlanExtracted | null = null;
  let buffer: string[] = [];

  for (let i = 0; i <= lines.length; i++) {
    const line = lines[i] ?? "";
    const match = matchField(line);

    if (match.field || i === lines.length) {
      if (currentField && buffer.length) {
        result[currentField] = buffer.join("\n").trim();
      }
      if (match.field) {
        const value = line.replace(match.label!, "").replace(/^:/, "").trim();
        buffer = value ? [value] : [];
        currentField = match.field;
      } else {
        buffer = [];
        currentField = null;
      }
    } else if (currentField) {
      buffer.push(line);
    }
  }

  FIELD_ORDER.forEach((k) => {
    result[k] = result[k] || "";
  });

  if (result.title) result.title = result.title.replace(/^[-:]+/, "").trim();
  if (result.subject)
    result.subject = result.subject.replace(/^[-:]+/, "").trim();
  if (result.grade) result.grade = result.grade.replace(/^[-:]+/, "").trim();
  if (result.duration)
    result.duration = result.duration.replace(/^[-:]+/, "").trim();

  return result as PlanExtracted;
}
