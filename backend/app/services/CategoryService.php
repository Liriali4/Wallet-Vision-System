<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\CategoryRepository;
use Exception;

class CategoryService
{
    private CategoryRepository $categoryRepository;

    public function __construct()
    {
        $this->categoryRepository = new CategoryRepository();
    }

    public function getCategories(int $userId, ?string $type = null): array
    {
        if ($type) {
            $categories = $this->categoryRepository->findByUser($userId, $type);
        } else {
            $categories = $this->categoryRepository->findAll($userId);
        }

        return array_map(fn($c) => $c->toArray(), $categories);
    }

    public function getCategory(int $userId, int $categoryId): array
    {
        $category = $this->categoryRepository->findById($categoryId, $userId);

        if (!$category) {
            throw new Exception('Category not found');
        }

        return $category->toArray();
    }

    public function createCategory(int $userId, array $data): int
    {
        $category = new Category();
        $category->user_id = $userId;
        $category->name = $data['name'];
        $category->description = $data['description'] ?? '';
        $category->color = $data['color'] ?? '#6366f1';
        $category->icon = $data['icon'] ?? 'tag';
        $category->type = $data['type'] ?? 'expense';

        return $this->categoryRepository->create($category);
    }

    public function updateCategory(int $userId, int $categoryId, array $data): bool
    {
        $category = $this->categoryRepository->findById($categoryId, $userId);

        if (!$category) {
            throw new Exception('Category not found');
        }

        if (isset($data['name'])) {
            $category->name = $data['name'];
        }

        if (isset($data['description'])) {
            $category->description = $data['description'];
        }

        if (isset($data['color'])) {
            $category->color = $data['color'];
        }

        if (isset($data['icon'])) {
            $category->icon = $data['icon'];
        }

        if (isset($data['order_index'])) {
            $category->order_index = $data['order_index'];
        }

        return $this->categoryRepository->update($category);
    }

    public function deleteCategory(int $userId, int $categoryId): bool
    {
        return $this->categoryRepository->delete($categoryId, $userId);
    }
}
