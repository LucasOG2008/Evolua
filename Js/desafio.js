document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "Login.html";
        return;
    }

    // Carrega o desafio do banco
    let desafioAtual = null;

    try {
        const res = await fetch("http://localhost:3000/desafios", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const desafios = await res.json();

        if (desafios.length > 0) {
            // Pega o primeiro desafio (ou pode ser aleatório)
            desafioAtual = desafios[0];
            document.getElementById("temaTexto").innerText = desafioAtual.titulo || desafioAtual.descricao;
        }
    } catch (error) {
        console.error("Erro ao carregar desafio:", error);
    }

    // Envia a resposta
    document.getElementById("botao").addEventListener("click", async () => {
        const resposta = document.getElementById("resposta").value.trim();

        if (!resposta) {
            alert("Escreva sua reflexão antes de enviar.");
            return;
        }

        if (!desafioAtual) {
            alert("Nenhum desafio carregado.");
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/respostas/desafio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_pergunta: desafioAtual.id || desafioAtual.ID,
                    resposta
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.mensagem); // "Desafio enviado com sucesso! +10 pontos"
                document.getElementById("resposta").value = "";
            } else {
                alert("Erro: " + data.erro);
            }
        } catch (error) {
            console.error("Erro ao enviar desafio:", error);
        }
    });
});