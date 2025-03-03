
"use strict";

/* ------------------------------------------------------------------------- */
/*                                                                CONSTANTES */
/* ------------------------------------------------------------------------- */

//Verifica se o login foi realizado
const USUARIO = JSON.parse(localStorage.getItem('loginFeito')) || false;

//Se não, é reeencaminhado para a pagina para fazer login
if (!USUARIO) {
  window.location.href = "login.html"
}

//Verifica se o jogo foi inicializado uma vez
if (localStorage.getItem("jogoInicializado") === null) {
  localStorage.setItem("jogoInicializado", null)
}

/*Numero de jogadores por omissão*/
const NUMERO_JOGADORES_OMISSAO = 1;

/*Nome do jogador 1 por omissão*/ 
const NOME_JOGADOR1_OMISSAO = USUARIO.nome;

/*Nome do jogador 2 por omissão*/ 
const NOME_JOGADOR2_OMISSAO = null;

/*Nome do jogador 3 por omissão*/ 
const NOME_JOGADOR3_OMISSAO = null;

/*Nome do jogador 4 por omissão*/ 
const NOME_JOGADOR4_OMISSAO = null;

/*Tamanho do tabuleiro por omissão*/
const TAMANHO_TABULEIRO_OMISSAO = "5x4";

/*Estilo do tabuleiro e cartas por omissão*/
const ESTILO_TABULEIRO_OMISSAO = "animais";

/*Modo Contrarelogio por omissão*/
const MODO_CONTRARELOGIO_OMISSAO = false;

/*Dificuldade Modo Contrarelogio por omissão*/
const DIFICULDADE_CONTRARELOGIO_OMISSAO = "facil";

/*Modo Trio por omissão*/
const MODO_TRIO_OMISSAO = false;

/*ID do botão de Logout*/
const LOGOUT = "logout";

/*Audio de click no menu de Definições*/
const audioFeedback = new Audio("./media/feedbacksound.mp3");

/*Audio de virar a carta do modo contrarelogio*/
const audioFlip = new Audio("./media/flip.mp3");

/* ------------------------------------------------------------------------- */

/*ID da imagem da vista previa*/
const VISTA_PREVIA = "imagemVistaPrevia";

/* ------------------------------------------------------------------------- */

/*ID do botão de Iniciar o jogo*/
const BOTAO_INICIAR = "botaoIniciar";

/*ID do botão de ativar o modo contrarelogio*/
const BOTAO_CONTRARELOGIO = "botaoContrarelogio";

/*ID do botão de ativar o modo trio*/
const BOTAO_TRIO = "botaoTrio";

/* ------------------------------------------------------------------------- */
/*                                                         VARIÁVEIS GLOBAIS */
/* ------------------------------------------------------------------------- */

//Objeto onde é especificado as definições do jogo, 
//o objeto que vai ser guardado no local storage
//para mudar o aspeto geral do jogo.
let configuracao = {

  numeroJogadores: NUMERO_JOGADORES_OMISSAO,

  nomeJogador1: NOME_JOGADOR1_OMISSAO,

  nomeJogador2: NOME_JOGADOR2_OMISSAO,

  nomeJogador3: NOME_JOGADOR3_OMISSAO,

  nomeJogador4: NOME_JOGADOR4_OMISSAO,

  estiloTabuleiro: ESTILO_TABULEIRO_OMISSAO,

  tamanhoTabuleiro: TAMANHO_TABULEIRO_OMISSAO,

  modoContrarelogio: MODO_CONTRARELOGIO_OMISSAO,

  dificuldadeContrarelogio: DIFICULDADE_CONTRARELOGIO_OMISSAO,

  modoTrio: MODO_TRIO_OMISSAO
};

/* ------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------- */
/*                                                INICIALIZAÇÃO DA APLICAÇÃO */
/* ------------------------------------------------------------------------- */

// A função principal() é automaticamente invocada quando o documento HTML
// tiver sido completamente carregado pelo browser, incluindo o ficheiro CSS.
window.addEventListener("load", principal);

/* ------------------------------------------------------------------------- */

/**
 * Primeira função a ser executada após o browser completar o carregamento
 * de toda a informação presente no documento HTML.
 */

function principal() {

  // Mostra a configuração por omissão do jogo.
  mostraConfiguracaoJogo();

  // Associa comportamento a elementos na página HTML.
  defineEventListenersParaElementosHTML();

}

//Função que mostra a imagem da vista previa por omissão e o nome do usuario que fez login na lista de jogadores
function mostraConfiguracaoJogo() {
  //Mostra uma imagem diferente dependendo tamanho e estilo do tabuleiro 
  document.getElementById(VISTA_PREVIA).src = "media/previa" + configuracao.tamanhoTabuleiro + configuracao.estiloTabuleiro + ".png";

  //Mostra o nome do usuario que fez login na lista de jogadores
  document.getElementById("jogador1").innerHTML = USUARIO.nome;
}

