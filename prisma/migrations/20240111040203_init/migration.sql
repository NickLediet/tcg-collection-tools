-- CreateTable
CREATE TABLE "Card" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scryfall_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_scryfall_id_key" ON "Card"("scryfall_id");
