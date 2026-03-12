document.addEventListener("DOMContentLoaded", () => {
    const etapas = document.querySelectorAll("#Perguntas form > div");
    let etapaAtual = 0;

    // Inicializa a primeira etapa
    etapas[etapaAtual].classList.add("ativa");

    // Função para atualizar o estado dos botões de "Próximo" e "Finalizar"
    const gerenciarBotoes = (indice) => {
        const divAtual = etapas[indice];
        const campoTexto = divAtual.querySelector("textarea");
        const btnProximo = divAtual.querySelector(".prox") || divAtual.querySelector('button[type="submit"]');
        const btnAnterior = divAtual.querySelector(".prev");

        // Validação: Libera o botão se houver texto
        campoTexto.addEventListener("input", () => {
            btnProximo.disabled = campoTexto.value.trim() === "";
        });

        // Botão "Voltar" sempre habilitado se existir (exceto na primeira questão)
        if (btnAnterior) {
            btnAnterior.disabled = false;
        }
    };

    // Configura os eventos de clique
    etapas.forEach((div, indice) => {
        gerenciarBotoes(indice);

        const btnProx = div.querySelector(".prox");
        const btnPrev = div.querySelector(".prev");

        if (btnProx) {
            btnProx.addEventListener("click", () => {
                etapas[etapaAtual].classList.remove("ativa");
                etapaAtual++;
                etapas[etapaAtual].classList.add("ativa");
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener("click", () => {
                etapas[etapaAtual].classList.remove("ativa");
                etapaAtual--;
                etapas[etapaAtual].classList.add("ativa");
            });
        }
    });
});