// Variables globales
let humedadActual = Math.floor(Math.random() * 20); // Humedad inicial aleatoria
let historialHumedad = []; // Historial de valores de humedad
let tiempo = 0; // Tiempo simulado

// Referencias a elementos del DOM
const humedadActualElemento = document.getElementById("humedad-actual");
const listaHistorial = document.getElementById("lista-historial");

// Inicialización del gráfico
let ctx = document.getElementById('humidityChart').getContext('2d');
let humidityChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Etiquetas de tiempo
        datasets: [{
            label: 'Humedad (%)',
            data: [], // Datos de humedad
            borderColor: 'rgba(103, 58, 183, 1)',
            backgroundColor: 'rgba(103, 58, 183, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});

// Función para cambiar entre secciones
function mostrarSeccion(seccion) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById(seccion).style.display = 'block';
}

// Botones de navegación
document.getElementById("btn-inicio").addEventListener("click", () => mostrarSeccion("inicio"));
document.getElementById("btn-sensores").addEventListener("click", () => mostrarSeccion("sensores"));
document.getElementById("btn-historial").addEventListener("click", () => mostrarSeccion("historial"));
document.getElementById("btn-perfil").addEventListener("click", () => mostrarSeccion("perfil"));

// Función para obtener la humedad actual
function obtenerHumedadActual() {
    // Simulación de cambio de humedad
    const cambio = Math.random() > 0.5 ? -Math.floor(Math.random() * 5) - 1 : 0;
    
    if (humedadActual < 20) {
        setTimeout(() => {
            humedadActual += Math.floor(Math.random() * 10) + 20;
        }, 60000);
    } else if (humedadActual >= 21) {
        humedadActual += cambio;
    }

    if (humedadActual < 0) humedadActual = 0;
    if (humedadActual > 100) humedadActual = 100;

    // Actualizar en el DOM
    humedadActualElemento.textContent = `${humedadActual}%`;

    // Guardar en el historial
    historialHumedad.unshift({ tiempo: tiempo++, humedad: humedadActual });
    if (historialHumedad.length > 20) historialHumedad.pop();

    actualizarHistorial();
    actualizarGrafico();
}

// Función para actualizar la lista de historial
function actualizarHistorial() {
    listaHistorial.innerHTML = '';
    historialHumedad.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `Tiempo ${entry.tiempo}: Humedad ${entry.humedad}%`;
        listaHistorial.appendChild(li);
    });
}

// Función para actualizar el gráfico
function actualizarGrafico() {
    let labels = historialHumedad.map(entry => `T${entry.tiempo}`);
    let data = historialHumedad.map(entry => entry.humedad);
    humidityChart.data.labels = labels;
    humidityChart.data.datasets[0].data = data;
    humidityChart.update();
}

// Botón para ver humedad actual
document.getElementById("btn-ver-humedad").addEventListener("click", obtenerHumedadActual);

// Actualizar cada minuto
setInterval(obtenerHumedadActual, 60000);
