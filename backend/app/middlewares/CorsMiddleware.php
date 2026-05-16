<?php

namespace App\Middlewares;

/**
 * CORS is handled in bootstrap.php.
 * This middleware exists for OPTIONS preflight only.
 */
class CorsMiddleware
{
    public static function handle(): void
    {
        // CORS headers already set in bootstrap.php.
        // Handle OPTIONS preflight here as a safety net.
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}
