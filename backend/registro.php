<?php
// backend/registro.php
require 'db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $nombre = trim($_POST['nombre'] ?? '');
    $tipo_usuario = trim($_POST['tipo_usuario'] ?? '');

    if (!$email || !$password || !$nombre || !in_array($tipo_usuario, ['empresa', 'candidato'])) {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
        exit;
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare('INSERT INTO usuarios (email, password, nombre, tipo_usuario) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('ssss', $email, $passwordHash, $nombre, $tipo_usuario);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Usuario registrado correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al registrar usuario o email ya existe']);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Método no permitido']);
