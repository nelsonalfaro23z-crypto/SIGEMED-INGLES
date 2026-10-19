document.addEventListener('DOMContentLoaded', function() {
    const userId = 1; // ID de María López en la tabla usuario

    // 1. CARGAR DATOS DESDE MYSQL
    function cargarPerfil() {
        fetch(`api_perfil.php?action=obtener_perfil&id_usuario=${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    const u = data.usuario;
                    document.getElementById('cardNombreUsuario').textContent = u.nombre_completo;
                    document.getElementById('topNombreUsuario').textContent = u.nombre_completo;
                    document.getElementById('txtIdUsuario').textContent = `#${u.id_usuario}`;
                    document.getElementById('txtCorreoUsuario').textContent = u.correo;

                    // Rellenar inputs del modal de edición
                    document.getElementById('inputNombreEdit').value = u.nombre_completo;
                    document.getElementById('inputCorreoEdit').value = u.correo;
                }
            })
            .catch(err => console.error('Error al cargar perfil:', err));
    }

    cargarPerfil();

    // CERRAR SESIÓN
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('usuarioSesion');
            window.location.href = "Iniciar Sesión.html";
        });
    }

    // 2. MODAL EDITAR MIS DATOS
    const btnEditProfile = document.getElementById('btnEditProfile');
    const modalEdit = document.getElementById('modalEditarPerfil');
    const btnCerrarEdit = document.getElementById('btnCerrarEditModal');

    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', () => modalEdit.style.display = 'flex');
    }
    if (btnCerrarEdit) {
        btnCerrarEdit.addEventListener('click', () => modalEdit.style.display = 'none');
    }

    document.getElementById('formEditDatos').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.append('action', 'actualizar_datos');
        formData.append('id_usuario', userId);

        fetch('api_perfil.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                if (data.status === 'success') {
                    modalEdit.style.display = 'none';
                    cargarPerfil();
                }
            });
    });

    // 3. MODAL CAMBIAR CONTRASEÑA
    const btnChangePassword = document.getElementById('btnChangePassword');
    const modalPass = document.getElementById('modalPassModal');
    const btnCerrarPass = document.getElementById('btnCerrarPassModal');

    if (btnChangePassword) {
        btnChangePassword.addEventListener('click', () => modalPass.style.display = 'flex');
    }
    if (btnCerrarPass) {
        btnCerrarPass.addEventListener('click', () => modalPass.style.display = 'none');
    }

    document.getElementById('formPassChange').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.append('action', 'cambiar_contrasena');
        formData.append('id_usuario', userId);

        fetch('api_perfil.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                if (data.status === 'success') {
                    modalPass.style.display = 'none';
                    this.reset();
                }
            });
    });
});