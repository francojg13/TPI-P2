// src/js/login.js
document
  .getElementById("form-login")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const errorDiv = document.getElementById("login-error");
    errorDiv.classList.add("oculto");

    try {
      const res = await fetch("../backend/login.php", {
        method: "POST",
        body: new URLSearchParams({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        // Redirigir según tipo de usuario
        if (data.tipo_usuario === "empresa") {
          window.location.href = "publicar.html";
        } else {
          window.location.href = "empleos.html";
        }
      } else {
        errorDiv.textContent = data.message || "Error al iniciar sesión";
        errorDiv.classList.remove("oculto");
      }
    } catch (err) {
      errorDiv.textContent = "Error de conexión con el servidor";
      errorDiv.classList.remove("oculto");
    }
  });
