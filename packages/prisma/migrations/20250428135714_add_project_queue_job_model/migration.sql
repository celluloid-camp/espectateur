-- CreateTable
CREATE TABLE "ProjectQueueJob" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "queueJobId" BIGINT,

    CONSTRAINT "ProjectQueueJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectQueueJob_id_key" ON "ProjectQueueJob"("id");

-- AddForeignKey
ALTER TABLE "ProjectQueueJob" ADD CONSTRAINT "ProjectQueueJob_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectQueueJob" ADD CONSTRAINT "ProjectQueueJob_queueJobId_fkey" FOREIGN KEY ("queueJobId") REFERENCES "queue_jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
