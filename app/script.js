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
let idiomaActual = 'es'; // Idioma por defecto

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
window.onload = () => {
    mostrarSeccion("inicio");
    cargarPreferenciasUsuario();
    generarListaSensores();
};

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

// Función para seleccionar un sensor
function seleccionarSensor(index) {
    sensorSeleccionado = sensores[index];
    document.getElementById('nombre-sensor').textContent = sensorSeleccionado.nombre;
    document.getElementById('humedad-actual-sensor').textContent = `${sensorSeleccionado.humedad}%`;

    let aviso = obtenerAvisoHumedad(sensorSeleccionado.humedad);
    document.getElementById('aviso-humedad-sensor').textContent = aviso;
}

// Función para generar el listado de historial
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

// Mostrar historial del sensor
function mostrarHistorial(index) {
    sensorSeleccionado = sensores[index];
    if (sensorSeleccionado.historial.length > 0) {
        const labels = sensorSeleccionado.historial.map((_, i) => `Min ${sensorSeleccionado.tiempo - i}`).reverse();
        const data = sensorSeleccionado.historial.slice().reverse();

        humidityChart.data.labels = labels;
        humidityChart.data.datasets[0].data = data;
        humidityChart.update();

        let aviso = obtenerAvisoHumedad(sensorSeleccionado.humedad);
        document.getElementById('aviso-humedad-historial').textContent = aviso;
    } else {
        humidityChart.data.labels = [];
        humidityChart.data.datasets[0].data = [];
        humidityChart.update();
        document.getElementById('aviso-humedad-historial').textContent = '';
    }
}

// Actualizar sensores
function actualizarSensores() {
    sensores.forEach(sensor => {
        sensor.tiempo++;
        sensor.humedad = Math.max(0, sensor.humedad - Math.floor(Math.random() * 5));
        sensor.historial.unshift(sensor.humedad);
        if (sensor.historial.length > 20) sensor.historial.pop();
    });

    if (sensorSeleccionado) {
        document.getElementById('humedad-actual-sensor').textContent = `${sensorSeleccionado.humedad}%`;
        mostrarHistorial(sensores.indexOf(sensorSeleccionado));
    }
}

// Función para obtener aviso de humedad
function obtenerAvisoHumedad(humedad) {
    if (humedad < 20) return idiomaActual === 'es' ? "Tienes que regar" : "You need to water";
    if (humedad <= 60) return idiomaActual === 'es' ? "No hace falta riego" : "No need to water";
    return idiomaActual === 'es' ? "Exceso de humedad, no regar" : "Too much moisture, don't water";
}

// Cambio de idioma
document.getElementById("btn-idioma").addEventListener('click', () => {
    idiomaActual = idiomaActual === 'es' ? 'en' : 'es';
    alert(`Idioma cambiado a ${idiomaActual === 'es' ? 'Español' : 'Inglés'}`);
});

// Guardar preferencias del usuario
function guardarPreferenciasUsuario() {
    const nombreUsuario = document.getElementById('nombre-usuario').value;
    localStorage.setItem('nombreUsuario', nombreUsuario);
    localStorage.setItem('idioma', idiomaActual);
}

// Cargar preferencias del usuario
function cargarPreferenciasUsuario() {
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';
    idiomaActual = localStorage.getItem('idioma') || 'es';
    document.getElementById('nombre-usuario').value = nombreUsuario;
}

// Validación de usuario
document.getElementById("btn-guardar-perfil").addEventListener('click', () => {
    const password = document.getElementById('password').value;
    if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
    } else {
        guardarPreferenciasUsuario();
        alert("Perfil guardado correctamente.");
    }
});

// Actualizar sensores cada minuto
setInterval(actualizarSensores, 60000);
