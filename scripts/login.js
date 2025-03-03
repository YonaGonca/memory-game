
'use strict'

/* ------------------------------------------------------------------------- */
/*                                                         VARIÁVEIS GLOBAIS */
/* ------------------------------------------------------------------------- */

/**
 * Elemento de topo do formulário para criar um usuario, iniciar sessão ou 
 * para mudar de palavra passe, para simplificar o
 * acesso aos dados dos seus campos. Esta variável global só pode inicializada
 * quando o documento HTML tiver sido completamente carregado pelo browser.
*/
let formularioLogin = null;
let formularioRegisto = null;
let formularioPalavra = null;

/* ------------------------------------------------------------------------- */
/*                                                   CONSTRUTORES DE OBJETOS */
/* ------------------------------------------------------------------------- */

/**
 * Construtor de um objeto da conta de um novo usuario. Cada usuario tem
 * um nome de usuario, um e-mail, uma faixa etaria, um genero e uma palavra-passe. 
 * 
 * @param {string} nome - Nome do usuario.
 * @param {string} email - E-mail do usuario.
 * @param {string} faixa - Faixa Etaria do usuario.
 * @param {string} genero - Genero do usuario.
 * @param {string} palavra - Palavra-Passe do usuario.
 */
function usuarioRegisto(nome, email, faixa, genero, palavra) {

    this.nome = nome;

    this.email = email;

    this.faixa = faixa;
    
    this.genero = genero;

    this.palavra = palavra;
  }

/* ------------------------------------------------------------------------- */
/*                                                INICIALIZAÇÃO DA APLICAÇÃO */
/* ------------------------------------------------------------------------- */

// A função principal() é automaticamente invocada quando o documento HTML
// tiver sido completamente carregado pelo browser, incluindo o ficheiro CSS.
window.addEventListener("load", principal);

/**
 * Primeira função a ser executada após o browser completar o carregamento
 * de toda a informação presente no documento HTML.
 */
function principal() {

    // Para simplificar o acesso aos elementos do formulário dependendo da situação.
    if (document.title == "Log in | Memory Game") {
        formularioLogin = document.forms.loginForm;
    }else if(document.title == "New Account | Memory Game"){
        formularioRegisto = document.forms.registoForm;
    }else if(document.title == "New Password | Memory Game"){
        formularioPalavra = document.forms.palavraForm;
    }
  
    // Associar comportamento a elementos na página HTML.
    defineEventosParaElementosHTML();
  }

/* ------------------------------------------------------------------------- */
/*                                            REAÇÃO A EVENTOS DO UTILIZADOR */
/* ------------------------------------------------------------------------- */

/**
 * Associa event handlers a elementos no documento HTML, em particular fomrularios.
 */
