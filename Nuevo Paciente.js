document.addEventListener('DOMContentLoaded', function () {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const expNumber = document.getElementById('expNumber');
    const age = document.getElementById('age');
    const gender = document.getElementById('gender');
    const phone = document.getElementById('phone');
    const address = document.getElementById('address');
    const prevRegDate = document.getElementById('prevRegDate');

    const today = new Date().toLocaleDateString('es-SV');
    if (prevRegDate) {
        prevRegDate.textContent = today;
    }

    // Actualización en tiempo real de la tarjeta de vista previa
    function updatePreview() {
        const fullName = `${firstName ? firstName.value : ''} ${lastName ? lastName.value : ''}`.trim();
        
        const prevNameEl = document.getElementById('prevName');
        const prevExpEl = document.getElementById('prevExp');
        const prevAgeEl = document.getElementById('prevAge');
        const prevGenderEl = document.getElementById('prevGender');
        const prevPhoneEl = document.getElementById('prevPhone');
        const prevAddressEl = document.getElementById('prevAddress');

        if (prevNameEl) prevNameEl.textContent = fullName !== '' ? fullName : '—';
        if (prevExpEl) prevExpEl.textContent = expNumber && expNumber.value !== '' ? expNumber.value : '—';
        if (prevAgeEl) prevAgeEl.textContent = age && age.value !== '' ? age.value + ' años' : '—';
        if (prevGenderEl) prevGenderEl.textContent = gender && gender.value !== '' ? gender.value : '—';
        if (prevPhoneEl) prevPhoneEl.textContent = phone && phone.value !== '' ? phone.value : '—';
        if (prevAddressEl) prevAddressEl.textContent = address && address.value !== '' ? address.value : '—';
    }

    [firstName, lastName, expNumber, age, gender, phone, address].forEach(input => {
        if (input) {
            input.addEventListener('input', updatePreview);
            input.addEventListener('change', updatePreview);
        }
    });

    // Botón Limpiar
    const btnClear = document.getElementById('btnClear');
    const patientForm = document.getElementById('patientForm');

    if (btnClear && patientForm) {
        btnClear.addEventListener('click', function () {
            patientForm.reset();
            updatePreview();
            if (prevRegDate) {
                prevRegDate.textContent = today;
            }
        });
    }
});