import { Plan } from "../../generated/prisma";
import prisma from "../config/database";

async function create(data: Plan) {
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
