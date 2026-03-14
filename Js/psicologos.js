const psicologos = [

{
foto: "../Imagens/Home_page/fim.png",
descricao: "Dr. João Silva - Especialista em ansiedade."
},

{
foto: "",
descricao: "Dra. Ana Costa - Terapia cognitivo comportamental."
},

{
foto: "",
descricao: "Dr. Marcos Lima - Desenvolvimento emocional."
},

{
foto: "",
descricao: "Dra. Juliana Alves - Psicologia clínica."
}

];

let indice = 0;

const atual = document.querySelector("#psicologoAtual");
const anterior = document.querySelector("#psicologoAnterior");
const proximo = document.querySelector("#psicologoProximo");

function atualizar(){

let ant = indice - 1;
let prox = indice + 1;

if(ant < 0) ant = psicologos.length - 1;
if(prox >= psicologos.length) prox = 0;

mostrar(atual, psicologos[indice]);
mostrar(anterior, psicologos[ant]);
mostrar(proximo, psicologos[prox]);

}

function mostrar(elemento, dados){

const foto = elemento.querySelector(".foto");
const descricao = elemento.querySelector(".descricao");

foto.style.backgroundImage = `url(${dados.foto})`;
foto.style.backgroundSize = "cover";
foto.style.backgroundPosition = "center";

descricao.textContent = dados.descricao;

}

document.getElementById("proximo").onclick = function(){

indice++;

if(indice >= psicologos.length){
indice = 0;
}

atualizar();

}

document.getElementById("anterior").onclick = function(){

indice--;

if(indice < 0){
indice = psicologos.length - 1;
}

atualizar();

}

atualizar();