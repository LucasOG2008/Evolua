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
        
        // Dica: adicione aqui o feedback para o usuário saber se funcionou!
        if (resposta.ok) {
            alert("Cadastrado com sucesso!");
        }

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao conectar com o servidor");
    }
});