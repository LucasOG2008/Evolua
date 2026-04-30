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
    const userId = params.get('id');

    if (!userId) {
        document.querySelector('main').innerHTML = '<p>Usuário não especificado.</p>';
        return;
    }

    try {
        const res = await fetch(`${API}/users/admin/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401 || res.status === 403) {
            window.location.href = '../Login.html';
            return;
        }

        if (res.status === 404) {
            document.querySelector('main').innerHTML = '<p>Usuário não encontrado.</p>';
            return;
        }

        const data = await res.json();


        document.getElementById('tituloPainel').textContent = `Painel de ${data.nome || 'Usuário'}`;


        document.getElementById('infoUsuario').innerHTML = `
            <p><strong>Nome:</strong> ${data.nome || 'Não informado'}</p>
            <p><strong>Email:</strong> ${data.email || 'Não informado'}</p>
            <p><strong>Cargo:</strong> ${data.cargo || 'Não informado'}</p>
            <p><strong>Setor:</strong> ${data.setor || 'Não informado'}</p>
        `;


        document.getElementById('descricaoUsuario').innerHTML = `
            <h3>Sobre</h3>
            <p>${data.descricao || 'Sem descrição cadastrada.'}</p>
        `;


        document.getElementById('pontuacao').innerHTML = `
            <h3>Pontuação</h3>
            <span style="font-size:2rem; font-weight:bold;">${data.Pontos || 0} pts</span>
        `;

        const infoPsicologo = document.getElementById('infoPsicologo');
        const descricaoPsicologo = document.getElementById('descricaoPsicologo');
        const fotoPsicologo = document.getElementById('fotoPsicologo');

        if (data.psi_nome) {
            if (fotoPsicologo) fotoPsicologo.style.display = 'none'; // sem foto nesta rota
            infoPsicologo.innerHTML = `
                <p><strong>Nome:</strong> ${data.psi_nome}</p>
                <p><strong>Email:</strong> ${data.psi_email || 'Não informado'}</p>
                <p><strong>Telefone:</strong> ${data.psi_telefone || 'Não informado'}</p>
            `;
            descricaoPsicologo.innerHTML = `
                <h3>Sobre o Psicólogo</h3>
                <p>${data.psi_descricao || 'Sem descrição.'}</p>
            `;
        } else {
            document.querySelector('section.card:last-of-type').innerHTML = `
                <h2>Psicólogo</h2>
                <p style="padding:1rem;">Este usuário ainda não possui psicólogo vinculado.</p>
            `;
        }

    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        document.querySelector('main').innerHTML = '<p>Erro ao carregar dados do usuário.</p>';
    }
});
