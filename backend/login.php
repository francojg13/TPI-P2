<?php
require 'db.php';
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Si ya hay sesión activa y no se envía email/password, solo verificar sesión
    if (!isset($_POST['email']) && !isset($_POST['password'])) {
        if (isset($_SESSION['usuario_id']) && isset($_SESSION['tipo_usuario']) && $_SESSION['tipo_usuario'] === 'empresa') {
            echo json_encode([
                'success' => true,
                'tipo_usuario' => 'empresa',
                'nombre' => $_SESSION['nombre']
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No autenticado']);
        }
        exit;
    }

    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!$email || !$password) {
        echo json_encode(['success' => false, 'message' => 'Email y contraseña son obligatorios']);
        exit;
    }

    $stmt = $conn->prepare('SELECT id, password, nombre FROM empresas WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $empresa = $result->fetch_assoc();

    if ($empresa && password_verify($password, $empresa['password'])) {
        $_SESSION['usuario_id'] = $empresa['id'];
        $_SESSION['tipo_usuario'] = 'empresa';
        $_SESSION['nombre'] = $empresa['nombre'];
        echo json_encode([
            'success' => true,
            'message' => 'Login exitoso',
            'tipo_usuario' => 'empresa',
            'nombre' => $empresa['nombre']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Método no permitido']);
