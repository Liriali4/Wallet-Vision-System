<?php
require 'bootstrap.php';

try {
    $db = \App\Database::getInstance();
    $stmt = $db->prepare('SELECT password FROM users WHERE email = ?');
    $stmt->execute(['user@personal-finance.com']);
    $row = $stmt->fetch();
    
    if ($row) {
        echo "Password hash: " . $row['password'] . "\n";
        
        // Test password verification
        $password = 'password';
        if (password_verify($password, $row['password'])) {
            echo "Password 'password' is correct!\n";
        } else {
            echo "Password 'password' is INCORRECT\n";
            
            // Try common passwords
            $common = ['123456', 'password', '12345678', 'qwerty', 'abc123'];
            foreach ($common as $test) {
                if (password_verify($test, $row['password'])) {
                    echo "Password '$test' is correct!\n";
                    break;
                }
            }
        }
    } else {
        echo "User not found\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
