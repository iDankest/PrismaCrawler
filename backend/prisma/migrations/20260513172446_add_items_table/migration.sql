/*
  Warnings:

  - You are about to drop the column `effectType` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `effectValue` on the `Item` table. All the data in the column will be lost.
  - Added the required column `effects` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "effectType",
DROP COLUMN "effectValue",
ADD COLUMN     "effects" JSONB NOT NULL;
