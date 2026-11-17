-- Step 1: Temporarily allow both old and new enum values
ALTER TABLE `asset`
MODIFY `status` ENUM(
  'AVAILABLE',
  'ASSGINED',
  'ASSIGNED',
  'MAINTENANCE',
  'RETIRED'
) NOT NULL DEFAULT 'AVAILABLE';

-- Step 2: Rename existing records
UPDATE `asset`
SET `status` = 'ASSIGNED'
WHERE `status` = 'ASSGINED';

-- Step 3: Remove the misspelled enum value
ALTER TABLE `asset`
MODIFY `status` ENUM(
  'AVAILABLE',
  'ASSIGNED',
  'MAINTENANCE',
  'RETIRED'
) NOT NULL DEFAULT 'AVAILABLE';