function defineEventosParaElementosHTML() {
    //Caso estejamos na página de iniciar sessão
    if (document.title == "Log in | Memory Game") {
        //A função é lida quando submetemos o formulário
        formularioLogin.addEventListener('submit', (loginFuncao) => {

            //preventDefault para evitar que a pagina seja carregada de novo
            loginFuncao.preventDefault();

            //Definimos as constantes que são submetidas no formulário
            const emailLogin = formularioLogin.elements.mail.value;
            const palavraLogin = formularioLogin.elements.palavraPasse.value;
        
            //Definimos uma contante com uma lista de todos os usuarios registados
            const Registados = JSON.parse(localStorage.getItem('registados')) || [];

            //Verificamos se o usuario e email submetidos pelo formulario encontra-se na lista de registados
            const usuarioValido = Registados.find(user => user.email === emailLogin && user.palavra === palavraLogin);
            
            //Se não aparece, aparece esta alerta e sai da função
            if(!usuarioValido){
                return alert("User or Password incorrect.");
            }  
            //Se sim aparece, aparece esta alerta
            if (usuarioValido.genero == "masculino") {
                alert("Welcome "+usuarioValido.nome)
            }else if (usuarioValido.genero == "feminino") {
                alert("Welcome "+usuarioValido.nome)
            }
            
            //Guardamos o usuario que fez login para conseguir entra no jogo
            localStorage.setItem("loginFeito", JSON.stringify(usuarioValido))

            //Reencaminhar ao jogo
            window.location.href = "definiçoes.html"
        })
      //Caso estejamos na página de criar conta  
    }else if(document.title == "New Account | Memory Game"){
        //A função é lida quando submetemos o formulário
        formularioRegisto.addEventListener('submit', (registoFuncao) => {

            //preventDefault para evitar que a pagina seja carregada de novo
            registoFuncao.preventDefault();

            //Definimos as constantes que são submetidas no formulário
            const novoUsuario = formularioRegisto.elements.user.value;
            const novoEmail = formularioRegisto.elements.mail.value;
            const novaFaixaEtaria = formularioRegisto.elements.faixa.value;
            const novoGenero = formularioRegisto.elements.genero.value;
            const novaPalavra = formularioRegisto.elements.palavraPasse.value;
            const confirmarNovaPalavra = formularioRegisto.elements.confirmarPalavraPasse.value;
            
            //Definimos uma contante com uma lista de todos os usuarios registados
            const usuariosRegistados = JSON.parse(localStorage.getItem('registados')) || [];
            const emailRegistados = JSON.parse(localStorage.getItem('registados')) || [];

            //Verificamos se o usuario e email submetidos pelo formulario encontra-se na lista de registados
            const procuraUsuario = usuariosRegistados.find(user => user.nome === novoUsuario);
            const procuraEmail= emailRegistados.find(mail => mail.email === novoEmail);
            
            //Se não aparece, aparece esta alerta e sai da função
            if(procuraEmail){
                return alert("Email already used.");
            }   
            if(procuraUsuario){
                return alert("Username already used.");
            }

            //Se as palavras-passes não coincidem aparece esta alerta e sai da funcao
            if(novaPalavra != confirmarNovaPalavra){
                return alert("Passwords did't match.");
            }
            
            //É adicionado o usuario novo a lista de usuariosRegistados
            usuariosRegistados.push(new usuarioRegisto(novoUsuario, novoEmail, novaFaixaEtaria, novoGenero, novaPalavra));
            
            //A nova lista é guardada no local storage
            localStorage.setItem('registados', JSON.stringify(usuariosRegistados))

            //Reencaminhar ao jogo
            window.location.href = "login.html"
        })
    //Caso estejamos na página de mudar a palavra-passe  
    }else if(document.title == "New Password | Memory Game"){
        //A função é lida quando submetemos o formulário
        formularioPalavra.addEventListener('submit', (palavraFuncao) => {
            //preventDefault para evitar que a pagina seja carregada de novo
            palavraFuncao.preventDefault();

            //Definimos as constantes que são submetidas no formulário
            const emailPalavra = formularioPalavra.elements.mail.value;
            const novaPalavra = formularioPalavra.elements.palavraPasse.value;

            //Definimos uma contante com uma lista de todos os usuarios registados
            const usuariosRegistados = JSON.parse(localStorage.getItem('registados')) || [];

            //Verificamos se o email submetidos pelo formulario encontra-se na lista de registados
            const usuarioValido = usuariosRegistados.find(user => user.email === emailPalavra);
            //Procura o indice do email submetido
            const usuarioIndex = usuariosRegistados.indexOf(usuarioValido)
        
            //Se não aparece, aparece esta alerta e sai da função
            if(!usuarioValido){
                return alert("Incorrect email.");
            }  
        
            //Define a nova palavra passe
            usuariosRegistados[usuarioIndex].palavra = novaPalavra;

            //Guarda no local storage
            localStorage.setItem('registados', JSON.stringify(usuariosRegistados))
            
            //Reencaminhar ao jogo
            window.location.href = "login.html"
        })
    }
  }
  

