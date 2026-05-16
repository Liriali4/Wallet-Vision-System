<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Exception;

class AuthService
{
    private UserRepository $userRepository;

    public function __construct()
    {
        $this->userRepository = new UserRepository();
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
}
