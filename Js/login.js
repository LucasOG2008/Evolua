const form = document.getElementById("acesso");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cpf = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

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

        window.location.href = "painel.html";
    } else {
        alert(data.erro);
    }
});
