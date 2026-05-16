<?php

namespace App\Controllers;

use App\Repositories\UserRepository;
use App\Repositories\TransactionRepository;
use Exception;

class AdminController
{
    private UserRepository $userRepository;

    public function __construct()
    {
        $this->userRepository = new UserRepository();
    }

    private function requireAdmin(): void
    {
        $payload = $GLOBALS['auth_payload'] ?? null;
        if (!$payload || ($payload['role'] ?? '') !== 'admin') {
            \Response::error('Acesso negado. Apenas administradores.', 403);
            exit;
        }
    }

    public function getUsers(): void
    {
        try {
            $this->requireAdmin();

            $page    = (int)($_GET['page']     ?? 1);
            $perPage = (int)($_GET['per_page'] ?? 20);

            $users = $this->userRepository->findAll($page, $perPage);
            $total = $this->userRepository->getTotalCount();

            $data = array_map(fn($u) => $u->toArrayWithoutSensitive(), $users);
            \Response::paginated($data, $total, $page, $perPage, 'Usuários recuperados');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }

    public function deactivateUser(): void
    {
        try {
            $this->requireAdmin();
            $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
            if (!$id) { \Response::error('ID do usuário obrigatório', 400); return; }
            $this->userRepository->deactivate($id);
            \Response::success(null, 'Usuário desativado');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }

    public function activateUser(): void
    {
        try {
            $this->requireAdmin();
            $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
            if (!$id) { \Response::error('ID do usuário obrigatório', 400); return; }
            $this->userRepository->activate($id);
            \Response::success(null, 'Usuário ativado');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }

    public function deleteUser(): void
    {
        try {
            $this->requireAdmin();
            $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
            if (!$id) { \Response::error('ID do usuário obrigatório', 400); return; }
            $this->userRepository->delete($id);
            \Response::success(null, 'Usuário removido');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }

    public function getStatistics(): void
    {
        try {
            $this->requireAdmin();

            $totalUsers  = $this->userRepository->getTotalCount();
            $activeUsers = $this->userRepository->getActiveCount();

            $txRepo = new TransactionRepository();
            $totalTx = $txRepo->getTotalCountAll();

            \Response::success([
                'total_users'  => $totalUsers,
                'active_users' => $activeUsers,
                'total_transactions' => $totalTx,
                'timestamp'    => date('Y-m-d H:i:s'),
            ], 'Estatísticas recuperadas');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }
}
