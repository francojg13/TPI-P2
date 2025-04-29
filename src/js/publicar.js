document.getElementById("form-publicar").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const empresa = document.getElementById("empresa").value.trim();
    const puesto = document.getElementById("puesto").value.trim();
    const rubro = document.getElementById("rubro").value.trim();
    const ubicacion = document.getElementById("ubicacion").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const fecha = document.getElementById("fecha").value;
    const logoFile = document.getElementById("logo").files[0];
  
    const reader = new FileReader();
  
    reader.onload = function () {
      const logoBase64 = logoFile ? reader.result : null;
  
      const nuevaOferta = {
        id: Date.now(),
        empresa,
        puesto,
        rubro,
        ubicacion,
        descripcion,
        fecha,
        logo: logoBase64 || null
      };
  
      const ofertas = JSON.parse(localStorage.getItem("ofertas")) || [];
      ofertas.push(nuevaOferta);
      localStorage.setItem("ofertas", JSON.stringify(ofertas));
  
      document.getElementById("form-publicar").reset();
      document.getElementById("mensaje-exito").classList.remove("oculto");
    };
  
    if (logoFile) {
      reader.readAsDataURL(logoFile);
    } else {
      reader.onload(); // ejecuta igual sin logo
    }
  });
  