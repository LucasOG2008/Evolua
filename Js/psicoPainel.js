function toggleMenu() {
    document.getElementById("navMenu").classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "../Login.html";
        return;
    }

    let fotoOriginal = ""; // Para restaurar se houver erro

    // 1. BUSCAR DADOS DO PERFIL
    try {
        const res = await fetch("http://localhost:3000/psicologos/perfil", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "../Login.html";
            return;
        }

        const data = await res.json();

        document.getElementById("nome").innerText = data.Nome || "Não informado";
        document.getElementById("email").innerText = data.Email || "Não informado";
        document.getElementById("telefone").innerText = data.Telefone || "Não informado";
        document.getElementById("crp").innerText = data.CRP || "Não informado";
        document.getElementById("descricaoTexto").value = data.Descricao || "";
        document.getElementById("btnSalvarDescricao").style.display = "none";

        if (data.Foto) {
            fotoOriginal = data.Foto;
            document.getElementById("fotoPerfil").src = data.Foto;
        }

    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
    }

    // 2. ALTERAR FOTO DE PERFIL
    document.getElementById("inputFoto").addEventListener("change", async (e) => {
        const arquivo = e.target.files[0];
        if (!arquivo) return;

        const msg = document.getElementById("msgFoto");
        const imgElement = document.getElementById("fotoPerfil");
        const backupFoto = imgElement.src; // Backup local antes de tentar o upload

        // Preview imediato (UX mais rápida)
        const leitor = new FileReader();
        leitor.onload = (ev) => { imgElement.src = ev.target.result; };
        leitor.readAsDataURL(arquivo);

        msg.style.color = "#555";
        msg.textContent = "Salvando...";

        const formData = new FormData();
        formData.append("foto", arquivo);

        try {
            const res = await fetch("http://localhost:3000/psicologos/perfil/foto", {
                method: "PATCH",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                msg.style.color = "green";
                msg.textContent = "Foto atualizada!";
                setTimeout(() => { msg.textContent = ""; }, 3000);
            } else {
                const erroData = await res.json().catch(() => ({}));
                msg.style.color = "red";
                msg.textContent = `Erro ao salvar: ${erroData.erro || res.status}`;
                imgElement.src = backupFoto; // Rollback da imagem
            }
        } catch (error) {
            console.error("Erro ao enviar foto:", error);
            msg.style.color = "red";
            msg.textContent = "Erro de conexão ao salvar foto.";
            imgElement.src = backupFoto; // Rollback da imagem
        }

        e.target.value = ""; // Limpa o input file
    });
});

// 3. GERENCIAMENTO DA DESCRIÇÃO
function mostrarBotaoSalvar() {
    const botao = document.getElementById("btnSalvarDescricao");
    if (botao) botao.style.display = "block";
}

async function salvarDescricao() {
    const descricao = document.getElementById("descricaoTexto").value;
    const token = localStorage.getItem("token");
    const botao = document.getElementById("btnSalvarDescricao");
    const erroMsg = document.getElementById("erroSalvar");

    try {
        const res = await fetch("http://localhost:3000/psicologos/perfil/descricao", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ descricao })
        });

        if (res.ok) {
            if (botao) botao.style.display = "none";
            if (erroMsg) erroMsg.style.display = "none";
            alert("Descrição atualizada com sucesso!");
        } else {
            if (erroMsg) erroMsg.style.display = "block";
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao conectar com o servidor.");
    }
}