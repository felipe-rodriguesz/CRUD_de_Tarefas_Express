// ==========================================
// 1. CAPTURANDO ELEMENTOS DA TELA (DOM)
// ==========================================

// Seções da tela
const authSection = document.getElementById("auth-section");
const tasksSection = document.getElementById("tasks-section");

// Nós iniciamos escondendo a área de tarefas por padrão via classe 'hidden' no HTML!

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

// ==========================================
// 1.3 SISTEMA DE TOAST NOTIFICATIONS
// ==========================================

// Cria o container de toasts uma única vez
const toastContainer = document.createElement("div");
toastContainer.id = "toast-container";
toastContainer.className = "fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none";
document.body.appendChild(toastContainer);

/**
 * Exibe uma notificação toast estilizada.
 * @param {string} mensagem - Texto da notificação.
 * @param {"sucesso"|"erro"|"info"} tipo - Tipo visual do toast.
 * @param {number} duracaoMs - Quanto tempo o toast fica visível (ms).
 */
function mostrarToast(mensagem, tipo = "info", duracaoMs = 3500) {
    const cores = {
        sucesso: { bg: "bg-figma-accent", text: "text-figma-dark", icon: "check-circle" },
        erro:    { bg: "bg-figma-red",    text: "text-white",      icon: "alert-circle" },
        info:    { bg: "bg-figma-dark",   text: "text-white",      icon: "info" }
    };
    const estilo = cores[tipo] || cores.info;

    const toast = document.createElement("div");
    toast.className = `${estilo.bg} ${estilo.text} px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto
                        font-semibold text-[15px] min-w-[280px] max-w-[420px]
                        transform translate-x-[120%] transition-transform duration-300 ease-out`;
    toast.innerHTML = `
        <i data-lucide="${estilo.icon}" class="w-5 h-5 shrink-0"></i>
        <span class="flex-1">${mensagem}</span>
        <button onclick="this.parentElement.remove()" class="opacity-60 hover:opacity-100 transition-opacity shrink-0">
            <i data-lucide="x" class="w-4 h-4"></i>
        </button>
    `;
    toastContainer.appendChild(toast);
    lucide.createIcons({ nodes: [toast] });

    // Anima a entrada
    requestAnimationFrame(() => {
        toast.classList.remove("translate-x-[120%]");
        toast.classList.add("translate-x-0");
    });

    // Remove após a duração
    setTimeout(() => {
        toast.classList.remove("translate-x-0");
        toast.classList.add("translate-x-[120%]");
        setTimeout(() => toast.remove(), 300);
    }, duracaoMs);
}


// ==========================================
// 1.4 SISTEMA DE MODAIS CUSTOMIZADOS
// ==========================================

/**
 * Exibe um modal de confirmação estilizado (substitui confirm()).
 * @param {string} titulo - Título do modal.
 * @param {string} mensagem - Mensagem descritiva.
 * @param {string} textoBotao - Texto do botão de confirmar.
 * @returns {Promise<boolean>} - true se confirmou, false se cancelou.
 */
