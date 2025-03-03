
"use strict";

/* ------------------------------------------------------------------------- */
/*                                                            OBJETO RANKING */
/* ------------------------------------------------------------------------- */

//Só é definido a primeira vez que entramos no jogo para evitar que seja apagado o ranking
if (localStorage.getItem("jogoInicializado") === null) {
    const ranking = {
    
        ranking5x4: [],

        ranking5x6: [],

        ranking6x6: [],

        rankingITW: [],
    
        rankingTrio5x6: [],
    
        rankingTrio6x6: []
    
    };
    
    //Guardamos o objeto no localStorage
    localStorage.setItem("listaRankings", JSON.stringify(ranking))
  }

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

    //Funçao que cria estatisticas 
    criarEstatisticas();
  
    //Parte do codigo que só é lido quando estamos no site das estatisticas
    if(document.title == "Statistics | Memory Game"){
        
        //Verifica se o login foi realizado
        const USUARIO = JSON.parse(localStorage.getItem('loginFeito')) || false;

        //Se não, é reeencaminhado para a pagina para fazer login
        if (!USUARIO) {
            window.location.href = "login.html"
        }
    
        //Funçao para mostrar as Estatisticas e os Rankings na pagina de Estatisticas 
        mostrarEstatisticasRankings();

        //Permite fazer logout se fazemos click no botão con o logo de logout 
        document.getElementById("logout").addEventListener("click", fazerLogout);
    }
  }

/* ------------------------------------------------------------------------- */
/*                                                                   FUNÇÕES */
/* ------------------------------------------------------------------------- */

//Função que cria a lista de objetos que tem as estatisticas para cada conta, 
//só funciona no caso de haver uma nova conta que não tenha estatisticas criadas. 
function criarEstatisticas() {
    //Definimos uma constante que é a lista de usuarios com estatisticas já criadas
    const estatisticas = JSON.parse(localStorage.getItem('listaEstatisticas')) || [];

    //Definimos uma constante com os usuarios registados
    const usuariosRegistados = JSON.parse(localStorage.getItem('registados')) || [];

    //Definimos uma variavel para verificar se os usuarios já têm ou não estatisticas
    let procuraEstatistica;
    for (let i = 0; i < usuariosRegistados.length; i++) {
        procuraEstatistica = estatisticas.find(user => user.nome === usuariosRegistados[i].nome);
        //Se não tem estatistica é adicionado um objeto novo com as estatistics do usuario novo
        if (!procuraEstatistica) {
            estatisticas.push({nome: usuariosRegistados[i].nome, estatisticasIndividuaisGerais: [0,0], estatisticasIndividuaisGeraisAnimais: [0,0], estatisticasIndividuaisGeraisNatal: [0,0], estatisticasIndividuaisGeraisAzulejos: [0,0], estatisticasMultijogadorGerais:[0,0], estatisticasMultijogadorGeraisAnimais: [0,0], estatisticasMultijogadorGeraisNatal: [0,0], estatisticasMultijogadorGeraisAzulejos: [0,0]});
        }    
    }

    //Guradamos no localStorage a lista de estatisticas, se não houver 
    //usuario novo, a lista ficará exatamente igual
    localStorage.setItem("listaEstatisticas", JSON.stringify(estatisticas))
}

