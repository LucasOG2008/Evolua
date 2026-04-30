const params     = new URLSearchParams(window.location.search);
const idPaciente = params.get("id");

const mapaTextarea = {
    1: "pergInicial",
    2: "segPerg",
    3: "terPerg",
    4: "quarPerg",
    5: "quinPerg"
};

const mapaObs = {
    1: "obs-1",
    2: "obs-2",
    3: "obs-3",
    4: "obs-4",
    5: "obs-5"
};

document.addEventListener("DOMContentLoaded", async () => {

    const etapas = document.querySelectorAll("#Perguntas form > div");
    let etapaAtual = 0;
    etapas[0].classList.add("ativa");

    etapas.forEach(div => {
        const btnProx = div.querySelector(".prox");
        const btnPrev = div.querySelector(".prev");

        if (btnProx) {
            btnProx.disabled = false;
            btnProx.addEventListener("click", () => {
                etapas[etapaAtual].classList.remove("ativa");
                etapaAtual++;
                etapas[etapaAtual].classList.add("ativa");
            });
        }
        if (btnPrev) {
            btnPrev.disabled = false;
            btnPrev.addEventListener("click", () => {
                etapas[etapaAtual].classList.remove("ativa");
                etapaAtual--;
                etapas[etapaAtual].classList.add("ativa");
            });
        }
    });

    if (!idPaciente) { window.location.href = "PsicoPossiveisPacientes.html"; return; }

    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "../Login.html"; return; }

    try {
        const res = await fetch(`http://localhost:3000/respostas/paciente/${idPaciente}?tipo=formulario`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 401) { window.location.href = "../Login.html"; return; }
        if (!res.ok) { console.error("Erro API:", res.status); return; }

        const todas = await res.json();

        const vistas = new Set();
        const respostas = todas.filter(r => {
            if (vistas.has(r.ID_pergunta)) return false;
            vistas.add(r.ID_pergunta);
            return true;
        });

        // Preenche resposta do paciente e observação já existente
        respostas.forEach(r => {
            const ta = document.getElementById(mapaTextarea[r.ID_pergunta]);
            if (ta) ta.value = r.Resposta;

            const obs = document.getElementById(mapaObs[r.ID_pergunta]);
            if (obs && r.Observacao_psicologo) obs.value = r.Observacao_psicologo;
        });

        const ultimaEtapa = etapas[etapas.length - 1];
        const [btnValidar, btnInvalidar] = ultimaEtapa.querySelectorAll(".Finalizar");
        const pendentes = respostas.filter(r => r.Status === "enviado");

        if (pendentes.length === 0) {
            if (btnValidar)   { btnValidar.disabled   = true; btnValidar.textContent   = "Já validado"; }
            if (btnInvalidar) { btnInvalidar.disabled = true; btnInvalidar.textContent = "Já avaliado"; }
        } else {
            if (btnValidar)   { btnValidar.disabled   = false; btnValidar.addEventListener("click",   () => avaliar("analisado")); }
            if (btnInvalidar) { btnInvalidar.disabled = false; btnInvalidar.addEventListener("click", () => avaliar("invalido")); }
        }

        async function avaliar(status) {
            for (const r of pendentes) {
                // Cada resposta pega a observação do seu próprio campo
                const obsEl = document.getElementById(mapaObs[r.ID_pergunta]);
                const obs   = obsEl ? obsEl.value.trim() || null : null;

                await fetch(`http://localhost:3000/respostas/${r.ID}/validar`, {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ status, observacao: obs })
                });
            }
            window.history.back();
        }

    } catch (e) {
        console.error("Erro:", e);
    }
});