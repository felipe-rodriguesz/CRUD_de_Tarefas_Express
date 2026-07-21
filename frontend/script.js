// ==========================================
// 1. CAPTURANDO ELEMENTOS DA TELA (DOM)
// ==========================================

// Seções da tela
const authSection = document.getElementById("auth-section");
const tasksSection = document.getElementById("tasks-section");

// Nós iniciamos escondendo a área de tarefas por padrão!
tasksSection.style.display = "none";

// Formulários
const formLogin = document.getElementById("form-login");
const loginEmail = document.getElementById("login-email");
const loginSenha = document.getElementById("login-senha");

const listaTarefasHTML = document.getElementById("lista-tarefas");

const formTarefa = document.getElementById("form-tarefa");
const tarefaTitulo = document.getElementById("tarefa-titulo");
const tarefaDescricao = document.getElementById("tarefa-descricao");

// Novos elementos capturados (Fase 4)
const formCadastro = document.getElementById("form-cadastro");
const cadastroNome = document.getElementById("cadastro-nome");
const cadastroEmail = document.getElementById("cadastro-email");
const cadastroSenha = document.getElementById("cadastro-senha");
const btnSair = document.getElementById("btn-sair");

const inputPesquisa = document.getElementById("input-pesquisa");
const btnPesquisar = document.getElementById("btn-pesquisar");
const btnDarkMode = document.getElementById("btn-dark-mode");


// ==========================================
// 1.5 TOGGLE DE VISIBILIDADE DE SENHA
// ==========================================

function toggleSenha(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}


// ==========================================
// 1.6 DARK MODE
// ==========================================

// Inicializa o tema salvo no localStorage ao carregar a página
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
}

btnDarkMode.addEventListener("click", function () {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
    lucide.createIcons(); // Rerenderiza ícones após troca de tema
});


// ==========================================
// 1.7 SKELETON LOADING
// ==========================================

function mostrarSkeleton() {
    let html = "";
    for (let i = 0; i < 3; i++) {
        html += `
            <li class="skeleton-item">
                <div class="skeleton-check"></div>
                <div class="skeleton-content">
                    <div class="skeleton-line short"></div>
                    <div class="skeleton-line long"></div>
                </div>
                <div class="skeleton-btn"></div>
                <div class="skeleton-btn"></div>
            </li>
        `;
    }
    listaTarefasHTML.innerHTML = html;
}


// ==========================================
// 2. FUNÇÃO DE TROCA DE TELAS (O EFEITO SPA)
// ==========================================

// Essa função será chamada sempre que precisarmos mostrar ou esconder as tarefas
function alternarTelas(usuarioLogado) {
    if (usuarioLogado) {
        // Se estiver logado: esconde o login, mostra as tarefas
        authSection.style.display = "none";
        tasksSection.style.display = "block";
    } else {
        // Se não estiver logado: mostra o login, esconde as tarefas
        authSection.style.display = "block";
        tasksSection.style.display = "none";
    }
}

// ==========================================
// 3. INTEGRAÇÃO COM A API: LOGIN
// ==========================================

// Quando o usuário apertar o botão "Entrar" no formulário de Login
formLogin.addEventListener("submit", async function (evento) {
    // 1. O padrão do HTML é recarregar a página ao enviar um formulário. Nós proibimos isso!
    evento.preventDefault(); 
    
    // 2. Pegamos os valores exatos que o usuário digitou nas caixas
    const emailDigitado = loginEmail.value;
    const senhaDigitada = loginSenha.value;

    try {
        // 3. Fazemos a ponte HTTP (O Carteiro) para o nosso Backend Node.js
        const resposta = await fetch("http://localhost:3000/usuarios/login", {
            method: "POST", // Vamos enviar dados fechados
            headers: {
                "Content-Type": "application/json" // Avisamos que estamos enviando um JSON
            },
            // Empacotamos o email e senha no formato JSON antes de enviar
            body: JSON.stringify({ email: emailDigitado, senha: senhaDigitada }) 
        });

        // 4. Recebemos a resposta do servidor
        if (resposta.ok) {
            // A senha estava certa! O Node.js nos devolveu o Token JWT
            const dados = await resposta.json();
            const nossoCrachaJwt = dados.token;

            // Guardamos o crachá no cofre do navegador (localStorage)
            localStorage.setItem("tokenTarefas", nossoCrachaJwt);
            
            // Sucesso visual: Limpamos os inputs e trocamos a tela!
            loginSenha.value = ""; 
            alternarTelas(true);
            
            // AGORA SIM: Mandamos o JS ir buscar as tarefas no banco!
            carregarTarefas();

        } else {
            // A senha estava errada ou o usuário não existe
            alert("E-mail ou senha incorretos! ❌");
        }

    } catch (erro) {
        console.error("Erro na comunicação com a API:", erro);
        alert("Não foi possível conectar com o servidor. O Backend está rodando? 🕵️‍♂️");
    }
});

