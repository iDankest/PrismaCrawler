/*
  Warnings:

  - You are about to drop the column `event` on the `GameLog` table. All the data in the column will be lost.
  - Added the required column `characterId` to the `GameLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `details` to the `GameLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventType` to the `GameLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TileType" AS ENUM ('FLOOR', 'WALL', 'DOOR', 'LOOT');

-- CreateEnum
CREATE TYPE "GameEventType" AS ENUM ('PLAYER_MOVED', 'PLAYER_ATTACKED', 'PLAYER_DIED', 'ENEMY_DIED', 'ITEM_PICKED', 'LEVEL_UP');

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_characterId_fkey";

-- AlterTable
ALTER TABLE "GameLog" DROP COLUMN "event",
ADD COLUMN     "characterId" INTEGER NOT NULL,
ADD COLUMN     "details" TEXT NOT NULL,
ADD COLUMN     "eventType" "GameEventType" NOT NULL;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "characterId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Monster" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Slime',

    CONSTRAINT "Monster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dungeon" (
    "id" SERIAL NOT NULL,
    "characterId" INTEGER NOT NULL,
    "playerX" INTEGER NOT NULL,
    "playerY" INTEGER NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "savedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dungeon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DungeonTile" (
    "id" SERIAL NOT NULL,
    "dungeonId" INTEGER NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "type" "TileType" NOT NULL,

    CONSTRAINT "DungeonTile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DungeonEnemy" (
    "id" SERIAL NOT NULL,
    "dungeonId" INTEGER NOT NULL,
    "monsterId" INTEGER NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "currentHp" INTEGER NOT NULL,

    CONSTRAINT "DungeonEnemy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DungeonItem" (
    "id" SERIAL NOT NULL,
    "dungeonId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,

    CONSTRAINT "DungeonItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameLog" ADD CONSTRAINT "GameLog_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dungeon" ADD CONSTRAINT "Dungeon_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DungeonTile" ADD CONSTRAINT "DungeonTile_dungeonId_fkey" FOREIGN KEY ("dungeonId") REFERENCES "Dungeon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DungeonEnemy" ADD CONSTRAINT "DungeonEnemy_dungeonId_fkey" FOREIGN KEY ("dungeonId") REFERENCES "Dungeon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DungeonEnemy" ADD CONSTRAINT "DungeonEnemy_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DungeonItem" ADD CONSTRAINT "DungeonItem_dungeonId_fkey" FOREIGN KEY ("dungeonId") REFERENCES "Dungeon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DungeonItem" ADD CONSTRAINT "DungeonItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
