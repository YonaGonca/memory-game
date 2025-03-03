
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

//Definimos uma constante com uma lista das configurações do jogo
const configuracaoJogo = JSON.parse(localStorage.getItem('configuracaoJogo')) || false;

//Definimos uma constante com uma lista das cestatisticas do jogo
const estatisticasJogo = JSON.parse(localStorage.getItem('listaEstatisticas')) || false;

//Definimos uma constante com uma lista dos rankings do jogo
const rankingJogo = JSON.parse(localStorage.getItem('listaRankings')) || false;


/* ------------------------------------------------------------------------- */
/*                                                         VARIÁVEIS GLOBAIS */
/* ------------------------------------------------------------------------- */

//Definir a largura e altura do tabuleiro para ter as dimensões e a quantidade de cartas
let larguraTabuleiro = configuracaoJogo.tamanhoTabuleiro[0];
let alturaTabuleiro = configuracaoJogo.tamanhoTabuleiro[2];
//Quando o tamanho é ITW são 40 cartas e o tabuleiro não é quadrado
if (configuracaoJogo.tamanhoTabuleiro == "ITW") {
    larguraTabuleiro = 5;
    alturaTabuleiro = 8;
}

//Definimos um lista de numeros os quais vão a representar as posições das cartas
let numeros = [];
//Quando o modo trio está desativado é uma lista de pares até o numero de cartas dividido por 2. 
//Exemplo: 5x4 => 20 cartas => [1,1,2,2,3,3,...,8,8,9,9,10,10]
if (configuracaoJogo.modoTrio == false) {
    for (let i = 1; i <= (larguraTabuleiro * alturaTabuleiro) / 2; i++) {
        numeros.push(i, i);
    }
//Quando o modo trio está ativado é uma lista de trios até o numero de cartas dividido por 3. 
//Exemplo: 5x6 => 30 cartas => [1,1,1,2,2,2,3,3,3,...,8,8,8,9,9,9,10,10,10]
} else if (configuracaoJogo.modoTrio == true) {
    for (let i = 1; i <= (larguraTabuleiro * alturaTabuleiro) / 3; i++) {
        numeros.push(i, i, i);
    }
}
//Logo da lista ser criada é disposta aleatoriamentes com a função Math.random()
numeros = numeros.sort(() => { return Math.random() - 0.5 })

//Definimos uma variavel que representa o tempo maximo do modo contrarelogio
//Esta variavel ficara vazia se o modo contrarelogio está desativado
let tempoMaximo;

//A variavel tempoMaximo vai ter um valor ou outro dependendo de varios fatores:
//Tamanho do tabuleiro, dificuldade selecionada, quantidade de jogadores e se está ativado o modo trio
//Tamanho do tabuleiro: Maior quantidade de cartas = Maior quantidade de tempo
//Maior dificuldade = Menor quantidade de tempo
//Quantidade de jogadores: Individual => Tempo maximo é o tempo total do jogo / Multijogador = > Tempo maximo é tempo maximo por jogada
//Modo Trio: Modo trio = Maior quantidade de tempo / Isto é porque o Modo Trio é sustancialmente mais complicado  
if (configuracaoJogo.modoContrarelogio == true && configuracaoJogo.numeroJogadores == 1) {
    if (configuracaoJogo.tamanhoTabuleiro == "5x4") {
        if (configuracaoJogo.dificuldadeContrarelogio == "facil") {
            tempoMaximo = 60;
        } else if (configuracaoJogo.dificuldadeContrarelogio == "intermedio") {
            tempoMaximo = 45;
        } else if (configuracaoJogo.dificuldadeContrarelogio == "dificil") {
            tempoMaximo = 30;
        }
    } else if (configuracaoJogo.tamanhoTabuleiro == "5x6") {
        if (configuracaoJogo.modoTrio == false) {
            if (configuracaoJogo.dificuldadeContrarelogio == "facil") {
                tempoMaximo = 100;
            } else if (configuracaoJogo.dificuldadeContrarelogio == "intermedio") {
                tempoMaximo = 80;
            } else if (configuracaoJogo.dificuldadeContrarelogio == "dificil") {
                tempoMaximo = 65;
            }
        } else if (configuracaoJogo.modoTrio == true) {
            if (configuracaoJogo.dificuldadeContrarelogio == "facil") {
                tempoMaximo = 110;
            } else if (configuracaoJogo.dificuldadeContrarelogio == "intermedio") {
                tempoMaximo = 90;
            } else if (configuracaoJogo.dificuldadeContrarelogio == "dificil") {
                tempoMaximo = 80;
            }
        }

    } else if (configuracaoJogo.tamanhoTabuleiro == "6x6") {
        if (configuracaoJogo.modoTrio == false) {
            if (configuracaoJogo.dificuldadeContrarelogio == "facil") {
                tempoMaximo = 110;
            } else if (configuracaoJogo.dificuldadeContrarelogio == "intermedio") {
                tempoMaximo = 90;
            } else if (configuracaoJogo.dificuldadeContrarelogio == "dificil") {
                tempoMaximo = 75;
            }
        } else if (configuracaoJogo.modoTrio == true) {
            if (configuracaoJogo.dificuldadeContrarelogio == "facil") {
                tempoMaximo = 145;
            } else if (configuracaoJogo.dificuldadeContrarelogio == "intermedio") {
                tempoMaximo = 125;
            } else if (configuracaoJogo.dificuldadeContrarelogio == "dificil") {
                tempoMaximo = 100;
            }
        }
    } else if (configuracaoJogo.tamanhoTabuleiro == "ITW") {
        if (configuracaoJogo.dificuldadeContrarelogio == "facil") {
            tempoMaximo = 130;
        } else if (configuracaoJogo.dificuldadeContrarelogio == "intermedio") {
            tempoMaximo = 110;
        } else if (configuracaoJogo.dificuldadeContrarelogio == "dificil") {
            tempoMaximo = 100;
        }
    }
} else if (configuracaoJogo.modoContrarelogio == true && configuracaoJogo.numeroJogadores > 1) {
    if (configuracaoJogo.dificuldadeContrarelogio == "facil") {
        tempoMaximo = 15;
    } else if (configuracaoJogo.dificuldadeContrarelogio == "intermedio") {
        tempoMaximo = 10;
    } else if (configuracaoJogo.dificuldadeContrarelogio == "dificil") {
        tempoMaximo = 5;
    }
}


//Contador que representa a quantidade de cartas que estão viradas no tabuleiro
let cartasViradas = 0;

//Posição da primeira carta virada
let carta1 = null;

//Posição da segunda carta virada
let carta2 = null;

//Posição da terceira carta virada - Só utilizada no Modo Trio
let carta3 = null;

//Valor da primeira carta virada
let primeiroResultado = null;

//Valor da segunda carta virada
let segundoResultado = null;

//Valor da terceira carta virada - Só utilizada no Modo Trio
let terceiroResultado = null;

//Pontos Obtidos pelo jogador 1
let pontosObtidos1 = 0;

//Pontos Obtidos pelo jogador 2
let pontosObtidos2 = 0;

//Pontos Obtidos pelo jogador 3
let pontosObtidos3 = 0;

//Pontos Obtidos pelo jogador 4
let pontosObtidos4 = 0;

//Pontos que faltam por obter - Valor variavel
let pontosRestantes = (larguraTabuleiro * alturaTabuleiro) / 2;
//Pontos que faltam por obter - Valor fixo
let pontosRestantesFixos = (larguraTabuleiro * alturaTabuleiro) / 2;
//Pontos que faltam obter quando o modoTrio está ativado
if (configuracaoJogo.modoTrio == true) {
    pontosRestantes = (larguraTabuleiro * alturaTabuleiro) / 3;
    pontosRestantesFixos = (larguraTabuleiro * alturaTabuleiro) / 3;
}

//Variavel utilizada para verificar se o temporizador está ativo ou não 
let temporizadorAtivo = false;

//Temporizador do jogo - Vai aumentando em um segundo a segundo
let temporizadorTempoJogo = 0;

