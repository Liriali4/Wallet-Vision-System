<?php

require_once __DIR__ . '/../bootstrap.php';

use App\Database;

echo "Initializing SQLite database...\n";

try {
    // Get connection
    $pdo = Database::getInstance();
    
    // Read and execute schema
    $schemaFile = __DIR__ . '/../../database/schema-sqlite.sql';
    $schema = file_get_contents($schemaFile);
    
    if (!$schema) {
        throw new Exception("Schema file not found: $schemaFile");
    }
    
    // Execute schema in chunks (SQLite doesn't support multiple statements in one exec)
    $statements = array_filter(explode(';', $schema));
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement)) {
            try {
                $pdo->exec($statement);
            } catch (PDOException $e) {
                // Ignore duplicate table errors
                if (strpos($e->getMessage(), 'already exists') === false) {
                    echo "Warning: " . $e->getMessage() . "\n";
                }
            }
        }
    }
    
    echo "✅ Database initialized successfully!\n";
    echo "📁 Database location: " . realpath(__DIR__ . '/../database/dev.db') . "\n";
    
    // Test connection
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch();
    echo "👥 Users in database: " . $result['count'] . "\n";
    
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM transactions");
    $result = $stmt->fetch();
    echo "📊 Transactions in database: " . $result['count'] . "\n";
    
} catch (Exception $e) {
    echo "❌ Error initializing database: " . $e->getMessage() . "\n";
    exit(1);
}
