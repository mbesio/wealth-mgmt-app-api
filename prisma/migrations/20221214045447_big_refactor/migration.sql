/*
  Warnings:

  - You are about to drop the `InputLiabilities` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `principalEUR` to the `AccountLiabilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `principalUSD` to the `AccountLiabilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountEUR` to the `InputAssets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountUSD` to the `InputAssets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InputLiabilities" DROP CONSTRAINT "InputLiabilities_belongsToAccountId_fkey";

-- AlterTable
ALTER TABLE "AccountLiabilities" ADD COLUMN     "principalEUR" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "principalUSD" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "FX" ALTER COLUMN "date" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "InputAssets" ADD COLUMN     "amountEUR" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "amountUSD" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "date" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "InputLiabilities";
