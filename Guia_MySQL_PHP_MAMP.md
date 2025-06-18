# Guía paso a paso: Conexión y operaciones con MySQL usando PHP y MAMP

## 1. Instala y configura MAMP
- Descarga MAMP desde https://www.mamp.info/ y sigue las instrucciones de instalación.
- Inicia MAMP y asegúrate de que los servicios de Apache y MySQL estén activos.
- Accede a phpMyAdmin desde el panel de MAMP para gestionar tus bases de datos.

## 2. Crea la base de datos y tablas
- En phpMyAdmin, crea una base de datos (por ejemplo: `famaempleos`).
- Crea las tablas necesarias, por ejemplo:

```sql
CREATE TABLE empleos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  rubro VARCHAR(50) NOT NULL,
  zona VARCHAR(50) NOT NULL,
  fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Estructura de archivos PHP
- Dentro de la carpeta `htdocs` de MAMP, crea una carpeta para tu proyecto (por ejemplo: `famaempleos`).
- Crea los siguientes archivos:
  - `db.php` (conexión a la base de datos)
  - `empleos.php` (operaciones CRUD)

## 4. Código de conexión (db.php)
```php
<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'famaempleos';
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die('Error de conexión: ' . $conn->connect_error);
}
?>
```

## 5. Operaciones CRUD seguras (empleos.php)
- Ejemplo: Insertar un empleo (usando sentencias preparadas)
```php
<?php
require 'db.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $titulo = trim($_POST['titulo']);
    $descripcion = trim($_POST['descripcion']);
    $rubro = trim($_POST['rubro']);
    $zona = trim($_POST['zona']);
    // Validación básica
    if ($titulo && $descripcion && $rubro && $zona) {
        $stmt = $conn->prepare('INSERT INTO empleos (titulo, descripcion, rubro, zona) VALUES (?, ?, ?, ?)');
        $stmt->bind_param('ssss', $titulo, $descripcion, $rubro, $zona);
        $stmt->execute();
        echo 'Empleo publicado correctamente';
    } else {
        echo 'Todos los campos son obligatorios';
    }
}
?>
```

## 6. Integración con el front-end
- Desde tu JS, usa `fetch` para enviar datos al archivo PHP:
```js
fetch('http://localhost:8888/famaempleos/empleos.php', {
  method: 'POST',
  body: new FormData(formulario)
})
.then(res => res.text())
.then(data => alert(data));
```

## 7. Seguridad y validación
- Valida datos en el front-end antes de enviarlos.
- Valida y escapa datos en PHP antes de operar con la base de datos.
- Usa sentencias preparadas para evitar inyección SQL.

## 8. Prueba tu integración
- Publica un empleo desde el front-end y verifica que se guarde en la base de datos.
- Agrega operaciones de lectura, actualización y borrado según lo necesites.

---
¿Quieres que genere los archivos PHP de ejemplo para tu proyecto?
