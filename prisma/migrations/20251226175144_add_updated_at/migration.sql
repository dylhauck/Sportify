/*
  Warnings:

  - You are about to drop the column `ownerId` on the `League` table. All the data in the column will be lost.
  - The `sport` column on the `League` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `createdById` to the `League` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `League` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "League" DROP CONSTRAINT "League_ownerId_fkey";

-- AlterTable
ALTER TABLE "League" DROP COLUMN "ownerId",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "sport",
ADD COLUMN     "sport" TEXT NOT NULL DEFAULT 'NFL';

-- CreateTable
CREATE TABLE "LeagueMember" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeagueMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeagueMember_userId_idx" ON "LeagueMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueMember_leagueId_userId_key" ON "LeagueMember"("leagueId", "userId");

-- AddForeignKey
ALTER TABLE "League" ADD CONSTRAINT "League_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueMember" ADD CONSTRAINT "LeagueMember_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueMember" ADD CONSTRAINT "LeagueMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
