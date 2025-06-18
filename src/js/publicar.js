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
    const puesto = document.getElementById("puesto").value.trim();
    const rubro = document.getElementById("rubro").value.trim();
    const ubicacion = document.getElementById("ubicacion").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const fecha = document.getElementById("fecha").value;
    const logoFile = document.getElementById("logo").files[0];

    if (!RUBROS_PERMITIDOS.includes(rubro)) {
      alert("Por favor, selecciona un rubro válido de la lista");
      return;
    }

    // Preparamos los datos para enviar al backend
    const formData = new FormData();
    formData.append("empresa", empresa);
    formData.append("puesto", puesto);
    formData.append("rubro", rubro);
    formData.append("zona", ubicacion);
    formData.append("descripcion", descripcion);
    formData.append("fecha", fecha);
    if (logoFile) {
      formData.append("logo", logoFile);
    }

    fetch("../backend/empleos.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          document.getElementById("form-publicar").reset();
          document.getElementById("mensaje-exito").classList.remove("oculto");
        } else {
          alert(data.message || "Error al publicar el empleo");
        }
      })
      .catch(() => {
        alert("Error de conexión con el servidor");
      });
  });
