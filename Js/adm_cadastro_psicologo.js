document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('acesso');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '../../html/Login.html';
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // ← estava faltando isso!

        const nome = document.getElementById('usuario').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const crp = document.getElementById('CRP').value.trim();
        const fotoFile = document.getElementById('foto').files[0];

        if (!nome || !email || !telefone || !cpf || !senha || !crp) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos obrigatórios',
                text: 'Preencha todos os campos obrigatórios antes de continuar.',
                confirmButtonColor: '#FF9100'
            });
            return;
        }

        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('email', email);
        formData.append('telefone', telefone);
        formData.append('cpf', cpf);
        formData.append('senha', senha);
        formData.append('crp', crp);
        if (fotoFile) formData.append('foto', fotoFile);

        try {
            const response = await fetch('http://localhost:3000/psicologos', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Cadastro realizado!',
                    text: 'Psicólogo cadastrado com sucesso.',
                    confirmButtonColor: '#FF9100'
                });
                form.reset();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Falha no cadastro',
                    text: data.erro || 'Ocorreu um erro ao cadastrar o psicólogo.',
                    confirmButtonColor: '#d33'
                });
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro de conexão',
                text: 'Não foi possível conectar ao servidor. Tente novamente.',
                confirmButtonColor: '#d33'
            });
        }
    });
});

window.toggleMenu = function () {
    document.getElementById('navMenu').classList.toggle('show');
};