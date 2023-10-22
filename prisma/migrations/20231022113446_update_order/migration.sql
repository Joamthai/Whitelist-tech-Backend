/*
  Warnings:

  - You are about to drop the column `orderId` on the `address` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_orderId_fkey`;

-- AlterTable
ALTER TABLE `address` DROP COLUMN `orderId`;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `addressId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
