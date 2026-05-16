<?php

namespace App\Middlewares;

use Exception;

class AuthMiddleware
{
    public static function authenticate(): array
    {
        // Try standard header first, then Apache fallback
        $authHeader = $_SERVER['HTTP_AUTHORIZATION']
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
            ?? (function_exists('getallheaders') ? (getallheaders()['Authorization'] ?? null) : null)
            ?? null;

        if (!$authHeader) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Missing authorization header']);
            exit;
        }

        $parts = explode(' ', trim($authHeader));

        if (count($parts) !== 2 || strtolower($parts[0]) !== 'bearer') {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid authorization header format']);
            exit;
        }

        try {
            return \JWT::decode($parts[1]);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
            exit;
        }
    }
}
