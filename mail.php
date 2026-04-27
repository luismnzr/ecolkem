<?php
/**
 * Ecolkem - Endpoint de envío de formularios
 *
 * Recibe los formularios del sitio (Contacto y Diagnóstico Técnico) por POST
 * y los reenvía como correo a servicioalcliente@ecolkem.com usando la función
 * mail() de PHP (la que provee el servidor de Ecolkem).
 *
 * REQUISITOS DEL HOSTING:
 *  - PHP 7.4+ (la mayoría de los hostings compartidos cumplen)
 *  - Función mail() habilitada (default en cPanel/Plesk)
 *  - Para evitar que los correos caigan a SPAM, configurar SPF/DKIM en el
 *    dominio ecolkem.com y que MAIL_FROM (abajo) sea una dirección REAL del
 *    dominio (recomendado: no-reply@ecolkem.com).
 *
 * CONFIGURACIÓN:
 *  - Edita las constantes RECIPIENT y MAIL_FROM si cambian las direcciones.
 *  - El sitio asume que este archivo está en la raíz (junto a index.html).
 */

declare(strict_types=1);

const RECIPIENT = 'servicioalcliente@ecolkem.com';
const MAIL_FROM = 'no-reply@ecolkem.com';
const SITE_NAME = 'Ecolkem';

header('Content-Type: application/json; charset=utf-8');

// Solo aceptar POST
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

// Honeypot anti-spam: campo oculto que solo bots llenan.
// Si llegó con contenido, fingimos éxito y descartamos.
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

/**
 * Limpia un valor antes de meterlo en un header de correo.
 * Evita inyección de headers (CR/LF) y trims básicos.
 */
function sanitize_header(string $value): string {
    $value = preg_replace('/[\r\n\t]+/', ' ', $value) ?? '';
    return trim($value);
}

// Tipo de formulario (lo manda el HTML como hidden _form)
$form_type = sanitize_header((string)($_POST['_form'] ?? 'contacto'));

$subjects = [
    'contacto'    => 'Nuevo mensaje de contacto - Sitio web Ecolkem',
    'diagnostico' => 'Nuevo diagnostico tecnico - Desarrollo de producto',
];
$subject = $subjects[$form_type] ?? $subjects['contacto'];

// Reply-To: el correo de quien llena el formulario.
// Buscamos en varios nombres comunes (ES + EN).
$sender_email_raw = (string)($_POST['email'] ?? $_POST['Correo'] ?? '');
$sender_email = filter_var(trim($sender_email_raw), FILTER_VALIDATE_EMAIL);
$sender_name = sanitize_header((string)($_POST['name'] ?? $_POST['Nombre'] ?? ''));

// Cuerpo del correo: volcamos todos los campos del POST en orden legible.
$lines = [];
$lines[] = "Nuevo envio desde el sitio web Ecolkem";
$lines[] = "Tipo: " . ucfirst($form_type);
$lines[] = str_repeat('-', 60);
$lines[] = '';

foreach ($_POST as $key => $value) {
    // Saltar campos internos y el honeypot
    if ($key === 'website' || str_starts_with($key, '_')) {
        continue;
    }
    $label = ucfirst(str_replace(['_', '-'], ' ', $key));
    $value = is_array($value) ? implode(', ', $value) : (string)$value;
    $value = trim($value);
    if ($value === '') {
        continue;
    }
    $lines[] = "$label:";
    $lines[] = $value;
    $lines[] = '';
}

$lines[] = str_repeat('-', 60);
$lines[] = 'Origen: ' . ($_SERVER['HTTP_REFERER'] ?? 'desconocido');
$lines[] = 'IP: '     . ($_SERVER['REMOTE_ADDR']  ?? 'desconocida');

$body = implode("\n", $lines);

// Headers
$headers   = [];
$headers[] = 'From: ' . SITE_NAME . ' <' . MAIL_FROM . '>';
if ($sender_email) {
    $reply_to = $sender_name !== ''
        ? "$sender_name <$sender_email>"
        : $sender_email;
    $headers[] = "Reply-To: $reply_to";
}
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'X-Mailer: PHP/' . phpversion();

$ok = @mail(
    RECIPIENT,
    sanitize_header($subject),
    $body,
    implode("\r\n", $headers),
    '-f' . MAIL_FROM
);

if (!$ok) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'send_failed']);
    exit;
}

echo json_encode(['ok' => true]);
