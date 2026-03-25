document.addEventListener("DOMContentLoaded", () => {
    const etapas = document.querySelectorAll("#Perguntas form > div");
    let etapaAtual = 0;

    // Inicializa a primeira etapa
    etapas[etapaAtual].classList.add("ativa");

    // Configura os eventos de clique
    etapas.forEach((div, indice) => {
        const btnProx = div.querySelector(".prox");
        const btnPrev = div.querySelector(".prev");
        const btnFinalizar = div.querySelector(".Finalizar");

        // Removemos a validação de input, pois o texto já estará lá
        if (btnProx) {
            btnProx.disabled = false; // Garante que o botão esteja clicável
            btnProx.addEventListener("click", () => {
                etapas[etapaAtual].classList.remove("ativa");
                etapaAtual++;
                etapas[etapaAtual].classList.add("ativa");
            });
        }

        if (btnPrev) {
            btnPrev.disabled = false; // Garante que o botão de voltar esteja clicável
            btnPrev.addEventListener("click", () => {
                etapas[etapaAtual].classList.remove("ativa");
                etapaAtual--;
                etapas[etapaAtual].classList.add("ativa");
            });
        }

        // Oculta o botão finalizar, pois o psicólogo não envia o formulário
        
    });
});