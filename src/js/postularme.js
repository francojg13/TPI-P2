// Clase para manejar las postulaciones
class Postulacion {
  constructor(nombre, email, telefono, cv, mensaje) {
    this.id = Date.now();
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.cv = cv;
    this.mensaje = mensaje;
    this.fecha = new Date().toLocaleDateString();
  }

  // Método para validar los datos de la postulación
  validar() {
    if (!this.nombre || !this.email || !this.telefono || !this.cv) {
      throw new Error("Todos los campos son obligatorios");
    }
    if (!this.validarEmail(this.email)) {
      throw new Error("El email no es válido");
    }
    return true;
  }

  // Método para validar el formato del email
  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}

// Clase para manejar el formulario y la interfaz de usuario
class FormularioPostulacion {
  constructor() {
    this.form = document.getElementById("form-postulacion");
    this.mensajeExito = document.getElementById("mensaje-exito");
    this.postulaciones = this.cargarPostulaciones();
    this.inicializarEventos();
  }

  // Método para inicializar los event listeners
  inicializarEventos() {
    this.form.addEventListener("submit", (e) => this.manejarEnvio(e));
  }

  // Método para manejar el envío del formulario
  manejarEnvio(e) {
    e.preventDefault();

    try {
      // Crear nueva postulación con los datos del formulario
      const postulacion = new Postulacion(
        this.form.nombre.value.trim(),
        this.form.email.value.trim(),
        this.form.telefono.value.trim(),
        this.form.cv.value.trim(),
        this.form.mensaje.value.trim()
      );

      // Validar la postulación
      postulacion.validar();

      // Guardar la postulación
      this.guardarPostulacion(postulacion);

      // Mostrar mensaje de éxito y limpiar formulario
      this.mostrarMensajeExito();
      this.form.reset();
    } catch (error) {
      this.mostrarError(error.message);
    }
  }

  // Método para cargar las postulaciones guardadas
  cargarPostulaciones() {
    return JSON.parse(localStorage.getItem("postulaciones")) || [];
  }

  // Método para guardar una nueva postulación
  guardarPostulacion(postulacion) {
    this.postulaciones.push(postulacion);
    localStorage.setItem("postulaciones", JSON.stringify(this.postulaciones));
  }

  // Método para mostrar mensaje de éxito
  mostrarMensajeExito() {
    this.mensajeExito.classList.remove("oculto");
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      this.mensajeExito.classList.add("oculto");
    }, 3000);
  }

  // Método para mostrar errores
  mostrarError(mensaje) {
    // Crear elemento para mostrar el error
    const errorDiv = document.createElement("div");
    errorDiv.className = "mensaje-error";
    errorDiv.textContent = mensaje;

    // Insertar el mensaje de error antes del formulario
    this.form.parentNode.insertBefore(errorDiv, this.form);

    // Remover el mensaje después de 3 segundos
    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }
}

// Agregar estilos para los mensajes de error
const style = document.createElement("style");
style.textContent = `
    .mensaje-error {
        background-color: #ffebee;
        color: #c62828;
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 1rem;
        text-align: center;
    }
`;
document.head.appendChild(style);

// Inicializar el formulario cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  new FormularioPostulacion();
});
