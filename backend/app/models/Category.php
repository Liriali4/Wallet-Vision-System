<?php

namespace App\Models;

class Category
{
    public ?int $id = null;
    public ?int $user_id = null;
    public ?string $name = null;
    public ?string $description = null;
    public string $color = '#6366f1';
    public string $icon = 'tag';
    public string $type = 'expense'; // income or expense
    public int $order_index = 0;
    public bool $is_active = true;
    public ?string $created_at = null;
    public ?string $updated_at = null;

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'description' => $this->description,
            'color' => $this->color,
            'icon' => $this->icon,
            'type' => $this->type,
            'order_index' => $this->order_index,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
        ];
    }
}
