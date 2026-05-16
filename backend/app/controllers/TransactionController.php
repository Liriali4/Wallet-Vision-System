<?php

namespace App\Controllers;

use App\Services\TransactionService;
use Exception;

class TransactionController
{
    private TransactionService $transactionService;

    public function __construct()
    {
        $this->transactionService = new TransactionService();
    }

    public function getBalance(): void
    {
        try {
            $payload = $GLOBALS['auth_payload'] ?? null;
            if (!$payload) { \Response::error('Não autorizado', 401); return; }

            $month = isset($_GET['month']) ? (int)$_GET['month'] : null;
            $year  = isset($_GET['year'])  ? (int)$_GET['year']  : null;

            $balance = $this->transactionService->getBalance($payload['user_id'], $month, $year);
            \Response::success($balance, 'Saldo recuperado');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }

    public function getTransactions(): void
    {
        try {
            $payload = $GLOBALS['auth_payload'] ?? null;
            if (!$payload) { \Response::error('Não autorizado', 401); return; }

            $page    = (int)($_GET['page']     ?? 1);
            $perPage = (int)($_GET['per_page'] ?? 20);
            $type    = $_GET['type'] ?? null;

            $result = $this->transactionService->getTransactions($payload['user_id'], $page, $perPage, $type);

            \Response::paginated($result['transactions'], $result['total'], $result['page'], $result['perPage'], 'Transações recuperadas');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }

    public function getMonthlyTransactions(): void
    {
        try {
            $payload = $GLOBALS['auth_payload'] ?? null;
            if (!$payload) { \Response::error('Não autorizado', 401); return; }

            $month = (int)($_GET['month'] ?? date('n'));
            $year  = (int)($_GET['year']  ?? date('Y'));
            $type  = $_GET['type'] ?? null;

            $transactions = $this->transactionService->getMonthlyTransactions($payload['user_id'], $month, $year, $type);
            \Response::success($transactions, 'Transações mensais recuperadas');
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

            if (!$data || !isset($data['amount'], $data['type'])) {
                \Response::error('Campos obrigatórios: amount, type', 400);
                return;
            }

            $id = $this->transactionService->createTransaction($payload['user_id'], $data);
            \Response::success(['id' => $id], 'Transação criada', 201);
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
            if (!$id) { \Response::error('ID da transação obrigatório', 400); return; }

            $data = json_decode(file_get_contents('php://input'), true) ?? [];
            $this->transactionService->updateTransaction($payload['user_id'], $id, $data);
            \Response::success(null, 'Transação atualizada');
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
            if (!$id) { \Response::error('ID da transação obrigatório', 400); return; }

            $this->transactionService->deleteTransaction($payload['user_id'], $id);
            \Response::success(null, 'Transação removida');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }
}
