let psicologos = [];
let indice = 0;

const atual = document.querySelector("#psicologoAtual");
const anterior = document.querySelector("#psicologoAnterior");
const proximo = document.querySelector("#psicologoProximo");

async function carregarPsicologos() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/psicologos", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 401) {
            window.location.href = "login.html";
            return;
        }

        psicologos = await res.json();

        if (psicologos.length === 0) {
            document.getElementById("erroNenhumPsicologo").style.display = "block";
            return;
        }

        atualizar();
    } catch (error) {
        console.error("Erro ao carregar psicólogos:", error);
    }
}

function atualizar() {
    let ant = indice - 1;
    let prox = indice + 1;

    if (ant < 0) ant = psicologos.length - 1;
    if (prox >= psicologos.length) prox = 0;

    mostrar(atual, psicologos[indice], true);
    mostrar(anterior, psicologos[ant], false);
    mostrar(proximo, psicologos[prox], false);
}

function mostrar(elemento, dados, mostrarBotao) {
    const foto = elemento.querySelector(".foto");
    const descricao = elemento.querySelector(".descricao");

    if (dados.Foto) {
        foto.style.backgroundImage = `url('${dados.Foto}')`;
    } else {
        foto.style.backgroundImage = `url('../Imagens/Home_page/fim.png')`;
    }
    foto.style.backgroundSize = "cover";
    foto.style.backgroundPosition = "center";

    descricao.textContent = `${dados.Nome} — ${dados.Descricao || 'Sem descrição'}`;

    const btnCurtir = elemento.querySelector(".btn-curtir");
    if (mostrarBotao && btnCurtir) {
        btnCurtir.style.display = "block";
        btnCurtir.onclick = () => curtirPsicologo(dados.ID, dados.Nome);
    } else if (btnCurtir) {
        btnCurtir.style.display = "none";
    }
}

async function curtirPsicologo(id, nome) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://localhost:3000/psicologos/${id}/curtir`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
            document.getElementById("psicologoVinculado").style.display = "block";
        } else {
            document.getElementById("erroVincular").style.display = "block";
        }
    } catch (error) {
        console.error("Erro ao curtir:", error);
    }
}

document.getElementById("proximo").onclick = function () {
    indice = (indice + 1) % psicologos.length;
    atualizar();
};

document.getElementById("anterior").onclick = function () {
    indice = (indice - 1 + psicologos.length) % psicologos.length;
    atualizar();
};

carregarPsicologos();
