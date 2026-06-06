-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prediction_history" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prediction_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shared_predictions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "predictionId" TEXT NOT NULL,
    "shareToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "shared_predictions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "prediction_history_userId_idx" ON "prediction_history"("userId");

-- CreateIndex
CREATE INDEX "prediction_history_createdAt_idx" ON "prediction_history"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "shared_predictions_shareToken_key" ON "shared_predictions"("shareToken");

-- CreateIndex
CREATE INDEX "shared_predictions_userId_idx" ON "shared_predictions"("userId");

-- CreateIndex
CREATE INDEX "shared_predictions_shareToken_idx" ON "shared_predictions"("shareToken");

-- AddForeignKey
ALTER TABLE "prediction_history" ADD CONSTRAINT "prediction_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_predictions" ADD CONSTRAINT "shared_predictions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
