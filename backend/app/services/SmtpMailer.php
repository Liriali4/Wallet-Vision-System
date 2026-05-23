<?php

namespace App\Services;

use Exception;

class SmtpMailer
{
    private string $host;
    private int $port;
    private string $username;
    private string $password;
    private string $encryption;
    private string $fromEmail;
    private string $fromName;

    public function __construct(array $config)
    {
        $this->host = $config['host'] ?? '';
        $this->port = (int)($config['port'] ?? 587);
        $this->username = $config['username'] ?? '';
        $this->password = $config['password'] ?? '';
        $this->encryption = strtolower($config['encryption'] ?? 'tls');
        $this->fromEmail = $config['from_email'] ?? 'no-reply@walletvision.local';
        $this->fromName = $config['from_name'] ?? 'Wallet Vision';
    }

    public function send(string $to, string $subject, string $html): void
    {
        if (!$this->host || !$this->username || !$this->password) {
            throw new Exception('SMTP não configurado. Defina SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, SMTP_ENCRYPTION, SMTP_FROM_EMAIL e SMTP_FROM_NAME no .env');
        }

        $transport = $this->encryption === 'ssl' ? 'ssl://' : '';
        $socket = stream_socket_client(
            "{$transport}{$this->host}:{$this->port}",
            $errno,
            $errstr,
            15
        );

        if (!$socket) {
            throw new Exception("Falha ao conectar no SMTP: {$errstr}");
        }

        $this->expect($socket, [220]);
        $this->command($socket, 'EHLO localhost', [250]);

        if ($this->encryption === 'tls') {
            $this->command($socket, 'STARTTLS', [220]);
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                fclose($socket);
                throw new Exception('Falha ao iniciar TLS no SMTP');
            }
            $this->command($socket, 'EHLO localhost', [250]);
        }

        $this->command($socket, 'AUTH LOGIN', [334]);
        $this->command($socket, base64_encode($this->username), [334]);
        $this->command($socket, base64_encode($this->password), [235]);
        $this->command($socket, "MAIL FROM:<{$this->fromEmail}>", [250]);
        $this->command($socket, "RCPT TO:<{$to}>", [250, 251]);
        $this->command($socket, 'DATA', [354]);

        $headers = [
            "From: {$this->fromName} <{$this->fromEmail}>",
            "To: <{$to}>",
            "Subject: {$subject}",
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8'
        ];

        $message = implode("\r\n", $headers) . "\r\n\r\n" . $html . "\r\n.";
        $this->command($socket, $message, [250]);
        $this->command($socket, 'QUIT', [221]);
        fclose($socket);
    }

    private function command($socket, string $command, array $expectedCodes): void
    {
        fwrite($socket, $command . "\r\n");
        $this->expect($socket, $expectedCodes);
    }

    private function expect($socket, array $expectedCodes): void
    {
        $response = '';
        while (($line = fgets($socket, 512)) !== false) {
            $response .= $line;
            if (isset($line[3]) && $line[3] === ' ') break;
        }

        $code = (int)substr($response, 0, 3);
        if (!in_array($code, $expectedCodes, true)) {
            throw new Exception("Erro SMTP [{$code}]: " . trim($response));
        }
    }
}

