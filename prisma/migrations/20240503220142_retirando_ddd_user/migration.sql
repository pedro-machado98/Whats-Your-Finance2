/*
  Warnings:

  - You are about to drop the column `ddd` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[telefone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "ddd",
ALTER COLUMN "telefone" SET DATA TYPE BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "users_telefone_key" ON "users"("telefone");
