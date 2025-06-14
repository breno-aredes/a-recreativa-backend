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

const FIELD_LABELS = [
  { key: "title", labels: [/^PLANO DE AULA$/im, /PLANO DE AULA/i] },
  { key: "subject", labels: [/Disciplina/i, /Mat[ée]ria/i] },
  { key: "grade", labels: [/S[ée]rie(?:\/Ano)?/i, /Ano/i, /Turma/i] },
  {
    key: "duration",
    labels: [/Dura[çc][ãa]o/i, /Data/i, /Tempo/i, /Minutos/i],
  },
  {
    key: "objectives",
    labels: [/Foco e objetivos da aula/i, /Objetivos da Aula/i, /Objetivos/i],
  },
  {
    key: "activities",
    labels: [
      /Estrutura \/ Atividade/i,
      /Atividades Desenvolvidas/i,
      /Atividades/i,
      /Estrutura/i,
    ],
  },
  {
    key: "resources",
    labels: [/Materiais necessários/i, /Recursos Necessários/i, /Recursos/i],
  },
  { key: "evaluation", labels: [/Avalia[çc][ãa]o/i] },
  { key: "homework", labels: [/Tarefa de Casa/i] },
  { key: "notes", labels: [/Observa[çc][õo]es Adicionais?/i, /Notas/i] },
  { key: "learningObjectives", labels: [/Objetivos de aprendizagem/i] },
];

function extractField(
  text: string,
  labelRegex: RegExp,
  nextLabels: RegExp[]
): string {
  const next = nextLabels.length
    ? `(?:${nextLabels.map((r) => r.source).join("|")})`
    : "$";
  const regex = new RegExp(
    `${labelRegex.source}\\s*:?\\s*([\\s\\S]*?)(?=\\n\\s*${next}|$)`,
    "i"
  );
  const match = text.match(regex);
  return (match?.[1] ?? "").replace(/\n\s+/g, "\n").trim();
}

export function extractPlanInfo(text: string): PlanExtracted {
  let norm = text.replace(/\r/g, "").replace(/[ ]+\n/g, "\n");

  const allLabels = FIELD_LABELS.flatMap((f) => f.labels);

  function getField(key: string): string {
    const field = FIELD_LABELS.find((f) => f.key === key);
    if (!field) return "";
    for (const label of field.labels) {
      const nextLabels = allLabels.filter((r) => !field.labels.includes(r));
      const value = extractField(norm, label, nextLabels);
      if (value) {
        if (key === "grade") {
          return value
            .split(/[\n\r]/)[0]
            .replace(/T[óo]pico:.*/i, "")
            .replace(/Aula n[ºo]?.*/i, "")
            .replace(/Data:.*/i, "")
            .trim();
        }
        if (key === "duration") {
          return value
            .split(/[\n\r]/)[0]
            .replace(/T[óo]pico:.*/i, "")
            .replace(/Aula n[ºo]?.*/i, "")
            .trim();
        }
        if (key === "subject") return value.replace(/S[ée]rie:.*/i, "").trim();
        return value;
      }
    }
    return "";
  }

  let title = getField("title");
  if (!title) {
    const titleMatch = norm.match(/^PLANO DE AULA$/im);
    if (titleMatch) title = titleMatch[0].trim();
  }

  let objectives = getField("objectives");
  const learningObjectives = getField("learningObjectives");
  if (learningObjectives) {
    objectives += (objectives ? "\n" : "") + learningObjectives;
  }

  return {
    title,
    subject: getField("subject"),
    grade: getField("grade"),
    duration: getField("duration"),
    objectives,
    activities: getField("activities"),
    resources: getField("resources"),
    evaluation: getField("evaluation"),
    homework: getField("homework"),
    notes: getField("notes"),
  };
}
