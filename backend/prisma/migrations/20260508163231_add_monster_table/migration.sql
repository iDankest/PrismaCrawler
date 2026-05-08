-- CreateTable
CREATE TABLE "Monster" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL DEFAULT 50,
    "attack" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "Monster_pkey" PRIMARY KEY ("id")
);
