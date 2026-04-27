document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('acesso');
    const token = localStorage.getItem('token');

    form.addEventListener('submit', async (e) => {

        const nome = document.getElementById('usuario').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const crp = document.getElementById('CRP').value.trim();
        const fotoInput = document.getElementById('foto');
        const fotoFile = fotoInput.files[0];

        if (!nome || !email || !telefone || !cpf || !senha || !crp) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('email', email);
        formData.append('telefone', telefone);
        formData.append('cpf', cpf);
        formData.append('senha', senha);
        formData.append('crp', crp);
        if (fotoFile) {
            formData.append('foto', fotoFile);
        }

        try {
            const response = await fetch('http://localhost:3000/psicologos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert('Psicólogo cadastrado com sucesso!');
                form.reset();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.erro || 'Falha no cadastro',
                    confirmButtonColor: '#d33'
                });
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro de conexão com o servidor.');
        }
    });
});

window.toggleMenu = function() {
    document.getElementById("navMenu").classList.toggle("show");
};