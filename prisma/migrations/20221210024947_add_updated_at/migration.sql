/*
  Warnings:

  - Added the required column `updatedAt` to the `InputAssets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `InputLiabilities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InputAssets" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "InputLiabilities" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
