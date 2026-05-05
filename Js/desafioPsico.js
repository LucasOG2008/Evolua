const params     = new URLSearchParams(window.location.search);
const idPaciente = params.get("id");

document.addEventListener("DOMContentLoaded", async () => {

    if (!idPaciente) {
        window.location.href = "PsicoPossiveisPacientes.html";
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "../Login.html"; return; }

    let respostaDesafio = null;
    try {
        const res = await fetch(`http://localhost:3000/respostas/paciente/${idPaciente}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 401) { window.location.href = "../Login.html"; return; }

        const todas = await res.json();
        respostaDesafio = todas.find(r => r.Tipo === "desafio");
    } catch (e) {
        console.error("Erro ao buscar desafio:", e);
    }

    if (!respostaDesafio) {
        document.getElementById("caixaResposta").innerHTML =
            "<p>Este paciente ainda não respondeu nenhum desafio.</p>";
        return;
    }

    const temaTexto = document.getElementById("temaTexto");
    if (temaTexto && respostaDesafio.Pergunta) {
        temaTexto.textContent = respostaDesafio.Pergunta;
    }

    const textarea = document.getElementById("resposta");
    if (textarea) {
        textarea.value = respostaDesafio.Resposta;
    }

    const botoes = document.querySelectorAll("#botaoval");
    const btnValidar   = botoes[0];
    const btnInvalidar = botoes[1];

    if (respostaDesafio.Status !== "enviado") {
        const msg = document.createElement("p");
        msg.textContent = `Status atual: ${respostaDesafio.Status}`;
        msg.style.fontWeight = "bold";
        document.getElementById("reflexao").appendChild(msg);
        if (btnValidar)   btnValidar.disabled   = true;
        if (btnInvalidar) btnInvalidar.disabled = true;
    } else {
        if (btnValidar) {
            btnValidar.addEventListener("click", () => avaliar("analisado"));
        }
        if (btnInvalidar) {
            btnInvalidar.addEventListener("click", () => avaliar("invalido"));
        }
    }

    async function avaliar(status) {
        const obs = prompt("Observação para o paciente (opcional):", "") || null;

        try {
            const res = await fetch(`http://localhost:3000/respostas/${respostaDesafio.ID}/validar`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status, observacao: obs })
            });

        } catch (e) {
            console.error("Erro ao avaliar:", e);
        }
    }
});