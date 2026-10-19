document.addEventListener('DOMContentLoaded', function () {

    // 1. FECHA Y HORA ACTUALES SALVADOREÑAS
    function actualizarFechaHora() {
        const now = new Date();
        const txtFecha = document.getElementById('txtFechaActual');
        const txtHora = document.getElementById('txtHoraActual');

        if (txtFecha) {
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            txtFecha.textContent = `${day}/${month}/${now.getFullYear()}`;
        }

        if (txtHora) {
            txtHora.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        }
    }
    actualizarFechaHora();

    // 2. BÚSQUEDA DE PACIENTE EN TIEMPO REAL
    const inputBuscar = document.getElementById('inputBuscarPaciente');
    const resultsContainer = document.getElementById('resultsPaciente');
    const idPacienteInput = document.getElementById('idPacienteInput');

    if (inputBuscar) {
        inputBuscar.addEventListener('input', function () {
            const query = this.value.trim();
            if (query.length < 2) {
                resultsContainer.style.display = 'none';
                return;
            }

            fetch(`api_triaje.php?action=buscar_paciente&q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(pacientes => {
                    resultsContainer.innerHTML = '';
                    if (pacientes.length > 0) {
                        pacientes.forEach(p => {
                            const item = document.createElement('div');
                            item.className = 'autocomplete-item';
                            item.innerHTML = `<strong>${p.nombre} ${p.apellido}</strong> (Exp: ${p.num_expediente})`;
                            item.addEventListener('click', function () {
                                // Rellenar información en la tarjeta
                                idPacienteInput.value = p.id_paciente;
                                document.getElementById('lblExpediente').textContent = p.num_expediente;
                                document.getElementById('lblNombre').textContent = `${p.nombre} ${p.apellido}`;
                                document.getElementById('lblEdad').textContent = `${p.edad} años`;
                                document.getElementById('lblMotivo').textContent = p.motivo_consulta || 'Consulta general';
                                document.getElementById('lblHoraIngreso').textContent = p.hora_ingreso;

                                inputBuscar.value = `${p.nombre} ${p.apellido}`;
                                resultsContainer.style.display = 'none';
                            });
                            resultsContainer.appendChild(item);
                        });
                        resultsContainer.style.display = 'block';
                    } else {
                        resultsContainer.style.display = 'none';
                    }
                })
                .catch(err => console.error(err));
        });

        document.addEventListener('click', function (e) {
            if (!inputBuscar.contains(e.target) && !resultsContainer.contains(e.target)) {
                resultsContainer.style.display = 'none';
            }
        });
    }

    // 3. BOTÓN VER EXPEDIENTE COMPLETO (Redirige enviando el ID del paciente actual)
    const btnVerExpediente = document.querySelector('.btn-ver-expediente');
    if (btnVerExpediente) {
        btnVerExpediente.addEventListener('click', function () {
            const idPaciente = idPacienteInput.value;
            if (idPaciente) {
                window.location.href = `Expedientes_enfer.html?id_paciente=${idPaciente}`;
            } else {
                alert('Por favor, selecciona primero un paciente para ver su expediente.');
            }
        });
    }

    // 4. CAMBIO DINÁMICO DE PRIORIDADES
    const radioPrioridades = document.querySelectorAll('input[name="prioridad"]');
    const badgeText = document.getElementById('badgePrioridadText');
    const descAtencion = document.getElementById('descAtencionText');
    const boxResumen = document.getElementById('boxResumenPrioridad');
    const txtDestino = document.getElementById('txtDestino');

    radioPrioridades.forEach(radio => {
        radio.addEventListener('change', function () {
            const val = this.value;
            boxResumen.className = 'resumen-prioridad-box';

            if (val === 'Caso Grave / Emergencia') {
                boxResumen.classList.add('box-critico');
                badgeText.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> CRÍTICO`;
                descAtencion.textContent = 'Atención inmediata';
                txtDestino.textContent = 'Sala de espera - Prioridad 1';
            } else if (val === 'Caso Delicado') {
                boxResumen.style.backgroundColor = '#fef3c7';
                badgeText.style.backgroundColor = '#d97706';
                badgeText.innerHTML = `<i class="fa-solid fa-heart-pulse"></i> DELICADO`;
                descAtencion.textContent = 'Atención rápida';
                txtDestino.textContent = 'Sala de espera - Prioridad 2';
            } else {
                boxResumen.style.backgroundColor = '#d1fae5';
                badgeText.style.backgroundColor = '#059669';
                badgeText.innerHTML = `<i class="fa-regular fa-clock"></i> NORMAL`;
                descAtencion.textContent = 'Por turno';
                txtDestino.textContent = 'Sala de espera general';
            }
        });
    });

    // 5. ENVÍO DEL FORMULARIO DE TRIAJE
    const formTriaje = document.getElementById('formTriaje');
    if (formTriaje) {
        formTriaje.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!idPacienteInput.value) {
                alert('Por favor busque y seleccione un paciente en la parte superior antes de guardar.');
                return;
            }

            const formData = new FormData(this);
            formData.append('action', 'guardar_triaje');

            fetch('api_triaje.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                if (data.status === 'success') {
                    window.location.href = 'Dashboard Recepción.php';
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error al guardar el triaje.');
            });
        });
    }

    // Cancelar
    const btnCancelar = document.getElementById('btnCancelarTriaje');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', function () {
            window.location.href = 'Dashboard Recepción.php';
        });
    }
});