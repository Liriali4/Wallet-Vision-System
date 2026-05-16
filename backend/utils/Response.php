<?php

class Response
{
    public static function success(mixed $data = null, string $message = 'Success', int $code = 200): void
    {
        http_response_code($code);
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ]);
    }

    public static function error(string $message = 'Error', int $code = 400, mixed $errors = null): void
    {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
        ]);
    }

    public static function paginated(array $data, int $total, int $page, int $perPage, string $message = 'Success'): void
    {
        http_response_code(200);
        echo json_encode([
            'success'    => true,
            'message'    => $message,
            'data'       => $data,
            'pagination' => [
                'total'       => $total,
                'page'        => $page,
                'per_page'    => $perPage,
                'total_pages' => $perPage > 0 ? (int) ceil($total / $perPage) : 1,
            ],
        ]);
    }
}
