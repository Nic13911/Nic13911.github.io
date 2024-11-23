// Mostrar la sección seleccionada y ocultar las demás
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
  }
  
  // Guardar perfil en Local Storage
  const profileForm = document.getElementById('profileForm');
  const profileData = document.getElementById('profileData');
  
  profileForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Guardar datos en localStorage
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', btoa(password)); // Encriptamos la contraseña con Base64 (simplificado)
    
    // Mostrar perfil guardado
    displayProfile();
  });
  
  function displayProfile() {
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    
    if (name && email) {
      document.getElementById('displayName').textContent = name;
      document.getElementById('displayEmail').textContent = email;
      
      profileForm.style.display = 'none';
      profileData.style.display = 'block';
    }
  }
  
  // Mostrar perfil si ya existe al cargar la página
  window.onload = function() {
    if (localStorage.getItem('userName')) {
      displayProfile();
    }
  }
// Datos de humedad simulados
const humidityData = [45, 50, 47, 60, 55, 65, 70, 60, 50, 55];

// Crear gráfico
const ctx = document.getElementById('humidityChart').getContext('2d');
const humidityChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct'],
    datasets: [{
      label: 'Humedad (%)',
      data: humidityData,
      borderColor: 'rgba(75, 192, 192, 1)',
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
function simulateSensorData() {
    // Simula un cambio en los valores de humedad cada 5 segundos
    setInterval(() => {
      const newHumidity = Math.floor(Math.random() * 30) + 40; // Rango 40-70%
      humidityData.push(newHumidity);
      if (humidityData.length > 10) humidityData.shift(); // Mantiene solo 10 puntos
      humidityChart.update(); // Actualiza el gráfico
    }, 5000);
  }
  
  simulateSensorData();
