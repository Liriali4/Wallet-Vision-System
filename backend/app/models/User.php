<?php

namespace App\Models;

class User
{
    public ?int $id = null;
    public ?string $email = null;
    public ?string $password = null;
    public ?string $full_name = null;
    public ?string $profile_image = null;
    public ?string $phone = null;
    public string $locale = 'pt';
    public string $theme = 'dark';
    public bool $is_active = true;
    public string $role = 'user';
    public ?string $last_login = null;
    public ?string $created_at = null;
    public ?string $updated_at = null;

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'full_name' => $this->full_name,
            'profile_image' => $this->profile_image,
            'phone' => $this->phone,
            'locale' => $this->locale,
            'theme' => $this->theme,
            'role' => $this->role,
            'is_active' => $this->is_active,
            'last_login' => $this->last_login,
            'created_at' => $this->created_at,
        ];
    }

    public function toArrayWithoutSensitive(): array
    {
        $array = $this->toArray();
        unset($array['password']);
        return $array;
    }
}
