<?php

return [
    'name' => 'Personal Finance Management System',
    'version' => '1.0.0',
    'env' => getenv('APP_ENV') ?: 'development',
    'debug' => getenv('APP_DEBUG') ?: true,
    'url' => getenv('APP_URL') ?: 'http://localhost:8000',
    'client_url' => getenv('CLIENT_URL') ?: 'http://localhost:4200',
    
    'jwt' => [
        'secret' => getenv('JWT_SECRET') ?: 'your-secret-key-change-in-production',
        'expiration' => 3600 * 24, // 24 hours
        'refresh_expiration' => 3600 * 24 * 7, // 7 days
    ],
];
