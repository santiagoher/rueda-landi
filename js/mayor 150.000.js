const array_concursantes = [
    { nombre: "Mini parlante", imagen: "img/parlante.png" },
    { nombre: "Porta casco", imagen: "img/porta casco.png" },
    { nombre: "Kit LMT", imagen: "img/kit LMT.png" },
    { nombre: "Tula", imagen: "img/Tula.png" },
    { nombre: "Balon", imagen: "img/Balon.png" },
    { nombre: "Gorra marcas varias", imagen: "img/Gorra varias.png" },
    { nombre: "Agendas", imagen: "img/Agenas.png" },
    { nombre: "Maletin deportivo", imagen: "img/Maletin deportivo.png" },
    { nombre: "Kit herramientas imbra", imagen: "img/kit herramientas imbra.png" },
    { nombre: "Sombrilla", imagen: "img/Sombrilla.png" },
    { nombre: "Cuaderno", imagen: "img/Cuaderno.png" },
    { nombre: "Placa arbolito", imagen: "img/Placa arbolito.png" },
    { nombre: "Camiseta", imagen: "img/Camisetas.png" },
    { nombre: "Canguro", imagen: "img/Canguros.png" },
    { nombre: "Morral", imagen: "img/Morral.png" },
    { nombre: "Gorra plana", imagen: "img/Gorra planas.png" },
    { nombre: "Piernera", imagen: "img/Piernera.png" },
    { nombre: "Chaqueta impermeable", imagen: "img/Chaquete impermedable.png" },
  ];
  
  let canvas = document.getElementById("idcanvas");
  let context = canvas.getContext("2d");
  let center = canvas.width / 2;
  let radius = center;
  
  // Cargar imágenes
  function cargarImagenes(callback) {
    let totalImagenes = array_concursantes.length;
    let imagenesCargadas = 0;
  
    array_concursantes.forEach((item, index) => {
      let img = new Image();
      img.src = item.imagen;
      img.onload = () => {
        item.imgElement = img;
        imagenesCargadas++;
        if (imagenesCargadas === totalImagenes) {
          callback();
        }
      };
      img.onerror = () => {
        console.error(`Error al cargar la imagen: ${item.imagen}`);
      };
    });
  }
  
  // Dibujar la ruleta
 // Dibujar la ruleta
function dibujarRuleta(rotacion = 0) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    let radioTexto = center - 70;
    let colores = ["#f15622", "#2d2d2d"];
  
    for (let i = 0; i < array_concursantes.length; i++) {
      let inicioAngulo = (i * 2 * Math.PI) / array_concursantes.length + rotacion;
      let finAngulo = ((i + 1) * 2 * Math.PI) / array_concursantes.length + rotacion;
  
      context.save();
      context.beginPath();
      context.moveTo(center, center);
      context.arc(center, center, center - 20, inicioAngulo, finAngulo);
      context.closePath();
      context.fillStyle = colores[i % 2];
      context.fill();
      context.restore();
  
      // Dibujar fondo circular blanco
      let anguloMedio = (inicioAngulo + finAngulo) / 2;
      let xImagen = center + radioTexto * Math.cos(anguloMedio);
      let yImagen = center + radioTexto * Math.sin(anguloMedio);
  
      context.save();
      context.beginPath();
      context.arc(xImagen, yImagen, 40, 0, 2 * Math.PI); // Fondo circular blanco
      context.fillStyle = "#ffffff";
      context.fill();
      context.restore();
  
      // Dibujar imágenes
      if (array_concursantes[i].imgElement) {
        context.drawImage(
          array_concursantes[i].imgElement,
          xImagen - 30, // Ajuste para centrar horizontalmente
          yImagen - 30, // Ajuste para centrar verticalmente
          60, // Ancho de la imagen
          60  // Alto de la imagen
        );
      }
    }
    dibujarIndicadorMetido();
  }
  
  
  // Dibujar el indicador
  function dibujarIndicadorMetido() {
    context.save();
    context.beginPath();
    context.moveTo(center + radius - 10, center - 20);
    context.lineTo(center + radius - 10, center);
    context.lineTo(center + radius - 10, center + 20);
    context.closePath();
    context.fillStyle = "red";
    context.fill();
    context.restore();
  }
  // Cargar el sonido
