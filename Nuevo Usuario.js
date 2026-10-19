document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Redirección del botón de flecha Regresar (<)
    const btnBack = document.getElementById('btnBack');
    if (btnBack) {
        btnBack.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'Usuarios y Roles.html';
        });
    }

    // 2. Redirección del botón Cancelar
    const btnCancel = document.getElementById('btnCancel');
    if (btnCancel) {
        btnCancel.addEventListener('click', function() {
            window.location.href = 'Usuarios y Roles.html';
        });
    }

    // 3. Envío del formulario "Guardar usuario"
    const newUserForm = document.getElementById('newUserForm');
    if (newUserForm) {
        newUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar contraseñas
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden. Por favor, verifíquelas.');
                return;
            }

            alert('¡Usuario registrado exitosamente!');
            // Redirige de vuelta a la tabla de Usuarios y Roles
            window.location.href = 'Usuarios y Roles.html';
        });
    }

});