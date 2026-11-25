-- DropForeignKey
ALTER TABLE `assethistory` DROP FOREIGN KEY `AssetHistory_employeeId_fkey`;

-- DropIndex
DROP INDEX `AssetHistory_employeeId_fkey` ON `assethistory`;

-- AlterTable
ALTER TABLE `assethistory` ADD COLUMN `newStatus` ENUM('AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'RETIRED') NULL,
    ADD COLUMN `prepreviousStatus` ENUM('AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'RETIRED') NULL,
    MODIFY `action` ENUM('ASSIGNED', 'UNASSIGNED', 'STATUS_CHANGED') NOT NULL,
    MODIFY `employeeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `AssetHistory` ADD CONSTRAINT `AssetHistory_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
