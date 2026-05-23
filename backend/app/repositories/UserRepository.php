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
        $this->ensurePasswordResetTable();
    }

    public function findById(int $id): ?User
    {
        $stmt = $this->db->query('SELECT * FROM users WHERE id = ?', [$id]);
        $row = $stmt->fetch();
        return $row ? $this->map($row) : null;
    }

    public function findByEmail(string $email): ?User
    {
        $stmt = $this->db->query('SELECT * FROM users WHERE email = ?', [$email]);
        $row = $stmt->fetch();
        return $row ? $this->map($row) : null;
    }

    public function findAll(int $page = 1, int $perPage = 20): array
    {
        $offset = ($page - 1) * $perPage;
        $stmt = $this->db->query('SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?', [$perPage, $offset]);
        $out = [];
        while ($row = $stmt->fetch()) $out[] = $this->map($row);
        return $out;
    }

    public function getTotalCount(): int
    {
        $stmt = $this->db->query('SELECT COUNT(*) as total FROM users', []);
        $row = $stmt->fetch();
        return (int)$row['total'];
    }

    public function getActiveCount(): int
    {
        $stmt = $this->db->query('SELECT COUNT(*) as total FROM users WHERE is_active = 1', []);
        $row = $stmt->fetch();
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
            'UPDATE users SET full_name=?, phone=?, locale=?, theme=?, updated_at=CURRENT_TIMESTAMP WHERE id=?',
            [$user->full_name, $user->phone, $user->locale, $user->theme, $user->id]
        );
    }

    public function updatePassword(int $userId, string $hash): void
    {
        $this->db->query('UPDATE users SET password=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', [$hash, $userId]);
    }

    public function updateLastLogin(int $userId): void
    {
        $this->db->query('UPDATE users SET last_login=CURRENT_TIMESTAMP WHERE id=?', [$userId]);
    }

    public function deactivate(int $userId): void
    {
        $this->db->query('UPDATE users SET is_active=0, updated_at=CURRENT_TIMESTAMP WHERE id=?', [$userId]);
    }

    public function activate(int $userId): void
    {
        $this->db->query('UPDATE users SET is_active=1, updated_at=CURRENT_TIMESTAMP WHERE id=?', [$userId]);
    }

    public function delete(int $userId): void
    {
        $this->db->query('DELETE FROM users WHERE id=?', [$userId]);
    }

    public function updateRole(int $userId, string $role): void
    {
        if (!in_array($role, ['user', 'admin'])) {
            throw new Exception('Role inválida. Use "user" ou "admin".');
        }
        $this->db->query('UPDATE users SET role=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', [$role, $userId]);
    }

    public function createPasswordResetToken(int $userId, string $email, string $tokenHash, string $expiresAt): void
    {
        $this->db->query('DELETE FROM password_resets WHERE user_id = ? OR email = ?', [$userId, $email]);
        $this->db->query(
            'INSERT INTO password_resets (user_id, email, token_hash, expires_at) VALUES (?, ?, ?, ?)',
            [$userId, $email, $tokenHash, $expiresAt]
        );
    }

    public function findPasswordResetByHash(string $tokenHash): ?array
    {
        $stmt = $this->db->query(
            'SELECT * FROM password_resets WHERE token_hash = ? AND used_at IS NULL AND expires_at > CURRENT_TIMESTAMP LIMIT 1',
            [$tokenHash]
        );
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function markPasswordResetAsUsed(int $resetId): void
    {
        $this->db->query('UPDATE password_resets SET used_at = CURRENT_TIMESTAMP WHERE id = ?', [$resetId]);
    }

    private function ensurePasswordResetTable(): void
    {
        $driver = \Database::getConnection()->getAttribute(\PDO::ATTR_DRIVER_NAME);
        if ($driver === 'sqlite') {
            $this->db->query(
                'CREATE TABLE IF NOT EXISTS password_resets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    email TEXT NOT NULL,
                    token_hash TEXT NOT NULL UNIQUE,
                    expires_at TIMESTAMP NOT NULL,
                    used_at TIMESTAMP NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )'
            );
        } else {
            $this->db->query(
                'CREATE TABLE IF NOT EXISTS password_resets (
                    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                    user_id INT UNSIGNED NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    token_hash VARCHAR(255) NOT NULL UNIQUE,
                    expires_at TIMESTAMP NOT NULL,
                    used_at TIMESTAMP NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_password_resets_email (email),
                    INDEX idx_password_resets_expires (expires_at),
                    CONSTRAINT fk_password_resets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
            );
        }
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
