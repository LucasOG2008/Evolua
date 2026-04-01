function mostrarFuncionarios() {
    const funcionarios = document.getElementById("funcionarios");
    const psicologos = document.getElementById("psicologos");
  
    funcionarios.style.display = "block";  
    psicologos.style.display = "none"; 
  }
  
  function mostrarPsicologos() {
    const funcionarios = document.getElementById("funcionarios");
    const psicologos = document.getElementById("psicologos");
  
    psicologos.style.display = "block";   
    funcionarios.style.display = "none";   
  }