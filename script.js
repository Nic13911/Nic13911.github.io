// Variables
let humedadActual = Math.floor(Math.random() * 100); // Valor inicial de humedad aleatorio
let historialHumedad = []; // Arreglo para almacenar los valores de humedad
let tiempo = 0; // Tiempo simulado

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

// Simular humedad actual y cambios razonables
function obtenerHumedadActual() {
    let cambio = Math.floor(Math.random() * 6) - 3; // Cambios de -3 a +3 en la humedad para mantener la razonabilidad
    humedadActual = Math.max(0, Math.min(100, humedadActual + cambio)); // Limitar entre 0 y 100%

    document.getElementById("humedad-actual").innerText = `Humedad: ${humedadActual}%`;
    
    let recomendacion = "";
    if (humedadActual <= 20) {
        recomendacion = "Tienes que regar.";
    } else if (humedadActual > 20 && humedadActual <= 40) {
        recomendacion = "Tendrás que regar pronto.";
    } else if (humedadActual > 40 && humedadActual <= 60) {
        recomendacion = "No hace falta regar.";
    } else {
        recomendacion = "No riegues. Exceso de humedad.";
    }
    document.getElementById("recomendacion-riego").innerText = recomendacion;

    // Guardar el valor de humedad en el historial
    historialHumedad.push({ tiempo: tiempo++, humedad: humedadActual });
    actualizarHistorial();
    actualizarGrafico();
}

// Actualizar la lista de historial
function actualizarHistorial() {
    const listaHistorial = document.getElementById("lista-historial");
    listaHistorial.innerHTML = ""; // Limpiar la lista
    historialHumedad.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `Tiempo ${entry.tiempo}: Humedad ${entry.humedad}%`;
        listaHistorial.appendChild(li);
    });
}

// Configurar el gráfico de humedad
let ctx = document.getElementById('humidityChart').getContext('2d');
let humidityChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Etiquetas de tiempo (simuladas)
        datasets: [{
            label: 'Humedad (%)',
            data: [], // Datos de humedad
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

// Actualizar gráfico con datos del historial
function actualizarGrafico() {
    let labels = historialHumedad.map(entry => `T${entry.tiempo}`);
    let data = historialHumedad.map(entry => entry.humedad);
    humidityChart.data.labels = labels;
    humidityChart.data.datasets[0].data = data;
    humidityChart.update();
}

// Actualizar humedad cada 5 segundos
setInterval(obtenerHumedadActual, 5000);

// Guardar y mostrar perfil
document.getElementById("form-perfil").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const idioma = document.getElementById("idioma").value;
    
    // Guardar en LocalStorage
    localStorage.setItem("nombre", nombre);
    localStorage.setItem("idioma", idioma);
    
    mostrarPerfil();
});

function mostrarPerfil() {
    const nombreGuardado = localStorage.getItem("nombre") || "No guardado";
    const idiomaGuardado = localStorage.getItem("idioma") || "No guardado";
    
    document.getElementById("nombre-guardado").textContent = `Nombre: ${nombreGuardado}`;
    document.getElementById("idioma-guardado").textContent = `Idioma: ${idiomaGuardado}`;
}

// Mostrar perfil guardado al cargar la página
document.addEventListener("DOMContentLoaded", mostrarPerfil);
