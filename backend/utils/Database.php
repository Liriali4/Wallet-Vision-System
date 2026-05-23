<?php

class Database
{
    private static ?Database $instance = null;
    private static ?PDO $pdo = null;
    private static array $config;

    private function __construct()
    {
    }

    public static function init(): void
    {
        if (self::$pdo === null) {
            self::$config = require __DIR__ . '/../config/database.php';
            
            // Try MySQL first, fallback to SQLite
            try {
                self::connectMySQL();
            } catch (PDOException $e) {
                // Fallback to SQLite for development
                self::connectSQLite();
            }
        }
    }

    private static function connectMySQL(): void
    {
        $host = self::$config['host'];
        $database = self::$config['database'];
        $user = self::$config['user'];
        $password = self::$config['password'];
        $port = self::$config['port'];
        $charset = self::$config['charset'];

        $dsn = "mysql:host=$host;port=$port;dbname=$database;charset=$charset";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        self::$pdo = new PDO($dsn, $user, $password, $options);
    }

    private static function connectSQLite(): void
    {
        $databasePath = __DIR__ . '/../database/dev.db';
        
        // Create database directory if it doesn't exist
        $dir = dirname($databasePath);
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }

        $dsn = "sqlite:$databasePath";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        self::$pdo = new PDO($dsn, null, null, $options);
        
        // Enable foreign keys in SQLite
        self::$pdo->exec('PRAGMA foreign_keys = ON;');
    }

    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::init();
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public static function getConnection(): PDO
    {
        self::init();
        return self::$pdo;
    }

    /**
     * Execute a prepared statement with parameters
     */
    public function query(string $sql, array $params = [])
    {
        self::init();
        $stmt = self::$pdo->prepare($sql);
        if ($params) {
            $stmt->execute($params);
        } else {
            $stmt->execute();
        }
        return $stmt;
    }

    /**
     * Get the last inserted ID
     */
    public function lastInsertId(): int
    {
        self::init();
        return (int)self::$pdo->lastInsertId();
    }

    /**
     * Magic method to access PDO methods directly for compatibility
     */
    public function __call($name, $arguments)
    {
        self::init();
        return call_user_func_array([self::$pdo, $name], $arguments);
    }
}
