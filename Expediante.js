// =====================================================
// EXPEDIENTES.JS
// =====================================================


// =====================================================
// REGRESAR AL DASHBOARD
// =====================================================

const backBtn = document.getElementById("backBtn");

backBtn.addEventListener("click", function () {

    window.location.href = "Dashboard.html";

});


// =====================================================
// CERRAR SESIÓN
// =====================================================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {

    const confirmar = confirm(
        "¿Desea cerrar sesión?"
    );

    if (confirmar) {

        window.location.href = "index.html";

    }

});


// =====================================================
// ACTUALIZAR EXPEDIENTE
// =====================================================

const updateBtn = document.getElementById("updateBtn");

updateBtn.addEventListener("click", function () {

    alert(
        "Aquí se abrirá el formulario para actualizar el expediente."
    );

});


// =====================================================
// BOTONES "VER DETALLE"
// =====================================================

const detailButtons =
    document.querySelectorAll(".detail-btn");


detailButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const row =
            this.closest("tr");

        const cells =
            row.querySelectorAll("td");

        const fecha =
            cells[0].textContent.trim();

        const motivo =
            cells[2].textContent.trim();

        const diagnostico =
            cells[3].textContent.trim();

        const medico =
            cells[4].textContent.trim();


        alert(
            "DETALLE DE LA CONSULTA\n\n" +
            "Fecha: " + fecha + "\n" +
            "Motivo: " + motivo + "\n" +
            "Diagnóstico: " + diagnostico + "\n" +
            "Médico: " + medico
        );

    });

});


// =====================================================
// BUSCAR EXPEDIENTE
// =====================================================

const searchInput =
    document.getElementById("searchInput");

const historyTable =
    document.getElementById("historyTable");


searchInput.addEventListener("input", function () {

    const search =
        this.value.toLowerCase().trim();


    const rows =
        historyTable.querySelectorAll("tr");


    rows.forEach(function (row) {

        const text =
            row.textContent.toLowerCase();


        if (text.includes(search)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

});


// =====================================================
// FILTRO DE FECHAS
// =====================================================

const dateFilter =
    document.getElementById("dateFilter");


dateFilter.addEventListener("change", function () {

    console.log(
        "Filtro seleccionado:",
        this.value
    );

});


// =====================================================
// PESTAÑAS
// =====================================================

const historyTab =
    document.getElementById("historyTab");

const consultationsTab =
    document.getElementById("consultationsTab");


historyTab.addEventListener("click", function () {

    historyTab.classList.add("active");

    consultationsTab.classList.remove("active");

});


consultationsTab.addEventListener("click", function () {

    consultationsTab.classList.add("active");

    historyTab.classList.remove("active");

    alert(
        "Aquí se mostrarán las consultas anteriores."
    );

});