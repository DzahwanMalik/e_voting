/*
  Warnings:

  - You are about to drop the column `description` on the `Candidate` table. All the data in the column will be lost.
  - Added the required column `mission` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vision` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "description",
ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "mission" TEXT NOT NULL,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "vision" TEXT NOT NULL;
