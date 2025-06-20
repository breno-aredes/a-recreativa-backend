/*
  Warnings:

  - The primary key for the `Plan` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "objectives" TEXT NOT NULL,
    "activities" TEXT NOT NULL,
    "resources" TEXT NOT NULL,
    "evaluation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "homework" TEXT,
    "notes" TEXT,
    "filePath" TEXT
);
INSERT INTO "new_Plan" ("activities", "createdAt", "duration", "evaluation", "filePath", "grade", "homework", "id", "notes", "objectives", "resources", "subject", "title") SELECT "activities", "createdAt", "duration", "evaluation", "filePath", "grade", "homework", "id", "notes", "objectives", "resources", "subject", "title" FROM "Plan";
DROP TABLE "Plan";
ALTER TABLE "new_Plan" RENAME TO "Plan";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
