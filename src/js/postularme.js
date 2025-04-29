// Esta clase sirve para manejar las postulaciones
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

  // Este método sirve para validar los datos de la postulación
  validar() {
    if (!this.nombre || !this.email || !this.telefono || !this.cv) {
      throw new Error("Todos los campos son obligatorios");
    }
    if (!this.validarEmail(this.email)) {
      throw new Error("El email no es válido");
    }
    return true;
  }

  // Este método sirve para validar el formato del email
  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}

// Esta clase sirve para manejar el formulario y la interfaz de usuario
class FormularioPostulacion {
  constructor() {
    this.form = document.getElementById("form-postulacion");
    this.mensajeExito = document.getElementById("mensaje-exito");
    this.postulaciones = this.cargarPostulaciones();
    this.inicializarEventos();
  }

  // Este método sirve para inicializar los event listeners
  inicializarEventos() {
    this.form.addEventListener("submit", (e) => this.manejarEnvio(e));
  }

  // Este método sirve para manejar el envío del formulario
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

      // Valida la postulación
      postulacion.validar();

      // Guarda la postulación
      this.guardarPostulacion(postulacion);

      // Muestra el mensaje de éxito y limpia el formulario
      this.mostrarMensajeExito();
      this.form.reset();
    } catch (error) {
      this.mostrarError(error.message);
    }
  }

  // Este método sirve para cargar las postulaciones guardadas
  cargarPostulaciones() {
    return JSON.parse(localStorage.getItem("postulaciones")) || [];
  }

  // Este método sirve para guardar una nueva postulación
  guardarPostulacion(postulacion) {
    this.postulaciones.push(postulacion);
    localStorage.setItem("postulaciones", JSON.stringify(this.postulaciones));
  }

  // Este método sirve para mostrar mensaje de éxito
  mostrarMensajeExito() {
    this.mensajeExito.classList.remove("oculto");
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      this.mensajeExito.classList.add("oculto");
    }, 3000);
  }

  // Este método sirve para mostrar errores
  mostrarError(mensaje) {
    // Crear elemento para mostrar el error
    const errorDiv = document.createElement("div");
    errorDiv.className = "mensaje-error";
    errorDiv.textContent = mensaje;

    // Insertar el mensaje de error antes del formulario
    this.form.parentNode.insertBefore(errorDiv, this.form);

    // Borra el mensaje después de 3 segundos
    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }
}

// Este método sirve para agregar estilos para los mensajes de error
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

// Este método sirve para inicializar el formulario cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  new FormularioPostulacion();
});
