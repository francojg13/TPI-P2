// Agregamos un event listener al formulario para manejar cuando se envía
document
  .getElementById("form-publicar")
  .addEventListener("submit", function (e) {
    // Prevenimos el comportamiento por defecto del formulario (evita que la página se recargue)
    e.preventDefault();

    // Obtenemos todos los valores del formulario y eliminamos espacios en blanco innecesarios
    const empresa = document.getElementById("empresa").value.trim();
    const puesto = document.getElementById("puesto").value.trim();
    const rubro = document.getElementById("rubro").value.trim();
    const ubicacion = document.getElementById("ubicacion").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const fecha = document.getElementById("fecha").value;
    // Obtenemos el archivo de logo si se subió uno
    const logoFile = document.getElementById("logo").files[0];

    // Creamos un objeto FileReader para poder leer el archivo de imagen
    const reader = new FileReader();

    // Esta función se ejecutará cuando el FileReader termine de leer el archivo
    reader.onload = function () {
      // Guardamos el resultado de la lectura (imagen en formato base64) o null si no hay logo
      const logoBase64 = logoFile ? reader.result : null;

      // Creamos un objeto con toda la información de la oferta
      const nuevaOferta = {
        id: Date.now(), // Usamos la fecha actual como ID único
        empresa,
        puesto,
        rubro,
        ubicacion,
        descripcion,
        fecha,
        logo: logoBase64 || null,
      };

      // Obtenemos las ofertas existentes del localStorage o inicializamos un array vacío
      const ofertas = JSON.parse(localStorage.getItem("ofertas")) || [];
      // Agregamos la nueva oferta al array
      ofertas.push(nuevaOferta);
      // Guardamos el array actualizado en localStorage
      localStorage.setItem("ofertas", JSON.stringify(ofertas));

      // Limpiamos el formulario
      document.getElementById("form-publicar").reset();
      // Mostramos el mensaje de éxito
      document.getElementById("mensaje-exito").classList.remove("oculto");
    };

    // Si se subió un archivo de logo, lo leemos como URL de datos (base64)
    if (logoFile) {
      reader.readAsDataURL(logoFile);
    } else {
      // Si no hay logo, ejecutamos directamente la función onload
      reader.onload();
    }
  });
