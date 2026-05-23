<?php

namespace App\Repositories;

use App\Models\Transaction;
use App\Database;

class TransactionRepository
{
    private \PDO $pdo;

    public function __construct()
    {
        $this->pdo = Database::getInstance();
    }

    public function findById(int $id, int $userId): ?Transaction
    {
        $stmt = $this->pdo->prepare(
            'SELECT * FROM transactions WHERE id = ? AND user_id = ?'
        );
        $stmt->execute([$id, $userId]);
        $row = $stmt->fetch();
        
        if (!$row) {
            return null;
        }

        return $this->mapToModel($row);
    }

    public function findByUser(int $userId, int $page = 1, int $perPage = 20, ?string $type = null): array
    {
        $offset = ($page - 1) * $perPage;

        if ($type) {
            $sql = 'SELECT t.*, c.name as category_name FROM transactions t 
                    LEFT JOIN categories c ON t.category_id = c.id
                    WHERE t.user_id = ? AND t.type = ?
                    ORDER BY t.date DESC LIMIT ? OFFSET ?';
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$userId, $type, $perPage, $offset]);
        } else {
            $sql = 'SELECT t.*, c.name as category_name FROM transactions t 
                    LEFT JOIN categories c ON t.category_id = c.id
                    WHERE t.user_id = ?
                    ORDER BY t.date DESC LIMIT ? OFFSET ?';
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$userId, $perPage, $offset]);
        }

        $rows = $stmt->fetchAll();
        return array_map([$this, 'mapToModel'], $rows);
    }

    public function getTotalCount(int $userId, ?string $type = null): int
    {
        if ($type) {
            $stmt = $this->pdo->prepare('SELECT COUNT(*) as total FROM transactions WHERE user_id = ? AND type = ?');
            $stmt->execute([$userId, $type]);
        } else {
            $stmt = $this->pdo->prepare('SELECT COUNT(*) as total FROM transactions WHERE user_id = ?');
            $stmt->execute([$userId]);
        }
        
        $row = $stmt->fetch();
        return (int)$row['total'];
    }

    public function getMonthlyTransactions(int $userId, int $month, int $year, ?string $type = null): array
    {
        if ($type) {
            $sql = 'SELECT t.*, c.name as category_name FROM transactions t 
                    LEFT JOIN categories c ON t.category_id = c.id
                    WHERE t.user_id = ? AND t.month = ? AND t.year = ? AND t.type = ?
                    ORDER BY t.date DESC';
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$userId, $month, $year, $type]);
        } else {
            $sql = 'SELECT t.*, c.name as category_name FROM transactions t 
                    LEFT JOIN categories c ON t.category_id = c.id
                    WHERE t.user_id = ? AND t.month = ? AND t.year = ?
                    ORDER BY t.date DESC';
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$userId, $month, $year]);
        }

        $rows = $stmt->fetchAll();
        return array_map([$this, 'mapToModel'], $rows);
    }

    public function getBalance(int $userId, ?int $month = null, ?int $year = null): array
    {
        if ($month && $year) {
            $sql = 'SELECT 
                        COALESCE(SUM(CASE WHEN type = "income" THEN amount ELSE 0 END), 0) as income,
                        COALESCE(SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END), 0) as expense,
                        COALESCE(SUM(CASE WHEN type = "income" THEN amount ELSE -amount END), 0) as balance
                    FROM transactions 
                    WHERE user_id = ? AND month = ? AND year = ?';
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$userId, $month, $year]);
        } else {
            $sql = 'SELECT 
                        COALESCE(SUM(CASE WHEN type = "income" THEN amount ELSE 0 END), 0) as income,
                        COALESCE(SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END), 0) as expense,
                        COALESCE(SUM(CASE WHEN type = "income" THEN amount ELSE -amount END), 0) as balance
                    FROM transactions 
                    WHERE user_id = ?';
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$userId]);
        }

        $row = $stmt->fetch();
        return [
            'income' => (float)($row['income'] ?? 0),
            'expense' => (float)($row['expense'] ?? 0),
            'balance' => (float)($row['balance'] ?? 0)
        ];
    }

    public function create(Transaction $transaction): int
    {
        $sql = 'INSERT INTO transactions 
                (user_id, category_id, type, description, amount, date, month, year, notes, attachment_url, is_recurring, recurrence_pattern) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $transaction->user_id,
            $transaction->category_id,
            $transaction->type,
            $transaction->description,
            $transaction->amount,
            $transaction->date,
            $transaction->month,
            $transaction->year,
            $transaction->notes,
            $transaction->attachment_url,
            $transaction->is_recurring ? 1 : 0,
            $transaction->recurrence_pattern
        ]);

        return (int)$this->pdo->lastInsertId();
    }

    public function update(Transaction $transaction): void
    {
        $sql = 'UPDATE transactions 
                SET category_id = ?, type = ?, description = ?, amount = ?, date = ?, month = ?, year = ?, 
                    notes = ?, attachment_url = ?, is_recurring = ?, recurrence_pattern = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ? AND user_id = ?';
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $transaction->category_id,
            $transaction->type,
            $transaction->description,
            $transaction->amount,
            $transaction->date,
            $transaction->month,
            $transaction->year,
            $transaction->notes,
            $transaction->attachment_url,
            $transaction->is_recurring ? 1 : 0,
            $transaction->recurrence_pattern,
            $transaction->id,
            $transaction->user_id
        ]);
    }

    public function delete(int $id, int $userId): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
    }

    private function mapToModel(array $row): Transaction
    {
        $t                 = new Transaction();
        $t->id             = (int)$row['id'];
        $t->user_id        = (int)$row['user_id'];
        $t->category_id    = (int)$row['category_id'];
        $t->category_name  = $row['category_name'] ?? null;
        $t->type           = $row['type'];
        $t->description    = $row['description'];
        $t->amount         = (float)$row['amount'];
        $t->date           = $row['date'];
        $t->month          = (int)$row['month'];
        $t->year           = (int)$row['year'];
        $t->notes          = $row['notes'] ?? null;
        $t->attachment_url = $row['attachment_url'] ?? null;
        $t->is_recurring   = (bool)$row['is_recurring'];
        $t->recurrence_pattern = $row['recurrence_pattern'] ?? null;
        $t->created_at     = $row['created_at'] ?? null;
        $t->updated_at     = $row['updated_at'] ?? null;
        return $t;
    }
}
