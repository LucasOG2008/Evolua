const form = document.getElementById("acesso");
const modal = document.querySelector('#meuModal');
const textoErro = document.querySelector('#mensagemErro');
const botaoFechar = document.querySelector('#fecharModal');

botaoFechar.onclick = function() {
    modal.style.display = "none";
};

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cpf = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    try {
        const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ cpf, senha })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            // Redireciona baseado no tipo de usuário
            switch (data.usuario.tipo) {
                case 'admin':
                    window.location.href = "adm/adm_index.html";
                    break;
                case 'psicologo':
                    window.location.href = "psicologo/psico_index.html";
                    break;
                default: // 'comum'
                    window.location.href = "index.html";
            }
        } else {
                document.getElementById("mensagemErro").textContent = data.erro || 'Erro ao fazer login';
                document.getElementById("meuModal").style.display = "block";
        }
        
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById("meuModal").style.display = "block";
    }
});