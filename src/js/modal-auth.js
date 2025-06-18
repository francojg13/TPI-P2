// src/js/modal-auth.js

document.addEventListener("DOMContentLoaded", function () {
  // Modal elementos
  const modal = document.getElementById("modal-auth");
  const btnLogin = document.querySelector(".btn-link");
  const btnRegistro = document.querySelector(".btn-outline");
  const closeBtn = document.getElementById("close-modal-auth");
  const tabLogin = document.getElementById("tab-login");
  const tabRegistro = document.getElementById("tab-registro");
  const formLogin = document.getElementById("modal-login-form");
  const formRegistro = document.getElementById("modal-registro-form");

  // Mostrar modal en login
  if (btnLogin)
    btnLogin.addEventListener("click", function (e) {
      e.preventDefault();
      modal.classList.remove("oculto");
      tabLogin.classList.add("active");
      tabRegistro.classList.remove("active");
      formLogin.classList.remove("oculto");
      formRegistro.classList.add("oculto");
    });
  // Mostrar modal en registro
  if (btnRegistro)
    btnRegistro.addEventListener("click", function (e) {
      e.preventDefault();
      modal.classList.remove("oculto");
      tabLogin.classList.remove("active");
      tabRegistro.classList.add("active");
      formLogin.classList.add("oculto");
      formRegistro.classList.remove("oculto");
    });
  // Cerrar modal
  closeBtn.addEventListener("click", function () {
    modal.classList.add("oculto");
  });
  // Tabs
  tabLogin.addEventListener("click", function () {
    tabLogin.classList.add("active");
    tabRegistro.classList.remove("active");
    formLogin.classList.remove("oculto");
    formRegistro.classList.add("oculto");
  });
  tabRegistro.addEventListener("click", function () {
    tabLogin.classList.remove("active");
    tabRegistro.classList.add("active");
    formLogin.classList.add("oculto");
    formRegistro.classList.remove("oculto");
  });
  // Cerrar modal al hacer click fuera del contenido
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.add("oculto");
    }
  });
});