// ==========================================
// 3.5 INTEGRAÇÃO COM A API: CADASTRO E LOGOUT
// ==========================================

// Quando o usuário apertar o botão "Cadastrar"
formCadastro.addEventListener("submit", async function (evento) {
    evento.preventDefault(); 

    const nome = cadastroNome.value;
    const email = cadastroEmail.value;
    const senha = cadastroSenha.value;

    try {
        const resposta = await fetch("http://localhost:3000/usuarios/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome: nome, email: email, senha: senha }) 
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("Cadastro realizado com sucesso! 🎉 Agora é só fazer login acima.");
            // Limpa as caixas de texto de cadastro
            cadastroNome.value = "";
            cadastroEmail.value = "";
            cadastroSenha.value = "";
        } else {
            alert("Erro ao cadastrar: " + (resultado.mensagem || "Verifique os dados."));
        }

    } catch (erro) {
        console.error("Erro no cadastro:", erro);
        alert("Falha na comunicação com o servidor.");
    }
});

// Quando o usuário apertar "Sair da Conta"
btnSair.addEventListener("click", function() {
    // Apaga o token do cofre do navegador
    localStorage.removeItem("tokenTarefas");
    
    // Mostra o formulário de login novamente
    alternarTelas(false);
    
    alert("Você saiu da conta! 👋");
});

// ==========================================
// 4. INTEGRAÇÃO COM A API: BUSCAR TAREFAS
// ==========================================

async function carregarTarefas(textoBusca = "") {
    // 1. Pegamos o crachá que estava guardado no cofre
    const token = localStorage.getItem("tokenTarefas");

    // Montamos a URL: se houver texto de busca, adicionamos como parâmetro
    const url = textoBusca
        ? `http://localhost:3000/tasks?search=${encodeURIComponent(textoBusca)}`
        : "http://localhost:3000/tasks";

    // Mostra skeleton enquanto carrega
    mostrarSkeleton();

    try {
        // 2. Fazemos o pedido GET enviando o token e a URL (com ou sem busca)
        const resposta = await fetch(url, {
            method: "GET",
            headers: {
                // Aqui enviamos o token JWT no cabeçalho (O segurança barra sem isso!)
                "Authorization": `Bearer ${token}` 
            }
        });

        if (resposta.ok) {
            // O nosso backend retorna um objeto com { data, page, limit, total }
            // Precisamos acessar a propriedade "data" que contém a lista real!
            const respostaBackend = await resposta.json();
            const tarefasArray = respostaBackend.data;
            
            // 3. Limpamos a lista antiga na tela
            listaTarefasHTML.innerHTML = "";

            // 4. Se o usuário não tiver tarefas (ou a busca não encontrar nada)...
            if (tarefasArray.length === 0) {
                listaTarefasHTML.innerHTML = "<p style='text-align:center; color:#666;'>Nenhuma tarefa encontrada.</p>";
                return;
            }

            // 5. Para CADA tarefa que veio do banco de dados...
            tarefasArray.forEach(tarefa => {
                // Criamos um novo <li> vazio
                const li = document.createElement("li");
                
                // Se o status for concluído, adicionamos a classe CSS para riscar o texto
                if (tarefa.status === "CONCLUÍDO!") {
                    li.classList.add("concluida");
                }

                // Injetamos o conteúdo HTML com ícones Lucide
                li.innerHTML = `
                    <input type="checkbox" onclick="toggleTarefa(${tarefa.id}, '${tarefa.status}')" ${tarefa.status === "CONCLUÍDO!" ? "checked" : ""}>
                    <span><strong>${tarefa.titulo}</strong>${tarefa.descricao}</span>
                    <button onclick="editarTarefa(${tarefa.id}, '${tarefa.titulo}', '${tarefa.descricao}')" title="Editar">
                        <i data-lucide="pencil"></i>
                    </button>
                    <button onclick="excluirTarefa(${tarefa.id})" title="Excluir">
                        <i data-lucide="trash-2"></i>
                    </button>
                `;

                // Colamos esse <li> novinho dentro da <ul> na tela
                listaTarefasHTML.appendChild(li);
            });

            // Renderiza os ícones Lucide nos elementos recém-criados
            lucide.createIcons();

        } else {
            alert("Sua sessão expirou. Faça login novamente.");
            alternarTelas(false); // Volta para a tela de login
        }

    } catch (erro) {
        // Mostra mensagem de erro dentro da lista caso o servidor não responda
        listaTarefasHTML.innerHTML = "<p class='erro-carregamento'>&#10060; Falha ao carregar. O servidor está rodando?</p>";
        console.error("Erro ao carregar tarefas:", erro);
    }
}

