// Variables
let humedadActual = Math.floor(Math.random() * 20); // Valor inicial de humedad aleatorio (0-20%)
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

// Botón para mostrar humedad actual
document.getElementById("btn-ver-humedad").addEventListener("click", () => {
    document.getElementById("humedad-sensor").textContent = `Humedad actual: ${humedadActual}%`;
});

// Obtener humedad actual y actualizar recomendación
function obtenerHumedadActual() {
    const cambio = Math.random() > 0.5 ? -Math.floor(Math.random() * 5) - 1 : 0; // Decremento entre 1 y 5%
    
    if (humedadActual < 20 && !haRegado) {
        setTimeout(() => {
            humedadActual += Math.floor(Math.random() * 10) + 20; // Simular riego, aumento de 20 a 30%
            haRegado = true;
        }, 60000); // Simular riego después de un minuto
    } else if (humedadActual >= 21) {
        humedadActual += cambio; // Disminuir en niveles altos
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
    historialHumedad.unshift({ tiempo: tiempo++, humedad: humedadActual }); // Insertar al principio (últimos 20)
    if (historialHumedad.length > 20) historialHumedad.pop(); // Limitar el historial a 20 entradas

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

// Actualizar gráfico con datos del historial
function actualizarGrafico() {
    let labels = historialHumedad.map(entry => `T${entry.tiempo}`);
    let data = historialHumedad.map(entry => entry.humedad);
    humidityChart.data.labels = labels;
    humidityChart.data.datasets[0].data = data;
    humidityChart.update();
}

// Actualizar humedad cada 1 minuto
setInterval(obtenerHumedadActual, 60000); // 1 minuto en milisegundos

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
