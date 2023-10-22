/*
  Warnings:

  - You are about to drop the column `tatolPrice` on the `orderitem` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `Orderitem_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `Orderitem_productId_fkey`;

-- AlterTable
ALTER TABLE `address` ADD COLUMN `orderId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `orderitem` DROP COLUMN `tatolPrice`,
    ADD COLUMN `totalPrice` DECIMAL(10, 2) NOT NULL;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
