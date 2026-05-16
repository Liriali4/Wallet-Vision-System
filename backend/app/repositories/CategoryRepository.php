<?php

namespace App\Repositories;

use App\Models\Category;
use Exception;

class CategoryRepository
{
    private \Database $db;

    public function __construct()
    {
        $this->db = \Database::getInstance();
    }

    public function findById(int $id, int $userId): ?Category
    {
        $stmt  = $this->db->query('SELECT * FROM categories WHERE id = ? AND user_id = ?', [$id, $userId]);
        $result = $stmt->get_result();
        $row   = $result->fetch_assoc();
        $stmt->close();
        return $row ? $this->map($row) : null;
    }

    public function findAll(int $userId): array
    {
        $stmt   = $this->db->query('SELECT * FROM categories WHERE user_id = ? ORDER BY type ASC, order_index ASC, name ASC', [$userId]);
        $result = $stmt->get_result();
        $out    = [];
        while ($row = $result->fetch_assoc()) $out[] = $this->map($row);
        $stmt->close();
        return $out;
    }

    public function findByUser(int $userId, ?string $type = null): array
    {
        if ($type) {
            $stmt = $this->db->query(
                'SELECT * FROM categories WHERE user_id = ? AND type = ? AND is_active = 1 ORDER BY order_index ASC, name ASC',
                [$userId, $type]
            );
        } else {
            $stmt = $this->db->query(
                'SELECT * FROM categories WHERE user_id = ? AND is_active = 1 ORDER BY type ASC, order_index ASC, name ASC',
                [$userId]
            );
        }
        $result = $stmt->get_result();
        $out    = [];
        while ($row = $result->fetch_assoc()) $out[] = $this->map($row);
        $stmt->close();
        return $out;
    }

    public function create(Category $c): int
    {
        $this->db->query(
            'INSERT INTO categories (user_id, name, description, type, color, icon) VALUES (?, ?, ?, ?, ?, ?)',
            [$c->user_id, $c->name, $c->description ?? '', $c->type, $c->color, $c->icon]
        );
        return $this->db->lastInsertId();
    }

    public function update(Category $c): bool
    {
        $this->db->query(
            'UPDATE categories SET name=?, description=?, color=?, icon=?, order_index=?, updated_at=NOW() WHERE id=?',
            [$c->name, $c->description ?? '', $c->color, $c->icon, $c->order_index, $c->id]
        );
        return $this->db->affectedRows() >= 0;
    }

    public function delete(int $id, int $userId): bool
    {
        $this->db->query('DELETE FROM categories WHERE id=? AND user_id=?', [$id, $userId]);
        return $this->db->affectedRows() > 0;
    }

    /**
     * Get or create a default "Outros" category for the given user and type.
     */
    public function getOrCreateDefault(int $userId, string $type): int
    {
        $name = $type === 'income' ? 'Outros (Receita)' : 'Outros (Despesa)';

        $stmt   = $this->db->query('SELECT id FROM categories WHERE user_id=? AND name=? AND type=?', [$userId, $name, $type]);
        $result = $stmt->get_result();
        $row    = $result->fetch_assoc();
        $stmt->close();

        if ($row) return (int)$row['id'];

        $c              = new Category();
        $c->user_id     = $userId;
        $c->name        = $name;
        $c->description = 'Categoria padrão';
        $c->type        = $type;
        $c->color       = $type === 'income' ? '#A3B19B' : '#D98A74';
        $c->icon        = 'tag';

        return $this->create($c);
    }

    private function map(array $row): Category
    {
        $c              = new Category();
        $c->id          = (int)$row['id'];
        $c->user_id     = (int)$row['user_id'];
        $c->name        = $row['name'];
        $c->description = $row['description'];
        $c->color       = $row['color'];
        $c->icon        = $row['icon'];
        $c->type        = $row['type'];
        $c->order_index = (int)$row['order_index'];
        $c->is_active   = (bool)$row['is_active'];
        $c->created_at  = $row['created_at'];
        $c->updated_at  = $row['updated_at'];
        return $c;
    }
}
