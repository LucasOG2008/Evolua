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

     
        document.getElementById('nomePsicologo').textContent = data.Nome || 'Psicólogo';

        const fotoEl = document.getElementById('fotoPerfil');
        if (data.Foto) {
            fotoEl.src = data.Foto;
            fotoEl.alt = `Foto de ${data.Nome}`;
        } else {
            fotoEl.style.display = 'none';
        }

       
        document.getElementById('descricao').textContent = data.Descricao || 'Sem descrição cadastrada.';

        document.getElementById('infoContato').innerHTML = `
            <p><strong>Email:</strong> ${data.Email || 'Não informado'}</p>
            <p><strong>Telefone:</strong> ${data.Telefone || 'Não informado'}</p>
            <p><strong>CRP:</strong> ${data.CRP || 'Não informado'}</p>
        `;


        document.getElementById('pacientes').innerHTML = `
            <span style="font-size:2rem; font-weight:bold;">${data.TotalPacientes || 0}</span>
            <p>paciente(s) ativo(s)</p>
        `;

    } catch (error) {
        console.error('Erro ao carregar perfil do psicólogo:', error);
        document.querySelector('main').innerHTML = '<p>Erro ao carregar dados do psicólogo.</p>';
    }
});
