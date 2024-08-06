-- DropForeignKey
ALTER TABLE "Responses" DROP CONSTRAINT "Responses_question_id_fkey";

-- AddForeignKey
ALTER TABLE "Responses" ADD CONSTRAINT "Responses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
