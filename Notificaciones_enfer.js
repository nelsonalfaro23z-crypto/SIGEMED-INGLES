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

    // MARCAR UNA SOLA NOTIFICACIÓN COMO LEÍDA
    const btnsMarkSingle = document.querySelectorAll('.btnMarkSingle');
    btnsMarkSingle.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.notification-card');
            if (card) {
                card.classList.remove('unread', 'urgent');
                const dot = card.querySelector('.unread-dot');
                if (dot) dot.remove();
                this.remove(); // Remueve el botón de marcar leída
            }
        });
    });

    // MARCAR TODAS COMO LEÍDAS
    const btnMarkAllRead = document.getElementById('btnMarkAllRead');
    if (btnMarkAllRead) {
        btnMarkAllRead.addEventListener('click', function() {
            const unreadCards = document.querySelectorAll('.notification-card.unread');
            unreadCards.forEach(card => {
                card.classList.remove('unread', 'urgent');
                const dot = card.querySelector('.unread-dot');
                if (dot) dot.remove();
                const btnSingle = card.querySelector('.btnMarkSingle');
                if (btnSingle) btnSingle.remove();
            });
            alert('Todas las notificaciones han sido marcadas como leídas.');
        });
    }

    // LIMPIAR TODAS LAS NOTIFICACIONES
    const btnClearAll = document.getElementById('btnClearAll');
    if (btnClearAll) {
        btnClearAll.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que querés borrar todas las notificaciones?')) {
                const list = document.querySelector('.notifications-list');
                list.innerHTML = '<p style="text-align:center; padding: 20px; color: #64748b;">No tienes notificaciones pendientes.</p>';
            }
        });
    }

    // FILTROS POR PESTAÑAS (TODAS / NO LEÍDAS / URGENTES)
    const tabBtns = document.querySelectorAll('.filter-tabs .tab-btn');
    const allCards = document.querySelectorAll('.notification-card');

    tabBtns.forEach(tab => {
        tab.addEventListener('click', function() {
            tabBtns.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            allCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'flex';
                } else if (filter === 'unread') {
                    card.style.display = card.classList.contains('unread') ? 'flex' : 'none';
                } else if (filter === 'urgent') {
                    card.style.display = card.classList.contains('urgent') ? 'flex' : 'none';
                }
            });
        });
    });

});