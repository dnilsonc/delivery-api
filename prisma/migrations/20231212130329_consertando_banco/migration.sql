/*
  Warnings:

  - You are about to drop the column `bairro` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `cep` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `cidade` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `complemento` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `endereco` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL
);
INSERT INTO "new_User" ("cpf", "email", "id", "name", "telefone") SELECT "cpf", "email", "id", "name", "telefone" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");
CREATE UNIQUE INDEX "User_telefone_key" ON "User"("telefone");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
