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
