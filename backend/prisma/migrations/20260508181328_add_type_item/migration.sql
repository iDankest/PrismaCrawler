/*
  Warnings:

  - Changed the type of `type` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "type",
ADD COLUMN     "type" "ItemType" NOT NULL;
