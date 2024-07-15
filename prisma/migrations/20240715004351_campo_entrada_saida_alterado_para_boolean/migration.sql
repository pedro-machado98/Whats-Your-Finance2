/*
  Warnings:

  - You are about to drop the column `entrada_saida` on the `movimentacoes` table. All the data in the column will be lost.
  - Added the required column `entrada` to the `movimentacoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saida` to the `movimentacoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movimentacoes" DROP COLUMN "entrada_saida",
ADD COLUMN     "entrada" BOOLEAN NOT NULL,
ADD COLUMN     "saida" BOOLEAN NOT NULL;
