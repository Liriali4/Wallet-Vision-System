<?php

namespace App\Services;

use App\Models\Goal;
use App\Repositories\GoalRepository;
use Exception;

class GoalService
{
    private GoalRepository $goalRepository;

    public function __construct()
    {
        $this->goalRepository = new GoalRepository();
    }

    public function getGoals(int $userId, ?string $status = null): array
    {
        if ($status) {
            $goals = $this->goalRepository->findByUser($userId, $status);
        } else {
            $goals = $this->goalRepository->findByUser($userId);
        }

        return array_map(fn($g) => $g->toArray(), $goals);
    }

    public function getGoal(int $userId, int $goalId): array
    {
        $goal = $this->goalRepository->findById($goalId, $userId);

        if (!$goal) {
            throw new Exception('Goal not found');
        }

        return $goal->toArray();
    }

    public function createGoal(int $userId, array $data): int
    {
        $goal = new Goal();
        $goal->user_id = $userId;
        $goal->title = $data['title'];
        $goal->description = $data['description'] ?? '';
        $goal->target_amount = (float) $data['target_amount'];
        $goal->start_date = $data['start_date'] ?? date('Y-m-d');
        $goal->end_date = $data['end_date'];
        $goal->category = $data['category'] ?? '';
        $goal->color = $data['color'] ?? '#8b5cf6';
        $goal->icon = $data['icon'] ?? 'target';
        $goal->priority = $data['priority'] ?? 'medium';
        $goal->status = $data['status'] ?? 'not_started';

        return $this->goalRepository->create($goal);
    }

    public function updateGoal(int $userId, int $goalId, array $data): bool
    {
        $goal = $this->goalRepository->findById($goalId, $userId);

        if (!$goal) {
            throw new Exception('Goal not found');
        }

        if (isset($data['title'])) {
            $goal->title = $data['title'];
        }

        if (isset($data['description'])) {
            $goal->description = $data['description'];
        }

        if (isset($data['target_amount'])) {
            $goal->target_amount = (float) $data['target_amount'];
        }

        if (isset($data['current_amount'])) {
            $goal->current_amount = (float) $data['current_amount'];
        }

        if (isset($data['end_date'])) {
            $goal->end_date = $data['end_date'];
        }

        if (isset($data['priority'])) {
            $goal->priority = $data['priority'];
        }

        if (isset($data['status'])) {
            $goal->status = $data['status'];
        }

        if (isset($data['color'])) {
            $goal->color = $data['color'];
        }

        if (isset($data['icon'])) {
            $goal->icon = $data['icon'];
        }

        return $this->goalRepository->update($goal);
    }

    public function deleteGoal(int $userId, int $goalId): bool
    {
        return $this->goalRepository->delete($goalId, $userId);
    }
}
