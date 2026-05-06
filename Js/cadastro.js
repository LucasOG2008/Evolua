const form = document.getElementById("acesso");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("usuario").value.trim();
    const cargo = document.getElementById("cargo").value.trim();
    const setor = document.getElementById("setor").value.trim();
    const email = document.getElementById("email").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!nome || !cargo || !setor || !email || !cpf || !senha) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos obrigatórios',
            text: 'Preencha todos os campos antes de continuar.',
            confirmButtonColor: '#FF9100'
        });
        return;
    }

    try {
        const resposta = await fetch("http://localhost:3000/auth/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, cargo, setor, email, cpf, senha })
        });

        const data = await resposta.json();

        if (resposta.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Cadastro realizado!',
                text: 'Usuário cadastrado com sucesso.',
                confirmButtonColor: '#FF9100'
            });
            form.reset();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Falha no cadastro',
                text: data.erro || 'Ocorreu um erro ao cadastrar o usuário.',
                confirmButtonColor: '#d33'
            });
        }

    } catch (erro) {
        console.error("Erro:", erro);
        Swal.fire({
            icon: 'error',
            title: 'Erro de conexão',
            text: 'Não foi possível conectar ao servidor. Tente novamente.',
            confirmButtonColor: '#d33'
        });
    }
});