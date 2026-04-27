document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "Login.html";
        return;
    }

    const form = document.getElementById("meuFormulario");
    let perguntas = [];

    // Busca as perguntas do banco
    try {
        const res = await fetch("http://localhost:3000/desafios/formulario", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        perguntas = await res.json();
    } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
        return;
    }

    // Renderiza as perguntas no formulário
    form.innerHTML = "";
    perguntas.forEach((p, i) => {
        const isFirst = i === 0;
        const isLast = i === perguntas.length - 1;

        const div = document.createElement("div");
        div.classList.add(isFirst ? "ativa" : "Secundaria");

        div.innerHTML = `
            <label class="Borda">
                ${p.Pergunta}
            </label>
            <br>
            <textarea id="resposta_${p.ID}" required placeholder="Digite sua resposta aqui"></textarea>
            ${!isFirst ? `<button type="button" class="prev" id="botao">Questão anterior</button>` : ""}
            ${!isLast ? `<button type="button" class="prox" id="botao" disabled>Próxima questão</button>` : ""}
            ${isLast ? `<button type="button" class="prev" id="botao">Questão anterior</button><button type="submit" id="botao" class="Finalizar" disabled>Finalizar</button>` : ""}
        `;

        form.appendChild(div);
    });

    // Navegação entre etapas
    const etapas = form.querySelectorAll("div");
    let etapaAtual = 0;

    etapas.forEach((div) => {
        const textarea = div.querySelector("textarea");
        const btnProx = div.querySelector(".prox") || div.querySelector('button[type="submit"]');
        const btnPrev = div.querySelector(".prev");

        if (textarea && btnProx) {
            textarea.addEventListener("input", () => {
                btnProx.disabled = textarea.value.trim() === "";
            });
        }

        if (btnProx && btnProx.type !== "submit") {
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


    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const respostas = perguntas.map(p => ({
            id_pergunta: p.ID,
            resposta: document.getElementById(`resposta_${p.ID}`).value
        }));

        try {
            const res = await fetch("http://localhost:3000/respostas/formulario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ respostas })
            });

            const data = await res.json();

            if (res.ok) {
                alert("Formulário enviado com sucesso!");
                window.location.href = "painel.html";
            } else {
                alert("Erro: " + data.erro);
            }
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
        }
    });
});