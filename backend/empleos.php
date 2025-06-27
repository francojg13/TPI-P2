<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'db.php';
require_once 'auth_utils.php';
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$LOGOS_DIR = '../assets/images/logos/'; // Carpeta donde se guardarán los logos
$LOGOS_URL = '/TPI-P2/assets/images/logos/'; // URL pública para acceder a los logos

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_empresa_auth(); // Solo empresas logueadas pueden publicar

    $titulo = trim($_POST['titulo'] ?? '');
    $descripcion = trim($_POST['descripcion'] ?? '');
    $rubro = trim($_POST['rubro'] ?? '');
    $zona = trim($_POST['zona'] ?? '');
    $logoFileName = null;
    $empresa_id = $_SESSION['usuario_id'];
    $tipo_contrato = trim($_POST['tipo_contrato'] ?? 'Full-time');
    $salario_min = isset($_POST['salario_min']) ? floatval($_POST['salario_min']) : null;
    $salario_max = isset($_POST['salario_max']) ? floatval($_POST['salario_max']) : null;
    $fecha_expiracion = trim($_POST['fecha_expiracion'] ?? null);
    $requisitos = trim($_POST['requisitos'] ?? '');
    $beneficios = trim($_POST['beneficios'] ?? '');
    $estado = 'activa';

    // Manejo de logo (si se subió)
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
        $ext = pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION);
        $safeName = uniqid('logo_', true) . '.' . strtolower($ext);
        if (!is_dir($LOGOS_DIR)) {
            mkdir($LOGOS_DIR, 0777, true);
        }
        $destPath = $LOGOS_DIR . $safeName;
        if (move_uploaded_file($_FILES['logo']['tmp_name'], $destPath)) {
            $logoFileName = $LOGOS_URL . $safeName;
        }
    }

    // Validación básica
    if ($titulo && $descripcion && $rubro && $zona) {
        $stmt = $conn->prepare('INSERT INTO empleos (titulo, descripcion, rubro, zona, fecha_publicacion, logo, empresa_id, tipo_contrato, salario_min, salario_max, fecha_expiracion, requisitos, beneficios, estado) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('sssssisddssss', $titulo, $descripcion, $rubro, $zona, $logoFileName, $empresa_id, $tipo_contrato, $salario_min, $salario_max, $fecha_expiracion, $requisitos, $beneficios, $estado);
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
    $result = $conn->query('SELECT e.id, e.titulo, em.nombre AS empresa, e.descripcion, e.rubro, e.zona, e.fecha_publicacion, e.logo, e.empresa_id, e.tipo_contrato, e.salario_min, e.salario_max, e.fecha_expiracion, e.requisitos, e.beneficios, e.estado FROM empleos e JOIN empresas em ON e.empresa_id = em.id ORDER BY e.fecha_publicacion DESC');
    $empleos = [];
    while ($row = $result->fetch_assoc()) {
        if (empty($row['logo'])) {
            $row['logo'] = '/TPI-P2/assets/images/default-logo.png';
        }
        $empleos[] = $row;
    }
    echo json_encode($empleos);
    exit;
}