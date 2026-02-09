-- CreateTable
CREATE TABLE "LeagueInvite" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeagueInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeagueInvite_leagueId_email_key" ON "LeagueInvite"("leagueId", "email");

-- AddForeignKey
ALTER TABLE "LeagueInvite" ADD CONSTRAINT "LeagueInvite_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;
