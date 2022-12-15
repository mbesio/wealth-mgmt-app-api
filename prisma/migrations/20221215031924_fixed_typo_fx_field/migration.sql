/*
  Warnings:

  - You are about to drop the column `fvVsEUR` on the `InputAssets` table. All the data in the column will be lost.
  - You are about to drop the column `fvVsEUR` on the `InputLiabilities` table. All the data in the column will be lost.
  - Added the required column `fxVsEUR` to the `InputAssets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fxVsEUR` to the `InputLiabilities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InputAssets" DROP COLUMN "fvVsEUR",
ADD COLUMN     "fxVsEUR" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "InputLiabilities" DROP COLUMN "fvVsEUR",
ADD COLUMN     "fxVsEUR" DOUBLE PRECISION NOT NULL;
