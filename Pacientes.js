document.addEventListener('DOMContentLoaded', function() {

    // 1. Menú Desplegable del Administrador
    const adminProfileMenu = document.getElementById('adminProfileMenu');
    const adminDropdown = document.getElementById('adminDropdown');

    if (adminProfileMenu && adminDropdown) {
        adminProfileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            adminDropdown.classList.toggle('show');
            adminProfileMenu.classList.toggle('active');
        });

        // Cerrar el menú si se hace clic afuera
        document.addEventListener('click', function(e) {
            if (!adminProfileMenu.contains(e.target)) {
                adminDropdown.classList.remove('show');
                adminProfileMenu.classList.remove('active');
            }
        });
    }

    // 2. Botón de Regresar al Dashboard Administrador
    const btnBack = document.getElementById('btnBack');
    if (btnBack) {
        btnBack.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'Dashboard Administrador.html';
        });
    }

    // 3. Redirección de botones Cerrar Sesión
    const btnLogoutSidebar = document.getElementById('btnLogoutSidebar');
    const btnLogoutDropdown = document.getElementById('btnLogoutDropdown');

    function logout(e) {
        e.preventDefault();
        localStorage.removeItem('usuarioSesion');
        window.location.href = 'Iniciar Sesión.html';
    }

    if (btnLogoutSidebar) btnLogoutSidebar.addEventListener('click', logout);
    if (btnLogoutDropdown) btnLogoutDropdown.addEventListener('click', logout);

    // 4. Filtro de Búsqueda General en tiempo real
    const searchInput = document.getElementById('searchPatient');
    const tableRows = document.querySelectorAll('#patientsTableBody tr');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();

            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    // 5. Filtro por Estado (Todos / Activo / Inactivo)
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const selectedStatus = this.value.toLowerCase();

            tableRows.forEach(row => {
                const statusCell = row.querySelector('.status-badge').textContent.toLowerCase();
                if (selectedStatus === 'todos' || statusCell.includes(selectedStatus)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // 6. Filtro directo por Número de Expediente
    const expFilter = document.getElementById('expFilter');
    if (expFilter) {
        expFilter.addEventListener('input', function() {
            const expQuery = this.value.toLowerCase().trim();

            tableRows.forEach(row => {
                const expCell = row.querySelector('td:first-child').textContent.toLowerCase();
                row.style.display = expCell.includes(expQuery) ? '' : 'none';
            });
        });
    }

});