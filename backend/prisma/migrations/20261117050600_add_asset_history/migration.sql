-- CreateTable
CREATE TABLE `AssetHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `action` ENUM('ASSIGNED', 'UNASSIGNED') NOT NULL,
    `assetId` INTEGER NOT NULL,
    `employeeId` INTEGER NOT NULL,
    `performedById` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AssetHistory` ADD CONSTRAINT `AssetHistory_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `Asset`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssetHistory` ADD CONSTRAINT `AssetHistory_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssetHistory` ADD CONSTRAINT `AssetHistory_performedById_fkey` FOREIGN KEY (`performedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
