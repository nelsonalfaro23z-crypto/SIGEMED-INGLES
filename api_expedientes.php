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

// 1. BUSCAR LISTA DE PACIENTES PARA EL AUTOCOMPLETO
if ($action === 'buscar_lista') {
    $q = trim($_GET['q'] ?? '');
    $lista = [];
    if (!empty($q)) {
        $stmt = $conexion->prepare("SELECT id_paciente, num_expediente, nombre, apellido FROM paciente WHERE nombre LIKE ? OR apellido LIKE ? OR num_expediente LIKE ? LIMIT 8");
        $like = "%$q%";
        $stmt->bind_param("sss", $like, $like, $like);
        $stmt->execute();
        $res = $stmt->get_result();
        while ($row = $res->fetch_assoc()) {
            $lista[] = $row;
        }
        $stmt->close();
    }
    echo json_encode($lista);
    exit();
}

// 2. OBTENER EXPEDIENTE Y DATOS MÉDICOS
if ($action === 'obtener_expediente') {
    $id_paciente = isset($_GET['id_paciente']) ? (int)$_GET['id_paciente'] : 0;

    if ($id_paciente > 0) {
        $sql = "SELECT p.*, e.alergias, e.padecimientos_cronicos 
                FROM paciente p 
                LEFT JOIN expediente e ON p.id_paciente = e.id_paciente 
                WHERE p.id_paciente = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("i", $id_paciente);
    } else {
        $sql = "SELECT p.*, e.alergias, e.padecimientos_cronicos 
                FROM paciente p 
                LEFT JOIN expediente e ON p.id_paciente = e.id_paciente 
                ORDER BY p.id_paciente DESC LIMIT 1";
        $stmt = $conexion->prepare($sql);
    }

    $stmt->execute();
    $res = $stmt->get_result();
    $paciente = $res->fetch_assoc();
    $stmt->close();

    if ($paciente) {
        $edad = 'N/A';
        if (!empty($paciente['fecha_nacimiento'])) {
            $dob = new DateTime($paciente['fecha_nacimiento']);
            $now = new DateTime();
            $edad = $now->diff($dob)->y . " años";
        }
        $paciente['edad_calculada'] = $edad;
        $paciente['fecha_nac_sv'] = !empty($paciente['fecha_nacimiento']) ? date("d/m/Y", strtotime($paciente['fecha_nacimiento'])) : 'N/A';

        // Obtener historial de citas
        $citas = [];
        $sqlCitas = "SELECT fecha, 'Consulta' as tipo_atencion, motivo, 'Sin diagnóstico' as diagnostico, medico FROM citas WHERE paciente LIKE ? ORDER BY fecha DESC";
        $stmtC = $conexion->prepare($sqlCitas);
        $nombreCompleto = "%" . $paciente['nombre'] . "%";
        $stmtC->bind_param("s", $nombreCompleto);
        $stmtC->execute();
        $resC = $stmtC->get_result();
        while ($c = $resC->fetch_assoc()) {
            $c['fecha_sv'] = date("d/m/Y", strtotime($c['fecha']));
            $citas[] = $c;
        }
        $stmtC->close();

        echo json_encode([
            "status" => "success",
            "paciente" => $paciente,
            "historial" => $citas
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Paciente no encontrado"]);
    }
    exit();
}

$conexion->close();
?>