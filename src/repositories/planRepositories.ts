import { Plan } from "../../generated/prisma";
import prisma from "../config/database";

type PlanCreateDTO = Omit<Plan, "id" | "createdAt"> & {
  filePath?: string | null;
};

async function create(data: PlanCreateDTO) {
  prisma.plan.create({ data });
  return;
}

async function findAll() {
  return prisma.plan.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default {
  create,
  findAll,
};