const sonidoSegmento = new Audio("img/op1.mp3"); // Ruta del archivo de sonido

// Función para sortear
function sortear() {
  let inicio = null;
  let duracion = 6000;
  let vueltasCompletas = 10;
  let segmentos = array_concursantes.length;

  // Seleccionar el segmento ganador
  let indiceGanador = Math.floor(Math.random() * segmentos);
  let anguloPorSegmento = 360 / segmentos;
  let anguloGanador = 360 - (indiceGanador * anguloPorSegmento + anguloPorSegmento / 2);
  let anguloFinal = vueltasCompletas * 360 + anguloGanador;

  // Variable para rastrear el último segmento reproducido
  let ultimoSegmento = -1;

  function animarGiro(timestamp) {
    if (!inicio) inicio = timestamp;
    let progreso = (timestamp - inicio) / duracion;

    let easing = progreso < 0.8 ? Math.pow(progreso, 2) : 1 - Math.pow(1 - progreso, 2);
    let rotacion = easing * anguloFinal;

    // Dibujar la ruleta
    dibujarRuleta((rotacion * Math.PI) / 180);

    // Calcular el segmento actual
    let anguloActual = (rotacion % 360) / (360 / segmentos);
    let segmentoActual = Math.floor(anguloActual);

    // Reproducir sonido si cambia de segmento
    if (segmentoActual !== ultimoSegmento) {
      sonidoSegmento.currentTime = 0; // Reinicia el sonido
      sonidoSegmento.play();
      ultimoSegmento = segmentoActual;
    }

    if (progreso < 1) {
      requestAnimationFrame(animarGiro);
    } else {
      mostrarPremio(indiceGanador);
    }
  }

  requestAnimationFrame(animarGiro);
}

  
function mostrarPremio(indiceGanador) {
  let premio = array_concursantes[indiceGanador];
  let modal = document.getElementById("modal-premio");
  let contenidoPremio = document.getElementById("contenido-premio");  // Asegúrate de tener un contenedor en el modal
  let textoPremio = document.getElementById("texto-premio");

  // Limpiar contenido anterior
  contenidoPremio.innerHTML = '';

  // Crear imagen del premio
  let imagenPremio = document.createElement("img");
  imagenPremio.src = premio.imagen;
  imagenPremio.alt = premio.nombre;
  imagenPremio.style.width = "200px";  // Tamaño ajustado para la imagen
  imagenPremio.style.height = "200px";
  imagenPremio.style.marginBottom = "15px";  // Separación entre la imagen y el texto

  // Crear el nombre del premio
  let nombrePremio = document.createElement("p");
  nombrePremio.textContent = `¡Ganaste el premio: ${premio.nombre}!`;
  nombrePremio.style.fontSize = "1.5em";
  nombrePremio.style.fontWeight = "bold";
  nombrePremio.style.textAlign = "center";
  nombrePremio.style.color = "#f15622";  // Un color llamativo

  // Agregar la imagen y el texto al contenedor
  contenidoPremio.appendChild(imagenPremio);
  contenidoPremio.appendChild(nombrePremio);

  // Reproducir el sonido al mostrar el modal
  const sonidoModal = new Audio("img/win 3.mp3"); 
  sonidoModal.play();

  modal.style.display = "flex";

  // Disparar confeti desde las esquinas
  setTimeout(() => {
    dispararConfeti();
  }, 0);
}

  
  
  // Función de confeti
  function dispararConfeti() {
  // Crear un canvas específico para confeti
  const confettiCanvas = document.createElement('canvas');
  confettiCanvas.id = 'confetti-canvas';
  document.body.appendChild(confettiCanvas);

  const myConfetti = confetti.create(confettiCanvas, {
    resize: true, // Redimensionar con la ventana
    useWorker: true, // Mejor rendimiento
  });

  const duration = 15 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 200, zIndex: 9999 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      document.body.removeChild(confettiCanvas); // Eliminar el canvas después
      return;
    }

    const particleCount = 50 * (timeLeft / duration);
    myConfetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    myConfetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

  
  // Cerrar el modal
  function cerrarModal() {
    let modal = document.getElementById("modal-premio");
    modal.style.display = "none";
  }
  
  // Inicializar
  cargarImagenes(() => {
    dibujarRuleta();
  });
  