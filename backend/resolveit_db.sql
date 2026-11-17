CREATE DATABASE resolveit_db;

SHOW DATABASES LIKE 'resolveit_db';

CREATE USER 'resolveit_user'@'localhost'
IDENTIFIED BY '@Taeman_23';

GRANT ALL PRIVILEGES ON resolveit_db.*
TO 'resolveit_user'@'localhost';

SHOW GRANTS FOR 'resolveit_user'@'localhost';

SELECT DATABASE(), CURRENT_USER();

USE resolveit_db;

SHOW COLUMNS FROM `User`;

GRANT CREATE, DROP, ALTER, REFERENCES ON *.* TO 'resolveit_user'@'localhost';
FLUSH PRIVILEGES;

ALTER TABLE `User`
RENAME COLUMN `fistName` TO `firstName`;

INSERT INTO users (firstName, lastName, email, password, role, isActive)
VALUES ('Lance', 'Mendoza', 'lancemendoza@gmail.com', 'ADMIN', true);

SELECT user, host, plugin
FROM mysql.user
WHERE user = 'resolveit_user';

SELECT
    migration_name,
    checksum,
    finished_at,
    rolled_back_at
FROM _prisma_migrations
WHERE migration_name = '20261104032657_user';

SELECT
    migration_name,
    checksum,
    finished_at,
    rolled_back_at
FROM _prisma_migrations;

SELECT id, firstName, lastName, email, role, isActive
FROM User
ORDER BY id;

INSERT INTO User (
    firstName,
    lastName,
    email,
    password,
    role,
    isActive,
    createdAt,
    updatedAt
)
VALUES (
    'Test',
    'Technician',
    'inactive.tech@resolveit.local',
    'TEMPORARY_TEST_ACCOUNT',
    'IT_TECHNICIAN',
    0,
    NOW(),
    NOW()
);

SELECT id, firstName, lastName, email, role, isActive
FROM User
WHERE email = 'inactive.tech@resolveit.local';

DELETE FROM User
WHERE id = 4
AND email = 'inactive.tech@resolveit.local';

SELECT *
FROM User
WHERE id = 4;

SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'resolveit_db'
  AND TABLE_NAME = 'User';
  
SELECT migration_name, finished_at
FROM _prisma_migrations
ORDER BY started_at;

SELECT migration_name, checksum, started_at, finished_at
FROM _prisma_migrations
WHERE migration_name = '20261104032657_user';

SELECT id, title, assignedToId
FROM Ticket;

DELETE FROM Ticket
WHERE id = 2
  AND title = 'Temporary status permission test'
  AND assignedToId IS NULL;
  
SELECT * FROM Ticket;

SELECT
    migration_name,
    started_at,
    finished_at,
    rolled_back_at,
    logs
FROM _prisma_migrations
ORDER BY started_at DESC
LIMIT 3;

SELECT id, assetTag, status, assignedToId
FROM asset;

SHOW CREATE TABLE asset;

SELECT @@SESSION.sql_mode;

SELECT status, status + 0 AS enum_index
FROM asset
WHERE id = 1;

SELECT id, assetTag, status, assignedToId
FROM asset;

SELECT id, assetTag, status, assignedToId
FROM asset;

SHOW CREATE TABLE asset;

SELECT id, assetTag, status, assignedToId
FROM resolveit_db.asset;

ALTER TABLE resolveit_db.asset
MODIFY status VARCHAR(20)
COLLATE utf8mb4_unicode_ci
NOT NULL DEFAULT 'AVAILABLE';

UPDATE resolveit_db.asset
SET status = 'ASSIGNED'
WHERE id = 1
AND status = 'ASSGINED';

SELECT id, assetTag, status, assignedToId
FROM resolveit_db.asset
WHERE id = 1;

ALTER TABLE resolveit_db.asset
MODIFY status ENUM(
    'AVAILABLE',
    'ASSIGNED',
    'MAINTENANCE',
    'RETIRED'
)
COLLATE utf8mb4_unicode_ci
NOT NULL DEFAULT 'AVAILABLE';