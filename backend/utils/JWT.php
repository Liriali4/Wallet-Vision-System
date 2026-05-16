<?php

class JWT
{
    private static function secret(): string
    {
        return getenv('JWT_SECRET') ?: 'wallet_vision_fallback_secret_change_me';
    }

    private static function expiration(): int
    {
        return 3600 * 24; // 24 hours
    }

    public static function encode(array $payload): string
    {
        $header = ['typ' => 'JWT', 'alg' => 'HS256'];

        $payload['iat'] = time();
        $payload['exp'] = time() + self::expiration();

        $h = self::b64e(json_encode($header));
        $p = self::b64e(json_encode($payload));
        $s = self::b64e(hash_hmac('sha256', "{$h}.{$p}", self::secret(), true));

        return "{$h}.{$p}.{$s}";
    }

    public static function decode(string $token): array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }

        [$h, $p, $s] = $parts;

        $expected = self::b64e(hash_hmac('sha256', "{$h}.{$p}", self::secret(), true));

        if (!hash_equals($expected, $s)) {
            throw new Exception('Invalid token signature');
        }

        $payload = json_decode(self::b64d($p), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid token payload');
        }

        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new Exception('Token expired');
        }

        return $payload;
    }

    private static function b64e(string $input): string
    {
        return rtrim(strtr(base64_encode($input), '+/', '-_'), '=');
    }

    private static function b64d(string $input): string
    {
        $rem = strlen($input) % 4;
        if ($rem) $input .= str_repeat('=', 4 - $rem);
        return base64_decode(strtr($input, '-_', '+/'));
    }
}
