/*
  Warnings:

  - The primary key for the `InkInCollection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `collectionId` on the `InkInCollection` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `inkId` on the `InkInCollection` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Collection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Collection` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Ink` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Ink` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `slug` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Ink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Ink` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InkInCollection" (
    "inkId" INTEGER NOT NULL,
    "collectionId" INTEGER NOT NULL,

    PRIMARY KEY ("inkId", "collectionId"),
    CONSTRAINT "InkInCollection_inkId_fkey" FOREIGN KEY ("inkId") REFERENCES "Ink" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InkInCollection_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_InkInCollection" ("collectionId", "inkId") SELECT "collectionId", "inkId" FROM "InkInCollection";
DROP TABLE "InkInCollection";
ALTER TABLE "new_InkInCollection" RENAME TO "InkInCollection";
CREATE TABLE "new_Collection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "curatorId" INTEGER NOT NULL,
    CONSTRAINT "Collection_curatorId_fkey" FOREIGN KEY ("curatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Collection" ("curatorId", "id", "name") SELECT "curatorId", "id", "name" FROM "Collection";
DROP TABLE "Collection";
ALTER TABLE "new_Collection" RENAME TO "Collection";
CREATE UNIQUE INDEX "Collection_slug_key" ON "Collection"("slug");
CREATE TABLE "new_Ink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source" TEXT NOT NULL,
    "rendered" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    CONSTRAINT "Ink_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ink" ("creatorId", "id", "rendered", "source") SELECT "creatorId", "id", "rendered", "source" FROM "Ink";
DROP TABLE "Ink";
ALTER TABLE "new_Ink" RENAME TO "Ink";
CREATE UNIQUE INDEX "Ink_slug_key" ON "Ink"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
