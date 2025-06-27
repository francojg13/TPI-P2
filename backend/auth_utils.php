<?php
// Utilidades de autenticación para empresas
session_start();

function empresa_autenticada() {
    return isset($_SESSION['usuario_id']) && isset($_SESSION['tipo_usuario']) && $_SESSION['tipo_usuario'] === 'empresa';
}

function require_empresa_auth() {
    if (!empresa_autenticada()) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Debes iniciar sesión como empresa para publicar ofertas.']);
        exit;
    }
}
