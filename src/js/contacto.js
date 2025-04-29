// Obtenemos referencias a los elementos del DOM que vamos a utilizar
const form = document.getElementById("form-contacto");
const mensaje = document.getElementById("mensaje-exito");

// Agregamos un event listener al formulario para manejar cuando se envía
form.addEventListener("submit", function (e) {
  // Prevenimos el comportamiento por defecto del formulario
  e.preventDefault();
  // Limpiamos el formulario
  form.reset();
  // Mostramos el mensaje de éxito quitando la clase 'oculto'
  mensaje.classList.remove("oculto");
});
