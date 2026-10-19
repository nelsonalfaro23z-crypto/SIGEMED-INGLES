<?php
$conn = new mysqli("localhost", "root", "", "sigemed");

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$sql = "INSERT INTO paciente (num_expediente, nombre, apellido, fecha_nacimiento, edad, genero, telefono, direccion, fecha_registro) 
        VALUES ('EXP-TEST', 'Prueba', 'Fuego', '2000-01-01', 25, 'Ma', '0000-0000', 'San Salvador', NOW())";

if ($conn->query($sql) === TRUE) {
    echo "¡REGISTRO DE PRUEBA INSERTADO CORRECTAMENTE!";
} else {
    echo "ERROR DE MYSQL: " . $conn->error;
}
$conn->close();
?>