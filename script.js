// Variables globales
let sensores = [
    { nombre: "Sensor 1", humedad: Math.floor(Math.random() * 20), historial: [], tiempo: 0 },
    { nombre: "Sensor 2", humedad: Math.floor(Math.random() * 20), historial: [], tiempo: 0 },
    { nombre: "Sensor 3", humedad: Math.floor(Math.random() * 20), historial: [], tiempo: 0 },
    { nombre: "Sensor 4", humedad: Math.floor(Math.random() * 20), historial: [], tiempo: 0 },
    { nombre: "Sensor 5", humedad: Math.floor(Math.random() * 20), historial: [], tiempo: 0 },
    { nombre: "Sensor 6", humedad: Math.floor(Math.random() * 20), historial: [], tiempo: 0 }
];

let sensorSeleccionado = null;
let ctx = document.getElementById('humidityChart').getContext('2d');

// Inicialización del gráfico
let humidityChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Humedad (%)',
            data: [],
            borderColor: 'rgba(103, 58, 183, 1)',
            backgroundColor: 'rgba(103, 58, 183, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});

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
document.getElementById("btn-historial").addEventListener("click", () => {
    mostrarSeccion("historial");
    generarListaHistorialSensores();
});
document.getElementById("btn-perfil").addEventListener("click", () => mostrarSeccion("perfil"));

// Función para generar el listado de sensores en la sección de Sensores
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

// Función para seleccionar un sensor y mostrar su humedad actual con aviso
function seleccionarSensor(index) {
    sensorSeleccionado = sensores[index];
    document.getElementById('nombre-sensor').textContent = sensorSeleccionado.nombre;
    document.getElementById('humedad-actual-sensor').textContent = ${sensorSeleccionado.humedad}%;

    // Mostrar el aviso correspondiente al nivel de humedad
    let aviso = obtenerAvisoHumedad(sensorSeleccionado.humedad);
    document.getElementById('aviso-humedad-sensor').textContent = aviso;
}

// Función para generar el listado de sensores en la sección de Historial
function generarListaHistorialSensores() {
    const listaHistorial = document.getElementById('lista-historial-sensores');
    listaHistorial.innerHTML = '';

    sensores.forEach((sensor, index) => {
        const li = document.createElement('li');
        li.textContent = sensor.nombre;
        li.addEventListener('click', () => mostrarHistorial(index));
        listaHistorial.appendChild(li);
    });
}

// Función para mostrar el historial de un sensor seleccionado en la sección de Historial
function mostrarHistorial(index) {
    sensorSeleccionado = sensores[index];

    // Asegurarse de que haya datos históricos para el sensor
    if (sensorSeleccionado.historial.length > 0) {
        const labels = sensorSeleccionado.historial.map((_, i) => Min ${sensorSeleccionado.tiempo - i}).reverse();
        const data = sensorSeleccionado.historial.slice().reverse();

        // Actualizar el gráfico con los datos del sensor seleccionado
        humidityChart.data.labels = labels;
        humidityChart.data.datasets[0].data = data;
        humidityChart.update();

        // Mostrar el aviso correspondiente al nivel de humedad más reciente
        let aviso = obtenerAvisoHumedad(sensorSeleccionado.humedad);
        document.getElementById('aviso-humedad-historial').textContent = aviso;
    } else {
        // Si no hay historial, vaciar el gráfico
        humidityChart.data.labels = [];
        humidityChart.data.datasets[0].data = [];
        humidityChart.update();
        document.getElementById('aviso-humedad-historial').textContent = '';
    }
}

// Función para actualizar los datos de los sensores cada minuto
function actualizarSensores() {
    sensores.forEach(sensor => {
        sensor.tiempo++;
        if (sensor.humedad < 20) {
            sensor.humedad += Math.floor(Math.random() * 10 + 20);
        } else {
            sensor.humedad -= Math.floor(Math.random() * 5);
        }
        sensor.historial.unshift(sensor.humedad);
        if (sensor.historial.length > 20) sensor.historial.pop();
    });

    // Si hay un sensor seleccionado, actualizar la pantalla
    if (sensorSeleccionado) {
        document.getElementById('humedad-actual-sensor').textContent = ${sensorSeleccionado.humedad}%;
        mostrarHistorial(sensores.indexOf(sensorSeleccionado));
    }
}

// Botón para mostrar humedad actual del sensor seleccionado
document.getElementById("btn-ver-humedad").addEventListener('click', () => {
    if (sensorSeleccionado) {
        document.getElementById('humedad-actual-sensor').textContent = ${sensorSeleccionado.humedad}%;
    }
});

// Función para obtener el aviso según el nivel de humedad
function obtenerAvisoHumedad(humedad) {
    if (humedad < 20) {
        return "Tienes que regar";
    } else if (humedad >= 21 && humedad <= 60) {
        return "No hace falta riego";
    } else {
        return "Exceso de humedad, no regar";
    }
}

// Actualizar sensores y lista cada minuto
setInterval(actualizarSensores, 60000);

// Generar listas de sensores y mostrar la sección de inicio
generarListaSensores();