// Variables
let humedadActual = 0;

// Cambiar entre secciones
document.getElementById("btn-inicio").addEventListener("click", () => mostrarSeccion("inicio"));
document.getElementById("btn-sensores").addEventListener("click", () => mostrarSeccion("sensores"));
document.getElementById("btn-historial").addEventListener("click", () => mostrarSeccion("historial"));
document.getElementById("btn-perfil").addEventListener("click", () => mostrarSeccion("perfil"));

function mostrarSeccion(seccion) {
    const sections = document.querySelectorAll(".section");
    sections.forEach(sec => sec.style.display = "none");
    document.getElementById(seccion).style.display = "block";
}

// Simular humedad actual
function obtenerHumedadActual() {
    humedadActual = Math.floor(Math.random() * 100);
    document.getElementById("humedad-actual").innerText = `Humedad: ${humedadActual}%`;
    document.getElementById("recomendacion-riego").innerText = humedadActual >= 20 && humedadActual <= 60
        ? "Recomendación: No es necesario regar."
        : "Recomendación: Es recomendable regar.";
}

setInterval(obtenerHumedadActual, 5000); // Actualiza cada 5 segundos

// Humedad en la sección de sensores
document.getElementById("btn-ver-humedad").addEventListener("click", () => {
    document.getElementById("humedad-sensor").innerText = `Humedad actual: ${humedadActual}%`;
});

// Guardar perfil en LocalStorage
document.getElementById("form-perfil").addEventListener("submit", function(event) {
    event.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const idioma = document.getElementById("idioma").value;

    localStorage.setItem("nombre", nombre);
    localStorage.setItem("idioma", idioma);

    mostrarPerfilGuardado();
});

function mostrarPerfilGuardado() {
    const nombreGuardado = localStorage.getItem("nombre");
    const idiomaGuardado = localStorage.getItem("idioma");

    document.getElementById("nombre-guardado").innerText = `Nombre: ${nombreGuardado}`;
    document.getElementById("idioma-guardado").innerText = `Idioma: ${idiomaGuardado}`;
}

// Cargar perfil guardado al cargar la página
document.addEventListener("DOMContentLoaded", mostrarPerfilGuardado);

// Gráfico de Humedad (Historial)
const ctx = document.getElementById('humidityChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['1', '2', '3', '4', '5'], // Simular etiquetas (puedes cambiarlo por fechas o horas)
        datasets: [{
            label: 'Humedad (%)',
            data: [30, 50, 40, 60, 45], // Simular valores de humedad
            borderColor: 'rgba(103, 58, 183, 1)',
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