//Identificador do Intervalo do temporizador
let identificadorIntervalo;

//Variaveis para guardar os numeros das cartas que foram viradas
let primeiroNumero;
let segundoNumero;
let terceiroNumero;

//Variaveis dos sons utilizados no jogo 
let audioPoint = new Audio("./media/correct.wav");
let audioFlip = new Audio("./media/flip.mp3");
let audioLose = new Audio("./media/lose.mp3");
let audioWin = new Audio("./media/win.mp3");

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

    //Mostra a Configuração inicial no documento HTML
    mostraConfiguracaoJogo();

    //Associa comportamento a elementos na página HTML.
    defineEventListenersParaElementosHTML();
  }

/* ------------------------------------------------------------------------- */
/*                                                INTERFACE COM O UTILIZADOR */
/* ------------------------------------------------------------------------- */

/**
 * Mostra a configuração do jogo no documento HTML, o nome 
 * do jogador que tem que jogar a quantidade de espaços para puntos
 * segundo o numero de jogadores que vão a jogar.
 */

function mostraConfiguracaoJogo() {
    
    //nome do jogador que tem que jogar
    document.getElementById("nomeJogadorTurno").innerHTML = configuracaoJogo.nomeJogador1;

    //Mostramos "0" se o modo contrarelogio esta desativado
    //Ou o tempo maximo se esta ativado
    if (configuracaoJogo.modoContrarelogio == false) {
        document.getElementById("tempoJogo").innerHTML = temporizadorTempoJogo;
    }else if (configuracaoJogo.modoContrarelogio == true) {
        document.getElementById("tempoJogo").innerHTML = tempoMaximo;
    }

    //Mostramos todos os pontos disponiveis
    document.getElementById("pontosRestantes").innerHTML = pontosRestantes + "/" + pontosRestantesFixos;

    mudarTamanhoTabuleiro();

    mudarEstiloTabuleiro();

    mudarPontosMultijogador();

    responsiveWebDesign();
  }

/* ------------------------------------------------------------------------- */

/**
 * Associa event listeners a elementos no documento HTML, em particular botões.
 * Com esta abordagem, evitam-se atributos onclick ou similares, e faz-se uma
 * melhor separação entre conteúdo, em HTML, e comportamento, em JavaScript.
 */
function defineEventListenersParaElementosHTML() {
    
    //Formulario utilizado para virar uma carta
    const formularioVirar = document.forms.virarForm;
    //Função que chama a função virarCarta() com o parametro sendo o numero submetido no formulario
    //A função é lida quando submetemos o formulário
    formularioVirar.addEventListener('submit', (funcaoVirarFormulario) => {
        //preventDefault para evitar que a pagina seja carregada de novo
        funcaoVirarFormulario.preventDefault();
        
        //indice da carta a virar
        const indexVirar = parseInt(formularioVirar.elements.numeroVirar.value);

        //Se o valor submetido cumpre está no intervalo permitido a carta é virada e o formulario é apagado
        if (indexVirar > 0 && indexVirar <= larguraTabuleiro*alturaTabuleiro && document.getElementById("card"+indexVirar).classList.contains("animacao") == false) {
            virarCarta(indexVirar)
            document.getElementById("virarForm").reset();
        }        
    })

    //Fazer Logout
    document.getElementById("logout").addEventListener("click", fazerLogout);

    //Manipular as cartas com o rato
    document.getElementById("card1Front").addEventListener("click", function (){virarCarta(1)})
    document.getElementById("card2Front").addEventListener("click", function (){virarCarta(2)})
    document.getElementById("card3Front").addEventListener("click", function (){virarCarta(3)})
    document.getElementById("card4Front").addEventListener("click", function (){virarCarta(4)})
    document.getElementById("card5Front").addEventListener("click", function (){virarCarta(5)})
    document.getElementById("card6Front").addEventListener("click", function (){virarCarta(6)})
    document.getElementById("card7Front").addEventListener("click", function (){virarCarta(7)})
    document.getElementById("card8Front").addEventListener("click", function (){virarCarta(8)})
    document.getElementById("card9Front").addEventListener("click", function (){virarCarta(9)})
    document.getElementById("card10Front").addEventListener("click", function (){virarCarta(10)})
    document.getElementById("card11Front").addEventListener("click", function (){virarCarta(11)})
    document.getElementById("card12Front").addEventListener("click", function (){virarCarta(12)})
    document.getElementById("card13Front").addEventListener("click", function (){virarCarta(13)})
    document.getElementById("card14Front").addEventListener("click", function (){virarCarta(14)})
    document.getElementById("card15Front").addEventListener("click", function (){virarCarta(15)})
    document.getElementById("card16Front").addEventListener("click", function (){virarCarta(16)})
    document.getElementById("card17Front").addEventListener("click", function (){virarCarta(17)})
    document.getElementById("card18Front").addEventListener("click", function (){virarCarta(18)})
    document.getElementById("card19Front").addEventListener("click", function (){virarCarta(19)})
    document.getElementById("card20Front").addEventListener("click", function (){virarCarta(20)})
    document.getElementById("card21Front").addEventListener("click", function (){virarCarta(21)})
    document.getElementById("card22Front").addEventListener("click", function (){virarCarta(22)})
    document.getElementById("card23Front").addEventListener("click", function (){virarCarta(23)})
    document.getElementById("card24Front").addEventListener("click", function (){virarCarta(24)})
    document.getElementById("card25Front").addEventListener("click", function (){virarCarta(25)})
    document.getElementById("card26Front").addEventListener("click", function (){virarCarta(26)})
    document.getElementById("card27Front").addEventListener("click", function (){virarCarta(27)})
    document.getElementById("card28Front").addEventListener("click", function (){virarCarta(28)})
    document.getElementById("card29Front").addEventListener("click", function (){virarCarta(29)})
    document.getElementById("card30Front").addEventListener("click", function (){virarCarta(30)})
    document.getElementById("card31Front").addEventListener("click", function (){virarCarta(31)})
    document.getElementById("card32Front").addEventListener("click", function (){virarCarta(32)})
    document.getElementById("card33Front").addEventListener("click", function (){virarCarta(33)})
    document.getElementById("card34Front").addEventListener("click", function (){virarCarta(34)})
    document.getElementById("card35Front").addEventListener("click", function (){virarCarta(35)})
    document.getElementById("card36Front").addEventListener("click", function (){virarCarta(36)})
    document.getElementById("card37Front").addEventListener("click", function (){virarCarta(37)})
    document.getElementById("card38Front").addEventListener("click", function (){virarCarta(38)})
    document.getElementById("card39Front").addEventListener("click", function (){virarCarta(39)})
    document.getElementById("card40Front").addEventListener("click", function (){virarCarta(40)})

  }

/* ------------------------------------------------------------------------- */

//Função que vai a alterar o temporizador segundo a segundo
//Também vai chamar as funções se o tempo chega a 0 no modo contrarelogio.
function contarTempoJogo() {
    //Definimos um setIterval para cada 1000ms => 1s
    //Isto é, todo o que esta escrito dentro do set interval, acontece cada segundo
    identificadorIntervalo = setInterval(() => {
        
        //temporizador aumenta em um
        temporizadorTempoJogo++;

        //Se o modo contrarelogio está desativado, é mostrado o temporizador
        if (configuracaoJogo.modoContrarelogio == false) {
            document.getElementById("tempoJogo").innerHTML = temporizadorTempoJogo;
        //Se o modo contrarelogio está ativado, é mostrado o tempoMaximo menos temporizador de maneira decrescente
        } else if (configuracaoJogo.modoContrarelogio == true) {
            document.getElementById("tempoJogo").innerHTML = tempoMaximo - temporizadorTempoJogo;
        }

        //Se o tempo chega a 0 no modo individual o jogo acaba
        if ((tempoMaximo - temporizadorTempoJogo) == 0 && configuracaoJogo.numeroJogadores == 1) {
            perdeJogo();
        //Se o tempo chega a 0 no modo multijogador o turno passa a outro jogador e as cartas que estavam viradas voltam a estar viradas para baixo
        } else if ((tempoMaximo - temporizadorTempoJogo) == 0 && configuracaoJogo.numeroJogadores > 1) {
            mudarTurnoJogador();
            cartasViradas = 0;
            
            if (carta1.classList.contains("animacao")) {
                audioFlip.play()
            }
            carta1.classList.remove("animacao");
            carta2.classList.remove("animacao");

        }
    }
        , 1000)
}

