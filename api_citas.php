<?php
date_default_timezone_set('America/El_Salvador');
header('Content-Type: application/json; charset=utf-8');

$conexion = new mysqli("localhost", "root", "", "sigemed");
if ($conexion->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error de conexión a MySQL"]);
    exit();
}
$conexion->set_charset("utf8");

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// 1. BUSCAR PACIENTES EN VIVO (Para autocompletar el nombre)
if ($action === 'buscar_paciente') {
    $q = trim($_GET['q'] ?? '');
    $pacientes = [];
    if (!empty($q)) {
        $stmt = $conexion->prepare("SELECT id_paciente, num_expediente, nombre, apellido FROM paciente WHERE nombre LIKE ? OR apellido LIKE ? OR num_expediente LIKE ? LIMIT 8");
        $like = "%$q%";
        $stmt->bind_param("sss", $like, $like, $like);
        $stmt->execute();
        $res = $stmt->get_result();
        while ($row = $res->fetch_assoc()) {
            $pacientes[] = $row;
        }
        $stmt->close();
    }
    echo json_encode($pacientes);
    exit();
}

// 2. OBTENER FECHAS OCUPADAS PARA EL CALENDARIO
if ($action === 'obtener_fechas') {
    $res = $conexion->query("SELECT DATE(fecha) as fecha, COUNT(*) as total FROM citas GROUP BY DATE(fecha)");
    $fechas = [];
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $fechas[$row['fecha']] = (int)$row['total'];
        }
    }
    echo json_encode($fechas);
    exit();
}

// 3. GUARDAR NUEVA CITA (Adaptado a tus columnas: paciente, medico, fecha, hora, motivo, estado)
if ($action === 'guardar_cita') {
    $nombre_paciente = trim($_POST['paciente'] ?? '');
    $medico          = trim($_POST['medico'] ?? '');
    $fecha           = trim($_POST['fecha'] ?? '');
    $hora            = trim($_POST['hora'] ?? '');
    $motivo          = trim($_POST['motivo'] ?? 'Consulta general');
    $estado          = 'Confirmada';

    if (!empty($nombre_paciente) && !empty($medico) && !empty($fecha) && !empty($hora)) {
        $stmt = $conexion->prepare("INSERT INTO citas (paciente, medico, fecha, hora, motivo, estado) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $nombre_paciente, $medico, $fecha, $hora, $motivo, $estado);
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "¡Cita agendada y guardada exitosamente!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al guardar en base de datos: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios para guardar la cita."]);
    }
    exit();
}

// 4. LISTAR TODAS LAS CITAS PROGRAMADAS
if ($action === 'listar_citas') {
    $sql = "SELECT * FROM citas ORDER BY fecha DESC, hora DESC";
    $res = $conexion->query($sql);
    $citas = [];
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            // Formatear la fecha a estándar salvadoreño DD/MM/YYYY para mostrar en la tabla
            $row['fecha_sv'] = date("d/m/Y", strtotime($row['fecha']));
            $citas[] = $row;
        }
    }
    echo json_encode($citas);
    exit();
}

$conexion->close();
?>