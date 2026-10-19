document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue

    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-message');

    // Ocultar mensaje de error en cada intento
    errorMsg.style.display = "none";

    // Credenciales para Enfermera / Recepción
    const correoEnfermera = "maria.lopez@gmail.com"; 
    const claveEnfermera = "123456";

    // Credenciales para Administrador
    const correoAdmin = "nelson.alfaro23z@gmail.com";
    const claveAdmin = "123456";

    // 1. Validación para Rol ENFERMERA / RECEPCIÓN
    if (email === correoEnfermera && password === claveEnfermera) {
        localStorage.setItem('usuarioSesion', JSON.stringify({
            correo: email,
            rol: 'Enfermera',
            nombre: 'Maria López',
            logueado: true
        }));

        // Redirecciona al Dashboard PHP que se conecta a MySQL
        window.location.href = "Dashboard Recepción.php"; 

    // 2. Validación para Rol ADMINISTRADOR
    } else if (email === correoAdmin && password === claveAdmin) {
        localStorage.setItem('usuarioSesion', JSON.stringify({
            correo: email,
            rol: 'Administrador',
            nombre: 'Nelson Alfaro',
            logueado: true
        }));

        // Redirecciona al Dashboard Administrador
        window.location.href = "Dashboard Administrador.html"; 

    // 3. Credenciales Incorrectas
    } else {
        errorMsg.textContent = "Correo o contraseña incorrectos.";
        errorMsg.style.display = "block";
    }
});