const API = 'http://localhost:3000';

function getToken() {
    return localStorage.getItem('token');
}

function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('show');
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = getToken();
    if (!token) {
        window.location.href = '../Login.html';
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const psiId = params.get('id');

    if (!psiId) {
        document.querySelector('main').innerHTML = '<p>Psicólogo não especificado.</p>';
        return;
    }

    try {
        const res = await fetch(`${API}/psicologos/admin/${psiId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401 || res.status === 403) {
            window.location.href = '../Login.html';
            return;
        }

        if (res.status === 404) {
            document.querySelector('main').innerHTML = '<p>Psicólogo não encontrado.</p>';
            return;
        }

        const data = await res.json();

        document.getElementById('nomePsicologo').innerText    = data.Nome      || 'Não informado';
        document.getElementById('crpPsicologo').innerText     = data.CRP       || 'Não informado';
        document.getElementById('emailPsicologo').innerText   = data.Email     || 'Não informado';
        document.getElementById('telefonePsicologo').innerText = data.Telefone || 'Não informado';
        document.getElementById('descricaoPsicologo').textContent = data.Descricao || 'Sem descrição cadastrada.';
        document.getElementById('totalPacientes').textContent = data.TotalPacientes || 0;

        const fotoEl = document.getElementById('fotoPerfil');
        if (data.Foto) {
            fotoEl.src = data.Foto;
            fotoEl.alt = `Foto de ${data.Nome}`;
        }

    } catch (error) {
        console.error('Erro ao carregar perfil do psicólogo:', error);
        document.querySelector('main').innerHTML = '<p>Erro ao carregar dados do psicólogo.</p>';
    }
});