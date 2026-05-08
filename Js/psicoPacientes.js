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

        const lista     = document.getElementById("listaPacientes");
        const template  = document.getElementById("templatePaciente");

        pacientes.forEach(p => {
            const clone = template.content.cloneNode(true);

            clone.querySelector(".paciente-nome").textContent = p.Nome;
            clone.querySelector(".paciente-descricao").textContent = p.Descricao || "Sem descrição cadastrada.";

            if (p.Cargo) {
                const elCargo = clone.querySelector(".paciente-cargo");
                elCargo.querySelector("span").textContent = p.Cargo;
                elCargo.style.display = "block";
            }

            if (p.Setor) {
                const elSetor = clone.querySelector(".paciente-setor");
                elSetor.querySelector("span").textContent = p.Setor;
                elSetor.style.display = "block";
            }

            clone.querySelector(".link-desafio").href    = `psico_validar_desafio.html?id=${p.ID}`;
            clone.querySelector(".link-formulario").href = `psico_validar_formulario.html?id=${p.ID}`;

            lista.appendChild(clone);
        });

    } catch (error) {
        document.getElementById("loading").style.display = "none";
        console.error("Erro ao carregar pacientes:", error);

        const aviso = document.getElementById("mensagemVazio");
        aviso.textContent   = "Erro ao carregar pacientes. Tente novamente.";
        aviso.style.display = "block";
    }
}

carregarMeusPacientes();