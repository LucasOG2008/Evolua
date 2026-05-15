let pacientes = [];
let indice = 0;

const atual = document.querySelector("#pacienteAtual");
const anterior = document.querySelector("#pacienteAnterior");
const proximo = document.querySelector("#pacienteProximo");

async function carregarPacientes() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "../Login.html";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/psicologos/pacientes", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 401) {
            window.location.href = "../Login.html";
            return;
        }

        pacientes = await res.json();

        if (pacientes.length === 0) {
            document.getElementById("erroNenhumPaciente").style.display = "block";
            return;
        }

        atualizar();
    } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
    }
}

function atualizar() {
    let ant = indice - 1;
    let prox = indice + 1;

    if (ant < 0) ant = pacientes.length - 1;
    if (prox >= pacientes.length) prox = 0;

    mostrar(atual, pacientes[indice], true);
    mostrar(anterior, pacientes[ant], false);
    mostrar(proximo, pacientes[prox], false);
}

function mostrar(elemento, dados, mostrarBotao) {
    const nome = elemento.querySelector(".nome");
    const descricao = elemento.querySelector(".descricao");
    const linkFormulario = elemento.querySelector(".visualizar");

    nome.textContent = dados.Nome;
    descricao.textContent = dados.Descricao || 'Sem descrição';

    if (linkFormulario) {
        linkFormulario.href = `psico_validar_formulario.html?id=${dados.ID}`;
    }

    const btnCurtir = elemento.querySelector(".btn-curtir");

    if (mostrarBotao && btnCurtir) {
        btnCurtir.style.display = "block";
        btnCurtir.onclick = () => curtirPaciente(dados.ID, dados.Nome);
    } else if (btnCurtir) {
        btnCurtir.style.display = "none";
    }
}

async function curtirPaciente(id, nome) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://localhost:3000/psicologos/pacientes/${id}/curtir`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
            mostrarNotificacao(`Você curtiu ${nome}! Aguardando aceitação.`, "sucesso");
        } else {
            const dados = await res.json();
            mostrarNotificacao(dados.erro || "Não foi possível curtir.", "erro");
        }
    } catch (error) {
        console.error("Erro ao curtir:", error);
        mostrarNotificacao("Erro de conexão ao tentar curtir.", "erro");
    }
}

function mostrarNotificacao(mensagem, tipo) {
    const notif = document.getElementById("notificacaoCurtir");

    notif.textContent = mensagem;
    notif.className = tipo;
    notif.style.opacity = "1";
    notif.style.display = "block";

    clearTimeout(notif._timeout);
    notif._timeout = setTimeout(function () {
        notif.style.opacity = "0";
        setTimeout(function () { notif.style.display = "none"; }, 400);
    }, 3000);
}

document.getElementById("proximo").onclick = function () {
    indice = (indice + 1) % pacientes.length;
    atualizar();
};

document.getElementById("anterior").onclick = function () {
    indice = (indice - 1 + pacientes.length) % pacientes.length;
    atualizar();
};

carregarPacientes();