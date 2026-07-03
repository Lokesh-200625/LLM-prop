-- AddForeignKey
ALTER TABLE "shared_predictions" ADD CONSTRAINT "shared_predictions_predictionId_fkey" FOREIGN KEY ("predictionId") REFERENCES "prediction_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;
