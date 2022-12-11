/*
  Warnings:

  - A unique constraint covering the columns `[date,pair]` on the table `FX` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[date,belongsToAccountId]` on the table `InputAssets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `interestRate` to the `AccountLiabilities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccountLiabilities" ADD COLUMN     "interestRate" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FX_date_pair_key" ON "FX"("date", "pair");

-- CreateIndex
CREATE UNIQUE INDEX "InputAssets_date_belongsToAccountId_key" ON "InputAssets"("date", "belongsToAccountId");
