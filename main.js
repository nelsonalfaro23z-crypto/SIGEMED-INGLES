document.addEventListener('DOMContentLoaded', function () {
    // Control del Menú Desplegable de Usuario
    const userProfile = document.getElementById('adminProfileMenu');
    const userDropdown = document.getElementById('adminDropdown');

    if (userProfile && userDropdown) {
        userProfile.addEventListener('click', function (e) {
            e.stopPropagation();
            userProfile.classList.toggle('active');
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function (e) {
            if (!userProfile.contains(e.target)) {
                userProfile.classList.remove('active');
                userDropdown.classList.remove('show');
            }
        });
    }

    // Cerrar Sesión
    const btnLogouts = document.querySelectorAll('.btn-logout, .logout-link');
    btnLogouts.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('usuarioSesion');
            window.location.href = "Iniciar Sesión.html";
        });
    });
});