/*
  Warnings:

  - You are about to drop the column `xp` on the `Score` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Score" DROP COLUMN "xp",
ADD COLUMN     "floor" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "kills" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalDamageDealt" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalDamageTaken" INTEGER NOT NULL DEFAULT 0;
