<?php

namespace App\Controllers;

use App\Services\GoalService;
use Exception;

class GoalController
{
    private GoalService $goalService;

    public function __construct()
    {
        $this->goalService = new GoalService();
    }

    public function getGoals(): void
    {
        try {
            $payload = $GLOBALS['auth_payload'] ?? null;
            if (!$payload) { \Response::error('Não autorizado', 401); return; }

            $status = $_GET['status'] ?? null;
            $goals  = $this->goalService->getGoals($payload['user_id'], $status);
            \Response::success($goals, 'Metas recuperadas');
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
            if (!$data || !isset($data['title'], $data['target_amount'])) {
                \Response::error('Campos obrigatórios: title, target_amount', 400);
                return;
            }

            // Default end_date if not provided
            if (!isset($data['end_date']) || empty($data['end_date'])) {
                $data['end_date'] = date('Y-12-31');
            }

            $id = $this->goalService->createGoal($payload['user_id'], $data);
            \Response::success(['id' => $id], 'Meta criada', 201);
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
            if (!$id) { \Response::error('ID da meta obrigatório', 400); return; }

            $data = json_decode(file_get_contents('php://input'), true) ?? [];
            $this->goalService->updateGoal($payload['user_id'], $id, $data);
            \Response::success(null, 'Meta atualizada');
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
            if (!$id) { \Response::error('ID da meta obrigatório', 400); return; }

            $this->goalService->deleteGoal($payload['user_id'], $id);
            \Response::success(null, 'Meta removida');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }
}
