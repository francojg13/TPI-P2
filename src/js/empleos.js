const lista = document.getElementById("lista-empleos");
const filtroRubro = document.getElementById("filtro-rubro");
const filtroZona = document.getElementById("filtro-zona");

let ofertas = JSON.parse(localStorage.getItem("ofertas")) || [];

function renderizar(ofertasFiltradas) {
  lista.innerHTML = "";
  if (ofertasFiltradas.length === 0) {
    lista.innerHTML = "<p>No se encontraron ofertas.</p>";
    return;
  }

  ofertasFiltradas.forEach(oferta => {
    const card = document.createElement("div");
    card.classList.add("card-empleo");
    
    const info = document.createElement("div");
    info.classList.add("card-info");
    
    const titulo = document.createElement("h2");
    titulo.innerText = oferta.puesto;
    
    const empresa = document.createElement("p");
    empresa.className = "empresa";
    empresa.innerText = oferta.empresa;
    
    const detallesLinea = document.createElement("p");
    detallesLinea.className = "detalles-linea";
    detallesLinea.innerText = `${oferta.ubicacion} | Rubro: ${oferta.rubro} | Publicado: ${oferta.fecha}`;
    
    const descripcion = document.createElement("p");
    descripcion.className = "descripcion-corta";
    descripcion.innerText = oferta.descripcion.length > 160
      ? oferta.descripcion.substring(0, 160) + "..."
      : oferta.descripcion;
    
    const boton = document.createElement("a");
    boton.href = `detalle.html?id=${oferta.id}`;
    boton.className = "btn-primary boton-derecha";
    boton.innerText = "Ver Detalle";
    
    // Logo de empresa
    const logo = document.createElement("img");
    logo.className = "card-logo";
    logo.src = oferta.logo || "../assets/images/default-logo.png"; // usá tu imagen real si tenés
    logo.alt = `Logo de ${oferta.empresa}`;
    
    // Estructura
    info.appendChild(titulo);
    info.appendChild(empresa);
    info.appendChild(detallesLinea);
    info.appendChild(descripcion);
    info.appendChild(boton);
    
    card.appendChild(info);
    card.appendChild(logo);
    lista.appendChild(card);
    
  });
}

function filtrarOfertas() {
  const rubro = filtroRubro.value.toLowerCase();
  const zona = filtroZona.value.toLowerCase();

  const filtradas = ofertas.filter(o => 
    o.rubro.toLowerCase().includes(rubro) &&
    o.ubicacion.toLowerCase().includes(zona)
  );

  renderizar(filtradas);
}

filtroRubro.addEventListener("input", filtrarOfertas);
filtroZona.addEventListener("input", filtrarOfertas);

renderizar(ofertas);
