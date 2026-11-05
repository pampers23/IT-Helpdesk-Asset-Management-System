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