// Inicialización del selector personalizado
document.addEventListener("DOMContentLoaded", function () {
  const rubroInput = document.getElementById("rubro");
  const rubroSelect = document.getElementById("rubro-select");
  const rubroTrigger = document.getElementById("rubro-trigger");
  const selectOptions = document.querySelectorAll(".select-option");

  // Función para mostrar/ocultar el selector
  function toggleSelect() {
    rubroSelect.classList.toggle("active");
    rubroTrigger.classList.toggle("active");
  }

  // Manejador de clic en el icono o el input
  function handleSelectorClick(e) {
    e.stopPropagation();
    toggleSelect();
  }

  rubroTrigger.addEventListener("click", handleSelectorClick);
  rubroInput.addEventListener("click", handleSelectorClick);

  // Manejador para las opciones
  selectOptions.forEach((option) => {
    option.addEventListener("click", function (e) {
      const value = this.getAttribute("data-value");
      rubroInput.value = value;
      toggleSelect();
    });
  });

  // Cerrar el selector cuando se hace clic fuera
  document.addEventListener("click", function () {
    rubroSelect.classList.remove("active");
    rubroTrigger.classList.remove("active");
  });

  // Evitar que el clic en el select cierre el menú
  rubroSelect.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // Bloqueo de publicación si no hay sesión de empresa
  fetch("../backend/login.php", { method: "POST" })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success || data.tipo_usuario !== "empresa") {
        document.getElementById("form-publicar").classList.add("oculto");
        document.getElementById("bloqueo-publicar").classList.remove("oculto");
      }
    })
    .catch(() => {
      document.getElementById("form-publicar").classList.add("oculto");
      document.getElementById("bloqueo-publicar").classList.remove("oculto");
    });
});

// Lista de rubros permitidos
const RUBROS_PERMITIDOS = [
  "Administración",
  "Atención al Cliente",
  "Comercial / Ventas",
  "Contabilidad / Finanzas",
  "Desarrollo / Programación",
  "Diseño / Multimedia",
  "Educación",
  "Gastronomía",
  "Ingeniería",
  "Legal",
  "Logística / Transporte",
  "Marketing / Publicidad",
  "Medicina / Salud",
  "Recursos Humanos",
  "Secretariado",
  "Servicios Generales",
  "Tecnología",
  "Turismo / Hotelería",
];

// Agregamos un event listener al formulario para manejar cuando se envía
document
  .getElementById("form-publicar")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const empresa = document.getElementById("empresa").value.trim();
    const titulo = document.getElementById("titulo").value.trim();
    const rubro = document.getElementById("rubro").value.trim();
    const zona = document.getElementById("zona").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const logoFile = document.getElementById("logo").files[0];
    const tipo_contrato = document.getElementById("tipo_contrato").value;
    const salario_min = document.getElementById("salario_min").value;
    const salario_max = document.getElementById("salario_max").value;
    const fecha_expiracion = document.getElementById("fecha_expiracion").value;
    const requisitos = document.getElementById("requisitos").value.trim();
    const beneficios = document.getElementById("beneficios").value.trim();

    if (!RUBROS_PERMITIDOS.includes(rubro)) {
      alert("Por favor, selecciona un rubro válido de la lista");
      return;
    }

    // Preparamos los datos para enviar al backend
    const formData = new FormData();
    formData.append("empresa", empresa);
    formData.append("titulo", titulo);
    formData.append("rubro", rubro);
    formData.append("zona", zona);
    formData.append("descripcion", descripcion);
    if (logoFile) {
      formData.append("logo", logoFile);
    }
    formData.append("tipo_contrato", tipo_contrato);
    if (salario_min) formData.append("salario_min", salario_min);
    if (salario_max) formData.append("salario_max", salario_max);
    if (fecha_expiracion) formData.append("fecha_expiracion", fecha_expiracion);
    if (requisitos) formData.append("requisitos", requisitos);
    if (beneficios) formData.append("beneficios", beneficios);

    fetch("/TPI-P2/backend/empleos.php", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (data.success) {
            document.getElementById("form-publicar").reset();
            document.getElementById("mensaje-exito").classList.remove("oculto");
          } else {
            alert(data.message || "Error al publicar el empleo");
          }
        } catch (e) {
          // Si la respuesta no es JSON válido, mostrar el texto crudo
          alert("Respuesta inesperada del servidor:\n" + text);
        }
      })
      .catch((err) => {
        alert("Error de conexión con el servidor");
      });
  });

// Botón de logout para empresas
const btnLogout = document.getElementById("btn-logout");
if (btnLogout) {
  btnLogout.addEventListener("click", function (e) {
    e.preventDefault();
    fetch("../backend/logout.php")
      .then((res) => res.json())
      .then(() => {
        window.location.href = "login.html";
      });
  });
}

// Mostrar u ocultar el botón de logout y los de login/registro según sesión
fetch("../backend/login.php", { method: "POST" })
  .then((res) => res.json())
  .then((data) => {
    if (data.success && data.tipo_usuario === "empresa") {
      if (btnLogout) btnLogout.style.display = "inline-block";
      // Autocompletar el nombre de la empresa en el formulario si existe el campo
      const empresaInput = document.getElementById("empresa");
      if (empresaInput && data.nombre) {
        empresaInput.value = data.nombre;
        empresaInput.readOnly = true;
        empresaInput.style.background = "#f5f5f5";
        empresaInput.style.cursor = "not-allowed";
      }
      // Ocultar los botones de login/registro
      document.querySelectorAll(".nav-actions a").forEach((a) => {
        if (
          a.href &&
          (a.href.includes("login.html") || a.href.includes("registro.html"))
        ) {
          a.style.display = "none";
        }
      });
    } else {
      if (btnLogout) btnLogout.style.display = "none";
      document.querySelectorAll(".nav-actions a").forEach((a) => {
        if (
          a.href &&
          (a.href.includes("login.html") || a.href.includes("registro.html"))
        ) {
          a.style.display = "";
        }
      });
    }
  })
  .catch(() => {
    if (btnLogout) btnLogout.style.display = "none";
    document.querySelectorAll(".nav-actions a").forEach((a) => {
      if (
        a.href &&
        (a.href.includes("login.html") || a.href.includes("registro.html"))
      ) {
        a.style.display = "";
      }
    });
  });
