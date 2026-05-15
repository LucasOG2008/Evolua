const BASE = "http://localhost:3000";

// ── MENU ──────────────────────────────────────────────────────
function toggleMenu() {
    document.getElementById("navMenu").classList.toggle("show");
}

// ── ABAS ──────────────────────────────────────────────────────
function trocarAba(id, btn) {
    document.querySelectorAll(".painel-card").forEach(c => c.style.display = "none");
    document.querySelectorAll(".aba").forEach(b => b.classList.remove("ativa"));
    document.getElementById("aba-" + id).style.display = "block";
    btn.classList.add("ativa");
}

// ── SALVAR DESCRIÇÃO ──────────────────────────────────────────
function mostrarBotaoSalvar() {
    const botao = document.getElementById("btnSalvarDescricao");
    if (botao) botao.style.display = "block";
}

async function salvarDescricao() {
    const descricao = document.getElementById("descricaoUsuario").value;
    const token     = localStorage.getItem("token");
    const botao     = document.getElementById("btnSalvarDescricao");

    try {
        const res = await fetch(`${BASE}/users/perfil/descricao`, {
            method: "PATCH",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ descricao })
        });

        if (res.ok) {
            if (botao) botao.style.display = "none";
            document.getElementById("erroSalvar").style.display = "none";
        } else {
            document.getElementById("erroSalvar").style.display = "block";
        }
    } catch (err) {
        console.error("Erro ao salvar descrição:", err);
        document.getElementById("erroSalvar").style.display = "block";
    }
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch(`${BASE}/users/perfil`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }

        const data = await res.json();
        console.log("Dados carregados:", data);

        // ── Perfil
        document.getElementById("nome").innerText  = data.nome  || data.Nome  || "Não informado";
        document.getElementById("cargo").innerText = data.cargo || data.Cargo || "Não informado";
        document.getElementById("setor").innerText = data.setor || data.Setor || "Não informado";

        if (document.getElementById("pontuacaoValor")) {
            document.getElementById("pontuacaoValor").innerText = data.Pontos || data.pontos || 0;
        }

        const campoDescricao = document.getElementById("descricaoUsuario");
        if (campoDescricao) {
            campoDescricao.value = data.descricao || data.Descricao || "";
            document.getElementById("btnSalvarDescricao").style.display = "none";
        }

        // ── Psicólogo vinculado (vem junto no /users/perfil)
        const secaoPsicologo = document.getElementById("secaoPsicologo");
        const avisoSemPsi    = document.getElementById("avisoSemPsi");

        const nomePsi = data.psi_nome || data.Psi_nome;

        if (nomePsi) {
            if (secaoPsicologo) secaoPsicologo.style.display = "block";
            if (avisoSemPsi)    avisoSemPsi.style.display    = "none";

            document.getElementById("psiNome").innerText     = nomePsi;
            document.getElementById("psiEmail").innerText    = data.psi_email    || data.Psi_email    || "Não informado";
            document.getElementById("psiNumero").innerText   = data.psi_telefone || data.Psi_telefone || "Não informado";
            document.getElementById("psiDescricao").innerText = data.psi_descricao || data.Psi_descricao || "Sem descrição.";

            const fotoPsi = document.querySelector(".psico-foto");
            if (fotoPsi && (data.psi_foto || data.Psi_foto)) {
                fotoPsi.src = data.psi_foto || data.Psi_foto;
            }

            // Vincula o botão de desvincular
            const btnDesvincular = document.getElementById("btnDesvincularPS");
            if (btnDesvincular) {
                btnDesvincular.onclick = () => confirmarDesvincularPsicologo(nomePsi);
            }

        } else {
            if (secaoPsicologo) secaoPsicologo.style.display = "none";
            if (avisoSemPsi)    avisoSemPsi.style.display    = "block";
        }

    } catch (err) {
        console.error("Erro ao buscar perfil:", err);
    }
});

// ── DESVINCULAR PSICÓLOGO ─────────────────────────────────────
async function confirmarDesvincularPsicologo(nomePsi) {
    const confirmado = confirm(
        `Tem certeza que deseja se desvincular de "${nomePsi}"?\nEsta ação não pode ser desfeita.`
    );
    if (!confirmado) return;

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`${BASE}/psicologos/desvincular`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
            document.getElementById("secaoPsicologo").style.display = "none";
            document.getElementById("avisoSemPsi").style.display    = "block";
        } else {
            const dados = await res.json();
            alert("Erro ao desvincular: " + (dados.erro || "Tente novamente."));
        }

    } catch (err) {
        console.error("Erro ao desvincular psicólogo:", err);
        alert("Erro de conexão ao tentar desvincular.");
    }
}