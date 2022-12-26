-- CreateTable
CREATE TABLE "Topic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "cover" TEXT NOT NULL,
    CONSTRAINT "Topic_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Source" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "lang" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "topicId" INTEGER NOT NULL,
    CONSTRAINT "Issue_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IssueItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "issueId" INTEGER NOT NULL,
    CONSTRAINT "IssueItem_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sourceId" INTEGER NOT NULL,
    CONSTRAINT "Category_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CategoryToTopic" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CategoryToTopic_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToTopic_B_fkey" FOREIGN KEY ("B") REFERENCES "Topic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Topic_url_key" ON "Topic"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Source_url_key" ON "Source"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Issue_url_key" ON "Issue"("url");

-- CreateIndex
CREATE UNIQUE INDEX "IssueItem_url_key" ON "IssueItem"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Category_url_key" ON "Category"("url");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToTopic_AB_unique" ON "_CategoryToTopic"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToTopic_B_index" ON "_CategoryToTopic"("B");
