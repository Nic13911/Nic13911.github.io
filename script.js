// Variables globales
let sensores = [
    { nombre: "Sensor 1", humedad: Math.floor(Math.random() * 20), historial: [], tiempo: 0, riegoActivo: false },
    { nombre: "Sensor 2", humedad: Math.floor(Math.random() * 20), historial: [], tiempo: 0, riegoActivo: false },
    { nombre: "Sensor 3", humedad: Math.floor(Math.random() * 20), historial: [], tiempo: 0, riegoActivo: false },
    { nombre: "Sensor 4", humedad: Math.floor(Math.random() * 20), historial: [], tiempo: 0, riegoActivo: false },
    { nombre: "Sensor 5", humedad: Math.floor(Math.random() * 20), historial: [], tiempo: 0, riegoActivo: false },
    { nombre: "Sensor 6", humedad: Math.floor(Math.random() * 20), historial: [], tiempo: 0, riegoActivo: false }
];

let sensorSeleccionado = null;
let intervaloRiego = null;

// Función para mostrar una sección específica
function mostrarSeccion(seccion) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById(seccion).classList.add('active');
}

// Mostrar sección de inicio por defecto
window.onload = () => mostrarSeccion("inicio");

// Manejadores de los botones del menú
document.getElementById("btn-inicio").addEventListener("click", () => mostrarSeccion("inicio"));
document.getElementById("btn-sensores").addEventListener("click", () => mostrarSeccion("sensores"));
document.getElementById("btn-historial").addEventListener("click", () => mostrarSeccion("historial"));
document.getElementById("btn-perfil").addEventListener("click", () => mostrarSeccion("perfil"));

// Función para generar el listado de sensores
function generarListaSensores() {
    const listaSensores = document.getElementById('lista-sensores');
    listaSensores.innerHTML = '';

    sensores.forEach((sensor, index) => {
        const li = document.createElement('li');
        li.textContent = sensor.nombre;
        li.addEventListener('click', () => seleccionarSensor(index));
        listaSensores.appendChild(li);
    });
}

// Función para seleccionar un sensor
function seleccionarSensor(index) {
    sensorSeleccionado = sensores[index];
    document.getElementById('nombre-sensor').textContent = sensorSeleccionado.nombre;
    document.getElementById('humedad-actual-sensor').textContent = `${sensorSeleccionado.humedad}%`;
    document.getElementById('aviso-humedad-sensor').textContent = obtenerAvisoHumedad(sensorSeleccionado.humedad);
}

// Función para activar riego
document.getElementById('btn-activar-riego').addEventListener('click', () => {
    if (sensorSeleccionado) {
        clearInterval(intervaloRiego);
        sensorSeleccionado.riegoActivo = true;

        intervaloRiego = setInterval(() => {
            if (sensorSeleccionado.humedad < 80) {
                sensorSeleccionado.humedad += Math.floor(Math.random() * 3 + 1);
                actualizarHumedadUI();
            }
        }, 1000);
    }
});

// Función para cortar riego
document.getElementById('btn-cortar-riego').addEventListener('click', () => {
    if (sensorSeleccionado) {
        clearInterval(intervaloRiego);
        sensorSeleccionado.riegoActivo = false;

        intervaloRiego = setInterval(() => {
            if (sensorSeleccionado.humedad > 20) {
                sensorSeleccionado.humedad -= Math.floor(Math.random() * 2 + 1);
                actualizarHumedadUI();
            }
        }, 2000);
    }
});

// Función para actualizar la humedad en la UI
function actualizarHumedadUI() {
    document.getElementById('humedad-actual-sensor').textContent = `${sensorSeleccionado.humedad}%`;
    document.getElementById('aviso-humedad-sensor').textContent = obtenerAvisoHumedad(sensorSeleccionado.humedad);
}

// Aviso según nivel de humedad
function obtenerAvisoHumedad(humedad) {
    if (humedad < 20) return "Tienes que regar";
    if (humedad >= 21 && humedad <= 60) return "No hace falta riego";
    return "Exceso de humedad, no regar";
}

generarListaSensores();
