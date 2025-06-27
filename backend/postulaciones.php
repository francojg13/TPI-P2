<?php
require 'db.php';
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim($_POST['nombre'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $telefono = trim($_POST['telefono'] ?? '');
    $cv = trim($_POST['cv'] ?? '');
    $mensaje = trim($_POST['mensaje'] ?? '');
    // Validación básica
    if ($nombre && $email && $telefono && $cv) {
        // Validación de email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'message' => 'Email no válido']);
            exit;
        }
        $stmt = $conn->prepare('INSERT INTO postulaciones (nombre, email, telefono, cv, mensaje) VALUES (?, ?, ?, ?, ?)');
        $stmt->bind_param('sssss', $nombre, $email, $telefono, $cv, $mensaje);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Postulación enviada correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al enviar la postulación']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Todos los campos obligatorios deben estar completos']);
    }
    exit;
}
?>
