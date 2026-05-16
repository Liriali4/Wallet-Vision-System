<?php

namespace App\Models;

class Transaction
{
    public ?int $id = null;
    public ?int $user_id = null;
    public ?int $category_id = null;
    public ?string $category_name = null;
    public string $type = 'expense'; // income or expense
    public ?string $description = null;
    public float $amount = 0;
    public ?string $date = null;
    public ?int $month = null;
    public ?int $year = null;
    public ?string $notes = null;
    public ?string $attachment_url = null;
    public bool $is_recurring = false;
    public ?string $recurrence_pattern = null;
    public ?string $created_at = null;
    public ?string $updated_at = null;

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'category_id' => $this->category_id,
            'category_name' => $this->category_name,
            'type' => $this->type,
            'description' => $this->description,
            'amount' => (float) $this->amount,
            'date' => $this->date,
            'month' => $this->month,
            'year' => $this->year,
            'notes' => $this->notes,
            'attachment_url' => $this->attachment_url,
            'is_recurring' => $this->is_recurring,
            'recurrence_pattern' => $this->recurrence_pattern,
            'created_at' => $this->created_at,
        ];
    }
}
