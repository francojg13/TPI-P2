<?php
require 'db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim($_POST['nombre'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $descripcion = trim($_POST['descripcion'] ?? '');
    $ubicacion = trim($_POST['ubicacion'] ?? '');
    $telefono = trim($_POST['telefono'] ?? '');
    $sitio_web = trim($_POST['sitio_web'] ?? '');
    $rubro = trim($_POST['rubro'] ?? '');
    $persona_contacto = trim($_POST['persona_contacto'] ?? '');

    // Validación básica
    if (!$nombre || !$email || !$password || !$descripcion || !$ubicacion || !$telefono || !$rubro) {
        echo json_encode(['success' => false, 'message' => 'Todos los campos obligatorios deben completarse']);
        exit;
    }

    // Manejo de logo (opcional)
    $logoPath = null;
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
        $ext = pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION);
        $logoName = uniqid('logo_') . '.' . $ext;
        $dest = '../assets/images/' . $logoName;
        if (move_uploaded_file($_FILES['logo']['tmp_name'], $dest)) {
            $logoPath = 'assets/images/' . $logoName;
        }
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare('INSERT INTO empresas (nombre, email, password, logo, descripcion, ubicacion, telefono, sitio_web, rubro, persona_contacto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('ssssssssss', $nombre, $email, $passwordHash, $logoPath, $descripcion, $ubicacion, $telefono, $sitio_web, $rubro, $persona_contacto);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Empresa registrada correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al registrar empresa o email ya existe']);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Método no permitido']);
