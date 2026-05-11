let pacientes = [];
let indice = 0;

const atual    = document.querySelector("#pacienteAtual");
const anterior = document.querySelector("#pacienteAnterior");
const proximo  = document.querySelector("#pacienteProximo");

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

        const dados = await res.json();

        if (!Array.isArray(dados) || dados.length === 0) {
            document.getElementById("mensagemVazio").style.display = "block";
            // Esconde carrossel se não há pacientes
            document.getElementById("carrossel").style.display = "none";
            return;
        }

        pacientes = dados;
        atualizar();

    } catch (error) {
        document.getElementById("loading").style.display = "none";
        console.error("Erro ao carregar pacientes:", error);

        const aviso = document.getElementById("mensagemVazio");
        aviso.textContent = "Erro ao carregar pacientes. Tente novamente.";
        aviso.style.display = "block";
        document.getElementById("carrossel").style.display = "none";
    }
}

function atualizar() {
    let ant  = indice - 1;
    let prox = indice + 1;

    if (ant < 0) ant = pacientes.length - 1;
    if (prox >= pacientes.length) prox = 0;

    mostrar(atual,    pacientes[indice], true);
    mostrar(anterior, pacientes[ant],   false);
    mostrar(proximo,  pacientes[prox],  false);
}

function mostrar(elemento, dados, principal) {
    elemento.querySelector(".nome").textContent      = dados.Nome;
    elemento.querySelector(".descricao").textContent = dados.Descricao || "Sem descrição cadastrada.";

    // Cargo e Setor só existem no card principal
    if (principal) {
        const elCargo = elemento.querySelector(".paciente-cargo");
        const elSetor = elemento.querySelector(".paciente-setor");

        if (elCargo) {
            if (dados.Cargo) {
                elemento.querySelector(".cargo-valor").textContent = dados.Cargo;
                elCargo.style.display = "block";
            } else {
                elCargo.style.display = "none";
            }
        }

        if (elSetor) {
            if (dados.Setor) {
                elemento.querySelector(".setor-valor").textContent = dados.Setor;
                elSetor.style.display = "block";
            } else {
                elSetor.style.display = "none";
            }
        }

        const linkDesafio    = elemento.querySelector(".link-desafio");
        const linkFormulario = elemento.querySelector(".link-formulario");

        if (linkDesafio)    linkDesafio.href    = `psico_validar_desafio.html?id=${dados.ID}`;
        if (linkFormulario) linkFormulario.href = `psico_validar_formulario.html?id=${dados.ID}`;
    }
}

document.getElementById("proximo").onclick = function () {
    if (pacientes.length === 0) return;
    indice = (indice + 1) % pacientes.length;
    atualizar();
};

document.getElementById("anterior").onclick = function () {
    if (pacientes.length === 0) return;
    indice = (indice - 1 + pacientes.length) % pacientes.length;
    atualizar();
};

carregarMeusPacientes();