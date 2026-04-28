function toggleMenu() {
    document.getElementById("navMenu").classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "../Login.html";
        return;
    }

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

        document.getElementById("nome").innerText      = data.Nome      || "Não informado";
        document.getElementById("email").innerText     = data.Email     || "Não informado";
        document.getElementById("telefone").innerText  = data.Telefone  || "Não informado";
        document.getElementById("crp").innerText       = data.CRP       || "Não informado";
        document.getElementById("descricaoTexto").innerText = data.Descricao || "Sem descrição.";

    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
    }
});