//Função que mostra as Estatisticas Individuais e Multijogador. Gerais e divididas por estilo de tabuleiro e cartas.
//Também mostra os rankings divididos por tamanho de tabuleiro. 
function mostrarEstatisticasRankings() {
    
    //Definimos uma constante que é o usuario que fez o log in
    const usuarioLogin = JSON.parse(localStorage.getItem('loginFeito')) || false;

    //Definimos uma constante que é o nome do usuario que fez o log in
    const usuarioNome = usuarioLogin.nome

    //Definimos uma constante que é a lista de estatisticas do jogo
    const estatisticasJogo = JSON.parse(localStorage.getItem('listaEstatisticas')) || false;

    //Definimos uma variavel que são as estatisticas do usuario que fez o log in
    var usuarioEstatisticas = estatisticasJogo.find(usuario => usuario.nome == usuarioNome);

    //Mostramos na pagina as estatisticas gerais e as divididas por estilos
    document.getElementById("jogosEstatisticasIndividuaisGerais").innerHTML = usuarioEstatisticas.estatisticasIndividuaisGerais[0];
    document.getElementById("tempoEstatisticasIndividuaisGerais").innerHTML = usuarioEstatisticas.estatisticasIndividuaisGerais[1]+" segs";
    document.getElementById("jogosEstatisticasIndividuaisAnimais").innerHTML = usuarioEstatisticas.estatisticasIndividuaisGeraisAnimais[0];
    document.getElementById("tempoEstatisticasIndividuaisAnimais").innerHTML = usuarioEstatisticas.estatisticasIndividuaisGeraisAnimais[1]+" segs";
    document.getElementById("jogosEstatisticasIndividuaisNatal").innerHTML = usuarioEstatisticas.estatisticasIndividuaisGeraisNatal[0];
    document.getElementById("tempoEstatisticasIndividuaisNatal").innerHTML = usuarioEstatisticas.estatisticasIndividuaisGeraisNatal[1]+" segs";
    document.getElementById("jogosEstatisticasIndividuaisAzulejos").innerHTML = usuarioEstatisticas.estatisticasIndividuaisGeraisAzulejos[0];
    document.getElementById("tempoEstatisticasIndividuaisAzulejos").innerHTML = usuarioEstatisticas.estatisticasIndividuaisGeraisAzulejos[1]+" segs";
    //Mostramos na pagina as estatisticas multijogador gerais e as divididas por estilos. Os tempos medios estão arredondados a duas casas decimais.
    document.getElementById("pontosEstatisticasMultijogadorGerais").innerHTML = usuarioEstatisticas.estatisticasMultijogadorGerais[0];
    document.getElementById("tempoEstatisticasMultijogadorGerais").innerHTML = Math.round((usuarioEstatisticas.estatisticasMultijogadorGerais[1] + Number.EPSILON) * 100) / 100+" segs";
    document.getElementById("pontosEstatisticasMultijogadorAnimais").innerHTML = usuarioEstatisticas.estatisticasMultijogadorGeraisAnimais[0];
    document.getElementById("tempoEstatisticasMultijogadorAnimais").innerHTML = Math.round((usuarioEstatisticas.estatisticasMultijogadorGeraisAnimais[1] + Number.EPSILON) * 100) / 100+" segs";
    document.getElementById("pontosEstatisticasMultijogadorNatal").innerHTML = usuarioEstatisticas.estatisticasMultijogadorGeraisNatal[0];
    document.getElementById("tempoEstatisticasMultijogadorNatal").innerHTML = Math.round((usuarioEstatisticas.estatisticasMultijogadorGeraisNatal[1] + Number.EPSILON) * 100) / 100+" segs";
    document.getElementById("pontosEstatisticasMultijogadorAzulejos").innerHTML = usuarioEstatisticas.estatisticasMultijogadorGeraisAzulejos[0];
    document.getElementById("tempoEstatisticasMultijogadorAzulejos").innerHTML = Math.round((usuarioEstatisticas.estatisticasMultijogadorGeraisAzulejos[1] + Number.EPSILON) * 100) / 100+" segs";

    //Definimos uma constante que é a lista de rankings do jogo
    const rankingJogo = JSON.parse(localStorage.getItem('listaRankings')) || false;

    //Definimos uma constante que é a lista de tamanhos de tabuleiro possiveis. O modo trio também porque tem um ranking separado do resto.
    const listaTamanhos = ["5x4","5x6","6x6","ITW","5x6Trio","6x6Trio"];

    //Mostramos com dois ciclos os rankings em cada tamanho diferente
    for (const i of listaTamanhos) {
        for (let j = 1; j <= 10; j++) {
            if (i == "5x4") {
                if (rankingJogo.ranking5x4[j-1] != undefined) {
                    document.getElementById("Ranking"+j+"Nome"+i).innerHTML = rankingJogo.ranking5x4[j-1][0];
                    document.getElementById("Ranking"+j+"Tempo"+i).innerHTML = rankingJogo.ranking5x4[j-1][1]+" segs";
                } 
            }else if (i == "5x6") {
                if (rankingJogo.ranking5x6[j-1] != undefined) {
                    document.getElementById("Ranking"+j+"Nome"+i).innerHTML = rankingJogo.ranking5x6[j-1][0];
                    document.getElementById("Ranking"+j+"Tempo"+i).innerHTML = rankingJogo.ranking5x6[j-1][1]+" segs";
                }
            }else if (i == "6x6") {
                if (rankingJogo.ranking6x6[j-1] != undefined) {
                    document.getElementById("Ranking"+j+"Nome"+i).innerHTML = rankingJogo.ranking6x6[j-1][0];
                    document.getElementById("Ranking"+j+"Tempo"+i).innerHTML = rankingJogo.ranking6x6[j-1][1]+" segs";
                }
            }else if (i == "ITW") {
                if (rankingJogo.rankingITW[j-1] != undefined) {
                    document.getElementById("Ranking"+j+"Nome"+i).innerHTML = rankingJogo.rankingITW[j-1][0];
                    document.getElementById("Ranking"+j+"Tempo"+i).innerHTML = rankingJogo.rankingITW[j-1][1]+" segs";
                }
            }else if (i == "5x6Trio") {
                if (rankingJogo.rankingTrio5x6[j-1] != undefined) {
                    document.getElementById("Ranking"+j+"Nome"+i).innerHTML = rankingJogo.rankingTrio5x6[j-1][0];
                    document.getElementById("Ranking"+j+"Tempo"+i).innerHTML = rankingJogo.rankingTrio5x6[j-1][1]+" segs";
                }
            }else if (i == "6x6Trio") {
                if (rankingJogo.rankingTrio6x6[j-1] != undefined) {
                    document.getElementById("Ranking"+j+"Nome"+i).innerHTML = rankingJogo.rankingTrio6x6[j-1][0];
                    document.getElementById("Ranking"+j+"Tempo"+i).innerHTML = rankingJogo.rankingTrio6x6[j-1][1]+" segs";
                }
            }
        }
    }
}


//Função utilizada para fazer logout
function fazerLogout() {

    //elimina o "loginFeito" do localStorage para não deixar entrar no jogo sem ter feito login outra vez
    localStorage.removeItem("loginFeito");

    //Reecaminha para a pagina principal
    window.location.href = "index.html";
  }

  