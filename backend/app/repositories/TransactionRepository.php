<?php

namespace App\Repositories;

use App\Models\Transaction;
use App\Utils\Database;

class TransactionRepository
{
    private Database $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(int $id, int $userId): ?Transaction
    {
        $stmt = $this->db->query(
            'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
            [$id, $userId]
        );

        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();

        if (!$row) {
            return null;
        }

        return $this->mapToModel($row);
    }

    public function findByUser(int $userId, int $page = 1, int $perPage = 20, ?string $type = null): array
    {
        $offset = ($page - 1) * $perPage;

        if ($type) {
            $stmt = $this->db->query(
                'SELECT t.*, c.name as category_name FROM transactions t 
                 LEFT JOIN categories c ON t.category_id = c.id
                 WHERE t.user_id = ? AND t.type = ?
                 ORDER BY t.date DESC LIMIT ? OFFSET ?',
                [$userId, $type, $perPage, $offset]
            );
        } else {
            $stmt = $this->db->query(
                'SELECT t.*, c.name as category_name FROM transactions t 
                 LEFT JOIN categories c ON t.category_id = c.id
                 WHERE t.user_id = ?
                 ORDER BY t.date DESC LIMIT ? OFFSET ?',
                [$userId, $perPage, $offset]
            );
        }

        $result = $stmt->get_result();
        $transactions = [];

        while ($row = $result->fetch_assoc()) {
            $transactions[] = $this->mapToModel($row);
        }

        $stmt->close();

        return $transactions;
    }

    public function findByMonth(int $userId, int $month, int $year, ?string $type = null): array
    {
        if ($type) {
            $stmt = $this->db->query(
                'SELECT t.*, c.name as category_name FROM transactions t 
                 LEFT JOIN categories c ON t.category_id = c.id
                 WHERE t.user_id = ? AND t.month = ? AND t.year = ? AND t.type = ?
                 ORDER BY t.date DESC',
                [$userId, $month, $year, $type]
            );
        } else {
            $stmt = $this->db->query(
                'SELECT t.*, c.name as category_name FROM transactions t 
                 LEFT JOIN categories c ON t.category_id = c.id
                 WHERE t.user_id = ? AND t.month = ? AND t.year = ?
                 ORDER BY t.date DESC',
                [$userId, $month, $year]
            );
        }

        $result = $stmt->get_result();
        $transactions = [];

        while ($row = $result->fetch_assoc()) {
            $transactions[] = $this->mapToModel($row);
        }

        $stmt->close();

        return $transactions;
    }

    public function getMonthlyStats(int $userId, int $month, int $year): array
    {
        $stmt = $this->db->query(
            'SELECT type, SUM(amount) as total FROM transactions 
             WHERE user_id = ? AND month = ? AND year = ?
             GROUP BY type',
            [$userId, $month, $year]
        );

        $result = $stmt->get_result();
        $stats = ['income' => 0, 'expense' => 0];

        while ($row = $result->fetch_assoc()) {
            $stats[$row['type']] = (float) $row['total'];
        }

        $stmt->close();

        return $stats;
    }

    public function create(Transaction $transaction): int
    {
        $month = date('n', strtotime($transaction->date));
        $year = date('Y', strtotime($transaction->date));

        $stmt = $this->db->query(
            'INSERT INTO transactions (user_id, category_id, type, description, amount, 
             date, month, year, notes, is_recurring, recurrence_pattern) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $transaction->user_id,
                $transaction->category_id,
                $transaction->type,
                $transaction->description,
                $transaction->amount,
                $transaction->date,
                $month,
                $year,
                $transaction->notes,
                $transaction->is_recurring ? 1 : 0,
                $transaction->recurrence_pattern
            ]
        );

        return $this->db->lastInsertId();
    }

    public function update(Transaction $transaction): bool
    {
        $month = date('n', strtotime($transaction->date));
        $year = date('Y', strtotime($transaction->date));

        $stmt = $this->db->query(
            'UPDATE transactions SET category_id = ?, description = ?, amount = ?, 
             date = ?, month = ?, year = ?, notes = ?, is_recurring = ?, 
             recurrence_pattern = ?, updated_at = NOW() WHERE id = ?',
            [
                $transaction->category_id,
                $transaction->description,
                $transaction->amount,
                $transaction->date,
                $month,
                $year,
                $transaction->notes,
                $transaction->is_recurring ? 1 : 0,
                $transaction->recurrence_pattern,
                $transaction->id
            ]
        );

        return $this->db->affectedRows() > 0;
    }

    public function delete(int $id, int $userId): bool
    {
        $stmt = $this->db->query(
            'DELETE FROM transactions WHERE id = ? AND user_id = ?',
            [$id, $userId]
        );

        return $this->db->affectedRows() > 0;
    }

    public function getTotalCount(int $userId): int
    {
        $stmt = $this->db->query(
            'SELECT COUNT(*) as total FROM transactions WHERE user_id = ?',
            [$userId]
        );

        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();

        return (int) $row['total'];
    }

    private function mapToModel(array $row): Transaction
    {
        $transaction = new Transaction();
        $transaction->id = (int) $row['id'];
        $transaction->user_id = (int) $row['user_id'];
        $transaction->category_id = (int) $row['category_id'];
        $transaction->category_name = $row['category_name'] ?? null;
        $transaction->type = $row['type'];
        $transaction->description = $row['description'];
        $transaction->amount = (float) $row['amount'];
        $transaction->date = $row['date'];
        $transaction->month = (int) $row['month'];
        $transaction->year = (int) $row['year'];
        $transaction->notes = $row['notes'];
        $transaction->is_recurring = (bool) $row['is_recurring'];
        $transaction->recurrence_pattern = $row['recurrence_pattern'];
        $transaction->created_at = $row['created_at'];
        $transaction->updated_at = $row['updated_at'];

        return $transaction;
    }
}
