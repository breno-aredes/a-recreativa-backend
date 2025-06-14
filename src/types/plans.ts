export interface Plan {
  title: string;
  subject: string;
  grade: string;
  duration: string;
  objectives: string;
  activities: string;
  resources: string;
  evaluation: string;
  homework?: string | null;
  notes?: string | null;
  file?: File;
}

export interface PlanResponse {
  plan: Plan;
}