//Função que define os eventos e as interações com os elementosHTML.
function defineEventListenersParaElementosHTML() {
  //Mostra uma vista previa nova se é mudado o estilo do tabuleiro
  document.querySelector("#estiloTabuleiro").addEventListener("change", mostraTabuleiro);

  //Mostra uma vista previa nova se é mudado o tamanho do tabuleiro
  document.querySelector("#tamanhoTabuleiro").addEventListener("change", mostraTabuleiro);

   //Permite fazer logout se fazemos click no botão con o logo de logout 
  document.getElementById(LOGOUT).addEventListener("click", fazerLogout);

  // Definimos uma contante com o formulario de adicionar jogadores para simplificar o acesso aos elementos do formulário.
  const formularioAdicionar = document.forms.adicionarForm;

  //É adicionado ou não um jogador a lista dos jogadores quando submetes o formulario
  formularioAdicionar.addEventListener("submit", adicionarJogador);

  //Inicia o jogo quando fazes click no botão COMEÇAR
  document.getElementById(BOTAO_INICIAR).addEventListener("click", iniciarJogo);

  //Ativa o Modo Contrarelogio quando fazes click no botão Contrarelogio, e permite escolher a dificuldade.
  document.getElementById(BOTAO_CONTRARELOGIO).addEventListener("click", ativarModoContrarelogio);

  //Ativa o Modo Trio quando fazes click no botão Trio
  document.getElementById(BOTAO_TRIO).addEventListener("click", ativarModoTrio);
}

/* ------------------------------------------------------------------------- */
/*                                                                   FUNÇÕES */
/* ------------------------------------------------------------------------- */

//Função que mostra a vista previa
function mostraTabuleiro() {

  //muda o valor da chave estiloTebuleiro do objeto configuração
  configuracao.estiloTabuleiro = document.querySelector("#estiloTabuleiro").value;

  //muda o valor da chave tamanhoTebuleiro do objeto configuração
  configuracao.tamanhoTabuleiro = document.querySelector("#tamanhoTabuleiro").value;

  //ativa o som do click
  audioFeedback.cloneNode().play();

  //Chama a função mostraConfiguracaoJogo() para mostrar as mudanças realizadas
  mostraConfiguracaoJogo();
}

//Função utilizada para fazer logout
function fazerLogout() {

  //elimina o "loginFeito" do localStorage para não deixar entrar no jogo sem ter feito login outra vez
  localStorage.removeItem("loginFeito");

  //Reecaminha para a pagina principal
  window.location.href = "index.html";
}

//Função que começa o jogo
function iniciarJogo() {
  //Guarda a configuração no local storage para mudar as definições do jogo
  localStorage.setItem("configuracaoJogo", JSON.stringify(configuracao));

  //Reencaminha para a pagina do jogo
  window.location.href = "jogo.html"
}

//Função que adiciona um jogador a lista de jogadores que vão participar no jogo
function adicionarJogador(event) {
  //preventDefault para evitar que a pagina seja carregada de novo
  event.preventDefault();

  //Definimos as constantes que são submetidas no formulário
  const formularioAdicionar = document.forms.adicionarForm;
  const emailAdicionar = formularioAdicionar.elements.mail.value;
  const palavraAdicionar = formularioAdicionar.elements.palavraPasse.value;

  //Definimos uma contante com uma lista de todos os usuarios registados
  const Registados = JSON.parse(localStorage.getItem('registados')) || [];

  //Verificamos se o usuario e email submetidos pelo formulario encontra-se na lista de registados
  const usuarioValido = Registados.find(user => user.email === emailAdicionar && user.palavra === palavraAdicionar);

  //Se não aparece, aparece esta alerta e sai da função
  if (!usuarioValido) {
    return alert("Usuario e/ou Palavra Passe incorretos.");
  }

  //Se o usuario já foi adicionado ao jogo, aparece esta alerta e sai da função
  if (usuarioValido.nome == configuracao.nomeJogador1 || usuarioValido.nome == configuracao.nomeJogador2 || usuarioValido.nome == configuracao.nomeJogador3 || usuarioValido.nome == configuracao.nomeJogador4) {
    return alert("Usuario já adicionado.");
  }

  //Se sim, adiciona ao jogador numa slot livre dependendo da quantidade de jogadores que já estão na lista de jogadores que vão a participar
  if (configuracao.numeroJogadores == 1) {
    //Escreve o nome do novo jogador
    document.getElementById("jogador2").innerHTML = usuarioValido.nome;

    //muda o valor da chave nomeJogador2 do objeto configuração
    configuracao.nomeJogador2 = usuarioValido.nome;

    //Aumenta em um o numero de jogadores no objeto configuração
    configuracao.numeroJogadores++;

    //ativa o som do click
    audioFeedback.cloneNode().play()

    //E faz exatamente o mesmo para o resto dos casos
  }else if (configuracao.numeroJogadores == 2) {
    document.getElementById("jogador3").innerHTML = usuarioValido.nome;
    configuracao.nomeJogador3 = usuarioValido.nome;
    configuracao.numeroJogadores++;
    audioFeedback.cloneNode().play()
  }else if (configuracao.numeroJogadores == 3) {
    document.getElementById("jogador4").innerHTML = usuarioValido.nome;
    configuracao.nomeJogador4 = usuarioValido.nome;
    configuracao.numeroJogadores++;
    audioFeedback.cloneNode().play()
    //Se o numero de jogadores é quatro não deixará adicionar mais jogadores
  } else if(configuracao.numeroJogadores == 4){
    alert("Foi atingido o maximo de jogadores possíveis")
  }
}