//Função que é chamada quando o jogo termina
function perdeJogo() {
    
    //desabilitar o botão de terminar jogo para não conseguir carrega-lo depois de o jogo ter acabado
    document.getElementById("botaoTerminarJogo").disabled = true;~

    //São adicionadas o tempo de jogo as estatisitcas
    adicionarEstatisticas();
    gravaEstatisticasRankings();

    //Paramos o temporizador
    clearInterval(identificadorIntervalo)

    //Ciclo que ao terminar o jogo vira e bloqueia todas as cartas uma a uma 
    let i = 1;
    let cartaBloqueada;
    const ciclo = setInterval(() => {
        if (i <= (larguraTabuleiro * alturaTabuleiro)) {
            cartaBloqueada = document.getElementById("card" + i)
            if (!cartaBloqueada.classList.contains("animacao")) {
                cartaBloqueada.classList.add("imagemCard" + numeros[i - 1]);
                cartaBloqueada.classList.add("animacao");
                audioFlip.cloneNode().play()
            }
            i++;
        }
        //Quando acabam as cartas
        if (i > (larguraTabuleiro * alturaTabuleiro)) {
            clearInterval(ciclo)

            //Som de perder
            audioLose.play();

            //É mostrado o Ranking depois de 0.1s
            setTimeout(() => { mostraRankingPopUp(); }, 100)
        }

        cartaBloqueada = document.getElementById(i)
    }, 100);


}


//Função principal que contem a logica do jogo
//É chamada cada vez que é feito um click numa carta ou é submetido o formulario
function virarCarta(numeroCarta) {

    //Começa o temporizador só depois de ter virado a primeria carta
    if (temporizadorAtivo == false) {
        temporizadorAtivo = true;
        contarTempoJogo();
    }
    
    //Aumenta o contador de cartas viradas +1
    cartasViradas++;

    //Quando é virada a primeira carta
    if (cartasViradas == 1) {
        carta1 = document.getElementById("card" + numeroCarta);

        //Adicionamos a classe imagemCard+(o numero da carta para assim mostrar a imagem da carta)
        carta1.classList.add("imagemCard" + numeros[numeroCarta - 1]);
        carta1.classList.add("animacao");

        //Guardamos a primeira carta virada
        primeiroResultado = numeros[numeroCarta - 1];
        primeiroNumero = numeroCarta;
        audioFlip.cloneNode().play()

    //Quando é virada a primeira carta
    } else if (cartasViradas == 2) {
        carta2 = document.getElementById("card" + numeroCarta);
        carta2.classList.add("imagemCard" + numeros[numeroCarta - 1]);
        carta2.classList.add("animacao");

        //Guardamos o segundo resultado
        segundoResultado = numeros[numeroCarta - 1];
        segundoNumero = numeroCarta;
        audioFlip.cloneNode().play()
        if (configuracaoJogo.modoTrio == false) {
            //Verificamos se os dois resultados são iguais
            if (primeiroResultado == segundoResultado) {
                //Se sim, verificamos a quantidade de jogadores
                if (configuracaoJogo.numeroJogadores == 1) {
                    //Se é individual somamos +1 aos pontos do jogador 1 e mostramos no HTML
                    pontosObtidos1++;
                    document.getElementsByClassName("selecionado")[0].innerHTML = pontosObtidos1;
                } else {
                    //Se é multijogador somamos +1 ao jogador correspondente e mostramos os pontos no HTML
                    if (document.getElementById("nomeJogadorTurno").innerHTML == configuracaoJogo.nomeJogador1) {
                        pontosObtidos1++;
                        document.getElementsByClassName("selecionado")[0].innerHTML = pontosObtidos1;
                    } else if (document.getElementById("nomeJogadorTurno").innerHTML == configuracaoJogo.nomeJogador2) {
                        pontosObtidos2++;
                        document.getElementsByClassName("selecionado")[0].innerHTML = pontosObtidos2;
                    } else if (document.getElementById("nomeJogadorTurno").innerHTML == configuracaoJogo.nomeJogador3) {
                        pontosObtidos3++;
                        document.getElementsByClassName("selecionado")[0].innerHTML = pontosObtidos3;
                    } else if (document.getElementById("nomeJogadorTurno").innerHTML == configuracaoJogo.nomeJogador4) {
                        pontosObtidos4++;
                        document.getElementsByClassName("selecionado")[0].innerHTML = pontosObtidos4;
                    }
                };
                //Subtraimos os pontos que faltam por obter
                pontosRestantes--;

                //Mostramos no HTML os pontos que faltam por obter
                document.getElementById("pontosRestantes").innerHTML = pontosRestantes + "/" + pontosRestantesFixos;

                //Se o jogo é multijogador, chamamos a função mudarTurnoJogador()
                if (configuracaoJogo.numeroJogadores > 1) {
                    mudarTurnoJogador()
                }
                //Se não é o ponto final, reproduz o som do ponto
                if (pontosRestantes != 0) {
                    audioPoint.cloneNode().play()
                }
                //0.3 segundos depois de acertar, as cartas são retiradas do tabuleiro
                setTimeout(() => {
                    document.getElementById("card" + primeiroNumero).style.opacity = 0;
                    document.getElementById("card" + segundoNumero).style.opacity = 0;
                    cartasViradas = 0;
                }, 300)

                //Se acabam as cartas
                if (pontosRestantes == 0) {
                    //Desabilitar todos os botões do jogo
                    document.getElementById("botaoTerminarJogo").disabled = true;
                    document.getElementById("virar").disabled = true;

                    //Se o modo é individual, são guardadas as estatisticas, é mostrado o Ranking e o tempo será detido
                    if (configuracaoJogo.numeroJogadores == 1) {
                        adicionarEstatisticas();
                        adicionarRankings();
                        gravaEstatisticasRankings();
                    }
                    setTimeout(() => {
                        audioWin.play();
                        mostraRankingPopUp();
                    }, 200)
                    clearInterval(identificadorIntervalo)
                }


            //No caso em que os resultados são diferentes as cartas são viradas para baixo
            } else {
                setTimeout(() => {
                    carta1.classList.remove("animacao");
                    carta1.classList.remove("imagemCard" + numeros[numeroCarta - 1]);
                    audioFlip.play()
                    carta2.classList.remove("animacao");
                    carta2.classList.remove("imagemCard" + numeros[numeroCarta - 1]);
                    cartasViradas = 0;
                }, 350)
                if (configuracaoJogo.numeroJogadores > 1) {
                    mudarTurnoJogador()
                }
            }


        }
    //Exatamente o mesmo funcionamento do == 2, mas para o modo Trio
    } else if (cartasViradas == 3 && configuracaoJogo.modoTrio == true) {
        carta3 = document.getElementById("card" + numeroCarta);
        carta3.classList.add("imagemCard" + numeros[numeroCarta - 1]);
        carta3.classList.add("animacao");
        terceiroResultado = numeros[numeroCarta - 1];
        terceiroNumero = numeroCarta;
        audioFlip.cloneNode().play();
        if (primeiroResultado == segundoResultado && segundoResultado == terceiroResultado) {
            if (configuracaoJogo.numeroJogadores == 1) {
                pontosObtidos1++;
                document.getElementsByClassName("selecionado")[0].innerHTML = pontosObtidos1;
            } else {
                if (document.getElementById("nomeJogadorTurno").innerHTML == configuracaoJogo.nomeJogador1) {
                    pontosObtidos1++;
                    document.getElementsByClassName("selecionado")[0].innerHTML = pontosObtidos1;
                } else if (document.getElementById("nomeJogadorTurno").innerHTML == configuracaoJogo.nomeJogador2) {
                    pontosObtidos2++;
                    document.getElementsByClassName("selecionado")[0].innerHTML = pontosObtidos2;
                } else if (document.getElementById("nomeJogadorTurno").innerHTML == configuracaoJogo.nomeJogador3) {
                    pontosObtidos3++;
                    document.getElementsByClassName("selecionado")[0].innerHTML = pontosObtidos3;
                } else if (document.getElementById("nomeJogadorTurno").innerHTML == configuracaoJogo.nomeJogador4) {
                    pontosObtidos4++;
                    document.getElementsByClassName("selecionado")[0].innerHTML = pontosObtidos4;
                }
            };
            pontosRestantes--;

            document.getElementById("pontosRestantes").innerHTML = pontosRestantes + "/" + pontosRestantesFixos;
            if (configuracaoJogo.numeroJogadores > 1) {
                mudarTurnoJogador()
            }
            if (pontosRestantes != 0) {
                audioPoint.cloneNode().play()
                document.getElementById("botaoTerminarJogo").disabled = true;
                document.getElementById("virar").disabled = true;
            }
            setTimeout(() => {
                document.getElementById("card" + primeiroNumero).style.opacity = 0;
                document.getElementById("card" + segundoNumero).style.opacity = 0;
                document.getElementById("card" + terceiroNumero).style.opacity = 0;
                cartasViradas = 0;
            }, 300)

            if (pontosRestantes == 0) {
                if (configuracaoJogo.numeroJogadores == 1) {
                    adicionarEstatisticas();
                    adicionarRankings();
                    gravaEstatisticasRankings();
                }
                setTimeout(() => {
                    audioWin.play();
                    mostraRankingPopUp();
                }, 200)
                clearInterval(identificadorIntervalo)
            }


        } else {
            setTimeout(() => {
                carta1.classList.remove("animacao");
                carta1.classList.remove("imagemCard" + numeros[numeroCarta - 1]);
                audioFlip.play()
                carta2.classList.remove("animacao");
                carta2.classList.remove("imagemCard" + numeros[numeroCarta - 1]);
                carta3.classList.remove("animacao");
                carta3.classList.remove("imagemCard" + numeros[numeroCarta - 1]);
                cartasViradas = 0;
            }, 350)
            if (configuracaoJogo.numeroJogadores > 1) {
                mudarTurnoJogador()
            }
        }
    }
}

