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

  // Agregar opción "Todos" al filtro de rubro
  const todosOption = document.createElement("div");
  todosOption.className = "select-option";
  todosOption.setAttribute("data-value", "");
  todosOption.textContent = "Todos";
  rubroSelect.insertBefore(todosOption, rubroSelect.firstChild);
  todosOption.addEventListener("click", function () {
    rubroInput.value = "";
    toggleSelect();
    filtrarOfertas();
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
    titulo.innerText = oferta.titulo || "";

    // Creamos y configuramos el nombre de la empresa
    const empresa = document.createElement("p");
    empresa.className = "empresa";
    empresa.innerText = oferta.empresa || "";

    // Creamos y configuramos la línea de detalles (zona, rubro y fecha)
    const detallesLinea = document.createElement("p");
    detallesLinea.className = "detalles-linea";
    // Línea de detalles extendida
    let detalles = [];
    if (oferta.zona) detalles.push(oferta.zona);
    if (oferta.rubro) detalles.push("Rubro: " + oferta.rubro);
    if (oferta.tipo_contrato)
      detalles.push("Contrato: " + oferta.tipo_contrato);
    if (oferta.salario_min || oferta.salario_max) {
      let salario = "Salario: ";
      if (oferta.salario_min) salario += "$" + oferta.salario_min;
      if (oferta.salario_max) salario += " - $" + oferta.salario_max;
      detalles.push(salario);
    }
    if (oferta.fecha_publicacion)
      detalles.push("Publicado: " + oferta.fecha_publicacion.split(" ")[0]);
    detallesLinea.innerText = detalles.join(" | ");

    // Creamos y configuramos la descripción del puesto
    const descripcion = document.createElement("p");
    descripcion.className = "descripcion-corta";
    // Si la descripción es muy larga, la cortamos y agregamos "..."
    descripcion.innerText =
      oferta.descripcion.length > 160
        ? oferta.descripcion.substring(0, 160) + "..."
        : oferta.descripcion;

    // Creamos y configuramos el botón para postularse
    const boton = document.createElement("a");
    boton.href = `postularme.html?id=${oferta.id}`;
    boton.className = "btn-primary boton-derecha";
    boton.innerText = "Postularme";

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

    // Mostrar requisitos y beneficios si existen
    if (oferta.requisitos) {
      const req = document.createElement("p");
      req.className = "detalle-extra";
      req.innerHTML = "<strong>Requisitos:</strong> " + oferta.requisitos;
      info.appendChild(req);
    }
    if (oferta.beneficios) {
      const ben = document.createElement("p");
      ben.className = "detalle-extra";
      ben.innerHTML = "<strong>Beneficios:</strong> " + oferta.beneficios;
      info.appendChild(ben);
    }

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
      return oferta.zona && oferta.zona.toLowerCase().includes(zona);
    }

    // Si hay ambos criterios, deben cumplirse los dos
    return (
      oferta.rubro &&
      oferta.rubro.toLowerCase() === rubro &&
      oferta.zona &&
      oferta.zona.toLowerCase().includes(zona)
    );
  });

  renderizar(filtradas);
}

// Agregamos los event listeners para detectar cambios en los filtros
filtroRubro.addEventListener("input", filtrarOfertas);
filtroZona.addEventListener("input", filtrarOfertas);

// Reemplazar la inicialización final por la carga desde el backend
cargarOfertas();

// --- Lógica de visibilidad de sesión para navbar ---
// Cambia el estilo del botón de logout a btn-primary si existe
const btnLogout = document.getElementById("btn-logout");
if (btnLogout) {
  btnLogout.classList.remove("btn-outline");
  btnLogout.classList.add("btn-primary");
}
// Mostrar u ocultar el botón de logout y los de login/registro según sesión
fetch("../backend/login.php", { method: "POST" })
  .then((res) => res.json())
  .then((data) => {
    if (data.success && data.tipo_usuario === "empresa") {
      if (btnLogout) btnLogout.style.display = "inline-block";
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
