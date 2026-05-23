<?php
require 'bootstrap.php';

try {
    $db = \App\Database::getInstance();
    $stmt = $db->query('SELECT COUNT(*) as count FROM users');
    $count = $stmt->fetch()['count'];
    echo "Users in database: $count\n";
    
    // Check if there's a test user
    $stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute(['user@personal-finance.com']);
    $user = $stmt->fetch();
    
    if ($user) {
        echo "Test user found: {$user['email']}\n";
    } else {
        echo "Test user NOT found\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
