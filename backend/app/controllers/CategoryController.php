<?php

namespace App\Controllers;

use App\Services\CategoryService;
use Exception;

class CategoryController
{
    private CategoryService $categoryService;

    public function __construct()
    {
        $this->categoryService = new CategoryService();
    }

    public function getCategories(): void
    {
        try {
            $payload = $GLOBALS['auth_payload'] ?? null;
            if (!$payload) { \Response::error('Não autorizado', 401); return; }

            $type       = $_GET['type'] ?? null;
            $categories = $this->categoryService->getCategories($payload['user_id'], $type);
            \Response::success($categories, 'Categorias recuperadas');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }

    public function create(): void
    {
        try {
            $payload = $GLOBALS['auth_payload'] ?? null;
            if (!$payload) { \Response::error('Não autorizado', 401); return; }

            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || !isset($data['name'], $data['type'])) {
                \Response::error('Campos obrigatórios: name, type', 400);
                return;
            }

            $id = $this->categoryService->createCategory($payload['user_id'], $data);
            \Response::success(['id' => $id], 'Categoria criada', 201);
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }

    public function update(): void
    {
        try {
            $payload = $GLOBALS['auth_payload'] ?? null;
            if (!$payload) { \Response::error('Não autorizado', 401); return; }

            $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
            if (!$id) { \Response::error('ID da categoria obrigatório', 400); return; }

            $data = json_decode(file_get_contents('php://input'), true) ?? [];
            $this->categoryService->updateCategory($payload['user_id'], $id, $data);
            \Response::success(null, 'Categoria atualizada');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }

    public function delete(): void
    {
        try {
            $payload = $GLOBALS['auth_payload'] ?? null;
            if (!$payload) { \Response::error('Não autorizado', 401); return; }

            $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
            if (!$id) { \Response::error('ID da categoria obrigatório', 400); return; }

            $this->categoryService->deleteCategory($payload['user_id'], $id);
            \Response::success(null, 'Categoria removida');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }
}
