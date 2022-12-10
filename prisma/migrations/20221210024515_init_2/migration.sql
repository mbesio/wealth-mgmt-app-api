/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `InputAssets` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `InputLiabilities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InputAssets" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "InputLiabilities" DROP COLUMN "updatedAt";
