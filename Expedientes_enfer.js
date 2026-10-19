document.addEventListener('DOMContentLoaded', function() {
    let currentPacienteId = null;

    const urlParams = new URLSearchParams(window.location.search);
    const idPacienteParam = urlParams.get('id_paciente');

    function cargarExpediente(idPaciente = '') {
        let url = `api_expedientes.php?action=obtener_expediente`;
        if (idPaciente) {
            url += `&id_paciente=${idPaciente}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    const pac = data.paciente;
                    currentPacienteId = pac.id_paciente;

                    document.getElementById('cardNombrePaciente').textContent = `${pac.nombre} ${pac.apellido}`;
                    document.getElementById('cardNumExpediente').textContent = pac.num_expediente;
                    document.getElementById('cardEdad').textContent = pac.edad_calculada || 'N/A';
                    document.getElementById('cardGenero').textContent = pac.genero || 'N/A';
                    document.getElementById('cardFechaNac').textContent = pac.fecha_nac_sv;
                    document.getElementById('cardTelefono').textContent = pac.telefono || 'Sin registro';

                    document.getElementById('dtNombre').textContent = pac.nombre;
                    document.getElementById('dtApellido').textContent = pac.apellido;
                    document.getElementById('dtFechaNac').textContent = pac.fecha_nac_sv;
                    document.getElementById('dtEdad').textContent = pac.edad_calculada || 'N/A';
                    document.getElementById('dtGenero').textContent = pac.genero || 'N/A';
                    document.getElementById('dtTelefono').textContent = pac.telefono || 'Sin registro';
                    document.getElementById('dtDireccion').textContent = pac.direccion || 'Sin dirección registrada';

                    document.getElementById('infoAlergias').textContent = pac.alergias || 'Ninguna registrada';
                    document.getElementById('infoPadecimientos').textContent = pac.padecimientos_cronicos || 'Ninguno registrado';
                    document.getElementById('infoObservaciones').textContent = pac.observaciones || 'Sin observaciones registradas.';

                    const tbody = document.getElementById('tableHistorialBody');
                    const txtTotal = document.getElementById('txtTotalHistorial');
                    tbody.innerHTML = '';

                    if (data.historial && data.historial.length > 0) {
                        data.historial.forEach(h => {
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td>${h.fecha_sv}</td>
                                <td><span class="badge-atencion">${h.tipo_atencion}</span></td>
                                <td>${h.motivo}</td>
                                <td>${h.diagnostico}</td>
                                <td>${h.medico}</td>
                                <td><button class="btn-ver-detalle"><i class="fa-regular fa-eye"></i> Ver detalle</button></td>
                            `;
                            tbody.appendChild(tr);
                        });
                        txtTotal.textContent = `Mostrando ${data.historial.length} consulta(s) registrada(s)`;
                    } else {
                        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:15px;">No hay historial de consultas registradas para este paciente.</td></tr>`;
                        txtTotal.textContent = `Mostrando 0 consultas`;
                    }
                }
            })
            .catch(err => console.error('Error al cargar expediente:', err));
    }

    // Inicializar
    cargarExpediente(idPacienteParam);

    // AUTOCOMPLETADO Y BÚSQUEDA EN TIEMPO REAL POR NOMBRE O EXPEDIENTE
    const inputSearch = document.getElementById('inputSearchExpediente');
    const resultsContainer = document.getElementById('resultsExpediente');

    if (inputSearch) {
        inputSearch.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length < 2) {
                resultsContainer.style.display = 'none';
                return;
            }

            fetch(`api_expedientes.php?action=buscar_lista&q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(pacientes => {
                    resultsContainer.innerHTML = '';
                    if (pacientes.length > 0) {
                        pacientes.forEach(p => {
                            const div = document.createElement('div');
                            div.className = 'autocomplete-item';
                            div.innerHTML = `<strong>${p.nombre} ${p.apellido}</strong> (Exp: ${p.num_expediente})`;
                            div.addEventListener('click', function() {
                                inputSearch.value = `${p.nombre} ${p.apellido}`;
                                resultsContainer.style.display = 'none';
                                cargarExpediente(p.id_paciente);
                            });
                            resultsContainer.appendChild(div);
                        });
                        resultsContainer.style.display = 'block';
                    } else {
                        resultsContainer.style.display = 'none';
                    }
                })
                .catch(err => console.error(err));
        });

        document.addEventListener('click', function(e) {
            if (!inputSearch.contains(e.target) && !resultsContainer.contains(e.target)) {
                resultsContainer.style.display = 'none';
            }
        });
    }

    // BOTÓN ACTUALIZAR EXPEDIENTE
    const btnActualizarExpediente = document.getElementById('btnActualizarExpediente');
    if (btnActualizarExpediente) {
        btnActualizarExpediente.addEventListener('click', function() {
            if (currentPacienteId) {
                window.location.href = `Nuevo Paciente.html?id_paciente=${currentPacienteId}`;
            } else {
                alert('No hay un paciente seleccionado para modificar.');
            }
        });
    }
});