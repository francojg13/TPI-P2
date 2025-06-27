// src/js/registro.js
document
  .getElementById("form-registro")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const nombre = document.getElementById("registro-nombre").value.trim();
    const email = document.getElementById("registro-email").value.trim();
    const password = document.getElementById("registro-password").value;
    const logo = document.getElementById("registro-logo").files[0];
    const descripcion = document
      .getElementById("registro-descripcion")
      .value.trim();
    const ubicacion = document
      .getElementById("registro-ubicacion")
      .value.trim();
    const telefono = document.getElementById("registro-telefono").value.trim();
    const sitio_web = document.getElementById("registro-sitio").value.trim();
    const rubro = document.getElementById("registro-rubro").value;
    const persona_contacto = document
      .getElementById("registro-persona")
      .value.trim();
    const errorDiv = document.getElementById("registro-error");
    errorDiv.classList.add("oculto");

    // Validación básica
    if (
      !nombre ||
      !email ||
      !password ||
      !descripcion ||
      !ubicacion ||
      !telefono ||
      !rubro
    ) {
      errorDiv.textContent =
        "Por favor, completa todos los campos obligatorios.";
      errorDiv.classList.remove("oculto");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("email", email);
    formData.append("password", password);
    if (logo) formData.append("logo", logo);
    formData.append("descripcion", descripcion);
    formData.append("ubicacion", ubicacion);
    formData.append("telefono", telefono);
    formData.append("sitio_web", sitio_web);
    formData.append("rubro", rubro);
    formData.append("persona_contacto", persona_contacto);

    try {
      const res = await fetch("../backend/registro.php", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = "login.html";
      } else {
        errorDiv.textContent = data.message || "Error al registrarse";
        errorDiv.classList.remove("oculto");
      }
    } catch (err) {
      errorDiv.textContent = "Error de conexión con el servidor";
      errorDiv.classList.remove("oculto");
    }
  });
