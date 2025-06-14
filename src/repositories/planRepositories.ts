import { Plan } from "../../generated/prisma";
import prisma from "../config/database";

async function create(data: Plan) {
  return prisma.plan.create({ data });
}

export default {
  create,
};
