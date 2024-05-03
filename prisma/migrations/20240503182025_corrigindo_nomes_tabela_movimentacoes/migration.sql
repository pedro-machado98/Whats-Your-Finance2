/*
  Warnings:

  - You are about to drop the column `description` on the `movimentacoes` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `movimentacoes` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `movimentacoes` table. All the data in the column will be lost.
  - You are about to drop the column `conta` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lasName` on the `users` table. All the data in the column will be lost.
  - Added the required column `entrada_saida` to the `movimentacoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor` to the `movimentacoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('GERAL', 'MORADIA', 'ALIMENTACAO', 'TRANSPORTE', 'SAUDE', 'EDUCACAO', 'LAZER', 'DESPESAS_PESSOAIS', 'ECONOMIAS');

-- AlterTable
ALTER TABLE "movimentacoes" DROP COLUMN "description",
DROP COLUMN "link",
DROP COLUMN "title",
ADD COLUMN     "categoria" "Categoria" NOT NULL DEFAULT 'GERAL',
ADD COLUMN     "conta" TEXT,
ADD COLUMN     "entrada_saida" TEXT NOT NULL,
ADD COLUMN     "valor" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "conta",
DROP COLUMN "lasName",
ADD COLUMN     "lastName" TEXT NOT NULL;
