function mostrarBotaoSalvar() {
    const botao = document.getElementById("btnSalvarDescricao");
    if (botao) botao.style.display = "block";
  }
  
  function toggleMenu() {
    document.getElementById("navMenu").classList.toggle("show");
  }
  
  function trocarAba(id, btn) {
    document.querySelectorAll('.painel-card').forEach(c => c.style.display = 'none');
    document.querySelectorAll('.aba').forEach(b => b.classList.remove('ativa'));
    document.getElementById('aba-' + id).style.display = 'block';
    btn.classList.add('ativa');
  }
  
  function syncInfo() {
    const nomeEl = document.getElementById('nome-info');
    const cargoEl = document.getElementById('cargo-info');
    const setorEl = document.getElementById('setor-info');
    const pontuacaoEl = document.getElementById('pontuacao-info');
    if (nomeEl) nomeEl.textContent = document.getElementById('nome').textContent;
    if (cargoEl) cargoEl.textContent = document.getElementById('cargo').textContent;
    if (setorEl) setorEl.textContent = document.getElementById('setor').textContent;
    if (pontuacaoEl) pontuacaoEl.textContent = document.getElementById('pontuacaoValor').textContent;
  }
  
  document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        window.location.href = "login.html";
        return;
    }
  
    try {
        const res = await fetch("http://localhost:3000/users/perfil", {
            headers: { "Authorization": `Bearer ${token}` }
        });
  
        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }
        
        const data = await res.json();
        console.log("Dados carregados:", data);
  
        document.getElementById("nome").innerText = data.nome || data.Nome || "Não informado";
        document.getElementById("cargo").innerText = data.cargo || data.Cargo || "Não informado";
        document.getElementById("setor").innerText = data.setor || data.Setor || "Não informado";
        
        if (document.getElementById("pontuacaoValor")) {
            document.getElementById("pontuacaoValor").innerText = data.pontos || data.Pontos || 0;
        }
        
        const campoDescricao = document.getElementById("descricaoUsuario");
        if (campoDescricao) {
            campoDescricao.value = data.descricao || data.Descricao || "";
            document.getElementById("btnSalvarDescricao").style.display = "none";
        }
  
        const secaoPsicologo = document.getElementById("secaoPsicologo");
        const avisoSemPsi = document.getElementById("avisoSemPsi");
  
        if (data.psi_nome || data.Psi_nome) {
            if (secaoPsicologo) secaoPsicologo.style.display = "block";
            if (avisoSemPsi) avisoSemPsi.style.display = "none";
            document.getElementById("psiNome").innerText = data.psi_nome || data.Psi_nome;
            document.getElementById("psiEmail").innerText = data.psi_email || data.Psi_email || "Não informado";
            document.getElementById("psiNumero").innerText = data.psi_telefone || data.Psi_telefone || "Não informado";
            document.getElementById("psiDescricao").innerText = data.psi_descricao || data.Psi_descricao || "Sem descrição.";
  
            const fotoPsi = document.querySelector(".psico-foto");
            if (fotoPsi && data.psi_foto) {
                fotoPsi.src = data.psi_foto;
            }
        } else {
            if (secaoPsicologo) secaoPsicologo.style.display = "none";
            if (avisoSemPsi) avisoSemPsi.style.display = "block";
        }
  
        syncInfo();
  
    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
    }
  });
  
  async function salvarDescricao() {
    const descricao = document.getElementById("descricaoUsuario").value;
    const token = localStorage.getItem("token");
    const botao = document.getElementById("btnSalvarDescricao");
  
    try {
        const res = await fetch("http://localhost:3000/users/perfil/descricao", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ descricao })
        });
  
        if (res.ok) {
            if (botao) botao.style.display = "none"; 
        } else {
            document.getElementById("erroSalvar").style.display = "block";
        }
    } catch (error) {
        console.error("Erro:", error);
    }
  }