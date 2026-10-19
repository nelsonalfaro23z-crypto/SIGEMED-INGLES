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

// 1. BUSCAR PACIENTES EN TIEMPO REAL
if ($action === 'buscar_paciente') {
    $q = trim($_GET['q'] ?? '');
    $pacientes = [];
    if (!empty($q)) {
        // Consulta segura con las columnas reales de tu tabla paciente
        $stmt = $conexion->prepare("SELECT id_paciente, num_expediente, nombre, apellido, motivo_consulta, fecha_registro FROM paciente WHERE nombre LIKE ? OR apellido LIKE ? OR num_expediente LIKE ? LIMIT 8");
        $like = "%$q%";
        $stmt->bind_param("sss", $like, $like, $like);
        $stmt->execute();
        $res = $stmt->get_result();
        while ($row = $res->fetch_assoc()) {
            $row['edad'] = '25'; // Valor por defecto o dinámico si no hay fecha de nacimiento
            $row['hora_ingreso'] = !empty($row['fecha_registro']) ? date("h:i A", strtotime($row['fecha_registro'])) : date("h:i A");
            $pacientes[] = $row;
        }
        $stmt->close();
    }
    echo json_encode($pacientes);
    exit();
}

// 2. GUARDAR DATOS DEL TRIAJE
if ($action === 'guardar_triaje') {
    $id_paciente             = !empty($_POST['id_paciente']) ? (int)$_POST['id_paciente'] : 0;
    $id_enfermera            = 1; 
    $presion_arterial        = trim($_POST['presion_arterial'] ?? '');
    $temperatura             = !empty($_POST['temperatura']) ? (float)$_POST['temperatura'] : 0.0;
    $frecuencia_cardiaca     = !empty($_POST['frecuencia_cardiaca']) ? (int)$_POST['frecuencia_cardiaca'] : 0;
    $frecuencia_respiratoria = !empty($_POST['frecuencia_respiratoria']) ? (int)$_POST['frecuencia_respiratoria'] : 0;
    $peso_kg                 = !empty($_POST['peso']) ? (float)$_POST['peso'] : null;
    $talla_cm                = null; 
    $nivel_prioridad         = trim($_POST['prioridad'] ?? 'Consulta Normal');
    $observaciones           = trim($_POST['observaciones'] ?? '');

    if ($id_paciente > 0) {
        $stmt = $conexion->prepare("INSERT INTO triaje (id_paciente, id_enfermera, presion_arterial, temperatura, frecuencia_cardiaca, frecuencia_respiratoria, peso_kg, talla_cm, nivel_prioridad, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("iisiiiddss", $id_paciente, $id_enfermera, $presion_arterial, $temperatura, $frecuencia_cardiaca, $frecuencia_respiratoria, $peso_kg, $talla_cm, $nivel_prioridad, $observaciones);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "¡Triaje registrado con éxito!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al guardar el triaje: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Debe buscar y seleccionar un paciente de la lista."]);
    }
    exit();
}

$conexion->close();
?>