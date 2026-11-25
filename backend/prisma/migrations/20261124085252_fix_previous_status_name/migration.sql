/*
  Warnings:

  - You are about to drop the column `prepreviousStatus` on the `assethistory` table. All the data in the column will be lost.

*/
-- AlterTable

ALTER TABLE `assethistory` RENAME COLUMN `prepreviousStatus` TO `previousStatus`;