//Função que ativa ou desativa o modo Contrarelogio
function ativarModoContrarelogio() {
  //Se esta desativado entra no primeiro if
  if (configuracao.modoContrarelogio == false) {

    //Quando é feito um click no botão contrarelogio é adicionado a classe animacao, com isto a carta é virada
    document.getElementById(BOTAO_CONTRARELOGIO).classList.add("animacao");

    //muda o valor da chave modoContrarelogio do objeto configuração
    configuracao.modoContrarelogio = true;

    //ativa o som do flip
    audioFlip.cloneNode().play()

    //Se esta ativado entra no else if
  } else if(configuracao.modoContrarelogio == true){

    //Definimos uma variavel onde guardamos a dificuldade antes de muda-la
    let dificuldadeAntiga = configuracao.dificuldadeContrarelogio;

    //Chamamos a função mudarDificuldade para mudar o valor da chave dificuldadeContrarelogio do objeto configuração
    mudarDificuldade()

    //Se fazemos click dois veces na mesma dificuldade a carta é virada e o modo contrarelogio é desativado
    if (dificuldadeAntiga == configuracao.dificuldadeContrarelogio) {

      //ativa o som do flip
      audioFlip.cloneNode().play()

      //É virada novamente para o outro lado
      document.getElementById(BOTAO_CONTRARELOGIO).classList.remove("animacao");

      //muda o valor da chave modoContrarelogio do objeto configuração
      configuracao.modoContrarelogio = false;
    }
  }
}

//Função que muda a dificuldade do modo contrarelogio
function mudarDificuldade() {

  //Definimos uma variavel com a classe dificuldade
  var dificuldades = document.getElementsByName("dificuldade");

  //Fazemos um ciclo em todas as opções com a classe dificuldade para ver qual de elas foi marcada
  for (var i = 0, length = dificuldades.length; i < length; i++) {
    if (dificuldades[i].checked) {

      //muda o valor da chave dificuldadeContrarelogio do objeto configuração
      configuracao.dificuldadeContrarelogio = dificuldades[i].value;
      break;
    } 
  }
}

//Função que ativa o Modo Trio
function ativarModoTrio() {

  //ativa o som do click
  audioFeedback.cloneNode().play()

  //Se o modo trio está desativado
  if (configuracao.modoTrio == false) {

    //Aparece uma imagem no botão do modo trio
    document.getElementById("modoTrioAtivado").style.display = "block";

    //Removemos as opções 5x4 e ITW dos tamanhos porque não são multiplos de 3
    document.getElementById("5x4").remove()
    document.getElementById("ITW").remove()

    //muda o valor da chave modoTrio do objeto configuração
    configuracao.modoTrio = true;

    //Se o tamanho do tabuleiro é diferente a 5x6 ou 6x6 o valor por omissão pasa a ser 5x6
    if (configuracao.tamanhoTabuleiro != "5x6" && configuracao.tamanhoTabuleiro != "6x6") {
      configuracao.tamanhoTabuleiro = "5x6";
    }
    //Se o modo Trio está ativado
  } else if(configuracao.modoTrio == true){

    //Desparece a imagem do botão do modo trio
    document.getElementById("modoTrioAtivado").style.display = "none";

    //Definimos uma variavel com o tamanho do tabuleiro
    var selecao = document.getElementById("tamanhoTabuleiro");

    //Definimos duas variaveis para criar outra vez as opções 5x4 e ITW
    var opcao1 = document.createElement("option");
    var opcao2 = document.createElement("option");
    opcao1.text = "5x4";
    opcao1.value = "5x4";
    opcao1.id = "5x4";
    opcao1.selected = "selected";
    opcao2.text = "ITW";
    opcao2.value = "ITW";
    opcao2.id = "ITW";

    //Adicionamos o 5x4 e o ITW a lista de seleção
    selecao.add(opcao1, 0);
    selecao.add(opcao2);

    //muda o valor da chave modoTrio do objeto configuração
    configuracao.modoTrio = false;

    //E o valor por omissão volta a ser 5x4
    configuracao.tamanhoTabuleiro = "5x4"
  }

    //Finalmente, mostramos a vista previa segundo as alterações feitas nesta função 
    document.getElementById(VISTA_PREVIA).src = "media/previa" + configuracao.tamanhoTabuleiro + configuracao.estiloTabuleiro + ".png";

}



