-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source" TEXT NOT NULL,
    "rendered" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    CONSTRAINT "Ink_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ink" ("creatorId", "id", "name", "rendered", "slug", "source") SELECT "creatorId", "id", "name", "rendered", "slug", "source" FROM "Ink";
DROP TABLE "Ink";
ALTER TABLE "new_Ink" RENAME TO "Ink";
CREATE UNIQUE INDEX "Ink_slug_key" ON "Ink"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
