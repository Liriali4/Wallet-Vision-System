<?php

return [
    'allowed_origins' => [
        getenv('CLIENT_URL') ?: 'http://localhost:4200',
        getenv('APP_URL') ?: 'http://localhost:8000',
    ],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    'allowed_headers' => ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    'allow_credentials' => true,
];
