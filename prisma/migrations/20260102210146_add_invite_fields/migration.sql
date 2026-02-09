/*
  Warnings:

  - Added the required column `fromUserId` to the `LeagueInvite` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "LeagueInvite" ADD COLUMN     "fromUserId" TEXT NOT NULL,
ADD COLUMN     "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "toUserId" TEXT;

-- CreateIndex
CREATE INDEX "LeagueInvite_toUserId_idx" ON "LeagueInvite"("toUserId");

-- CreateIndex
CREATE INDEX "LeagueInvite_status_idx" ON "LeagueInvite"("status");

-- AddForeignKey
ALTER TABLE "LeagueInvite" ADD CONSTRAINT "LeagueInvite_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueInvite" ADD CONSTRAINT "LeagueInvite_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
