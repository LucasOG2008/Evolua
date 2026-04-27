const form = document.getElementById("acesso");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = {
        nome: document.getElementById("usuario").value,
        cargo: document.getElementById("cargo").value,
        setor: document.getElementById("setor").value,
        email: document.getElementById("email").value,
        cpf: document.getElementById("cpf").value,
        senha: document.getElementById("senha").value
    };

    try {
        const resposta = await fetch("http://localhost:3000/auth/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            document.getElementById("Cadastrosucesso").style.display = "block";
        }

    } catch (erro) {
        console.error("Erro:", erro);
    }
});