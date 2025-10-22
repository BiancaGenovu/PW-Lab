-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Pilot', 'Admin');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'Pilot',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Circuit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "km" DOUBLE PRECISION NOT NULL,
    "country" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Circuit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Time" (
    "id" SERIAL NOT NULL,
    "pilotId" INTEGER NOT NULL,
    "circuitId" INTEGER NOT NULL,
    "lapTimeMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Time_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Circuit_country_idx" ON "Circuit"("country");

-- CreateIndex
CREATE UNIQUE INDEX "Circuit_name_country_key" ON "Circuit"("name", "country");

-- CreateIndex
CREATE INDEX "Time_pilotId_idx" ON "Time"("pilotId");

-- CreateIndex
CREATE INDEX "Time_circuitId_idx" ON "Time"("circuitId");

-- CreateIndex
CREATE INDEX "Time_lapTimeMs_idx" ON "Time"("lapTimeMs");

-- CreateIndex
CREATE INDEX "Time_pilotId_circuitId_idx" ON "Time"("pilotId", "circuitId");

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "Circuit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
