const API = 'http://localhost:3000';

function getToken() {
    return localStorage.getItem('token');
}

function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('show');
}

function trocarAba(id, btn) {
    document.querySelectorAll('.painel-card').forEach(c => c.style.display = 'none');
    document.querySelectorAll('.aba').forEach(b => b.classList.remove('ativa'));
    document.getElementById('aba-' + id).style.display = 'block';
    btn.classList.add('ativa');
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

        // Título e pontuação
        document.getElementById('tituloPainel').textContent = `Painel de ${data.nome || 'Usuário'}`;
        document.getElementById('pontuacaoValor').textContent = data.Pontos || 0;

        // Dados do perfil
        document.getElementById('nomeUsuario').innerText  = data.nome    || 'Não informado';
        document.getElementById('emailUsuario').innerText = data.email   || 'Não informado';
        document.getElementById('cargoUsuario').innerText = data.cargo   || 'Não informado';
        document.getElementById('setorUsuario').innerText = data.setor   || 'Não informado';
        document.getElementById('descricaoTexto').textContent = data.descricao || 'Sem descrição cadastrada.';

        // Psicólogo
        const secaoPsicologo = document.getElementById('secaoPsicologo');
        const avisoSemPsi    = document.getElementById('avisoSemPsi');

        if (data.psi_nome) {
            secaoPsicologo.style.display = 'block';
            avisoSemPsi.style.display    = 'none';

            document.getElementById('psiNome').innerText    = data.psi_nome;
            document.getElementById('psiEmail').innerText   = data.psi_email    || 'Não informado';
            document.getElementById('psiNumero').innerText  = data.psi_telefone || 'Não informado';
            document.getElementById('psiDescricao').innerText = data.psi_descricao || 'Sem descrição.';

            const fotoPsi = document.getElementById('fotoPsicologo');
            if (fotoPsi && data.psi_foto) {
                fotoPsi.src = data.psi_foto;
            }
        } else {
            secaoPsicologo.style.display = 'none';
            avisoSemPsi.style.display    = 'block';
        }

    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        document.querySelector('main').innerHTML = '<p>Erro ao carregar dados do usuário.</p>';
    }
});