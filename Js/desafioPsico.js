const params     = new URLSearchParams(window.location.search);
const idPaciente = params.get("id");

document.addEventListener("DOMContentLoaded", async () => {

    if (!idPaciente) { window.location.href = "PsicoPossiveisPacientes.html"; return; }

    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "../Login.html"; return; }

    try {
        const res = await fetch(`http://localhost:3000/respostas/paciente/${idPaciente}?tipo=desafio`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 401) { window.location.href = "../Login.html"; return; }
        if (res.status === 403) { console.error("Sem vínculo com este paciente."); return; }
        if (!res.ok) { console.error("Erro API:", res.status); return; }

        const todas = await res.json();
        const respostaDesafio = todas.find(r => r.Tipo === "desafio");

        if (!respostaDesafio) {
            document.getElementById("caixaResposta").innerHTML =
                "<p>Este paciente ainda não respondeu nenhum desafio.</p>";
            return;
        }

        // Preenche tema e resposta
        const temaTexto = document.getElementById("temaTexto");
        if (temaTexto && respostaDesafio.Pergunta) {
            temaTexto.textContent = respostaDesafio.Pergunta;
        }

        const textarea = document.getElementById("resposta");
        if (textarea) textarea.value = respostaDesafio.Resposta;

        // Corrigido: botões pelo id correto
        const btnValidar   = document.getElementById("btnValidar");
        const btnInvalidar = document.getElementById("btnInvalidar");

        if (respostaDesafio.Status !== "enviado") {
            if (btnValidar)   { btnValidar.disabled   = true; btnValidar.textContent   = "Já validado"; }
            if (btnInvalidar) { btnInvalidar.disabled = true; btnInvalidar.textContent = "Já avaliado"; }
        } else {
            if (btnValidar)   btnValidar.addEventListener("click",   () => avaliar("analisado"));
            if (btnInvalidar) btnInvalidar.addEventListener("click", () => avaliar("invalido"));
        }

        async function avaliar(status) {
            const obsEl = document.getElementById("observacaoDesafio");
            const obs   = obsEl ? obsEl.value.trim() || null : null;

            const r = await fetch(`http://localhost:3000/respostas/${respostaDesafio.ID}/validar`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status, observacao: obs })
            });

            if (r.ok) window.history.back();
            else console.error("Erro ao avaliar:", await r.json());
        }

    } catch (e) {
        console.error("Erro:", e);
    }
});