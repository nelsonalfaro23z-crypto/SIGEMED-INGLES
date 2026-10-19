<?php
// Configurar zona horaria de El Salvador
date_default_timezone_set('America/El_Salvador');

// Conexión a la base de datos MySQL
$conexion = new mysqli("localhost", "root", "", "sigemed");

// Verificar conexión
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Consultar los pacientes ordenados del más reciente al más antiguo usando 'id_paciente'
$sql = "SELECT * FROM paciente ORDER BY id_paciente DESC";
$resultado = $conexion->query($sql);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIGEMED - Dashboard Recepción / Enfermería</title>
    <link rel="stylesheet" href="Dashboard Recepción.css">
    <!-- Iconos FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

    <!-- SIDEBAR -->
    <aside class="sidebar">
        <div class="sidebar-header">
            <img src="Imagenes/LOGO_SIGEMED-FONDO.jpeg" alt="SIGEMED Logo" class="sidebar-logo">
        </div>

        <nav class="sidebar-menu">
            <a href="Dashboard Recepción.php" class="menu-item active">
                <i class="fa-solid fa-house"></i> Inicio
            </a>

            <a href="Nuevo Paciente.html" class="menu-item">
                <i class="fa-solid fa-user-plus"></i> Nuevo Paciente
            </a>

            <a href="Agenda de Citas_Enfer.html" class="menu-item">
                <i class="fa-solid fa-calendar-check"></i> Agenda de Citas
            </a>

            <a href="Triaje.html" class="menu-item">
                <i class="fa-solid fa-notes-medical"></i> Triaje
            </a>

            <a href="Expedientes_enfer.html" class="menu-item">
                <i class="fa-solid fa-folder-open"></i> Expedientes
            </a>
        </nav>

        <div class="sidebar-footer">
            <a href="Iniciar Sesión.html" class="btn-logout" id="btnLogout">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Cerrar Sesión
            </a>
        </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
        
        <!-- TOP HEADER -->
        <header class="top-header">
            <div class="header-title">
                <h1>Dashboard Recepción / Enfermería</h1>
                <div class="welcome-bar">
                    <span class="welcome-text">Bienvenida, <strong>Maria López</strong></span>
                    <span class="badge-role">Enfermera</span>
                </div>
            </div>
            
            <div class="header-right">
                <a href="Notificaciones_enfer.html" class="notification-badge" title="Ver Notificaciones">
                    <i class="fa-solid fa-bell"></i>
                    <span class="dot"></span>
                </a>

                <a href="Mi_Perfil.html" class="user-profile" style="text-decoration: none; color: inherit; cursor: pointer;">
                    <div class="avatar-circle"><i class="fa-solid fa-user"></i></div>
                    <div class="user-details">
                        <span class="user-name">Maria López <i class="fa-solid fa-chevron-right"></i></span>
                        <span class="user-sub">Recepción / Enfermería</span>
                    </div>
                </a>
            </div>
        </header>

        <!-- TARJETAS DE MÉTRICAS + ALERTA -->
        <section class="metrics-grid">
            
            <!-- Pacientes esperando -->
            <div class="metric-card">
                <div class="metric-icon icon-blue">
                    <i class="fa-solid fa-users"></i>
                </div>
                <div class="metric-info">
                    <span class="metric-label">Pacientes esperando</span>
                    <h2 class="metric-value"><?php echo ($resultado && $resultado->num_rows) ? $resultado->num_rows : 0; ?></h2>
                    <a href="#" class="metric-link">Ver lista</a>
                </div>
            </div>

            <!-- Citas de hoy -->
            <div class="metric-card">
                <div class="metric-icon icon-green">
                    <i class="fa-solid fa-calendar-plus"></i>
                </div>
                <div class="metric-info">
                    <span class="metric-label">Citas de hoy</span>
                    <h2 class="metric-value">18</h2>
                    <a href="Agenda de Citas_Enfer.html" class="metric-link">Ver agenda</a>
                </div>
            </div>

            <!-- Casos críticos -->
            <div class="metric-card">
                <div class="metric-icon icon-red">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div class="metric-info">
                    <span class="metric-label">Casos críticos</span>
                    <h2 class="metric-value">2</h2>
                    <a href="#" class="metric-link">Ver detalles</a>
                </div>
            </div>

            <!-- Atenciones realizadas -->
            <div class="metric-card">
                <div class="metric-icon icon-purple">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <div class="metric-info">
                    <span class="metric-label">Atenciones realizadas</span>
                    <h2 class="metric-value">24</h2>
                    <span class="metric-sub">Hoy</span>
                </div>
            </div>

            <!-- Alerta Prioritaria -->
            <div class="alert-card">
                <div class="alert-content">
                    <h3>Alerta prioritaria <i class="fa-solid fa-asterisk"></i></h3>
                    <p>1 paciente requiere atención inmediata</p>
                    <button class="btn-alert" onclick="window.location.href='Triaje.html'">Ver paciente</button>
                </div>
                <div class="alert-icon">
                    <i class="fa-solid fa-heart-pulse"></i>
                </div>
            </div>

        </section>

        <!-- DASHBOARD BODY: TABLA Y ACCIONES -->
        <div class="dashboard-body">
            
            <!-- COLA DE PACIENTES -->
            <section class="panel-box table-section">
                <h3 class="panel-title">Cola de pacientes</h3>
                
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Paciente</th>
                                <th>Hora de ingreso</th>
                                <th>Motivo</th>
                                <th>Prioridad</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if ($resultado && $resultado->num_rows > 0): ?>
                                <?php 
                                $contador = 1; 
                                while ($paciente = $resultado->fetch_assoc()): 
                                    $expediente = !empty($paciente['num_expediente']) ? $paciente['num_expediente'] : 'S/N';
                                    $motivo = !empty($paciente['motivo_consulta']) ? $paciente['motivo_consulta'] : 'Consulta general';
                                    
                                    // Formatear la hora de ingreso dinámicamente desde 'fecha_registro'
                                    if (!empty($paciente['fecha_registro'])) {
                                        $hora_ingreso = date("h:i A", strtotime($paciente['fecha_registro']));
                                    } else {
                                        $hora_ingreso = date("h:i A");
                                    }
                                ?>
                                    <tr>
                                        <td><?php echo $contador++; ?></td>
                                        <td>
                                            <div class="patient-name"><?php echo htmlspecialchars($paciente['nombre'] . ' ' . $paciente['apellido']); ?></div>
                                            <div class="patient-exp">N° exp. <?php echo htmlspecialchars($expediente); ?></div>
                                        </td>
                                        <td><?php echo $hora_ingreso; ?></td>
                                        <td><?php echo htmlspecialchars($motivo); ?></td>
                                        <td><span class="badge-priority priority-normal">Normal</span></td>
                                        <td><span class="badge-status status-esperando">Esperando</span></td>
                                        <td>
                                            <div class="actions">
                                                <button class="btn-action btn-ver" onclick="window.location.href='Triaje.html'">Ver</button>
                                                <button class="btn-action btn-folder" onclick="window.location.href='Pacientes.html'"><i class="fa-solid fa-folder"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                <?php endwhile; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="7" style="text-align: center; padding: 20px;">
                                        No hay pacientes registrados en la cola.
                                    </td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- ACCIONES RÁPIDAS -->
            <section class="panel-box quick-actions-section">
                <h3 class="panel-title center">Acciones rápidas</h3>
                
                <div class="quick-grid">
                    <button type="button" class="quick-card card-blue" id="btnQuickNuevoPaciente">
                        <i class="fa-solid fa-user-plus"></i>
                        <span>Nuevo Paciente</span>
                    </button>

                    <button type="button" class="quick-card card-green" id="btnQuickTriaje">
                        <i class="fa-solid fa-heart-pulse"></i>
                        <span>Registrar Triage</span>
                    </button>

                    <button type="button" class="quick-card card-purple" id="btnQuickAgendarCita">
                        <i class="fa-solid fa-calendar-plus"></i>
                        <span>Agendar Cita</span>
                    </button>

                    <button type="button" class="quick-card card-yellow" id="btnQuickVerExpediente">
                        <i class="fa-solid fa-folder-open"></i>
                        <span>Ver Expediente</span>
                    </button>
                </div>
            </section>

        </div>

    </main>

    <script src="Dashboard Recepción.js"></script>
</body>
</html>