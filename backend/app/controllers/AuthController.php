<?php

namespace App\Controllers;

use App\Services\AuthService;
use Exception;

class AuthController
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function register(): void
    {
        try {
            $input = file_get_contents('php://input');
            $input = trim($input, "'");
            $data = json_decode($input, true);

            if (!$data || !isset($data['email'], $data['password'], $data['full_name'])) {
                \Response::error('Campos obrigatÃ³rios: email, password, full_name', 400);
                return;
            }

            $user  = $this->authService->register($data['email'], $data['password'], $data['full_name']);
            $token = \JWT::encode(['user_id' => $user->id, 'email' => $user->email, 'role' => $user->role]);

            \Response::success(['user' => $user->toArrayWithoutSensitive(), 'token' => $token], 'Conta criada com sucesso', 201);
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }

    public function login(): void
    {
        try {
            $input = file_get_contents('php://input');
            $input = trim($input, "'");
            $data = json_decode($input, true);

            if (!$data || !isset($data['email'], $data['password'])) {
                \Response::error('Email e senha sÃ£o obrigatÃ³rios', 400);
                return;
            }

            $user  = $this->authService->login($data['email'], $data['password']);
            $token = \JWT::encode(['user_id' => $user->id, 'email' => $user->email, 'role' => $user->role]);

            \Response::success(['user' => $user->toArrayWithoutSensitive(), 'token' => $token], 'Login realizado com sucesso');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 401);
        }
    }

    public function logout(): void
    {
        \Response::success(null, 'Logout realizado com sucesso');
    }

    public function changePassword(): void
    {
        try {
            $payload = $GLOBALS['auth_payload'] ?? null;
            if (!$payload) { \Response::error('NÃ£o autorizado', 401); return; }

            $input = file_get_contents('php://input');
            $input = trim($input, "'");
            $data = json_decode($input, true);
            if (!$data || !isset($data['current_password'], $data['new_password'])) {
                \Response::error('Campos obrigatÃ³rios ausentes', 400);
                return;
            }

            $this->authService->changePassword($payload['user_id'], $data['current_password'], $data['new_password']);
            \Response::success(null, 'Senha alterada com sucesso');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }

    public function updateProfile(): void
    {
        try {
            $payload = $GLOBALS['auth_payload'] ?? null;
            if (!$payload) { \Response::error('NÃ£o autorizado', 401); return; }

            $input = file_get_contents('php://input');
            $input = trim($input, "'");
            $data = json_decode($input, true) ?? [];
            $this->authService->updateProfile($payload['user_id'], $data);
            \Response::success(null, 'Perfil atualizado com sucesso');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }

    public function me(): void
    {
        try {
            $payload = $GLOBALS['auth_payload'] ?? null;
            if (!$payload) { \Response::error('NÃ£o autorizado', 401); return; }

            $user = $this->authService->getUser($payload['user_id']);
            \Response::success($user->toArrayWithoutSensitive(), 'UsuÃ¡rio recuperado');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }

    public function forgotPassword(): void
    {
        try {
            $input = file_get_contents('php://input');
            $input = trim($input, "'");
            $data = json_decode($input, true);

            if (!$data || !isset($data['email'])) {
                \Response::error('Email ÃƒÂ© obrigatÃƒÂ³rio', 400);
                return;
            }

            $result = $this->authService->requestPasswordReset($data['email']);
            \Response::success($result, 'Se o e-mail existir, enviaremos as instruÃƒÂ§ÃƒÂµes para redefiniÃƒÂ§ÃƒÂ£o de senha.');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }

    public function resetPassword(): void
    {
        try {
            $input = file_get_contents('php://input');
            $input = trim($input, "'");
            $data = json_decode($input, true);

            if (!$data || !isset($data['token'], $data['password'])) {
                \Response::error('Token e nova senha sÃƒÂ£o obrigatÃƒÂ³rios', 400);
                return;
            }

            $this->authService->resetPassword($data['token'], $data['password']);
            \Response::success(null, 'Senha redefinida com sucesso');
        } catch (Exception $e) {
            \Response::error($e->getMessage(), 400);
        }
    }
}


