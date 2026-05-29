/*
  Warnings:

  - You are about to drop the column `token` on the `password_resets` table. All the data in the column will be lost.
  - Added the required column `token_hash` to the `password_resets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "password_resets" DROP COLUMN "token",
ADD COLUMN     "token_hash" TEXT NOT NULL;
