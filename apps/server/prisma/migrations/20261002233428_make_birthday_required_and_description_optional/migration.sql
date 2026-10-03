/*
  Warnings:

  - Made the column `birthday` on table `Candidate` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "description" TEXT,
ALTER COLUMN "birthday" SET NOT NULL;