function mostrarConfirmacao(titulo, mensagem, textoBotao = "Confirmar") {
    return new Promise((resolve) => {
        const overlay = document.createElement("div");
        overlay.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-6 opacity-0 transition-opacity duration-200";

        overlay.innerHTML = `
            <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-sm p-8 flex flex-col gap-5 transform scale-95 transition-transform duration-200">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-figma-red/10 flex items-center justify-center shrink-0">
                        <i data-lucide="alert-triangle" class="w-6 h-6 text-figma-red"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-figma-dark">${titulo}</h3>
                        <p class="text-sm text-gray-500 font-medium mt-1">${mensagem}</p>
                    </div>
                </div>
                <div class="flex gap-3 mt-2">
                    <button id="modal-cancelar" class="flex-1 py-3 rounded-xl border-2 border-figma-border text-figma-dark font-bold hover:bg-gray-50 transition-all text-[15px]">
                        Cancelar
                    </button>
                    <button id="modal-confirmar" class="flex-1 py-3 rounded-xl bg-figma-red text-white font-bold hover:bg-red-500 transition-all text-[15px]">
                        ${textoBotao}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        lucide.createIcons({ nodes: [overlay] });

        // Anima a entrada
        requestAnimationFrame(() => {
            overlay.classList.remove("opacity-0");
            overlay.classList.add("opacity-100");
            overlay.querySelector(".bg-white").classList.remove("scale-95");
            overlay.querySelector(".bg-white").classList.add("scale-100");
        });

        function fechar(resultado) {
            overlay.classList.remove("opacity-100");
            overlay.classList.add("opacity-0");
            setTimeout(() => { overlay.remove(); resolve(resultado); }, 200);
        }

        overlay.querySelector("#modal-cancelar").addEventListener("click", () => fechar(false));
        overlay.querySelector("#modal-confirmar").addEventListener("click", () => fechar(true));
        // Fechar ao clicar fora do modal
        overlay.addEventListener("click", (e) => { if (e.target === overlay) fechar(false); });
    });
}

/**
 * Exibe um modal de edição com campos de título e descrição (substitui prompt()).
 * @param {string} tituloAtual - Valor atual do título.
 * @param {string} descricaoAtual - Valor atual da descrição.
 * @returns {Promise<{titulo: string, descricao: string}|null>} - Dados ou null se cancelou.
 */
function mostrarModalEditar(tituloAtual, descricaoAtual) {
    return new Promise((resolve) => {
        const overlay = document.createElement("div");
        overlay.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-6 opacity-0 transition-opacity duration-200";

        overlay.innerHTML = `
            <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-md p-8 flex flex-col gap-5 transform scale-95 transition-transform duration-200">
                <div class="flex items-center gap-3 mb-1">
                    <div class="w-12 h-12 rounded-full bg-figma-accent/30 flex items-center justify-center shrink-0">
                        <i data-lucide="pencil" class="w-6 h-6 text-figma-dark"></i>
                    </div>
                    <h3 class="text-xl font-bold text-figma-dark">Editar Tarefa</h3>
                </div>

                <div class="flex flex-col gap-3">
                    <label class="text-sm font-bold text-gray-500 uppercase tracking-wider">Título</label>
                    <input type="text" id="edit-titulo" value="${tituloAtual.replace(/"/g, '&quot;')}" class="w-full px-4 py-3.5 rounded-xl border border-figma-border bg-figma-bg outline-none focus:border-figma-dark focus:bg-white font-semibold text-[16px] transition-all">
                    
                    <label class="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Descrição</label>
                    <textarea id="edit-descricao" rows="3" class="w-full px-4 py-3.5 rounded-xl border border-figma-border bg-figma-bg outline-none focus:border-figma-dark focus:bg-white resize-none text-[15px] transition-all">${descricaoAtual}</textarea>
                </div>

                <div class="flex gap-3 mt-2">
                    <button id="edit-cancelar" class="flex-1 py-3.5 rounded-xl border-2 border-figma-border text-figma-dark font-bold hover:bg-gray-50 transition-all text-[15px]">
                        Cancelar
                    </button>
                    <button id="edit-salvar" class="flex-1 py-3.5 rounded-xl bg-figma-dark text-white font-bold hover:bg-opacity-90 transition-all text-[15px] flex items-center justify-center gap-2">
                        <i data-lucide="check" class="w-5 h-5"></i> Salvar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        lucide.createIcons({ nodes: [overlay] });

        // Anima a entrada
        requestAnimationFrame(() => {
            overlay.classList.remove("opacity-0");
            overlay.classList.add("opacity-100");
            overlay.querySelector(".bg-white").classList.remove("scale-95");
            overlay.querySelector(".bg-white").classList.add("scale-100");
            // Foca automaticamente no campo de título
            overlay.querySelector("#edit-titulo").focus();
            overlay.querySelector("#edit-titulo").select();
        });

        function fechar(resultado) {
            overlay.classList.remove("opacity-100");
            overlay.classList.add("opacity-0");
            setTimeout(() => { overlay.remove(); resolve(resultado); }, 200);
        }

        overlay.querySelector("#edit-cancelar").addEventListener("click", () => fechar(null));
        overlay.querySelector("#edit-salvar").addEventListener("click", () => {
            const novoTitulo = overlay.querySelector("#edit-titulo").value.trim();
            const novaDescricao = overlay.querySelector("#edit-descricao").value.trim();
            if (!novoTitulo) {
                overlay.querySelector("#edit-titulo").classList.add("border-figma-red");
                return;
            }
            fechar({ titulo: novoTitulo, descricao: novaDescricao });
        });
        // Fechar ao clicar fora
        overlay.addEventListener("click", (e) => { if (e.target === overlay) fechar(null); });
        // Salvar ao apertar Enter no campo de descrição
        overlay.querySelector("#edit-descricao").addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                overlay.querySelector("#edit-salvar").click();
            }
        });
    });
}


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
// 1.7 SKELETON LOADING
// ==========================================

