-- Candidate pair model migration
-- Restructures Candidate from individual to pair-based model
-- vision/mission removed from Candidate, now exclusively at CandidatePair level
-- photoUrl added at CandidatePair level (optional campaign photo of calon + wakil together)

-- Step 1: Add isVice column to Candidate
ALTER TABLE "Candidate" ADD COLUMN "isVice" BOOLEAN NOT NULL DEFAULT false;

-- Step 2: Drop vision/mission columns (now at pair level — CandidatePair model)
ALTER TABLE "Candidate" DROP COLUMN "vision";
ALTER TABLE "Candidate" DROP COLUMN "mission";

-- Step 3: Create CandidatePair table (with pair-level photoUrl)
CREATE TABLE "CandidatePair" (
    "id" SERIAL NOT NULL,
    "electionId" INTEGER NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "viceId" INTEGER NOT NULL,
    "photoUrl" TEXT,
    "vision" TEXT NOT NULL,
    "mission" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CandidatePair_pkey" PRIMARY KEY ("id")
);

-- Step 4: Add unique constraints for 1-to-1 relations
CREATE UNIQUE INDEX "CandidatePair_candidateId_key" ON "CandidatePair"("candidateId");
CREATE UNIQUE INDEX "CandidatePair_viceId_key" ON "CandidatePair"("viceId");
CREATE UNIQUE INDEX "CandidatePair_electionId_candidateId_viceId_key" ON "CandidatePair"("electionId", "candidateId", "viceId");

-- Step 5: Add foreign keys for CandidatePair
ALTER TABLE "CandidatePair" ADD CONSTRAINT "CandidatePair_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CandidatePair" ADD CONSTRAINT "CandidatePair_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CandidatePair" ADD CONSTRAINT "CandidatePair_viceId_fkey" FOREIGN KEY ("viceId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 6: Restructure Vote table
-- Drop old foreign key
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_candidateId_fkey";

-- Add new column
ALTER TABLE "Vote" ADD COLUMN "candidatePairId" INTEGER NOT NULL;

-- Add foreign key
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_candidatePairId_fkey" FOREIGN KEY ("candidatePairId") REFERENCES "CandidatePair"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Drop old column
ALTER TABLE "Vote" DROP COLUMN "candidateId";

-- Step 7: Add candidatePairs relation to Election (handled by Prisma schema, no SQL needed for relations)