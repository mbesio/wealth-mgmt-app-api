/*
  Warnings:

  - You are about to drop the column `principalEUR` on the `AccountLiabilities` table. All the data in the column will be lost.
  - You are about to drop the column `principalUSD` on the `AccountLiabilities` table. All the data in the column will be lost.
  - You are about to drop the column `amountEUR` on the `InputAssets` table. All the data in the column will be lost.
  - You are about to drop the column `amountUSD` on the `InputAssets` table. All the data in the column will be lost.
  - You are about to drop the `FX` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `isActive` to the `AccountAssets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `AccountAssets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isActive` to the `AccountLiabilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fvVsEUR` to the `InputAssets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fxVsUSD` to the `InputAssets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccountAssets" ADD COLUMN     "deactivationDate" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL,
ADD COLUMN     "startDate" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AccountLiabilities" DROP COLUMN "principalEUR",
DROP COLUMN "principalUSD",
ADD COLUMN     "deactivationDate" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL,
ALTER COLUMN "startDate" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "InputAssets" DROP COLUMN "amountEUR",
DROP COLUMN "amountUSD",
ADD COLUMN     "fvVsEUR" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fxVsUSD" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "FX";

-- CreateTable
CREATE TABLE "InputLiabilities" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "remainingPrincipal" DOUBLE PRECISION NOT NULL,
    "fxVsUSD" DOUBLE PRECISION NOT NULL,
    "fvVsEUR" DOUBLE PRECISION NOT NULL,
    "belongsToAccountId" TEXT NOT NULL,

    CONSTRAINT "InputLiabilities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InputLiabilities" ADD CONSTRAINT "InputLiabilities_belongsToAccountId_fkey" FOREIGN KEY ("belongsToAccountId") REFERENCES "AccountLiabilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
