<?php

namespace App\Repositories;

use App\Models\User;
use Exception;

class UserRepository
{
    private \Database $db;

    public function __construct()
    {
        $this->db = \Database::getInstance();
    }

    public function findById(int $id): ?User
    {
        $stmt   = $this->db->query('SELECT * FROM users WHERE id = ?', [$id]);
        $result = $stmt->get_result();
        $row    = $result->fetch_assoc();
        $stmt->close();
        return $row ? $this->map($row) : null;
    }

    public function findByEmail(string $email): ?User
    {
        $stmt   = $this->db->query('SELECT * FROM users WHERE email = ?', [$email]);
        $result = $stmt->get_result();
        $row    = $result->fetch_assoc();
        $stmt->close();
        return $row ? $this->map($row) : null;
    }

    public function findAll(int $page = 1, int $perPage = 20): array
    {
        $offset = ($page - 1) * $perPage;
        $stmt   = $this->db->query('SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?', [$perPage, $offset]);
        $result = $stmt->get_result();
        $out    = [];
        while ($row = $result->fetch_assoc()) $out[] = $this->map($row);
        $stmt->close();
        return $out;
    }

    public function getTotalCount(): int
    {
        $stmt   = $this->db->query('SELECT COUNT(*) as total FROM users', []);
        $result = $stmt->get_result();
        $row    = $result->fetch_assoc();
        $stmt->close();
        return (int)$row['total'];
    }

    public function getActiveCount(): int
    {
        $stmt   = $this->db->query('SELECT COUNT(*) as total FROM users WHERE is_active = 1', []);
        $result = $stmt->get_result();
        $row    = $result->fetch_assoc();
        $stmt->close();
        return (int)$row['total'];
    }

    public function create(User $user): int
    {
        $this->db->query(
            'INSERT INTO users (email, password, full_name, phone, locale, theme, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [$user->email, $user->password, $user->full_name, $user->phone, $user->locale, $user->theme, $user->role]
        );
        return $this->db->lastInsertId();
    }

    public function update(User $user): void
    {
        $this->db->query(
            'UPDATE users SET full_name=?, phone=?, locale=?, theme=?, updated_at=NOW() WHERE id=?',
            [$user->full_name, $user->phone, $user->locale, $user->theme, $user->id]
        );
    }

    public function updatePassword(int $userId, string $hash): void
    {
        $this->db->query('UPDATE users SET password=?, updated_at=NOW() WHERE id=?', [$hash, $userId]);
    }

    public function updateLastLogin(int $userId): void
    {
        $this->db->query('UPDATE users SET last_login=NOW() WHERE id=?', [$userId]);
    }

    public function deactivate(int $userId): void
    {
        $this->db->query('UPDATE users SET is_active=0, updated_at=NOW() WHERE id=?', [$userId]);
    }

    public function activate(int $userId): void
    {
        $this->db->query('UPDATE users SET is_active=1, updated_at=NOW() WHERE id=?', [$userId]);
    }

    public function delete(int $userId): void
    {
        $this->db->query('DELETE FROM users WHERE id=?', [$userId]);
    }

    private function map(array $row): User
    {
        $u                = new User();
        $u->id            = (int)$row['id'];
        $u->email         = $row['email'];
        $u->password      = $row['password'];
        $u->full_name     = $row['full_name'];
        $u->profile_image = $row['profile_image'] ?? null;
        $u->phone         = $row['phone'] ?? null;
        $u->locale        = $row['locale'] ?? 'pt';
        $u->theme         = $row['theme']  ?? 'light';
        $u->is_active     = (bool)$row['is_active'];
        $u->role          = $row['role'] ?? 'user';
        $u->last_login    = $row['last_login'] ?? null;
        $u->created_at    = $row['created_at'] ?? null;
        $u->updated_at    = $row['updated_at'] ?? null;
        return $u;
    }
}
