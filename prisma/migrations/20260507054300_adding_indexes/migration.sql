/*
  Warnings:

  - You are about to drop the column `token` on the `email_verifications` table. All the data in the column will be lost.
  - Added the required column `token_hash` to the `email_verifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "AuthAction" ADD VALUE 'PASSWORD_RESET_SUCCESS';

-- AlterTable
ALTER TABLE "email_verifications" DROP COLUMN "token",
ADD COLUMN     "token_hash" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "auth_logs_user_id_idx" ON "auth_logs"("user_id");

-- CreateIndex
CREATE INDEX "email_verifications_user_id_idx" ON "email_verifications"("user_id");

-- CreateIndex
CREATE INDEX "password_resets_user_id_idx" ON "password_resets"("user_id");

-- CreateIndex
CREATE INDEX "sessions_user_id_revoked_at_idx" ON "sessions"("user_id", "revoked_at");
