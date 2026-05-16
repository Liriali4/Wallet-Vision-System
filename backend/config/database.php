<?php

return [
    'host' => getenv('DB_HOST') ?: 'localhost',
    'database' => getenv('DB_NAME') ?: 'personal_finance',
    'user' => getenv('DB_USER') ?: 'root',
    'password' => getenv('DB_PASSWORD') ?: '',
    'port' => getenv('DB_PORT') ?: 3306,
    'charset' => 'utf8mb4',
];
