<?php
require 'bootstrap.php';

try {
    $db = \App\Database::getInstance();
    
    // Hash the password 'password'
    $hash = password_hash('password', PASSWORD_DEFAULT);
    
    $stmt = $db->prepare('UPDATE users SET password = ? WHERE email = ?');
    $stmt->execute([$hash, 'user@personal-finance.com']);
    
    echo "Password updated successfully\n";
    echo "New hash: $hash\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
