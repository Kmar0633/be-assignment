/*
  Warnings:

  - You are about to drop the column `toAddress` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `currency` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "toAddress",
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "paymentHistoryId" INTEGER,
ADD COLUMN     "toAddressName" TEXT,
ADD COLUMN     "type" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toAddressName_fkey" FOREIGN KEY ("toAddressName") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_paymentHistoryId_fkey" FOREIGN KEY ("paymentHistoryId") REFERENCES "PaymentHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
