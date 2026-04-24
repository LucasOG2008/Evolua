document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");
    const usuarioStr = localStorage.getItem("usuario");

    if (!token || !usuarioStr) {
        redirecionarLogin();
        return;
    }

    let usuario;
    try {
        usuario = JSON.parse(usuarioStr);
    } catch {
        redirecionarLogin();
        return;
    }

    const tipo = usuario.tipo;

        const permissoes = {
        "html/index.html":                      ["comum"],
        "html/painel.html":                     ["comum"],
        "html/desafio.html":                    ["comum"],
        "html/formulario.html":                 ["comum"],
        "html/escolher_psiocologo.html":        ["comum"],

        "html/psicologo/psico_index.html":              ["psicologo"],
        "html/psicologo/psico_painel.html":             ["psicologo"],
        "html/psicologo/psicopacientes.html":           ["psicologo"],
        "html/psicologo/psicopossiveispacientes.html":  ["psicologo"],
        "html/psicologo/psico_validar_desafio.html":    ["psicologo"],
        "html/psicologo/psico_validar_formulario.html": ["psicologo"],

        "html/adm/adm_index.html":                          ["admin"],
        "html/adm/adm_cadastro.html":                       ["admin"],
        "html/adm/adm_cadastro_psicologo.html":             ["admin"],
        "html/adm/adm_busca_funcionario.html":              ["admin"],
        "html/adm/adm_visualizar_perfil.html":              ["admin"],
        "html/adm/adm_visualizar_perfil_psicologo.html":    ["admin"],
    };

    const pathAtual = window.location.pathname.toLowerCase();

    let tiposPermitidos = null;

    for (const [rota, tipos] of Object.entries(permissoes)) {
        if (pathAtual.includes(rota.toLowerCase())) {
            tiposPermitidos = tipos;
            break;
        }
    }

    if (tiposPermitidos !== null && !tiposPermitidos.includes(tipo)) {
        redirecionarPainelProprio(tipo);
        return;
    }

    function redirecionarLogin() {
        const nivelPasta = (window.location.pathname.match(/\//g) || []).length;
        const prefixo = nivelPasta <= 2 ? "../" : "../../";
        window.location.href = prefixo + "html/Login.html";
    }

    function redirecionarPainelProprio(tipo) {
        const nivelPasta = (window.location.pathname.match(/\//g) || []).length;
        const prefixo = nivelPasta <= 2 ? "" : "../";

        switch (tipo) {
            case "admin":
                window.location.href = prefixo + "adm/adm_index.html";
                break;
            case "psicologo":
                window.location.href = prefixo + "psicologo/psico_index.html";
                break;
            default:
                window.location.href = prefixo + "index.html";
        }
    }
});