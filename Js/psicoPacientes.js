function toggleMenu() {
    document.getElementById("navMenu").classList.toggle("show");
}

async function carregarMeusPacientes() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "../Login.html";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/psicologos/meus-pacientes", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        document.getElementById("loading").style.display = "none";

        if (res.status === 401) {
            window.location.href = "../Login.html";
            return;
        }

        const pacientes = await res.json();

        if (!Array.isArray(pacientes) || pacientes.length === 0) {
            document.getElementById("mensagemVazio").style.display = "block";
            return;
        }

        const lista = document.getElementById("listaPacientes");
        lista.innerHTML = "";

        pacientes.forEach(p => {
            const secao = document.createElement("section");
            secao.className = "pacientes";

            secao.innerHTML = `
                <h2>${p.Nome}</h2>
                <p>${p.Descricao || 'Sem descrição cadastrada.'}</p>
                ${p.Cargo ? `<p><strong>Cargo:</strong> ${p.Cargo}</p>` : ''}
                ${p.Setor ? `<p><strong>Setor:</strong> ${p.Setor}</p>` : ''}
                <div class="Vizualizar">
                    <a href="psico_validar_desafio.html?id=${p.ID}" class="icone">
                        <img src="../../Imagens/Icone_Sem_Fundo.png" alt="Icone arquivo">Visualizar Desafio
                    </a>
                    <a href="psico_validar_formulario.html?id=${p.ID}" class="icone">
                        <img src="../../Imagens/Icone_Sem_Fundo.png" alt="Icone arquivo">Visualizar Formulário
                    </a>
                </div>
            `;

            lista.appendChild(secao);
        });

    } catch (error) {
        document.getElementById("loading").style.display = "none";
        console.error("Erro ao carregar pacientes:", error);
        document.getElementById("mensagemVazio").textContent = "Erro ao carregar pacientes. Tente novamente.";
        document.getElementById("mensagemVazio").style.display = "block";
    }
}

carregarMeusPacientes();