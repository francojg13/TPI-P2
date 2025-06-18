<?php
// Mostrar errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// backend/empleos.php
require 'db.php';
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $puesto = trim($_POST['puesto'] ?? '');
    $descripcion = trim($_POST['descripcion'] ?? '');
    $rubro = trim($_POST['rubro'] ?? '');
    $zona = trim($_POST['zona'] ?? '');
    // Validación básica
    if ($puesto && $descripcion && $rubro && $zona) {
        $stmt = $conn->prepare('INSERT INTO empleos (titulo, descripcion, rubro, zona) VALUES (?, ?, ?, ?)');
        $stmt->bind_param('ssss', $puesto, $descripcion, $rubro, $zona);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Empleo publicado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al publicar empleo']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query('SELECT * FROM empleos ORDER BY fecha_publicacion DESC');
    $empleos = [];
    while ($row = $result->fetch_assoc()) {
        $empleos[] = $row;
    }
    echo json_encode($empleos);
    exit;
}
?>
