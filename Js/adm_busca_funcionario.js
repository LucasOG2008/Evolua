const API = 'http://localhost:3000';

function getToken() {
    return localStorage.getItem('token');
}

function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('show');
}

function mostrarFuncionarios() {
    document.getElementById('funcionarios').style.display = 'block';
    document.getElementById('psicologos').style.display = 'none';
}

function mostrarPsicologos() {
    document.getElementById('psicologos').style.display = 'block';
    document.getElementById('funcionarios').style.display = 'none';
}

let todosUsuarios = [];
let todosPsicologos = [];

function renderizarUsuarios(lista) {
    const container = document.getElementById('listaFuncionarios');
    container.innerHTML = '';
    if (lista.length === 0) {
        container.innerHTML = '<p class="vazio">Nenhum funcionário encontrado.</p>';
        return;
    }
    lista.forEach(u => {
        const div = document.createElement('div');
        div.className = 'perfil';
        div.innerHTML = `<p>${u.nome || u.Nome}</p>`;
        div.style.cursor = 'pointer';
        div.onclick = () => {
            window.location.href = `adm_visualizar_perfil.html?id=${u.id || u.ID}`;
        };
        container.appendChild(div);
    });
}

function renderizarPsicologos(lista) {
    const container = document.getElementById('listaPsicologos');
    container.innerHTML = '';
    if (lista.length === 0) {
        container.innerHTML = '<p class="vazio">Nenhum psicólogo encontrado.</p>';
        return;
    }
    lista.forEach(p => {
        const div = document.createElement('div');
        div.className = 'perfil';
        div.innerHTML = `<p>${p.Nome || p.nome}</p>`;
        div.style.cursor = 'pointer';
        div.onclick = () => {
            window.location.href = `adm_visualizar_perfil_psicologo.html?id=${p.ID || p.id}`;
        };
        container.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = getToken();
    if (!token) {
        window.location.href = '../Login.html';
        return;
    }

    try {
        const resUsers = await fetch(`${API}/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (resUsers.status === 401 || resUsers.status === 403) {
            window.location.href = '../Login.html';
            return;
        }
        todosUsuarios = await resUsers.json();
        renderizarUsuarios(todosUsuarios);
    } catch (e) {
        document.getElementById('listaFuncionarios').innerHTML = '<p class="vazio">Erro ao carregar funcionários.</p>';
        console.error(e);
    }

    try {
        const resPsi = await fetch(`${API}/psicologos/admin/todos`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        todosPsicologos = await resPsi.json();
        renderizarPsicologos(todosPsicologos);
    } catch (e) {
        document.getElementById('listaPsicologos').innerHTML = '<p class="vazio">Erro ao carregar psicólogos.</p>';
        console.error(e);
    }


    document.getElementById('buscaFuncionario').addEventListener('input', function () {
        const termo = this.value.toLowerCase();
        const filtrado = todosUsuarios.filter(u =>
            (u.nome || u.Nome || '').toLowerCase().includes(termo)
        );
        renderizarUsuarios(filtrado);
    });


    document.getElementById('buscaPsicologo').addEventListener('input', function () {
        const termo = this.value.toLowerCase();
        const filtrado = todosPsicologos.filter(p =>
            (p.Nome || p.nome || '').toLowerCase().includes(termo)
        );
        renderizarPsicologos(filtrado);
    });
});
