<?php

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../app/middlewares/CorsMiddleware.php';
require_once __DIR__ . '/../app/middlewares/AuthMiddleware.php';

use App\Middlewares\CorsMiddleware;
use App\Middlewares\AuthMiddleware;

CorsMiddleware::handle();

$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

// Extract the path by removing query string and scripts
$path = parse_url($requestUri, PHP_URL_PATH);

// Remove base path if any (in case of public subdirectory)
$path = str_replace('/public', '', $path);
$path = str_replace('\\', '/', $path);
$path = ltrim($path, '/');
$path = rtrim($path, '/');

switch ($path) {
    // Auth routes (public)
    case 'auth/register':
        if ($method === 'POST') {
            $controller = new \App\Controllers\AuthController();
            $controller->register();
        }
        break;

    case 'auth/login':
        if ($method === 'POST') {
            $controller = new \App\Controllers\AuthController();
            $controller->login();
        }
        break;

    case 'auth/logout':
        if ($method === 'POST') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\AuthController();
            $controller->logout();
        }
        break;
    case 'auth/forgot-password':
        if ($method === 'POST') {
            $controller = new \App\Controllers\AuthController();
            $controller->forgotPassword();
        }
        break;

    case 'auth/reset-password':
        if ($method === 'POST') {
            $controller = new \App\Controllers\AuthController();
            $controller->resetPassword();
        }
        break;

    case 'auth/change-password':
        if ($method === 'POST') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\AuthController();
            $controller->changePassword();
        }
        break;

    case 'auth/profile':
        if ($method === 'PUT') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\AuthController();
            $controller->updateProfile();
        }
        break;

    // Transaction routes (protected)
    case 'transactions/balance':
        if ($method === 'GET') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\TransactionController();
            $controller->getBalance();
        }
        break;

    case 'transactions':
        if ($method === 'GET') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\TransactionController();
            $controller->getTransactions();
        } elseif ($method === 'POST') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\TransactionController();
            $controller->create();
        }
        break;

    case 'transactions/monthly':
        if ($method === 'GET') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\TransactionController();
            $controller->getMonthlyTransactions();
        }
        break;

    case 'transactions/update':
        if ($method === 'PUT') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\TransactionController();
            $controller->update();
        }
        break;

    case 'transactions/delete':
        if ($method === 'DELETE') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\TransactionController();
            $controller->delete();
        }
        break;

    // Category routes (protected)
    case 'categories':
        if ($method === 'GET') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\CategoryController();
            $controller->getCategories();
        } elseif ($method === 'POST') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\CategoryController();
            $controller->create();
        }
        break;

    case 'categories/update':
        if ($method === 'PUT') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\CategoryController();
            $controller->update();
        }
        break;

    case 'categories/delete':
        if ($method === 'DELETE') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\CategoryController();
            $controller->delete();
        }
        break;

    // Goal routes (protected)
    case 'goals':
        if ($method === 'GET') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\GoalController();
            $controller->getGoals();
        } elseif ($method === 'POST') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\GoalController();
            $controller->create();
        }
        break;

    case 'goals/update':
        if ($method === 'PUT') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\GoalController();
            $controller->update();
        }
        break;

    case 'goals/delete':
        if ($method === 'DELETE') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\GoalController();
            $controller->delete();
        }
        break;

    // Admin routes (admin only)
    case 'admin/users':
        if ($method === 'GET') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\AdminController();
            $controller->getUsers();
        }
        break;

    case 'admin/users/deactivate':
        if ($method === 'PUT') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\AdminController();
            $controller->deactivateUser();
        }
        break;

    case 'admin/users/activate':
        if ($method === 'PUT') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\AdminController();
            $controller->activateUser();
        }
        break;

    case 'admin/users/delete':
        if ($method === 'DELETE') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\AdminController();
            $controller->deleteUser();
        }
        break;

    case 'admin/stats':
        if ($method === 'GET') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\AdminController();
            $controller->getStatistics();
        }
        break;

    case 'admin/users/update-role':
        if ($method === 'PUT') {
            $payload = AuthMiddleware::authenticate();
            $GLOBALS['auth_payload'] = $payload;
            $controller = new \App\Controllers\AdminController();
            $controller->updateUserRole();
        }
        break;

    default:
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Route not found'
        ]);
        break;
}
