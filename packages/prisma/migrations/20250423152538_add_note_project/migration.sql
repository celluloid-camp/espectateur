-- CreateTable
CREATE TABLE "ProjectNote" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID,
    "userId" UUID NOT NULL,
    "content" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ProjectNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectNote_projectId_userId_idx" ON "ProjectNote"("projectId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectNote_projectId_userId_key" ON "ProjectNote"("projectId", "userId");

-- AddForeignKey
ALTER TABLE "ProjectNote" ADD CONSTRAINT "projectnote_projectid_foreign" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "ProjectNote" ADD CONSTRAINT "projectnote_userid_foreign" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