//Função que altera o tamanho do tabuleiro
function mudarTamanhoTabuleiro() {
    let cartaSelecionada;
    if (configuracaoJogo.tamanhoTabuleiro == "5x6") {
        //Ciclo definido para adicionar mais cartas ao jogo
        for (let i = 21; i <= 30; i++) {
            cartaSelecionada = document.getElementById("card" + i)
            cartaSelecionada.style.display = "block ";
        }
        //Ciclo definido para mudar o tamanho de todas as cartas
        for (let i = 1; i <= 30; i++) {
            cartaSelecionada = document.getElementById("card" + i)
            cartaSelecionada.style.width = "90px";
            cartaSelecionada.style.height = "90px";
        }
    }

    //O mesmo funcionamento para o tamanho 6x6
    if (configuracaoJogo.tamanhoTabuleiro == "6x6") {
        document.getElementById("jogo").style.gridTemplateColumns = "auto auto auto auto auto auto";
        for (let i = 21; i <= 36; i++) {
            cartaSelecionada = document.getElementById("card" + i)
            cartaSelecionada.style.display = "block ";
        }
        for (let i = 1; i <= 36; i++) {
            cartaSelecionada = document.getElementById("card" + i)
            cartaSelecionada.style.width = "90px";
            cartaSelecionada.style.height = "90px";
        }
    }

    //Para o Tamanaho ITW criamos uma nova grelha de 17 colunas 
    if (configuracaoJogo.tamanhoTabuleiro == "ITW") {
        document.getElementById("jogo").style.gridTemplateColumns = "auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto";
        for (let i = 21; i <= 40; i++) {
            cartaSelecionada = document.getElementById("card" + i)
            cartaSelecionada.style.display = "block ";
        }
        for (let i = 1; i <= 40; i++) {
            cartaSelecionada = document.getElementById("card" + i)
            cartaSelecionada.style.width = "75px";
            cartaSelecionada.style.height = "75px";
        }
        //Depois mudamos o localização de cada carta uma a uma na grelha
        document.getElementById("card1").style.gridArea = "1 / 1 / 2 / 2";
        document.getElementById("card2").style.gridArea = "1 / 2 / 2 / 3";
        document.getElementById("card3").style.gridArea = "1 / 3 / 2 / 4";
        document.getElementById("card4").style.gridArea = "1 / 4 / 2 / 5";
        document.getElementById("card5").style.gridArea = "1 / 5 / 2 / 6";
        document.getElementById("card6").style.gridArea = "1 / 6 / 2 / 7";
        document.getElementById("card7").style.gridArea = "1 / 7 / 2 / 8";
        document.getElementById("card8").style.gridArea = "1 / 8 / 2 / 9";
        document.getElementById("card9").style.gridArea = "1 / 9 / 2 / 10";
        document.getElementById("card10").style.gridArea = "1 / 10 / 2 / 11";
        document.getElementById("card11").style.gridArea = "1 / 11 / 2 / 12";
        document.getElementById("card12").style.gridArea = "1 / 15 / 2 / 16";
        document.getElementById("card13").style.gridArea = "2 / 3 / 3 / 4";
        document.getElementById("card14").style.gridArea = "2 / 8 / 3 / 9";
        document.getElementById("card15").style.gridArea = "2 / 11 / 3 / 12";
        document.getElementById("card16").style.gridArea = "2 / 13 / 3 / 14";
        document.getElementById("card17").style.gridArea = "2 / 15 / 3 / 16";
        document.getElementById("card18").style.gridArea = "3 / 3 / 4 / 4";
        document.getElementById("card19").style.gridArea = "3 / 8 / 4 / 9";
        document.getElementById("card20").style.gridArea = "3 / 11 / 4 / 12";
        document.getElementById("card21").style.gridArea = "3 / 13 / 4 / 14";
        document.getElementById("card22").style.gridArea = "3 / 15 / 4 / 16";
        document.getElementById("card23").style.gridArea = "4 / 3 / 5 / 4";
        document.getElementById("card24").style.gridArea = "4 / 8 / 5 / 9";
        document.getElementById("card25").style.gridArea = "4 / 11 / 5 / 12";
        document.getElementById("card26").style.gridArea = "4 / 13 / 5 / 14";
        document.getElementById("card27").style.gridArea = "4 / 15 / 5 / 16";
        document.getElementById("card28").style.gridArea = "5 / 3 / 6 / 4";
        document.getElementById("card29").style.gridArea = "5 / 8 / 6 / 9";
        document.getElementById("card30").style.gridArea = "5 / 11 / 6 / 12";
        document.getElementById("card31").style.gridArea = "5 / 13 / 6 / 14";
        document.getElementById("card32").style.gridArea = "5 / 15 / 6 / 16";
        document.getElementById("card33").style.gridArea = "6 / 1 / 7 / 2";
        document.getElementById("card34").style.gridArea = "6 / 2 / 7 / 3";
        document.getElementById("card35").style.gridArea = "6 / 3 / 7 / 4";
        document.getElementById("card36").style.gridArea = "6 / 4 / 7 / 5";
        document.getElementById("card37").style.gridArea = "6 / 5 / 7 / 6";
        document.getElementById("card38").style.gridArea = "6 / 8 / 7 / 9";
        document.getElementById("card39").style.gridArea = "6 / 12 / 7 / 13";
        document.getElementById("card40").style.gridArea = "6 / 14 / 7 / 15";
    }
}

