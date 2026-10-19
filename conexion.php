<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "sigemed";

$conexion = new mysqli($host, $user, $password, $database);
$conexion->set_charset("utf8mb4");

if ($conexion->connect_error) {
    die("Error al conectar con la base de datos: " . $conexion->connect_error);
}
?>