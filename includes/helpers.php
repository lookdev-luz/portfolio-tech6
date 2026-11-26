<?php
declare(strict_types=1);
function e(mixed $value): string { return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function safe_url(mixed $url): string { $url = trim((string)$url); return preg_match('~^https?://~i', $url) ? $url : ''; }
function contact_link(array $c, string $service = ''): string {
    $message = 'Olá! Gostaria de conversar sobre um projeto' . ($service ? ' de ' . $service : '') . '.';
    if (!empty($c['whatsapp'])) { $digits = preg_replace('/\D+/', '', $c['whatsapp']); return 'https://wa.me/' . $digits . '?text=' . rawurlencode($message); }
    if (!empty($c['email']) && filter_var($c['email'], FILTER_VALIDATE_EMAIL)) return 'mailto:' . $c['email'] . '?subject=' . rawurlencode('Conversa sobre um projeto') . '&body=' . rawurlencode($message);
    return '#contato';
}
