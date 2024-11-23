// Variables
let humedadActual = Math.floor(Math.random() * 100); // Valor inicial de humedad aleatorio
let historialHumedad = []; // Arreglo para almacenar los valores de humedad
let tiempo = 0; // Tiempo simulado
let haRegado = false; // Variable para simular si se ha regado

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

// Botón para ver humedad actual en la sección de sensores
document.getElementById("btn-ver-humedad").addEventListener("click", () => {
    document.getElementById("humedad-sensor").textContent = `Humedad actual: ${humedadActual}%`;
});

// Obtener humedad actual y actualizar recomendación
function obtenerHumedadActual() {
    const cambio = Math.floor(Math.random() * 7) - 3; // Cambia entre -3 y +3
    humedadActual += cambio;

    // Simular riego si la humedad es menor de 20%
    if (humedadActual < 20 && !haRegado) {
        setTimeout(() => {
            humedadActual += Math.floor(Math.random() * 10) + 20; // Aumenta de 20 a 30 unidades
            haRegado = true;
        }, 60000); // Simula que se riega después de un minuto
    }

    // Evitar que la humedad sea menor que 0 o mayor que 100
    if (humedadActual < 0) humedadActual = 0;
    if (humedadActual > 100) humedadActual = 100;

    // Mostrar la humedad actual en la página principal
    document.getElementById("humedad-actual").textContent = `${humedadActual}%`;

    // Mostrar recomendación de riego
    if (humedadActual < 20) {
        document.getElementById("recomendacion-riego").textContent = "Tienes que regar.";
    } else if (humedadActual < 40) {
        document.getElementById("recomendacion-riego").textContent = "Tendrás que regar pronto.";
    } else if (humedadActual < 60) {
        document.getElementById("recomendacion-riego").textContent = "No hace falta regar.";
    } else {
        document.getElementById("recomendacion-riego").textContent = "No riegues. Exceso de humedad.";
    }

    // Guardar el valor de humedad en el historial
    historialHumedad.unshift({ tiempo: tiempo++, humedad: humedadActual }); // Valores recientes primero
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
                beginAtZero: true,
                max: 100
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

// Perfil de usuario
document.getElementById("form-perfil").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const mail = document.getElementById("mail").value;
    const idioma = document.getElementById("idioma").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    
    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }
    
    // Guardar perfil en LocalStorage
    localStorage.setItem("nombre", nombre);
    localStorage.setItem("mail", mail);
    localStorage.setItem("idioma", idioma);
    localStorage.setItem("password", password);
    
    mostrarPerfil();
});

function mostrarPerfil() {
    const nombreGuardado = localStorage.getItem("nombre") || "No guardado";
    const mailGuardado = localStorage.getItem("mail") || "No guardado";
    const idiomaGuardado = localStorage.getItem("idioma") || "No guardado";
    
    document.getElementById("nombre-guardado").textContent = `Nombre: ${nombreGuardado}`;
    document.getElementById("mail-guardado").textContent = `Correo: ${mailGuardado}`;
    document.getElementById("idioma-guardado").textContent = `Idioma: ${idiomaGuardado}`;

    document.getElementById("form-perfil").style.display = "none";
    document.getElementById("profileData").style.display = "block";
    document.getElementById("login-form").style.display = "none";
}

// Iniciar sesión con contraseña
document.getElementById("btn-login").addEventListener("click", () => {
    const inputPassword = document.getElementById("login-password").value;
    const storedPassword = localStorage.getItem("password");

    if (inputPassword === storedPassword) {
        mostrarPerfil();
        document.getElementById("error-login").textContent = "";
    } else {
        document.getElementById("error-login").textContent = "Contraseña incorrecta.";
    }
});

// Cerrar sesión
document.getElementById("btn-logout").addEventListener("click", () => {
    document.getElementById("form-perfil").style.display = "block";
    document.getElementById("profileData").style.display = "none";
    document.getElementById("login-form").style.display = "none";
});

// Mostrar perfil guardado al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("nombre")) {
        document.getElementById("login-form").style.display = "block";
    } else {
        mostrarPerfil();
    }
});
