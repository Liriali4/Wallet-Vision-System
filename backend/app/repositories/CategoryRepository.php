<?php

namespace App\Repositories;

use App\Models\Category;
use App\Database;

class CategoryRepository
{
    private \PDO $pdo;

    public function __construct()
    {
        $this->pdo = Database::getInstance();
    }

    public function findById(int $id, int $userId): ?Category
    {
        $stmt = $this->pdo->prepare('SELECT * FROM categories WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        $row = $stmt->fetch();
        return $row ? $this->map($row) : null;
    }

    public function findAll(int $userId): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM categories WHERE user_id = ? ORDER BY type ASC, order_index ASC, name ASC');
        $stmt->execute([$userId]);
        $rows = $stmt->fetchAll();
        return array_map([$this, 'map'], $rows);
    }

    public function findByUser(int $userId, ?string $type = null): array
    {
        if ($type) {
            $sql = 'SELECT * FROM categories WHERE user_id = ? AND type = ? AND is_active = 1 ORDER BY order_index ASC, name ASC';
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$userId, $type]);
        } else {
            $sql = 'SELECT * FROM categories WHERE user_id = ? AND is_active = 1 ORDER BY type ASC, order_index ASC, name ASC';
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$userId]);
        }
        
        $rows = $stmt->fetchAll();
        return array_map([$this, 'map'], $rows);
    }

    public function create(Category $c): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO categories (user_id, name, description, type, color, icon) VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $c->user_id,
            $c->name,
            $c->description ?? '',
            $c->type,
            $c->color,
            $c->icon
        ]);
        return (int)$this->pdo->lastInsertId();
    }

    public function update(Category $c): bool
    {
        $stmt = $this->pdo->prepare(
            'UPDATE categories SET name=?, description=?, color=?, icon=?, order_index=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
        );
        $stmt->execute([
            $c->name,
            $c->description ?? '',
            $c->color,
            $c->icon,
            $c->order_index,
            $c->id
        ]);
        return $stmt->rowCount() > 0;
    }

    public function delete(int $id, int $userId): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM categories WHERE id=? AND user_id=?');
        $stmt->execute([$id, $userId]);
        return $stmt->rowCount() > 0;
    }

    /**
     * Get or create a default "Outros" category for the given user and type.
     */
    public function getOrCreateDefault(int $userId, string $type): int
    {
        $name = $type === 'income' ? 'Outros (Receita)' : 'Outros (Despesa)';

        $stmt = $this->pdo->prepare('SELECT id FROM categories WHERE user_id=? AND name=? AND type=?');
        $stmt->execute([$userId, $name, $type]);
        $row = $stmt->fetch();

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
