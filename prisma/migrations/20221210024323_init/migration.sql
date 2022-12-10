-- CreateTable
CREATE TABLE "AccountAssets" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "currency" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "AccountAssets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountLiabilities" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "currency" TEXT NOT NULL,
    "princial" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "term" INTEGER NOT NULL,

    CONSTRAINT "AccountLiabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InputAssets" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "belongsToAccountId" TEXT NOT NULL,

    CONSTRAINT "InputAssets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InputLiabilities" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "remainingPrincipal" DOUBLE PRECISION NOT NULL,
    "belongsToAccountId" TEXT NOT NULL,

    CONSTRAINT "InputLiabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FX" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "pair" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FX_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountAssets_name_key" ON "AccountAssets"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AccountLiabilities_name_key" ON "AccountLiabilities"("name");

-- AddForeignKey
ALTER TABLE "InputAssets" ADD CONSTRAINT "InputAssets_belongsToAccountId_fkey" FOREIGN KEY ("belongsToAccountId") REFERENCES "AccountAssets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InputLiabilities" ADD CONSTRAINT "InputLiabilities_belongsToAccountId_fkey" FOREIGN KEY ("belongsToAccountId") REFERENCES "AccountLiabilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