//Função que estilo do tabuleiro e das cartas
function mudarEstiloTabuleiro() {
    //Variavel criada para adicionar uma nova folha de estilos ao documento HTML
    var estilo = document.createElement('link');

    //Variaveis criadas para mudar os atributos src das imagens
    var imagemEstatisticas = document.getElementById("imagemEstatisticas");
    var imagemDefinicoes = document.getElementById("imagemDefinicoes");
    var imagemLogout = document.getElementById("imagemLogout");
    var imagemLogo = document.getElementById("logo")
    var imagemVitoria1 = document.getElementById("imagemVitoria1");
    var imagemVitoria2 = document.getElementById("imagemVitoria2");
    var imagemTituloIndividual1 = document.getElementById("imagemTituloIndividual1");
    var imagemTituloIndividual2 = document.getElementById("imagemTituloIndividual2");
    var imagemTituloMultijogador1 = document.getElementById("imagemTituloMultijogador1");
    var imagemTituloMultijogador2 = document.getElementById("imagemTituloMultijogador2");
    
    //Muda dependendendo do estilo selecionado
    if (configuracaoJogo.estiloTabuleiro == "natal") {
        //Alteração dos audios utilizados durante o jogo
        audioPoint = new Audio("./media/correct-natal.mp3");
        audioFlip = new Audio("./media/flip-natal.mp3");
        audioLose = new Audio("./media/lose-natal.wav");
        audioWin = new Audio("./media/win-natal.mp3");

        //Dando atributos ao <link> para a nova folha de estilos 
        estilo.rel = 'stylesheet';
        estilo.href = 'styles/jogoNatal.css';

        //Mudança de atributos src das imagens
        imagemEstatisticas.src = "./media/trophy-natal.png";
        imagemDefinicoes.src = "./media/seta-natal.png";
        imagemLogout.src = "./media/logout-natal.png";
        imagemLogo.src = "media/titulo-natal.png";
        imagemVitoria1.src = "media/trophyvictory-natal.png";
        imagemVitoria2.src = "media/trophyvictory-natal.png";
        imagemTituloIndividual1.src = "media/cardnatal-back.png";
        imagemTituloIndividual2.src = "media/cardnatal-back.png";
        imagemTituloMultijogador1.src = "media/cardnatal-back.png";
        imagemTituloMultijogador2.src = "media/cardnatal-back.png";

        //Funciona exatamente igual para o outro estilo
    } else if (configuracaoJogo.estiloTabuleiro == "azulejos") {
        audioPoint = new Audio("./media/correct-tiles.mp3");
        audioFlip = new Audio("./media/flip-tiles.mp3");
        audioLose = new Audio("./media/lose-tiles.mp3");
        audioWin = new Audio("./media/win-tiles.mp3");
        estilo.rel = 'stylesheet';
        estilo.href = 'styles/jogoAzulejos.css';
        imagemEstatisticas.src = "./media/trophy-azulejos.png";
        imagemDefinicoes.src = "./media/seta-azulejos.png";
        imagemLogout.src = "./media/logout-azulejos.png";
        imagemLogo.src = "media/titulo-azulejos.png";
        imagemVitoria1.src = "media/trophyvictory-azulejos.png";
        imagemVitoria2.src = "media/trophyvictory-azulejos.png";
        imagemTituloIndividual1.src = "media/cardtiles-back.png";
        imagemTituloIndividual2.src = "media/cardtiles-back.png";
        imagemTituloMultijogador1.src = "media/cardtiles-back.png";
        imagemTituloMultijogador2.src = "media/cardtiles-back.png";
    }
    //Adicionado a folha de estilos nova ao HTML
    document.getElementsByTagName('head')[0].appendChild(estilo);
}

//Função que muda o marcador onde são mostrados os pontos dos jogadores dependendo da quantidade de jogadores
function mudarPontosMultijogador() {
    //Cada jogador extra, adiciona uma caixa a uma grelha
    for (let i = 1; i < configuracaoJogo.numeroJogadores; i++) {
        document.getElementById("pontosObtidos" + (i + 1)).style.display = "block";
        document.getElementById("pontosObtidos" + (i + 1)).style.gridArea = "1 / " + (i + 1) + " / 2 / " + (i + 2);
        document.getElementById("pontosObtidos" + (i)).style.borderTopRightRadius = "0px";
        document.getElementById("pontosObtidos" + (i)).style.borderBottomRightRadius = "0px";
        document.getElementById("pontosObtidos" + (i + 1)).style.borderTopLeftRadius = "0px";
        document.getElementById("pontosObtidos" + (i + 1)).style.borderBottomLeftRadius = "0px";
        document.getElementById("pontos").style.width = "80%";
    }
}

//Variavel criada para mostrar os resultados do jogo multijogador ao final do jogo, uma lista de 2 ou mais jogadores
//dependendo da quantidade que estejam participando no jogo
let estatisticasMultijogador = [[configuracaoJogo.nomeJogador1,0,0],[configuracaoJogo.nomeJogador2,0,0]]
if (configuracaoJogo.numeroJogadores >= 3) {
    estatisticasMultijogador.push([configuracaoJogo.nomeJogador3,0,0]);
} 
if(configuracaoJogo.numeroJogadores == 4){
    estatisticasMultijogador.push([configuracaoJogo.nomeJogador4,0,0]);
}

//Função utilizada para mudar o turno do jogador no Modo Multijogador
function mudarTurnoJogador() {
    
    //Lista criada para simplificar o acesso aos nomes dos jogadores, o primeiro elemento 
    //é "repetir" para conseguir fazer um ciclo mais facilmente
    var jogadores = ["repetir", configuracaoJogo.nomeJogador1, configuracaoJogo.nomeJogador2, configuracaoJogo.nomeJogador3, configuracaoJogo.nomeJogador4];
    
    //Adicionamos e gravamos os tempos da jogado do turno anterio
    adicionarEstatisticas();
    gravaEstatisticasRankings();

    //Adicionamos tammbém o tempo à lista estatisticasMultijogador para no final do jogo mostrar o tempo medio
    estatisticasMultijogador[jogadores.indexOf(document.getElementById("nomeJogadorTurno").innerHTML) - 1].push(temporizadorTempoJogo);

    //Se não são iguais as cartas viradas e o modo trio esta desativado
    if (primeiroResultado != segundoResultado && configuracaoJogo.modoTrio == false) {
        
        //Eliminamos a classe selecionado ao jogador que jogou
        document.getElementById("pontosObtidos" + (jogadores.indexOf(document.getElementById("nomeJogadorTurno").innerHTML))).classList.remove("selecionado");
        
        //Para fazer o ciclo, se obtemos um nome que não está na lista de jogadores (undefined), pasa ao inicio da lista outra vez 
        if (!jogadores.includes(jogadores[jogadores.indexOf(document.getElementById("nomeJogadorTurno").innerHTML) + 1]) || jogadores[jogadores.indexOf(document.getElementById("nomeJogadorTurno").innerHTML) + 1] == null) {
            document.getElementById("nomeJogadorTurno").innerHTML = "repetir";
        }

        //Escrevemos o nome do jogador que tem que jogar no HTML
        document.getElementById("nomeJogadorTurno").innerHTML = jogadores[jogadores.indexOf(document.getElementById("nomeJogadorTurno").innerHTML) + 1];
        //E adicionamos a calsse selecionado ao proximo jogador que tem que jogar
        document.getElementById("pontosObtidos" + (jogadores.indexOf(document.getElementById("nomeJogadorTurno").innerHTML))).classList.add("selecionado");

    } else if (configuracaoJogo.modoTrio == true) {
        if (primeiroResultado != segundoResultado || segundoResultado != terceiroResultado || primeiroResultado != terceiroResultado) {
            //Eliminamos a classe selecionado ao jogador que jogou
            document.getElementById("pontosObtidos" + (jogadores.indexOf(document.getElementById("nomeJogadorTurno").innerHTML))).classList.remove("selecionado");
        
            //Para fazer o ciclo, se obtemos um nome que não está na lista de jogadores (undefined), pasa ao inicio da lista outra vez 
            if (!jogadores.includes(jogadores[jogadores.indexOf(document.getElementById("nomeJogadorTurno").innerHTML) + 1]) || jogadores[jogadores.indexOf(document.getElementById("nomeJogadorTurno").innerHTML) + 1] == null) {
            document.getElementById("nomeJogadorTurno").innerHTML = "repetir";
            }

            //Escrevemos o nome do jogador que tem que jogar no HTML
            document.getElementById("nomeJogadorTurno").innerHTML = jogadores[jogadores.indexOf(document.getElementById("nomeJogadorTurno").innerHTML) + 1];
            //E adicionamos a calsse selecionado ao proximo jogador que tem que jogar
            document.getElementById("pontosObtidos" + (jogadores.indexOf(document.getElementById("nomeJogadorTurno").innerHTML))).classList.add("selecionado");
        }
    }

    //Como o tempo é por turno, depois de cada jogada o temporizador começa de novo
    temporizadorTempoJogo = 0;
    if (configuracaoJogo.modoContrarelogio == false) {
        document.getElementById("tempoJogo").innerHTML = temporizadorTempoJogo;
    } else if (configuracaoJogo.modoContrarelogio == true) {
        document.getElementById("tempoJogo").innerHTML = tempoMaximo;
    }
    
}