// ==========================================
// 5. INTEGRAÇÃO COM A API: CRIAR TAREFA
// ==========================================

formTarefa.addEventListener("submit", async function (evento) {
    evento.preventDefault(); // Evita recarregar a página!

    const titulo = tarefaTitulo.value;
    const descricao = tarefaDescricao.value;
    const token = localStorage.getItem("tokenTarefas");

    try {
        const resposta = await fetch("http://localhost:3000/tasks", {
            method: "POST", // POST significa "Criar/Salvar"
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Crachá necessário!
            },
            body: JSON.stringify({ titulo: titulo, descricao: descricao })
        });

        if (resposta.ok) {
            // Sucesso! Limpamos as caixas de texto
            tarefaTitulo.value = "";
            tarefaDescricao.value = "";
            
            // O GRANDE TRUQUE: Mandamos o JS buscar a lista de tarefas atualizada!
            carregarTarefas(); 
            
        } else {
            alert("Erro ao criar a tarefa. ❌");
        }

    } catch (erro) {
        console.error("Erro ao criar tarefa:", erro);
    }
});

// ==========================================
// 6. INTEGRAÇÃO COM A API: DELETAR E CONCLUIR
// ==========================================

// Função global para excluir a tarefa
window.excluirTarefa = async function(id) {
    const confirmar = confirm("Tem certeza que deseja excluir esta tarefa?");
    if (!confirmar) return;

    const token = localStorage.getItem("tokenTarefas");

    try {
        const resposta = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE", // Comando de Destruição
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (resposta.ok) {
            // Se o Node.js confirmar a exclusão, recarregamos a lista!
            carregarTarefas(); 
        } else {
            alert("Erro ao excluir a tarefa.");
        }
    } catch (erro) {
        console.error("Erro ao excluir:", erro);
    }
};

// Função global para ALTERNAR o status da tarefa (concluir ou desmarcar)
window.toggleTarefa = async function(id, statusAtual) {
    const token = localStorage.getItem("tokenTarefas");

    try {
        let resposta;

        if (statusAtual === "CONCLUÍDO!") {
            // Tarefa já está concluída: vamos DESMARCAR via PUT, voltando ao status pendente
            resposta = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: "pendente" })
            });
        } else {
            // Tarefa está pendente: vamos CONCLUIR via PATCH
            resposta = await fetch(`http://localhost:3000/tasks/${id}/complete`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
        }

        if (resposta.ok) {
            carregarTarefas();
        }
    } catch (erro) {
        console.error("Erro ao alternar status:", erro);
    }
};

// ==========================================
// 7. PESQUISA DE TAREFAS
// ==========================================

// Quando o usuário clicar no botão "Buscar"
btnPesquisar.addEventListener("click", function() {
    const texto = inputPesquisa.value.trim();
    // Chamamos carregarTarefas passando o texto de busca!
    carregarTarefas(texto);
});

// Permite buscar também ao apertar Enter dentro do input de pesquisa
inputPesquisa.addEventListener("keypress", function(evento) {
    if (evento.key === "Enter") {
        const texto = inputPesquisa.value.trim();
        carregarTarefas(texto);
    }
});

// ==========================================
// 8. INTEGRAÇÃO COM A API: EDITAR TAREFA
// ==========================================

// Função global para editar a tarefa usando prompt() nativo do navegador
window.editarTarefa = async function(id, tituloAtual, descricaoAtual) {
    // Abrimos uma caixinha pedindo o novo título (já preenchida com o valor atual)
    const novoTitulo = prompt("Novo título da tarefa:", tituloAtual);
    if (novoTitulo === null) return; // Se o usuário cancelou, não fazemos nada

    const novaDescricao = prompt("Nova descrição da tarefa:", descricaoAtual);
    if (novaDescricao === null) return;

    const token = localStorage.getItem("tokenTarefas");

    try {
        const resposta = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "PUT", // PUT = Atualizar o recurso completo
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ titulo: novoTitulo, descricao: novaDescricao })
        });

        if (resposta.ok) {
            // Sucesso! Recarregamos a lista para mostrar os dados atualizados
            carregarTarefas();
        } else {
            alert("Erro ao editar a tarefa. ❌");
        }
    } catch (erro) {
        console.error("Erro ao editar:", erro);
    }
};

// Inicializa os ícones do Lucide que já estão estáticos no HTML
lucide.createIcons();