function mostrarSkeleton() {
    let html = "";
    for (let i = 0; i < 3; i++) {
        html += `
            <li class="bg-gray-300 rounded-figma-card p-6 h-48 animate-pulse relative overflow-hidden">
                <div class="w-2/3 h-6 bg-gray-400 rounded-md mb-4"></div>
                <div class="w-full h-4 bg-gray-400 rounded-md mb-2"></div>
                <div class="w-4/5 h-4 bg-gray-400 rounded-md mb-8"></div>
                <div class="flex gap-3">
                    <div class="w-24 h-10 bg-gray-400 rounded-full"></div>
                    <div class="w-10 h-10 bg-gray-400 rounded-full"></div>
                </div>
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
        authSection.classList.add("hidden");
        tasksSection.classList.remove("hidden");
    } else {
        authSection.classList.remove("hidden");
        tasksSection.classList.add("hidden");
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
        const resposta = await fetch("/usuarios/login", {
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
            
            // Salvamos o nome do usuário para exibir na tela!
            if (dados.nome) {
                localStorage.setItem("nomeUsuario", dados.nome);
            }
            
            // Sucesso visual: Limpamos os inputs e trocamos a tela!
            loginSenha.value = ""; 
            alternarTelas(true);
            
            // AGORA SIM: Mandamos o JS ir buscar as tarefas no banco!
            carregarTarefas();

        } else {
            // A senha estava errada ou o usuário não existe
            mostrarToast("E-mail ou senha incorretos!", "erro");
        }

    } catch (erro) {
        console.error("Erro na comunicação com a API:", erro);
        mostrarToast("Não foi possível conectar com o servidor.", "erro");
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
        const resposta = await fetch("/usuarios/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome: nome, email: email, senha: senha }) 
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            mostrarToast("Cadastro realizado com sucesso! Agora faça login.", "sucesso");
            // Limpa as caixas de texto de cadastro
            cadastroNome.value = "";
            cadastroEmail.value = "";
            cadastroSenha.value = "";
        } else {
            mostrarToast("Erro ao cadastrar: " + (resultado.mensagem || resultado.message || "Verifique os dados."), "erro");
        }

    } catch (erro) {
        console.error("Erro no cadastro:", erro);
        mostrarToast("Falha na comunicação com o servidor.", "erro");
    }
});

// Quando o usuário apertar "Sair da Conta"
btnSair.addEventListener("click", function() {
    // Apaga o token do cofre do navegador
    localStorage.removeItem("tokenTarefas");
    localStorage.removeItem("nomeUsuario");
    
    // Mostra o formulário de login novamente
    alternarTelas(false);
    
    mostrarToast("Você saiu da conta!", "info");
});

// ==========================================
// 4. INTEGRAÇÃO COM A API: BUSCAR TAREFAS
// ==========================================

async function carregarTarefas(textoBusca = "") {
    // 1. Pegamos o crachá que estava guardado no cofre
    const token = localStorage.getItem("tokenTarefas");

    // Montamos a URL: se houver texto de busca, adicionamos como parâmetro
    const url = textoBusca
        ? `/tasks?search=${encodeURIComponent(textoBusca)}`
        : "/tasks";

    // Atualiza o nome do usuário na tela
    const userGreeting = document.getElementById("user-greeting");
    if (userGreeting) {
        userGreeting.innerText = localStorage.getItem("nomeUsuario") || "User";
    }

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
                listaTarefasHTML.innerHTML = `
                    <li class="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                        <i data-lucide="inbox" class="w-16 h-16 mb-4 opacity-40"></i>
                        <p class="text-lg font-semibold">Nenhuma tarefa encontrada</p>
                        <p class="text-sm mt-1">Crie uma nova tarefa para começar!</p>
                    </li>
                `;
                lucide.createIcons();
                return;
            }

            // 5. Para CADA tarefa que veio do banco de dados...
            tarefasArray.forEach(tarefa => {
                const li = document.createElement("li");
                
                const isConcluido = tarefa.status === "CONCLUÍDO!";
                
                // Aplicamos as classes do Figma "Latest Project" card
                // Alternamos a cor de fundo baseado no ID ou status
                const bgClass = isConcluido ? "bg-gray-300 opacity-60" : "bg-figma-accent";
                const textColor = isConcluido ? "text-gray-500" : "text-figma-dark";
                
                li.className = `${bgClass} rounded-figma-card p-6 relative overflow-hidden group shadow-sm transition-transform hover:-translate-y-1`;

                // Escapamos aspas simples nos dados para evitar quebrar os atributos onclick
                const tituloEscapado = tarefa.titulo.replace(/'/g, "\\'").replace(/"/g, "&quot;");
                const descricaoEscapada = tarefa.descricao.replace(/'/g, "\\'").replace(/"/g, "&quot;");

                li.innerHTML = `
                    <div class="relative z-10">
                        <h4 class="text-[22px] font-bold ${textColor} leading-tight mb-2 ${isConcluido ? 'line-through' : ''}">${tarefa.titulo}</h4>
                        <p class="text-[16px] ${textColor} font-medium mb-8 opacity-80 ${isConcluido ? 'line-through' : ''}">${tarefa.descricao}</p>
                        
                        <div class="flex items-center gap-3">
                            <button onclick="toggleTarefa(${tarefa.id}, '${tarefa.status}')" class="bg-figma-dark text-white px-5 py-2.5 rounded-full font-medium text-[14px] flex items-center gap-2 hover:bg-opacity-90 transition-colors shadow-sm">
                                <i data-lucide="${isConcluido ? 'check-circle' : 'circle'}" class="w-4 h-4"></i>
                                ${isConcluido ? 'Concluída' : 'Pendente'}
                            </button>
                            <button onclick="editarTarefa(${tarefa.id}, '${tituloEscapado}', '${descricaoEscapada}')" class="p-2.5 bg-black/5 text-figma-dark rounded-full hover:bg-black/10 transition-colors shadow-sm" title="Editar">
                                <i data-lucide="pencil" class="w-4 h-4"></i>
                            </button>
                            <button onclick="excluirTarefa(${tarefa.id})" class="p-2.5 bg-figma-red text-white rounded-full hover:bg-red-500 transition-colors shadow-sm" title="Excluir">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Abstract shapes background -->
                    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-2xl z-0 pointer-events-none"></div>
                    <div class="absolute -right-4 -top-10 w-24 h-24 bg-white/30 rounded-full blur-xl z-0 pointer-events-none"></div>
                `;

                listaTarefasHTML.appendChild(li);
            });

            // Renderiza os ícones Lucide nos elementos recém-criados
            lucide.createIcons();

        } else {
            mostrarToast("Sua sessão expirou. Faça login novamente.", "erro");
            alternarTelas(false); // Volta para a tela de login
        }

    } catch (erro) {
        // Mostra mensagem de erro dentro da lista caso o servidor não responda
        listaTarefasHTML.innerHTML = `
            <li class="col-span-full flex flex-col items-center justify-center py-16 text-figma-red">
                <i data-lucide="wifi-off" class="w-16 h-16 mb-4 opacity-60"></i>
                <p class="text-lg font-semibold">Falha ao carregar</p>
                <p class="text-sm mt-1 text-gray-500">O servidor está rodando?</p>
            </li>
        `;
        lucide.createIcons();
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
        const resposta = await fetch("/tasks", {
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
            
            mostrarToast("Tarefa criada com sucesso!", "sucesso");
            
            // O GRANDE TRUQUE: Mandamos o JS buscar a lista de tarefas atualizada!
            carregarTarefas(); 
            
        } else {
            mostrarToast("Erro ao criar a tarefa.", "erro");
        }

    } catch (erro) {
        console.error("Erro ao criar tarefa:", erro);
        mostrarToast("Falha na comunicação com o servidor.", "erro");
    }
});

// ==========================================
// 6. INTEGRAÇÃO COM A API: DELETAR E CONCLUIR
// ==========================================

// Função global para excluir a tarefa
window.excluirTarefa = async function(id) {
    const confirmar = await mostrarConfirmacao(
        "Excluir tarefa",
        "Tem certeza que deseja excluir esta tarefa? Essa ação não pode ser desfeita.",
        "Excluir"
    );
    if (!confirmar) return;

    const token = localStorage.getItem("tokenTarefas");

    try {
        const resposta = await fetch(`/tasks/${id}`, {
            method: "DELETE", // Comando de Destruição
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (resposta.ok) {
            mostrarToast("Tarefa excluída com sucesso!", "sucesso");
            // Se o Node.js confirmar a exclusão, recarregamos a lista!
            carregarTarefas(); 
        } else {
            mostrarToast("Erro ao excluir a tarefa.", "erro");
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
            resposta = await fetch(`/tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: "pendente" })
            });
        } else {
            // Tarefa está pendente: vamos CONCLUIR via PATCH
            resposta = await fetch(`/tasks/${id}/complete`, {
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

// Função global para editar a tarefa usando modal customizado
window.editarTarefa = async function(id, tituloAtual, descricaoAtual) {
    // Abre o modal de edição estilizado
    const resultado = await mostrarModalEditar(tituloAtual, descricaoAtual);
    if (!resultado) return; // Se o usuário cancelou, não fazemos nada

    const token = localStorage.getItem("tokenTarefas");

    try {
        const resposta = await fetch(`/tasks/${id}`, {
            method: "PUT", // PUT = Atualizar o recurso completo
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ titulo: resultado.titulo, descricao: resultado.descricao })
        });

        if (resposta.ok) {
            mostrarToast("Tarefa editada com sucesso!", "sucesso");
            // Sucesso! Recarregamos a lista para mostrar os dados atualizados
            carregarTarefas();
        } else {
            mostrarToast("Erro ao editar a tarefa.", "erro");
        }
    } catch (erro) {
        console.error("Erro ao editar:", erro);
        mostrarToast("Falha na comunicação com o servidor.", "erro");
    }
};

// Inicializa os ícones do Lucide que já estão estáticos no HTML
lucide.createIcons();
