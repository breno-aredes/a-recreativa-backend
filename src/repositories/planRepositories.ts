import { Plan } from "../../generated/prisma";
import prisma from "../config/database";

async function create(data: Plan) {
  prisma.plan.create({ data });
  return;
}

export default {
  create,
};
