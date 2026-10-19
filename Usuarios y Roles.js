// Redirección al cerrar sesión apuntando a Iniciar Sesión.html
document.getElementById('btnLogout').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('usuarioSesion');
    window.location.href = "Iniciar Sesión.html";
});

// Filtro rápido de búsqueda por texto en la tabla
document.getElementById('searchInput').addEventListener('keyup', function() {
    let filter = this.value.toLowerCase();
    let rows = document.querySelectorAll('.data-table tbody tr');

    rows.forEach(row => {
        let text = row.innerText.toLowerCase();
        if (text.includes(filter)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});