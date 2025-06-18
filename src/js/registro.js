// src/js/registro.js
document
  .getElementById("form-registro")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const nombre = document.getElementById("registro-nombre").value.trim();
    const email = document.getElementById("registro-email").value.trim();
    const password = document.getElementById("registro-password").value;
    const tipo_usuario = document.getElementById("registro-tipo").value;
    const errorDiv = document.getElementById("registro-error");
    errorDiv.classList.add("oculto");

    try {
      const res = await fetch("../backend/registro.php", {
        method: "POST",
        body: new URLSearchParams({ nombre, email, password, tipo_usuario }),
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
