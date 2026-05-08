/*
  Warnings:

  - The `type` column on the `Monster` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MonsterType" AS ENUM ('BASIC', 'ELITE', 'BOSS');

-- AlterTable
ALTER TABLE "Monster" DROP COLUMN "type",
ADD COLUMN     "type" "MonsterType" NOT NULL DEFAULT 'BASIC';
