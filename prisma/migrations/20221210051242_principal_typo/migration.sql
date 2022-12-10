/*
  Warnings:

  - You are about to drop the column `princial` on the `AccountLiabilities` table. All the data in the column will be lost.
  - Added the required column `principal` to the `AccountLiabilities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccountLiabilities" DROP COLUMN "princial",
ADD COLUMN     "principal" DOUBLE PRECISION NOT NULL;
