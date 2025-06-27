// Obtenemos referencias a los elementos del DOM que vamos a utilizar
const form = document.getElementById("form-contacto");
const mensaje = document.getElementById("mensaje-exito");

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

// Agregamos un event listener al formulario para manejar cuando se envía
form.addEventListener("submit", function (e) {
  // Prevenimos el comportamiento por defecto del formulario
  e.preventDefault();
  // Limpiamos el formulario
  form.reset();
  // Mostramos el mensaje de éxito quitando la clase 'oculto'
  mensaje.classList.remove("oculto");
});
