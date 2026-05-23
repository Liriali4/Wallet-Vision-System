<?php
$input = file_get_contents('php://input');
echo 'Raw input: ' . $input . "\n";
echo 'Length: ' . strlen($input) . "\n";
echo 'Hex: ' . bin2hex($input) . "\n";
$data = json_decode($input, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo 'JSON Error: ' . json_last_error_msg() . "\n";
} else {
    echo 'Email: ' . ($data['email'] ?? 'NOT SET') . "\n";
    echo 'Password: ' . ($data['password'] ?? 'NOT SET') . "\n";
}
