<?php
// backend/login.php
require 'db.php';
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!$email || !$password) {
        echo json_encode(['success' => false, 'message' => 'Email y contraseña son obligatorios']);
        exit;
    }

    $stmt = $conn->prepare('SELECT id, password, nombre, tipo_usuario FROM usuarios WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['usuario_id'] = $user['id'];
        $_SESSION['tipo_usuario'] = $user['tipo_usuario'];
        $_SESSION['nombre'] = $user['nombre'];
        echo json_encode([
            'success' => true,
            'message' => 'Login exitoso',
            'tipo_usuario' => $user['tipo_usuario'],
            'nombre' => $user['nombre']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Método no permitido']);
