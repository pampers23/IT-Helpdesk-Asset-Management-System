CREATE DATABASE resolveit_db;

SHOW DATABASES LIKE 'resolveit_db';

CREATE USER 'resolveit_user'@'localhost'
IDENTIFIED BY '@Taeman_23';

GRANT ALL PRIVILEGES ON resolveit_db.*
TO 'resolveit_user'@'localhost';

SHOW GRANTS FOR 'resolveit_user'@'localhost';

SELECT DATABASE(), CURRENT_USER();

USE resolveit_db;

GRANT CREATE, DROP, ALTER, REFERENCES ON *.* TO 'resolveit_user'@'localhost';
FLUSH PRIVILEGES;