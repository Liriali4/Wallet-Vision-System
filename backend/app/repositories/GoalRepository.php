<?php

namespace App\Repositories;

use App\Models\Goal;
use App\Database;

class GoalRepository
{
    private \PDO $pdo;

    public function __construct()
    {
        $this->pdo = Database::getInstance();
    }

    public function findById(int $id, int $userId): ?Goal
    {
        $stmt = $this->pdo->prepare('SELECT * FROM goals WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        $row = $stmt->fetch();
        
        if (!$row) {
            return null;
        }

        return $this->mapToModel($row);
    }

    public function findByUser(int $userId, ?string $status = null): array
    {
        if ($status) {
            $sql = 'SELECT * FROM goals WHERE user_id = ? AND status = ?
                    ORDER BY priority DESC, end_date ASC';
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$userId, $status]);
        } else {
            $sql = 'SELECT * FROM goals WHERE user_id = ?
                    ORDER BY priority DESC, end_date ASC';
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$userId]);
        }

        $rows = $stmt->fetchAll();
        return array_map([$this, 'mapToModel'], $rows);
    }

    public function create(Goal $goal): int
    {
        $sql = 'INSERT INTO goals (user_id, title, description, target_amount, start_date, 
                end_date, category, color, icon, priority, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $goal->user_id,
            $goal->title,
            $goal->description,
            $goal->target_amount,
            $goal->start_date,
            $goal->end_date,
            $goal->category,
            $goal->color,
            $goal->icon,
            $goal->priority,
            $goal->status
        ]);

        return (int)$this->pdo->lastInsertId();
    }

    public function update(Goal $goal): bool
    {
        $sql = 'UPDATE goals SET title = ?, description = ?, target_amount = ?, 
                current_amount = ?, end_date = ?, category = ?, color = ?, icon = ?, 
                priority = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $goal->title,
            $goal->description,
            $goal->target_amount,
            $goal->current_amount,
            $goal->end_date,
            $goal->category,
            $goal->color,
            $goal->icon,
            $goal->priority,
            $goal->status,
            $goal->id
        ]);

        return $stmt->rowCount() > 0;
    }

    public function delete(int $id, int $userId): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM goals WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        return $stmt->rowCount() > 0;
    }

    private function mapToModel(array $row): Goal
    {
        $goal = new Goal();
        $goal->id = (int) $row['id'];
        $goal->user_id = (int) $row['user_id'];
        $goal->title = $row['title'];
        $goal->description = $row['description'];
        $goal->target_amount = (float) $row['target_amount'];
        $goal->current_amount = (float) $row['current_amount'];
        $goal->start_date = $row['start_date'];
        $goal->end_date = $row['end_date'];
        $goal->category = $row['category'];
        $goal->color = $row['color'];
        $goal->icon = $row['icon'];
        $goal->priority = $row['priority'];
        $goal->status = $row['status'];
        $goal->created_at = $row['created_at'];
        $goal->updated_at = $row['updated_at'];

        return $goal;
    }
}
