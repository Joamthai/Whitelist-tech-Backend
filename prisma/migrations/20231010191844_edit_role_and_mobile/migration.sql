-- AlterTable
ALTER TABLE `user` MODIFY `mobile` VARCHAR(191) NULL,
    MODIFY `role` ENUM('ADMIN', 'USER') NULL DEFAULT 'USER';