//Função utilizada para guardas as estatisticas la lista de objetos chamada estatisticasJogo
//As estatisticas são divididas em Individual e Multijogador, também são divididas por estilos
function adicionarEstatisticas() {
    //Se estamos jogando ao Modo Individual
    if (configuracaoJogo.numeroJogadores == 1) {
        //Fazemos um ciclo para procurar o nome do jogador que está jogando
        for (let i = 0; i < estatisticasJogo.length; i++) {
            if (estatisticasJogo[i].nome == document.getElementById("nomeJogadorTurno").innerHTML) {
                //Depois de encontra ao jogador, adicionamos +1 ao contador de jogos e somamos o tempo final ao contador do tempo total jogado
                estatisticasJogo[i].estatisticasIndividuaisGerais[0]++
                estatisticasJogo[i].estatisticasIndividuaisGerais[1] = estatisticasJogo[i].estatisticasIndividuaisGerais[1] + temporizadorTempoJogo;
                //O mesmo processo mas para cada estilo
                if (configuracaoJogo.estiloTabuleiro == "animais") {
                    estatisticasJogo[i].estatisticasIndividuaisGeraisAnimais[0]++
                    estatisticasJogo[i].estatisticasIndividuaisGeraisAnimais[1] = estatisticasJogo[i].estatisticasIndividuaisGeraisAnimais[1] + temporizadorTempoJogo;
                } else if (configuracaoJogo.estiloTabuleiro == "natal") {
                    estatisticasJogo[i].estatisticasIndividuaisGeraisNatal[0]++
                    estatisticasJogo[i].estatisticasIndividuaisGeraisNatal[1] = estatisticasJogo[i].estatisticasIndividuaisGeraisNatal[1] + temporizadorTempoJogo;
                } else if (configuracaoJogo.estiloTabuleiro == "azulejos") {
                    estatisticasJogo[i].estatisticasIndividuaisGeraisAzulejos[0]++
                    estatisticasJogo[i].estatisticasIndividuaisGeraisAzulejos[1] = estatisticasJogo[i].estatisticasIndividuaisGeraisAzulejos[1] + temporizadorTempoJogo;
                }
            }
        }
        //Se estamos jogando ao Modo Multijogador
    } else if (configuracaoJogo.numeroJogadores > 1) {
        //Se não é o ponto final
        if (pontosRestantes != 0) {
            //Vamos a fazer o mesmo ciclo que no modo individual, mas só vamos a adicionar o tempo jogado à lista das estatisticas
            //Para no final calcular o tempo medio por jogada
            //Este processo é tambem feito para cada estilo por separado
            for (let i = 0; i < estatisticasJogo.length; i++) {
                if (estatisticasJogo[i].nome == document.getElementById("nomeJogadorTurno").innerHTML) {
                    estatisticasJogo[i].estatisticasMultijogadorGerais.push(temporizadorTempoJogo);
                    if (configuracaoJogo.estiloTabuleiro == "animais") {
                        estatisticasJogo[i].estatisticasMultijogadorGeraisAnimais.push(temporizadorTempoJogo);
                    } else if (configuracaoJogo.estiloTabuleiro == "natal") {
                        estatisticasJogo[i].estatisticasMultijogadorGeraisNatal.push(temporizadorTempoJogo);
                    } else if (configuracaoJogo.estiloTabuleiro == "azulejos") {
                        estatisticasJogo[i].estatisticasMultijogadorGeraisAzulejos.push(temporizadorTempoJogo);
                    }
                }
            }
            //Se é o ponto final
        } else if (pontosRestantes == 0) {
            //Fazemos o mesmo ciclo para calcular a media de tempo de cada jogador e adicionamos a informação à lista estatisticasJogo 
            for (let i = 0; i < estatisticasJogo.length; i++) {
                if (estatisticasJogo[i].nome == configuracaoJogo.nomeJogador1 || estatisticasJogo[i].nome == configuracaoJogo.nomeJogador2 || estatisticasJogo[i].nome == configuracaoJogo.nomeJogador3 || estatisticasJogo[i].nome == configuracaoJogo.nomeJogador4) {
                    var somaTempo = estatisticasJogo[i].estatisticasMultijogadorGerais.slice(2,).reduce((a, b) => a + b, 0);
                    estatisticasJogo[i].estatisticasMultijogadorGerais[1] = somaTempo / (estatisticasJogo[i].estatisticasMultijogadorGerais.length - 2)
                    if (configuracaoJogo.estiloTabuleiro == "animais") {
                        somaTempo = estatisticasJogo[i].estatisticasMultijogadorGeraisAnimais.slice(2,).reduce((a, b) => a + b, 0);
                        estatisticasJogo[i].estatisticasMultijogadorGeraisAnimais[1] = somaTempo / (estatisticasJogo[i].estatisticasMultijogadorGeraisAnimais.length - 2)
                    } else if (configuracaoJogo.estiloTabuleiro == "natal") {
                        somaTempo = estatisticasJogo[i].estatisticasMultijogadorGeraisNatal.slice(2,).reduce((a, b) => a + b, 0);
                        estatisticasJogo[i].estatisticasMultijogadorGeraisNatal[1] = somaTempo / (estatisticasJogo[i].estatisticasMultijogadorGeraisNatal.length - 2)
                    } else if (configuracaoJogo.estiloTabuleiro == "azulejos") {
                        somaTempo = estatisticasJogo[i].estatisticasMultijogadorGeraisAzulejos.slice(2,).reduce((a, b) => a + b, 0);
                        estatisticasJogo[i].estatisticasMultijogadorGeraisAzulejos[1] = somaTempo / (estatisticasJogo[i].estatisticasMultijogadorGeraisAzulejos.length - 2)
                    }
                }

            }

            //Para os resultados que saem no fim do jogo criamos uma variavel com o nome de cada jogador
            var usuario1 = estatisticasJogo.find(usuario => usuario.nome == configuracaoJogo.nomeJogador1);
            var usuario2 = estatisticasJogo.find(usuario => usuario.nome == configuracaoJogo.nomeJogador2);
            var usuario3 = estatisticasJogo.find(usuario => usuario.nome == configuracaoJogo.nomeJogador3);
            var usuario4 = estatisticasJogo.find(usuario => usuario.nome == configuracaoJogo.nomeJogador4);

            //Adicionamos os pontos obtidos as estatisticas do jogo
            //São adicionadas aos jogadores dependendo da quantidade de jogadores que estejam no jogo e dividimos as estatisticas por estilos
            usuario1.estatisticasMultijogadorGerais[0] = usuario1.estatisticasMultijogadorGerais[0] + parseInt(document.getElementById("pontosObtidos1").innerHTML);
            usuario2.estatisticasMultijogadorGerais[0] = usuario2.estatisticasMultijogadorGerais[0] + parseInt(document.getElementById("pontosObtidos2").innerHTML);
            if (configuracaoJogo.numeroJogadores >= 3) {
                usuario3.estatisticasMultijogadorGerais[0] = usuario3.estatisticasMultijogadorGerais[0] + parseInt(document.getElementById("pontosObtidos3").innerHTML);
            }
            if (configuracaoJogo.numeroJogadores == 4) {
                usuario4.estatisticasMultijogadorGerais[0] = usuario4.estatisticasMultijogadorGerais[0] + parseInt(document.getElementById("pontosObtidos4").innerHTML);
            }
            if (configuracaoJogo.estiloTabuleiro == "animais") {
                usuario1.estatisticasMultijogadorGeraisAnimais[0] = usuario1.estatisticasMultijogadorGeraisAnimais[0] + parseInt(document.getElementById("pontosObtidos1").innerHTML);
                usuario2.estatisticasMultijogadorGeraisAnimais[0] = usuario2.estatisticasMultijogadorGeraisAnimais[0] + parseInt(document.getElementById("pontosObtidos2").innerHTML);
                if (configuracaoJogo.numeroJogadores >= 3) {
                    usuario3.estatisticasMultijogadorGeraisAnimais[0] = usuario3.estatisticasMultijogadorGeraisAnimais[0] + parseInt(document.getElementById("pontosObtidos3").innerHTML);
                }
                if (configuracaoJogo.numeroJogadores == 4) {
                    usuario4.estatisticasMultijogadorGeraisAnimais[0] = usuario4.estatisticasMultijogadorGeraisAnimais[0] + parseInt(document.getElementById("pontosObtidos4").innerHTML);
                }
            } else if (configuracaoJogo.estiloTabuleiro == "natal") {
                usuario1.estatisticasMultijogadorGeraisNatal[0] = usuario1.estatisticasMultijogadorGeraisNatal[0] + parseInt(document.getElementById("pontosObtidos1").innerHTML);
                usuario2.estatisticasMultijogadorGeraisNatal[0] = usuario2.estatisticasMultijogadorGeraisNatal[0] + parseInt(document.getElementById("pontosObtidos2").innerHTML);
                if (configuracaoJogo.numeroJogadores >= 3) {
                    usuario3.estatisticasMultijogadorGeraisNatal[0] = usuario3.estatisticasMultijogadorGeraisNatal[0] + parseInt(document.getElementById("pontosObtidos3").innerHTML);
                }
                if (configuracaoJogo.numeroJogadores == 4) {
                    usuario4.estatisticasMultijogadorGeraisNatal[0] = usuario4.estatisticasMultijogadorGeraisNatal[0] + parseInt(document.getElementById("pontosObtidos4").innerHTML);
                }
            } else if (configuracaoJogo.estiloTabuleiro == "azulejos") {
                usuario1.estatisticasMultijogadorGeraisAzulejos[0] = usuario1.estatisticasMultijogadorGeraisAzulejos[0] + parseInt(document.getElementById("pontosObtidos1").innerHTML);
                usuario2.estatisticasMultijogadorGeraisAzulejos[0] = usuario2.estatisticasMultijogadorGeraisAzulejos[0] + parseInt(document.getElementById("pontosObtidos2").innerHTML);
                if (configuracaoJogo.numeroJogadores >= 3) {
                    usuario3.estatisticasMultijogadorGeraisAzulejos[0] = usuario3.estatisticasMultijogadorGeraisAzulejos[0] + parseInt(document.getElementById("pontosObtidos3").innerHTML);
                }
                if (configuracaoJogo.numeroJogadores == 4) {
                    usuario4.estatisticasMultijogadorGeraisAzulejos[0] = usuario4.estatisticasMultijogadorGeraisAzulejos[0] + parseInt(document.getElementById("pontosObtidos4").innerHTML);
                }
            }
            //Adicionamos os pontos obtidos e o tempo medio a cada jogador na lista estatisticasMultijogador
            //Esta lista vai ser utilizada para mostrar os resultados do jogo ao final do jogo
            estatisticasMultijogador[0][1] = pontosObtidos1;
            estatisticasMultijogador[0][2] = estatisticasMultijogador[0].slice(3,).reduce((a, b) => a + b, 0)/(estatisticasMultijogador[0].length - 3);
            estatisticasMultijogador[1][1] = pontosObtidos2;
            estatisticasMultijogador[1][2] = estatisticasMultijogador[1].slice(3,).reduce((a, b) => a + b, 0)/(estatisticasMultijogador[1].length - 3);
            if (configuracaoJogo.numeroJogadores >= 3) {
                estatisticasMultijogador[2][1] = pontosObtidos3;
                estatisticasMultijogador[2][2] = estatisticasMultijogador[2].slice(3,).reduce((a, b) => a + b, 0)/(estatisticasMultijogador[2].length - 3);
    
            }
            if(configuracaoJogo.numeroJogadores == 4){
                estatisticasMultijogador[3][1] = pontosObtidos4;
                estatisticasMultijogador[3][2] = estatisticasMultijogador[3].slice(3,).reduce((a, b) => a + b, 0)/(estatisticasMultijogador[3].length - 3);    
            }

            
        }
    }
}

