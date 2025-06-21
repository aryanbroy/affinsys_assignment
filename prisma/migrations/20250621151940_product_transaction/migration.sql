-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_toUserId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "productId" INTEGER,
ALTER COLUMN "toUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
