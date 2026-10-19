document.addEventListener('DOMContentLoaded', function () {

    // 1. BÚSQUEDA DE PACIENTES EN TIEMPO REAL
    const selectPaciente = document.getElementById('selectPaciente');
    const idPacienteInput = document.getElementById('idPacienteInput');
    
    let resultsPaciente = document.getElementById('resultsPaciente');
    if (!resultsPaciente && selectPaciente) {
        resultsPaciente = document.createElement('div');
        resultsPaciente.id = 'resultsPaciente';
        resultsPaciente.className = 'autocomplete-results';
        selectPaciente.parentNode.appendChild(resultsPaciente);
    }

    if (selectPaciente) {
        selectPaciente.addEventListener('input', function () {
            const query = this.value.trim();
            if (query.length < 2) {
                resultsPaciente.style.display = 'none';
                idPacienteInput.value = '';
                return;
            }

            fetch(`api_citas.php?action=buscar_paciente&q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    resultsPaciente.innerHTML = '';
                    if (data.length > 0) {
                        data.forEach(pac => {
                            const div = document.createElement('div');
                            div.className = 'autocomplete-item';
                            div.innerHTML = `<strong>${pac.nombre} ${pac.apellido}</strong> (${pac.num_expediente})`;
                            div.addEventListener('click', function () {
                                selectPaciente.value = `${pac.nombre} ${pac.apellido}`;
                                idPacienteInput.value = pac.id_paciente;
                                resultsPaciente.style.display = 'none';
                            });
                            resultsPaciente.appendChild(div);
                        });
                        resultsPaciente.style.display = 'block';
                    } else {
                        resultsPaciente.style.display = 'none';
                    }
                })
                .catch(err => console.error(err));
        });

        document.addEventListener('click', function (e) {
            if (!selectPaciente.contains(e.target) && !resultsPaciente.contains(e.target)) {
                resultsPaciente.style.display = 'none';
            }
        });
    }

    // 2. CALENDARIO DE CITAS DINÁMICO CON COLORES
    const today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();
    let fechasOcupadas = {};

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const monthYearText = document.getElementById('monthYearText');
    const calendarDays = document.getElementById('calendarDays');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    function cargarFechasYRenderizar() {
        fetch('api_citas.php?action=obtener_fechas')
            .then(res => res.json())
            .then(data => {
                fechasOcupadas = data;
                renderCalendar();
            })
            .catch(() => renderCalendar());
    }

    function renderCalendar() {
        if (monthYearText) {
            monthYearText.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        }

        const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
        const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

        let adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
        let daysHTML = "";

        for (let x = 0; x < adjustedFirstDay; x++) {
            daysHTML += `<div class="day-number empty"></div>`;
        }

        for (let day = 1; day <= lastDay; day++) {
            const isToday = day === today.getDate() &&
                            currentMonth === today.getMonth() &&
                            currentYear === today.getFullYear();

            const formattedMonth = String(currentMonth + 1).padStart(2, '0');
            const formattedDay = String(day).padStart(2, '0');
            const dateKey = `${currentYear}-${formattedMonth}-${formattedDay}`;

            let extraClass = fechasOcupadas[dateKey] ? "day-ocupado" : "day-disponible";
            if (isToday) extraClass += " is-today";

            daysHTML += `
                <div class="day-number ${extraClass}" data-date="${dateKey}" data-day="${day}">
                    ${day}
                </div>
            `;
        }

        if (calendarDays) {
            calendarDays.innerHTML = daysHTML;
            attachDayClickEvents();
        }
    }

    function attachDayClickEvents() {
        const allDays = document.querySelectorAll('.day-number:not(.empty)');
        allDays.forEach(dayEl => {
            dayEl.addEventListener('click', function () {
                allDays.forEach(d => d.classList.remove('day-selected'));
                this.classList.add('day-selected');

                const selectedDate = this.getAttribute('data-date');
                const dateInput = document.getElementById('dateInput');
                if (dateInput) {
                    dateInput.value = selectedDate;
                }
            });
        });
    }

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function () {
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            cargarFechasYRenderizar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function () {
            currentMonth++;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            cargarFechasYRenderizar();
        });
    }

    // 3. CARGAR TABLA DE CITAS PROGRAMADAS DESDE LA BASE DE DATOS
    function cargarTablaCitas() {
        const appointmentsTableBody = document.getElementById('appointmentsTableBody');
        const txtTotalCitas = document.getElementById('txtTotalCitas');

        fetch('api_citas.php?action=listar_citas')
            .then(res => res.json())
            .then(citas => {
                appointmentsTableBody.innerHTML = '';
                if (citas.length > 0) {
                    citas.forEach(c => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${c.fecha_sv}</td>
                            <td>${c.hora}</td>
                            <td><strong>${c.paciente}</strong></td>
                            <td>${c.medico}</td>
                            <td>${c.motivo}</td>
                            <td><span class="badge-status status-confirmada">${c.estado}</span></td>
                            <td>
                                <div class="actions">
                                    <button class="btn-icon-table" title="Ver detalles"><i class="fa-regular fa-eye"></i></button>
                                    <button class="btn-icon-table" title="Editar"><i class="fa-solid fa-pen"></i></button>
                                    <button class="btn-icon-table btn-delete" title="Eliminar"><i class="fa-regular fa-trash-can"></i></button>
                                </div>
                            </td>
                        `;
                        appointmentsTableBody.appendChild(tr);
                    });
                    txtTotalCitas.textContent = `Mostrando ${citas.length} cita(s) programada(s)`;
                } else {
                    appointmentsTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;">No hay citas programadas actualmente.</td></tr>`;
                    txtTotalCitas.textContent = `Mostrando 0 citas`;
                }
            })
            .catch(err => console.error(err));
    }

    // 4. GUARDAR CITA DESDE EL FORMULARIO
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function (e)  {
            e.preventDefault();

            if (!selectPaciente.value) {
                alert('Por favor, selecciona un paciente válido de la lista desplegable.');
                return;
            }

            const formData = new FormData(this);
            formData.append('action', 'guardar_cita');
            
            // Asignar los campos correspondientes a la tabla SQL
            formData.set('paciente', selectPaciente.value);
            formData.set('medico', document.getElementById('selectMedicoCita').value);
            formData.set('fecha', document.getElementById('dateInput').value);
            formData.set('hora', document.getElementById('timeInput').value);
            formData.set('motivo', 'Consulta general');

            fetch('api_citas.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                if (data.status === 'success') {
                    appointmentForm.reset();
                    idPacienteInput.value = '';
                    cargarTablaCitas();
                    cargarFechasYRenderizar();
                }
            })
            .catch(err => {
                console.error(err);
                alert('Ocurrió un error al guardar la cita.');
            });
        });
    }

    const btnCancel = document.getElementById('btnCancel');
    if (btnCancel) {
        btnCancel.addEventListener('click', function() {
            appointmentForm.reset();
            if (idPacienteInput) idPacienteInput.value = '';
        });
    }

    // INICIALIZACIÓN
    cargarFechasYRenderizar();
    cargarTablaCitas();
});