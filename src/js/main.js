// Inicialización del selector personalizado
document.addEventListener("DOMContentLoaded", function () {
  const rubroInput = document.getElementById("buscar-rubro");
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
    option.addEventListener("click", function () {
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

// Manejador del formulario de búsqueda
document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Obtenemos los valores de búsqueda
  const rubro = document.getElementById("buscar-rubro").value.trim();
  const zona = document.getElementById("buscar-zona").value.trim();

  // Verificamos que al menos uno de los campos tenga contenido
  if (!rubro && !zona) {
    alert("Por favor, completa al menos uno de los campos de búsqueda");
    return;
  }

  // Redirigimos a la página de empleos con los parámetros de búsqueda
  window.location.href = `empleos.html?rubro=${encodeURIComponent(
    rubro
  )}&zona=${encodeURIComponent(zona)}`;
});
