document.addEventListener('DOMContentLoaded', function() {
    // BOTÓN CERRAR SESIÓN
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('usuarioSesion');
            window.location.href = "Iniciar Sesión.html";
        });
    }

    // EVENTOS PARA LAS ACCIONES RÁPIDAS DEL DASHBOARD
    const btnQuickNuevoPaciente = document.getElementById('btnQuickNuevoPaciente');
    const btnQuickTriaje = document.getElementById('btnQuickTriaje');
    const btnQuickAgendarCita = document.getElementById('btnQuickAgendarCita');
    const btnQuickVerExpediente = document.getElementById('btnQuickVerExpediente');

    if (btnQuickNuevoPaciente) {
        btnQuickNuevoPaciente.addEventListener('click', function() {
            window.location.href = 'Nuevo Paciente.html';
        });
    }

    if (btnQuickTriaje) {
        btnQuickTriaje.addEventListener('click', function() {
            window.location.href = 'Triaje.html';
        });
    }

    if (btnQuickAgendarCita) {
        btnQuickAgendarCita.addEventListener('click', function() {
            window.location.href = 'Agenda de Citas_Enfer.html';
        });
    }

    if (btnQuickVerExpediente) {
        btnQuickVerExpediente.addEventListener('click', function() {
            window.location.href = 'Expedientes_enfer.html';
        });
    }
});