<?php
date_default_timezone_set('America/El_Salvador');
header('Content-Type: application/json; charset=utf-8');

$conexion = new mysqli("localhost", "root", "", "sigemed");
if ($conexion->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error de conexión a la base de datos"]);
    exit();
}
$conexion->set_charset("utf8");

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// OBTENER PERFIL DE MARÍA LÓPEZ (id_usuario = 1)
if ($action === 'obtener_perfil') {
    $id_usuario = isset($_GET['id_usuario']) ? (int)$_GET['id_usuario'] : 1;

    $stmt = $conexion->prepare("SELECT u.*, r.nombre_rol FROM usuario u LEFT JOIN rol r ON u.id_rol = r.id_rol WHERE u.id_usuario = ?");
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $res = $stmt->get_result();
    $usuario = $res->fetch_assoc();
    $stmt->close();

    if ($usuario) {
        echo json_encode(["status" => "success", "usuario" => $usuario]);
    } else {
        echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
    }
    exit();
}

// ACTUALIZAR DATOS (nombre_completo y correo)
if ($action === 'actualizar_datos') {
    $id_usuario = isset($_POST['id_usuario']) ? (int)$_POST['id_usuario'] : 1;
    $nombre_completo = trim($_POST['nombre_completo'] ?? '');
    $correo = trim($_POST['correo'] ?? '');

    if (!empty($nombre_completo) && !empty($correo)) {
        $stmt = $conexion->prepare("UPDATE usuario SET nombre_completo = ?, correo = ? WHERE id_usuario = ?");
        $stmt->bind_param("ssi", $nombre_completo, $correo, $id_usuario);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "¡Datos actualizados con éxito en la base de datos!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al actualizar: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Todos los campos son obligatorios."]);
    }
    exit();
}

// CAMBIAR CONTRASEÑA
if ($action === 'cambiar_contrasena') {
    $id_usuario = isset($_POST['id_usuario']) ? (int)$_POST['id_usuario'] : 1;
    $pass_actual = trim($_POST['contrasena_actual'] ?? '');
    $pass_nueva = trim($_POST['contrasena_nueva'] ?? '');

    if (!empty($pass_actual) && !empty($pass_nueva)) {
        $stmt = $conexion->prepare("SELECT contrasena FROM usuario WHERE id_usuario = ?");
        $stmt->bind_param("i", $id_usuario);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res->fetch_assoc();
        $stmt->close();

        if ($row && $row['contrasena'] === $pass_actual) {
            $stmtUp = $conexion->prepare("UPDATE usuario SET contrasena = ? WHERE id_usuario = ?");
            $stmtUp->bind_param("si", $pass_nueva, $id_usuario);

            if ($stmtUp->execute()) {
                echo json_encode(["status" => "success", "message" => "¡Contraseña actualizada con éxito!"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Error al actualizar contraseña."]);
            }
            $stmtUp->close();
        } else {
            echo json_encode(["status" => "error", "message" => "La contraseña actual es incorrecta."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Debe rellenar ambos campos."]);
    }
    exit();
}

$conexion->close();
?>