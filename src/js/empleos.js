// Inicialización del selector personalizado
document.addEventListener("DOMContentLoaded", function () {
  const rubroInput = document.getElementById("filtro-rubro");
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
      filtrarOfertas(); // Aplicar filtros inmediatamente al seleccionar
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

// Obtenemos referencias a los elementos del DOM que vamos a necesitar
const lista = document.getElementById("lista-empleos");
const filtroRubro = document.getElementById("filtro-rubro");
const filtroZona = document.getElementById("filtro-zona");

let ofertas = [];

// Función para obtener los parámetros de la URL
function obtenerParametrosURL() {
  const params = new URLSearchParams(window.location.search);
  return {
    rubro: params.get("rubro") || "",
    zona: params.get("zona") || "",
  };
}

// Función para obtener las ofertas desde el backend
function cargarOfertas() {
  fetch("../backend/empleos.php")
    .then((res) => res.json())
    .then((data) => {
      ofertas = data;
      aplicarFiltrosIniciales();
    })
    .catch(() => {
      lista.innerHTML = "<p>Error al cargar las ofertas.</p>";
    });
}

function aplicarFiltrosIniciales() {
  const params = obtenerParametrosURL();
  if (params.rubro || params.zona) {
    filtroRubro.value = params.rubro;
    filtroZona.value = params.zona;
    filtrarOfertas();
  } else {
    renderizar(ofertas);
  }
}

// Función que se encarga de mostrar las ofertas en la página
function renderizar(ofertasFiltradas) {
  // Limpiamos el contenedor de ofertas
  lista.innerHTML = "";

  // Si no hay ofertas que mostrar, mostramos un mensaje
  if (ofertasFiltradas.length === 0) {
    lista.innerHTML = "<p>No se encontraron ofertas.</p>";
    return;
  }

  // Recorremos cada oferta y creamos su tarjeta correspondiente
  ofertasFiltradas.forEach((oferta) => {
    // Creamos el contenedor principal de la tarjeta
    const card = document.createElement("div");
    card.classList.add("card-empleo");

    // Creamos el contenedor para la información de la oferta
    const info = document.createElement("div");
    info.classList.add("card-info");

    // Creamos y configuramos el título del puesto
    const titulo = document.createElement("h2");
    titulo.innerText = oferta.puesto;

    // Creamos y configuramos el nombre de la empresa
    const empresa = document.createElement("p");
    empresa.className = "empresa";
    empresa.innerText = oferta.empresa;

    // Creamos y configuramos la línea de detalles (ubicación, rubro y fecha)
    const detallesLinea = document.createElement("p");
    detallesLinea.className = "detalles-linea";
    detallesLinea.innerText = `${oferta.ubicacion} | Rubro: ${oferta.rubro} | Publicado: ${oferta.fecha}`;

    // Creamos y configuramos la descripción del puesto
    const descripcion = document.createElement("p");
    descripcion.className = "descripcion-corta";
    // Si la descripción es muy larga, la cortamos y agregamos "..."
    descripcion.innerText =
      oferta.descripcion.length > 160
        ? oferta.descripcion.substring(0, 160) + "..."
        : oferta.descripcion;

    // Creamos y configuramos el botón para ver más detalles
    const boton = document.createElement("a");
    boton.href = `detalle.html?id=${oferta.id}`;
    boton.className = "btn-primary boton-derecha";
    boton.innerText = "Ver Detalle";

    // Creamos y configuramos el logo de la empresa
    const logo = document.createElement("img");
    logo.className = "card-logo";
    // Si la oferta tiene logo lo usamos, si no, usamos uno por defecto
    logo.src = oferta.logo || "../assets/images/default-logo.png";
    logo.alt = `Logo de ${oferta.empresa}`;

    // Armamos la estructura de la tarjeta agregando todos los elementos
    info.appendChild(titulo);
    info.appendChild(empresa);
    info.appendChild(detallesLinea);
    info.appendChild(descripcion);
    info.appendChild(boton);

    // Agregamos la información y el logo a la tarjeta
    card.appendChild(info);
    card.appendChild(logo);
    // Finalmente agregamos la tarjeta completa al contenedor principal
    lista.appendChild(card);
  });
}

// Función que se encarga de filtrar las ofertas según los criterios ingresados
function filtrarOfertas() {
  const rubro = filtroRubro.value.toLowerCase();
  const zona = filtroZona.value.toLowerCase();

  // Filtramos las ofertas que coincidan con los criterios
  const filtradas = ofertas.filter((oferta) => {
    // Si ambos campos están vacíos, mostramos todas las ofertas
    if (!rubro && !zona) return true;

    // Si solo hay rubro, filtramos por rubro
    if (rubro && !zona) {
      return oferta.rubro.toLowerCase() === rubro;
    }

    // Si solo hay zona, filtramos por zona
    if (!rubro && zona) {
      return oferta.ubicacion.toLowerCase().includes(zona);
    }

    // Si hay ambos criterios, deben cumplirse los dos
    return (
      oferta.rubro.toLowerCase() === rubro &&
      oferta.ubicacion.toLowerCase().includes(zona)
    );
  });

  renderizar(filtradas);
}

// Agregamos los event listeners para detectar cambios en los filtros
filtroRubro.addEventListener("input", filtrarOfertas);
filtroZona.addEventListener("input", filtrarOfertas);

// Reemplazar la inicialización final por la carga desde el backend
cargarOfertas();
