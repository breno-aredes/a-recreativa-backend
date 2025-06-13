import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

export let prisma: PrismaClient;

export function connectDb(): void {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
}

export async function disconnectDB(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
  }
}
