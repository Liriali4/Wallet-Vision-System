<?php

namespace App\Repositories;

use App\Models\Goal;
use App\Utils\Database;

class GoalRepository
{
    private Database $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(int $id, int $userId): ?Goal
    {
        $stmt = $this->db->query(
            'SELECT * FROM goals WHERE id = ? AND user_id = ?',
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

    public function findByUser(int $userId, ?string $status = null): array
    {
        if ($status) {
            $stmt = $this->db->query(
                'SELECT * FROM goals WHERE user_id = ? AND status = ?
                 ORDER BY priority DESC, end_date ASC',
                [$userId, $status]
            );
        } else {
            $stmt = $this->db->query(
                'SELECT * FROM goals WHERE user_id = ?
                 ORDER BY priority DESC, end_date ASC',
                [$userId]
            );
        }

        $result = $stmt->get_result();
        $goals = [];

        while ($row = $result->fetch_assoc()) {
            $goals[] = $this->mapToModel($row);
        }

        $stmt->close();

        return $goals;
    }

    public function create(Goal $goal): int
    {
        $stmt = $this->db->query(
            'INSERT INTO goals (user_id, title, description, target_amount, start_date, 
             end_date, category, color, icon, priority, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
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
            ]
        );

        return $this->db->lastInsertId();
    }

    public function update(Goal $goal): bool
    {
        $stmt = $this->db->query(
            'UPDATE goals SET title = ?, description = ?, target_amount = ?, 
             current_amount = ?, end_date = ?, category = ?, color = ?, icon = ?, 
             priority = ?, status = ?, updated_at = NOW() WHERE id = ?',
            [
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
            ]
        );

        return $this->db->affectedRows() > 0;
    }

    public function delete(int $id, int $userId): bool
    {
        $stmt = $this->db->query(
            'DELETE FROM goals WHERE id = ? AND user_id = ?',
            [$id, $userId]
        );

        return $this->db->affectedRows() > 0;
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
