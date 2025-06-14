-- CreateTable
CREATE TABLE "Plan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "objectives" TEXT NOT NULL,
    "activities" TEXT NOT NULL,
    "resources" TEXT NOT NULL,
    "evaluation" TEXT NOT NULL,
    "homework" TEXT,
    "notes" TEXT,
    "filePath" TEXT
);
