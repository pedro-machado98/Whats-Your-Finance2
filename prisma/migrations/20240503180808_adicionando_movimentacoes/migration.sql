/*
  Warnings:

  - You are about to drop the `bookmarks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `apelido` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ddd` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `firstName` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lasName` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "apelido" TEXT NOT NULL,
ADD COLUMN     "conta" TEXT,
ADD COLUMN     "ddd" INTEGER NOT NULL,
ADD COLUMN     "telefone" INTEGER NOT NULL,
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lasName" SET NOT NULL;

-- DropTable
DROP TABLE "bookmarks";

-- CreateTable
CREATE TABLE "movimentacoes" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "movimentacoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
