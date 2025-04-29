document.getElementById("form-postulacion").addEventListener("submit", function(e) {
    e.preventDefault();
  
    const postulacion = {
      nombre: document.getElementById("nombre").value.trim(),
      email: document.getElementById("email").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
      cv: document.getElementById("cv").value.trim(),
      mensaje: document.getElementById("mensaje").value.trim(),
      fecha: new Date().toLocaleDateString()
    };
  
    const postulaciones = JSON.parse(localStorage.getItem("postulaciones")) || [];
    postulaciones.push(postulacion);
    localStorage.setItem("postulaciones", JSON.stringify(postulaciones));
  
    document.getElementById("form-postulacion").reset();
    document.getElementById("mensaje-exito").classList.remove("oculto");
  });
  