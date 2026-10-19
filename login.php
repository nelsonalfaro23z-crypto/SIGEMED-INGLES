<?php
session_start();
header('Content-Type: application/json');
require_once 'conexion.php';

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $correo = trim($_POST['correo'] ?? '');
    $password = trim($_POST['contraseña'] ?? '');

    if (!empty($correo) && !empty($password)) {
        $stmt = $conexion->prepare("
            SELECT u.id_usuario, u.nombre_completo, u.contraseña, u.id_rol, r.nombre_rol 
            FROM USUARIO u
            INNER JOIN ROL r ON u.id_rol = r.id_rol
            WHERE u.correo = ?
        ");
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($resultado->num_rows === 1) {
            $usuario = $resultado->fetch_assoc();

            if ($password === $usuario['contraseña']) {
                $_SESSION['id_usuario'] = $usuario['id_usuario'];
                $_SESSION['nombre_usuario'] = $usuario['nombre_completo'];
                $_SESSION['id_rol'] = $usuario['id_rol'];

                $redirect = ($usuario['id_rol'] == 1) ? "Dashboard Recepción.html" : "Dashboard Administrador.html";

                $response['success'] = true;
                $response['correo'] = $correo;
                $response['rol'] = $usuario['nombre_rol'];
                $response['nombre'] = $usuario['nombre_completo'];
                $response['redirect'] = $redirect;
            } else {
                $response['message'] = "Correo o contraseña incorrectos.";
            }
        } else {
            $response['message'] = "Correo o contraseña incorrectos.";
        }
        $stmt->close();
    } else {
        $response['message'] = "Por favor, llena todos los campos.";
    }
} else {
    $response['message'] = "Método de petición no válido.";
}

echo json_encode($response);
?>