//Função que ao acabar um jogo no Modo individual adiciona os resultados do jogo aos rankings da web
function adicionarRankings() {
    //Os rankings só são validos para o modo individual
    //Pois no modo Multijogador, o tmepo total não é importante 
    if (configuracaoJogo.numeroJogadores == 1) {
        //Existe um ranking diferente para cada tamanho de tabuleiro
        if (configuracaoJogo.tamanhoTabuleiro == "5x4") {
            //Adicionamos o nome do jogador e o tempo total do jogo
            rankingJogo.ranking5x4.push([configuracaoJogo.nomeJogador1, temporizadorTempoJogo])
            //Com isto ordenamos a lista de forma crescente com base no tempo total de jogo
            rankingJogo.ranking5x4.sort((a, b) => a[1] - b[1]);
            //E se o tamanhjo da lista é maior a 11, eliminamos o ultimo tempo da lista
            if (rankingJogo.ranking5x4.length == 11) {
                rankingJogo.ranking5x4.pop();
            }
        //Para o resto de tamanho funciona igual, com a diferenção que 
        //Para os tamanhos 5x6 e 6x6 também existe um ranking diferente para o modo trio
        } else if (configuracaoJogo.tamanhoTabuleiro == "5x6") {
            if (configuracaoJogo.modoTrio == false) {
                rankingJogo.ranking5x6.push([configuracaoJogo.nomeJogador1, temporizadorTempoJogo]);
                rankingJogo.ranking5x6.sort((a, b) => a[1] - b[1]);
            } else if (configuracaoJogo.modoTrio == true) {
                rankingJogo.rankingTrio5x6.push([configuracaoJogo.nomeJogador1, temporizadorTempoJogo]);
                rankingJogo.rankingTrio5x6.sort((a, b) => a[1] - b[1]);
            }

        } else if (configuracaoJogo.tamanhoTabuleiro == "6x6") {
            if (configuracaoJogo.modoTrio == false) {
                rankingJogo.ranking6x6.push([configuracaoJogo.nomeJogador1, temporizadorTempoJogo]);
                rankingJogo.ranking6x6.sort((a, b) => a[1] - b[1]);
            } else if (configuracaoJogo.modoTrio == true) {
                rankingJogo.rankingTrio6x6.push([configuracaoJogo.nomeJogador1, temporizadorTempoJogo]);
                rankingJogo.rankingTrio6x6.sort((a, b) => a[1] - b[1]);
            }
        } else if (configuracaoJogo.tamanhoTabuleiro == "ITW") {
            rankingJogo.rankingITW.push([configuracaoJogo.nomeJogador1, temporizadorTempoJogo])
            rankingJogo.rankingITW.sort((a, b) => a[1] - b[1]);
        }
    }

}

//Função que guarda as estatisticas e os rankings no localStorage
function gravaEstatisticasRankings() {
    localStorage.setItem("listaEstatisticas", JSON.stringify(estatisticasJogo));
    localStorage.setItem("listaRankings", JSON.stringify(rankingJogo));
}

