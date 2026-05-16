<?php

class Database
{
    private static ?self $instance = null;
    private mysqli $connection;

    private function __construct()
    {
        $host     = getenv('DB_HOST')     ?: 'localhost';
        $user     = getenv('DB_USER')     ?: 'root';
        $password = getenv('DB_PASSWORD') ?: '';
        $database = getenv('DB_NAME')     ?: 'wallet_vision';
        $port     = (int)(getenv('DB_PORT') ?: 3306);

        $this->connection = new mysqli($host, $user, $password, $database, $port);

        if ($this->connection->connect_error) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database connection failed: ' . $this->connection->connect_error
            ]);
            exit;
        }

        $this->connection->set_charset('utf8mb4');
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection(): mysqli
    {
        return $this->connection;
    }

    public function query(string $sql, array $params = []): mysqli_stmt
    {
        $stmt = $this->connection->prepare($sql);

        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $this->connection->error . ' | SQL: ' . $sql);
        }

        if (!empty($params)) {
            $types = '';
            foreach ($params as $param) {
                if (is_int($param))   $types .= 'i';
                elseif (is_float($param)) $types .= 'd';
                else                  $types .= 's';
            }
            $stmt->bind_param($types, ...$params);
        }

        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }

        return $stmt;
    }

    public function lastInsertId(): int
    {
        return (int) $this->connection->insert_id;
    }

    public function affectedRows(): int
    {
        return $this->connection->affected_rows;
    }
}
