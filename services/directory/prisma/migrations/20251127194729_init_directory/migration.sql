-- CreateTable
CREATE TABLE "DirectoryEntry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "DirectoryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DirectoryEntry_email_key" ON "DirectoryEntry"("email");
