<?php

namespace App\Models;

class Goal
{
    public ?int $id = null;
    public ?int $user_id = null;
    public ?string $title = null;
    public ?string $description = null;
    public float $target_amount = 0;
    public float $current_amount = 0;
    public ?string $start_date = null;
    public ?string $end_date = null;
    public ?string $category = null;
    public string $color = '#8b5cf6';
    public string $icon = 'target';
    public string $priority = 'medium'; // low, medium, high
    public string $status = 'not_started'; // not_started, in_progress, completed, paused
    public ?string $created_at = null;
    public ?string $updated_at = null;

    public function getProgress(): float
    {
        if ($this->target_amount === 0) {
            return 0;
        }
        return min(100, ($this->current_amount / $this->target_amount) * 100);
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'target_amount' => (float) $this->target_amount,
            'current_amount' => (float) $this->current_amount,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'category' => $this->category,
            'color' => $this->color,
            'icon' => $this->icon,
            'priority' => $this->priority,
            'status' => $this->status,
            'progress' => $this->getProgress(),
            'created_at' => $this->created_at,
        ];
    }
}
