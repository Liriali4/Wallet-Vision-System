<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Exception;

class AuthService
{
    private UserRepository $userRepository;
    private array $appConfig;

    public function __construct()
    {
        $this->userRepository = new UserRepository();
        $this->appConfig = require __DIR__ . '/../../config/app.php';
    }

    public function register(string $email, string $password, string $fullName): User
    {
        $email    = strtolower(trim($email));
        $fullName = trim($fullName);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Formato de e-mail inválido');
        }

        if (strlen($password) < 8) {
            throw new Exception('A senha deve ter pelo menos 8 caracteres');
        }

        if (strlen($fullName) < 2) {
            throw new Exception('Nome completo obrigatório');
        }

        if ($this->userRepository->findByEmail($email)) {
            throw new Exception('Este e-mail já está cadastrado');
        }

        $user            = new User();
        $user->email     = $email;
        $user->password  = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
        $user->full_name = $fullName;
        $user->locale    = 'pt';
        $user->theme     = 'light';
        $user->role      = 'user';

        $user->id = $this->userRepository->create($user);
        return $user;
    }

    public function login(string $email, string $password): User
    {
        $email = strtolower(trim($email));
        $user  = $this->userRepository->findByEmail($email);

        if (!$user || !password_verify($password, $user->password)) {
            throw new Exception('Credenciais inválidas');
        }

        if (!$user->is_active) {
            throw new Exception('Conta desativada. Entre em contato com o suporte.');
        }

        $this->userRepository->updateLastLogin($user->id);
        return $user;
    }

    public function getUser(int $userId): User
    {
        $user = $this->userRepository->findById($userId);
        if (!$user) throw new Exception('Usuário não encontrado');
        return $user;
    }

    public function changePassword(int $userId, string $currentPassword, string $newPassword): void
    {
        $user = $this->userRepository->findById($userId);
        if (!$user) throw new Exception('Usuário não encontrado');

        if (!password_verify($currentPassword, $user->password)) {
            throw new Exception('Senha atual incorreta');
        }

        if (strlen($newPassword) < 8) {
            throw new Exception('A nova senha deve ter pelo menos 8 caracteres');
        }

        $this->userRepository->updatePassword($userId, password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]));
    }

    public function updateProfile(int $userId, array $data): void
    {
        $user = $this->userRepository->findById($userId);
        if (!$user) throw new Exception('Usuário não encontrado');

        if (isset($data['full_name'])) $user->full_name = trim($data['full_name']);
        if (isset($data['phone']))     $user->phone     = trim($data['phone']);
        if (isset($data['locale']))    $user->locale    = $data['locale'];
        if (isset($data['theme']))     $user->theme     = $data['theme'];

        $this->userRepository->update($user);
    }

    public function requestPasswordReset(string $email): ?array
    {
        $email = strtolower(trim($email));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return null;
        }

        $user = $this->userRepository->findByEmail($email);
        if (!$user) {
            return null;
        }

        $token = rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');
        $tokenHash = hash('sha256', $token);
        $expiresAt = date('Y-m-d H:i:s', time() + 3600);

        $this->userRepository->createPasswordResetToken($user->id, $email, $tokenHash, $expiresAt);
        return $this->sendResetEmail($email, $token);
    }

    public function resetPassword(string $token, string $newPassword): void
    {
        if (strlen($newPassword) < 8) {
            throw new Exception('A nova senha deve ter pelo menos 8 caracteres');
        }

        if (!$token) {
            throw new Exception('Token invÃ¡lido');
        }

        $tokenHash = hash('sha256', $token);
        $reset = $this->userRepository->findPasswordResetByHash($tokenHash);
        if (!$reset) {
            throw new Exception('Token invÃ¡lido ou expirado');
        }

        $hash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
        $this->userRepository->updatePassword((int)$reset['user_id'], $hash);
        $this->userRepository->markPasswordResetAsUsed((int)$reset['id']);
    }

    private function sendResetEmail(string $email, string $token): ?array
    {
        $baseUrl = rtrim($this->appConfig['client_url'] ?? 'http://localhost:4200', '/');
        $resetUrl = "{$baseUrl}/auth/reset-password?token={$token}";

        $html = "
            <h2>RedefiniÃ§Ã£o de senha - Wallet Vision</h2>
            <p>Recebemos um pedido para redefinir a sua senha.</p>
            <p><a href=\"{$resetUrl}\">Clique aqui para redefinir a senha</a></p>
            <p>Este link expira em 1 hora.</p>
            <p>Se vocÃª nÃ£o solicitou esta alteraÃ§Ã£o, ignore este e-mail.</p>
        ";

        try {
            $mailer = new SmtpMailer($this->appConfig['smtp'] ?? []);
            $mailer->send($email, 'Redefinir senha - Wallet Vision', $html);
            return null;
        } catch (Exception $e) {
            $isDev = ($this->appConfig['env'] ?? 'development') !== 'production';
            if (!$isDev) {
                throw $e;
            }

            $logFile = __DIR__ . '/../../password-reset-links.log';
            $line = sprintf(
                "[%s] email=%s reset_url=%s error=%s\n",
                date('Y-m-d H:i:s'),
                $email,
                $resetUrl,
                $e->getMessage()
            );
            file_put_contents($logFile, $line, FILE_APPEND);

            return [
                'reset_url' => $resetUrl,
                'email_delivery' => 'fallback_log'
            ];
        }
    }
}
