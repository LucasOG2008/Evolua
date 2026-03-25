async function mostrarFuncionarios() {
    const res = await fetch("http://localhost:3000/funcionarios");
    const dados = await res.json();

    const container = document.getElementById("funcionarios");
    
    container.innerHTML = `
        <div class="barraBusca">
            <input type="text" id="buscaFuncionario" placeholder="Buscar funcionário">
            <button onclick="buscarFuncionario()">Buscar</button>
        </div>
    `;

    dados.forEach(f => {
        const div = document.createElement("div");
        div.classList.add("perfil");
        div.innerHTML = `<p>${f.nome}</p>`;
        container.appendChild(div);
    });
}

async function mostrarPsicologos() {
    const res = await fetch("http://localhost:3000/psicologos");
    const dados = await res.json();

    const container = document.getElementById("psicologos");

    container.innerHTML = `
        <div class="barraBusca">
            <input type="text" id="buscaPsicologo" placeholder="Buscar psicólogo">
            <button onclick="buscarPsicologo()">Buscar</button>
        </div>
    `;

    dados.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("perfil");
        div.innerHTML = `<p>${p.nome}</p>`;
        container.appendChild(div);
    });
}

async function buscarFuncionario() {
    const nome = document.getElementById("buscaFuncionario").value;

    const res = await fetch(`http://localhost:3000/funcionarios/busca?nome=${nome}`);
    const dados = await res.json();

    const container = document.getElementById("funcionarios");

    container.innerHTML = "";

    dados.forEach(f => {
        const div = document.createElement("div");
        div.classList.add("perfil");
        div.innerHTML = `<p>${f.nome}</p>`;
        container.appendChild(div);
    });
}


async function buscarPsicologo() {
    const nome = document.getElementById("buscaPsicologo").value;

    const res = await fetch(`http://localhost:3000/psicologos/busca?nome=${nome}`);
    const dados = await res.json();

    const container = document.getElementById("psicologos");

    container.innerHTML = "";

    dados.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("perfil");
        div.innerHTML = `<p>${p.nome}</p>`;
        container.appendChild(div);
    });
}