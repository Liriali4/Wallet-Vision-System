<?php

namespace App\Services;

use App\Models\Transaction;
use App\Repositories\TransactionRepository;
use App\Repositories\CategoryRepository;
use Exception;

class TransactionService
{
    private TransactionRepository $transactionRepository;
    private CategoryRepository    $categoryRepository;

    public function __construct()
    {
        $this->transactionRepository = new TransactionRepository();
        $this->categoryRepository    = new CategoryRepository();
    }

    public function getBalance(int $userId, ?int $month = null, ?int $year = null): array
    {
        $month = $month ?: (int)date('n');
        $year  = $year  ?: (int)date('Y');

        $stats = $this->transactionRepository->getMonthlyStats($userId, $month, $year);

        return [
            'income'  => (float)($stats['income']  ?? 0),
            'expense' => (float)($stats['expense'] ?? 0),
            'balance' => (float)($stats['income'] ?? 0) - (float)($stats['expense'] ?? 0),
            'month'   => $month,
            'year'    => $year,
        ];
    }

    public function getTransactions(int $userId, int $page = 1, int $perPage = 20, ?string $type = null): array
    {
        $transactions = $this->transactionRepository->findByUser($userId, $page, $perPage, $type);
        $total        = $this->transactionRepository->getTotalCount($userId);

        return [
            'transactions' => array_map(fn($t) => $t->toArray(), $transactions),
            'total'        => $total,
            'page'         => $page,
            'perPage'      => $perPage,
        ];
    }

    public function getMonthlyTransactions(int $userId, int $month, int $year, ?string $type = null): array
    {
        $transactions = $this->transactionRepository->findByMonth($userId, $month, $year, $type);
        return array_map(fn($t) => $t->toArray(), $transactions);
    }

    public function createTransaction(int $userId, array $data): int
    {
        $type = $data['type'] ?? 'expense';
        if (!in_array($type, ['income', 'expense'])) {
            throw new Exception('Tipo inválido. Use income ou expense.');
        }

        // Resolve category_id — if not provided, use or create a default "Outros" category
        $categoryId = isset($data['category_id']) ? (int)$data['category_id'] : null;

        if ($categoryId) {
            // Validate ownership
            $category = $this->categoryRepository->findById($categoryId, $userId);
            if (!$category) throw new Exception('Categoria não encontrada');
        } else {
            // Auto-assign default category
            $categoryId = $this->categoryRepository->getOrCreateDefault($userId, $type);
        }

        $transaction                     = new Transaction();
        $transaction->user_id            = $userId;
        $transaction->category_id        = $categoryId;
        $transaction->type               = $type;
        $transaction->description        = trim($data['description'] ?? '');
        $transaction->amount             = abs((float)$data['amount']);
        $transaction->date               = $data['date'] ?? date('Y-m-d');
        $transaction->notes              = $data['notes'] ?? null;
        $transaction->is_recurring       = (bool)($data['is_recurring'] ?? false);
        $transaction->recurrence_pattern = $data['recurrence_pattern'] ?? null;

        if ($transaction->amount <= 0) {
            throw new Exception('O valor deve ser maior que zero');
        }

        return $this->transactionRepository->create($transaction);
    }

    public function updateTransaction(int $userId, int $transactionId, array $data): void
    {
        $transaction = $this->transactionRepository->findById($transactionId, $userId);
        if (!$transaction) throw new Exception('Transação não encontrada');

        if (isset($data['category_id'])) {
            $category = $this->categoryRepository->findById((int)$data['category_id'], $userId);
            if (!$category) throw new Exception('Categoria não encontrada');
            $transaction->category_id = (int)$data['category_id'];
        }

        if (isset($data['description'])) $transaction->description = trim($data['description']);
        if (isset($data['amount']))      $transaction->amount      = abs((float)$data['amount']);
        if (isset($data['date']))        $transaction->date        = $data['date'];
        if (isset($data['notes']))       $transaction->notes       = $data['notes'];
        if (isset($data['type']))        $transaction->type        = $data['type'];

        $this->transactionRepository->update($transaction);
    }

    public function deleteTransaction(int $userId, int $transactionId): void
    {
        if (!$this->transactionRepository->delete($transactionId, $userId)) {
            throw new Exception('Transação não encontrada');
        }
    }
}
