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

      // Enviar la postulación al backend
      const formData = new FormData(this.form);
      fetch("../backend/postulaciones.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // Muestra el mensaje de éxito y limpia el formulario
            this.mostrarMensajeExito();
            this.form.reset();
          } else {
            this.mostrarError(data.message || "Error al enviar la postulación");
          }
        })
        .catch(() => {
          this.mostrarError("Error de conexión con el servidor");
        });
    } catch (error) {
      this.mostrarError(error.message);
    }
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

// Mostrar datos del empleo seleccionado arriba del formulario
function mostrarDatosEmpleo() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;
  fetch("../backend/empleos.php")
    .then((res) => res.json())
    .then((empleos) => {
      const empleo = empleos.find((e) => e.id == id);
      if (empleo) {
        const cont = document.getElementById("datos-empleo");
        let detalles = [];
        if (empleo.zona) detalles.push(empleo.zona);
        if (empleo.rubro) detalles.push("Rubro: " + empleo.rubro);
        if (empleo.tipo_contrato)
          detalles.push("Contrato: " + empleo.tipo_contrato);
        if (empleo.salario_min || empleo.salario_max) {
          let salario = "Salario: ";
          if (empleo.salario_min) salario += "$" + empleo.salario_min;
          if (empleo.salario_max) salario += " - $" + empleo.salario_max;
          detalles.push(salario);
        }
        cont.innerHTML = `
          <div class="card-empleo" style="box-shadow:none; background: #f4f8fb; margin-bottom: 0;">
            <div class="card-info">
              <h2 style='margin-bottom:0.3rem;'>${empleo.titulo}</h2>
              <p class='empresa'>${empleo.empresa}</p>
              <p class='detalles-linea'>${detalles.join(" | ")}</p>
              <p class='descripcion-corta' style='margin-top:0.5rem;'>${
                empleo.descripcion
              }</p>
              ${
                empleo.requisitos
                  ? `<p class='detalle-extra'><strong>Requisitos:</strong> ${empleo.requisitos}</p>`
                  : ""
              }
              ${
                empleo.beneficios
                  ? `<p class='detalle-extra'><strong>Beneficios:</strong> ${empleo.beneficios}</p>`
                  : ""
              }
            </div>
            <img class="card-logo" src="${
              empleo.logo || "../assets/images/default-logo.png"
            }" alt="Logo de ${
          empleo.empresa
        }" style="max-width:70px; max-height:70px; object-fit:contain;">
          </div>
        `;
      }
    });
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarDatosEmpleo();
  new FormularioPostulacion();
});
