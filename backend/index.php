<?php

// Backend root entrypoint for compatibility.
// The public directory handles API routing in production.

header('Content-Type: application/json; charset=utf-8');
header('X-Powered-By: Personal Finance Management System');

if (file_exists(__DIR__ . '/public/index.php')) {
    require_once __DIR__ . '/public/index.php';
    return;
}

http_response_code(500);
echo json_encode([
    'success' => false,
    'message' => 'Backend entrypoint missing public/index.php'
]);
