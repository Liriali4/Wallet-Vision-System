<?php

declare(strict_types=1);

// ── Load .env file ──────────────────────────────────────────────────────────
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) continue;
        if (!str_contains($line, '=')) continue;
        [$key, $value] = explode('=', $line, 2);
        $key   = trim($key);
        $value = trim($value);
        if (!array_key_exists($key, $_ENV)) {
            $_ENV[$key] = $value;
            putenv("{$key}={$value}");
        }
    }
}

// ── Autoloader ──────────────────────────────────────────────────────────────
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

spl_autoload_register(function (string $class): void {
    $prefix  = 'App\\';
    $baseDir = __DIR__ . '/app/';
    $len     = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) return;
    $file = $baseDir . str_replace('\\', '/', substr($class, $len)) . '.php';
    if (file_exists($file)) require_once $file;
});

require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/utils/Database.php';
require_once __DIR__ . '/utils/JWT.php';

// Initialize Database connection
\Database::init();

// ── CORS ────────────────────────────────────────────────────────────────────
$clientUrl = getenv('CLIENT_URL') ?: 'http://localhost:4200';

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: {$clientUrl}");
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 3600');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
