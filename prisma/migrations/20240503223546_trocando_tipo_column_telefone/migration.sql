/*
  Warnings:

  - You are about to drop the column `telefone` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[DDDtelefone]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `DDDtelefone` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_telefone_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "telefone",
ADD COLUMN     "DDDtelefone" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_DDDtelefone_key" ON "users"("DDDtelefone");