//Mostra o Ranking dos melhores dez tempos ao final dum jogo no Modo Individual
//tambem mostra os resultados do jogo no Modo Multijogador
function mostraRankingPopUp() {
    //Se Modo Individual
    if (configuracaoJogo.numeroJogadores == 1) {

        //Procuramos a lista de Rankings no local storage
        const rankingJogo = JSON.parse(localStorage.getItem('listaRankings')) || false;

        //Imprimimos um titulo dependendo do tamanho do tabuleiro e do modo trio
        document.getElementById("tituloPopUp").innerHTML = "Ranking " + configuracaoJogo.tamanhoTabuleiro;
        if (configuracaoJogo.modoTrio == true) {
            document.getElementById("tituloPopUp").innerHTML = "Ranking Modo Trio " + configuracaoJogo.tamanhoTabuleiro
        }

        //Criamos um ciclo para ir posição por posição imprimindo o nome e o tempo de cada jogo que esteja registado no ranking
        for (let j = 1; j <= 10; j++) {
            if (configuracaoJogo.tamanhoTabuleiro == "5x4") {
                if (rankingJogo.ranking5x4[j - 1] != undefined) {
                    document.getElementById("Ranking" + j + "Nome").innerHTML = rankingJogo.ranking5x4[j - 1][0];
                    document.getElementById("Ranking" + j + "Tempo").innerHTML = rankingJogo.ranking5x4[j - 1][1] + " segs";
                }
            } else if (configuracaoJogo.tamanhoTabuleiro == "5x6" && configuracaoJogo.modoTrio == false) {
                if (rankingJogo.ranking5x6[j - 1] != undefined) {
                    document.getElementById("Ranking" + j + "Nome").innerHTML = rankingJogo.ranking5x6[j - 1][0];
                    document.getElementById("Ranking" + j + "Tempo").innerHTML = rankingJogo.ranking5x6[j - 1][1] + " segs";
                }
            } else if (configuracaoJogo.tamanhoTabuleiro == "6x6" && configuracaoJogo.modoTrio == false) {
                if (rankingJogo.ranking6x6[j - 1] != undefined) {
                    document.getElementById("Ranking" + j + "Nome").innerHTML = rankingJogo.ranking6x6[j - 1][0];
                    document.getElementById("Ranking" + j + "Tempo").innerHTML = rankingJogo.ranking6x6[j - 1][1] + " segs";
                }
            } else if (configuracaoJogo.tamanhoTabuleiro == "ITW") {
                if (rankingJogo.rankingITW[j - 1] != undefined) {
                    document.getElementById("Ranking" + j + "Nome").innerHTML = rankingJogo.rankingITW[j - 1][0];
                    document.getElementById("Ranking" + j + "Tempo").innerHTML = rankingJogo.rankingITW[j - 1][1] + " segs";
                }
            } else if (configuracaoJogo.tamanhoTabuleiro == "5x6" && configuracaoJogo.modoTrio == true) {
                if (rankingJogo.rankingTrio5x6[j - 1] != undefined) {
                    document.getElementById("Ranking" + j + "Nome").innerHTML = rankingJogo.rankingTrio5x6[j - 1][0];
                    document.getElementById("Ranking" + j + "Tempo").innerHTML = rankingJogo.rankingTrio5x6[j - 1][1] + " segs";
                }
            } else if (configuracaoJogo.tamanhoTabuleiro == "6x6" && configuracaoJogo.modoTrio == true) {
                if (rankingJogo.rankingTrio6x6[j - 1] != undefined) {
                    document.getElementById("Ranking" + j + "Nome").innerHTML = rankingJogo.rankingTrio6x6[j - 1][0];
                    document.getElementById("Ranking" + j + "Tempo").innerHTML = rankingJogo.rankingTrio6x6[j - 1][1] + " segs";
                }
            }
        }

        //Mudamos o conteudo HTML para DERROTA se não estão todos os pontos obtidos
        if (pontosRestantes != 0) {
            document.getElementById("caixaVitoria").innerHTML = "LOSE";
        }

        //Mostramos o ranking
        document.getElementById("popUpIndividual").style.display = "inline-table";

    //Para o modo multijogador, adicionamos a cada posição do ranking a cada jogador
    //Com os pontos obtidos e o tempo medio do jogo
    } else if (configuracaoJogo.numeroJogadores > 1) {
        //Se foram obtidos todos os pontos
        if (pontosRestantes == 0) {
            //São ordenadas as posições com base nos pontos obtidos
            estatisticasMultijogador.sort((a, b) => a[1] - b[1]).reverse();

            //No caso em que exista empate pontos, a melhor posição é dada ao jogador com menor tempo medio de jogada
            for (let i = 0; i < (configuracaoJogo.numeroJogadores-1); i++) {
                if (estatisticasMultijogador[i][1] == estatisticasMultijogador[i+1][1]) {
                    let listaIguais = [estatisticasMultijogador[i],estatisticasMultijogador[i+1]]
                    estatisticasMultijogador.splice(i, 1);
                    estatisticasMultijogador.splice(i, 1);
                    listaIguais.sort((a, b) => a[2] - b[2])
                    estatisticasMultijogador.splice(i, 0, listaIguais[1]);
                    estatisticasMultijogador.splice(i, 0, listaIguais[0]);
                }    
            }

            //Adicionamos as estatisticas a cada elemento HTML dos resultados
            document.getElementById("Ranking1NomeMultijogador").innerHTML = estatisticasMultijogador[0][0];
            document.getElementById("Ranking2NomeMultijogador").innerHTML = estatisticasMultijogador[1][0];
            document.getElementById("Ranking1PontosMultijogador").innerHTML = estatisticasMultijogador[0][1];
            document.getElementById("Ranking2PontosMultijogador").innerHTML = estatisticasMultijogador[1][1];
            //Arredondamos o tempo medio a duas casas decimais
            document.getElementById("Ranking1TempoMultijogador").innerHTML = Math.round((estatisticasMultijogador[0][2] + Number.EPSILON) * 100) / 100;
            document.getElementById("Ranking2TempoMultijogador").innerHTML = Math.round((estatisticasMultijogador[1][2] + Number.EPSILON) * 100) / 100;
        if (configuracaoJogo.numeroJogadores >= 3) {
            document.getElementById("Ranking3NomeMultijogador").innerHTML = estatisticasMultijogador[2][0];
            document.getElementById("Ranking3PontosMultijogador").innerHTML = estatisticasMultijogador[2][1];
            document.getElementById("Ranking3TempoMultijogador").innerHTML = Math.round((estatisticasMultijogador[2][2] + Number.EPSILON) * 100) / 100;
        }
        if(configuracaoJogo.numeroJogadores == 4){
            document.getElementById("Ranking4NomeMultijogador").innerHTML = estatisticasMultijogador[3][0];
            document.getElementById("Ranking4PontosMultijogador").innerHTML = estatisticasMultijogador[3][1];
            document.getElementById("Ranking4TempoMultijogador").innerHTML = Math.round((estatisticasMultijogador[3][2] + Number.EPSILON) * 100) / 100;
        }
            //Aparece o resultado
            document.getElementById("popUpMultijogador").style.display = "inline-table";

            //Se o jogo foi cancelado aparece outro pop up que diz "Jogo Cancelado"
        }else if (pontosRestantes != 0) {
            document.getElementById("popUpMultijogadorDerrota").style.display = "inline";
        }
        
    }

}

//Função para fazer logout
function fazerLogout() {
    localStorage.removeItem("loginFeito");
    window.location.href = "index.html";
  }


//Função que adiciona estilos Responsive para os tamanhos de tabuleiro maiores
function responsiveWebDesign() {
    if (configuracaoJogo.tamanhoTabuleiro == "5x6" || configuracaoJogo.tamanhoTabuleiro == "6x6") {
        for (let i = 1; i <= larguraTabuleiro*alturaTabuleiro ; i++) {
            document.getElementById("card"+i).classList.add("card5x6e6x6");
        }
    } else if (configuracaoJogo.tamanhoTabuleiro == "ITW") {
        for (let i = 1; i <= 40 ; i++) {
            document.getElementById("card"+i).classList.add("cardITW");
        }
    }
}


