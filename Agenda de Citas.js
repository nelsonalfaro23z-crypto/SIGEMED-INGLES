document.addEventListener('DOMContentLoaded', function () {

    // 1. OBTENER LA FECHA REAL DEL SISTEMA DÍA CON DÍA
    const today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const monthYearText = document.getElementById('monthYearText');
    const calendarDays = document.getElementById('calendarDays');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    // 2. FUNCIÓN DE RENDERIZADO DEL CALENDARIO DINÁMICO
    function renderCalendar() {
        if (monthYearText) {
            monthYearText.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        }

        const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
        const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Ajuste para comenzar semana en Lunes (0 = Lun, 6 = Dom)
        let adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

        let daysHTML = "";

        // Casillas vacías al inicio del mes
        for (let x = 0; x < adjustedFirstDay; x++) {
            daysHTML += `<div class="day-number empty"></div>`;
        }

        // Generación de días del mes
        for (let day = 1; day <= lastDay; day++) {
            // Comparación de día exacto con la fecha del sistema
            const isToday = day === today.getDate() &&
                            currentMonth === today.getMonth() &&
                            currentYear === today.getFullYear();

            daysHTML += `
                <div class="day-number ${isToday ? 'is-today' : ''}" data-day="${day}">
                    ${day}
                </div>
            `;
        }

        if (calendarDays) {
            calendarDays.innerHTML = daysHTML;
            attachDayClickEvents();
        }
    }

    // 3. ASIGNAR FECHA SELECCIONADA AL CAMPO DE FECHA EN EL FORMULARIO
    function attachDayClickEvents() {
        const allDays = document.querySelectorAll('.day-number:not(.empty)');
        allDays.forEach(dayEl => {
            dayEl.addEventListener('click', function () {
                allDays.forEach(d => d.classList.remove('selected'));
                this.classList.add('selected');

                const selectedDay = this.getAttribute('data-day');
                const formattedMonth = String(currentMonth + 1).padStart(2, '0');
                const formattedDay = String(selectedDay).padStart(2, '0');

                const selectedDateFormatted = `${currentYear}-${formattedMonth}-${formattedDay}`;

                const dateInput = document.getElementById('dateInput');
                if (dateInput) {
                    dateInput.value = selectedDateFormatted;
                }
            });
        });
    }

    // 4. CAMBIO DE MES
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function () {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function () {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }

    // 5. ACCIÓN DEL BOTÓN DE REGRESAR AL DASHBOARD
    const btnBack = document.getElementById('btnBack');
    if (btnBack) {
        btnBack.addEventListener('click', function() {
            window.location.href = 'Dashboard Administrador.html';
        });
    }

    // 6. FORMULARIO DE CITAS
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('¡Cita agendada y guardada exitosamente!');
            appointmentForm.reset();
            renderCalendar();
        });
    }

    // RENDERIZAR INICIAL
    renderCalendar();
});