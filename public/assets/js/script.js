// JavaScript para rolagem suave e funcionalidades simuladas

// Seleciona todos os links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Previne o comportamento padrão do link

        // Obtém o elemento de destino usando o href
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth' // Ativa a rolagem suave
        });
    });
});

// Referências de elementos comuns (alguns do index.html, outros para novas páginas)
const loginForm = document.getElementById('associadoLoginForm'); // Formulário de login no index.html
const loginButtonHero = document.getElementById('loginButtonHero'); // Botão "Login do Associado" do banner
const logoutButton = document.getElementById('logoutButton'); // Botão de logout nas páginas logadas
const cadastroAssociadoForm = document.getElementById('cadastroAssociadoForm'); // Formulário de cadastro
const contactForm = document.getElementById('contactForm'); // Formulário de contato no index.html

// --- Funções de Utilitários ---

// Função para mostrar o modal de mensagens
function showModal(message) {
    const modal = document.getElementById('messageModal');
    const modalMessage = document.getElementById('modalMessage');
    if (modal && modalMessage) {
        modalMessage.textContent = message;
        modal.style.display = 'flex';
    } else {
        alert(message); // Fallback para alert se o modal não estiver presente
    }
}

// Função para fechar o modal de mensagens
function closeMessageModal() {
    const modal = document.getElementById('messageModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Event listeners para fechar o modal
const closeButton = document.querySelector('.close-button');
const modalCloseBtn = document.getElementById('modalCloseButton');
const messageModal = document.getElementById('messageModal');

if (closeButton) {
    closeButton.addEventListener('click', closeMessageModal);
}
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeMessageModal);
}
if (messageModal) {
    window.addEventListener('click', (event) => {
        if (event.target == messageModal) {
            closeMessageModal();
        }
    });
}


// --- Funções para localStorage (Simulando Banco de Dados) ---

// Carrega os associados do localStorage
function getAssociados() {
    const associadosJSON = localStorage.getItem('associados');
    return associadosJSON ? JSON.parse(associadosJSON) : [];
}

// Salva a lista de associados no localStorage
function saveAssociados(associados) {
    localStorage.setItem('associados', JSON.stringify(associados));
}

// Função para formatar CPF (000.000.000-00) - útil para padronizar
function formatCpf(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove tudo o que não é dígito
    if (cpf.length > 11) cpf = cpf.substring(0, 11); // Limita a 11 dígitos
    return cpf.replace(/(\d{3})(\d)/, '$1.$2')
              .replace(/(\d{3})(\d)/, '$1.$2')
              .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}


// --- Lógica de Cadastro de Associado (para o próprio associado se cadastrar) ---

if (cadastroAssociadoForm) {
    cadastroAssociadoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim(); // <-- ATENÇÃO: ADICIONADO .trim()
        const cpf = formatCpf(document.getElementById('cpf').value.trim()); // <-- ATENÇÃO: ADICIONADO .trim()
        const senha = document.getElementById('senha').value.trim(); // <-- ATENÇÃO: ADICIONADO .trim()
        const dataNascimento = document.getElementById('dataNascimento').value;
        const matriculaMilitar = document.getElementById('matriculaMilitar').value.trim(); // <-- ATENÇÃO: ADICIONADO .trim()
        const idMilitar = document.getElementById('idMilitar').value.trim(); // <-- ATENÇÃO: ADICIONADO .trim()
        const corporacao = document.getElementById('corporacao').value;
        const dataCadastro = new Date().toISOString().slice(0, 10); // Data de cadastro hoje (YYYY-MM-DD)

        let associados = getAssociados();

        // Verifica se o CPF já está cadastrado
        const cpfExistente = associados.some(associado => associado.cpf === cpf);
        if (cpfExistente) {
            showModal('Este CPF já está cadastrado. Tente fazer login ou use outro CPF.');
            return;
        }

        const novoAssociado = {
            nome,
            cpf,
            senha, // Em um sistema real, a senha seria hashada e não salva em texto puro.
            dataNascimento,
            matriculaMilitar,
            idMilitar,
            corporacao,
            dataCadastro,
            statusMensalidade: 'Em Dia' // Novo associado começa 'Em Dia'
        };

        associados.push(novoAssociado);
        saveAssociados(associados);

        showModal('Cadastro realizado com sucesso! Agora você pode fazer login na Área do Associado.');
        cadastroAssociadoForm.reset();
        // Opcional: Redirecionar para a página de login após o cadastro
        // setTimeout(() => { window.location.href = '/index.html#area-associado'; }, 2000);
    });
}


// --- Lógica de Login (Atualizada para localStorage) ---

// Evento de clique no botão "Login do Associado" do banner (no index.html)
if (loginButtonHero) {
    loginButtonHero.addEventListener('click', function() {
        // Assume que o href já tem o caminho correto relativo ao index.html
        // ou que a rolagem para id é suficiente.
        document.querySelector(this.getAttribute('href') || '#area-associado').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Simula o envio do formulário de login (no index.html)
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const cpfInput = document.getElementById('cpf').value.trim(); // <-- ATENÇÃO: ADICIONADO .trim()
        const senhaInput = document.getElementById('senha').value.trim(); // <-- ATENÇÃO: ADICIONADO .trim()

        // Formata o CPF para a verificação, caso o usuário digite sem pontos/traço
        const cpfFormatado = formatCpf(cpfInput);

        // Lógica de Login para Administrador (credenciais fixas)
        if (cpfInput === 'adm' && senhaInput === 'senha_adm') {
            localStorage.setItem('loggedInUser', 'admin'); // Marca o admin como logado
            window.location.href = '/admin_panel.html';
            return; // Sai da função após o redirecionamento
        }

        // Lógica de Login para Associado (busca no localStorage)
        let associados = getAssociados();
        const associado = associados.find(a => a.cpf === cpfFormatado && a.senha === senhaInput);

        if (associado) {
            localStorage.setItem('loggedInUser', JSON.stringify(associado)); // Salva os dados do associado logado
            showModal(`Login realizado com sucesso! Bem-vindo(a), ${associado.nome.split(' ')[0]}!`);
            // Redireciona para a área do associado
            window.location.href = '/area_associado.html';
        } else {
            showModal('CPF ou senha incorretos. Tente novamente.');
        }

        loginForm.reset(); // Limpa os campos
    });
}


// --- Lógica de Logout ---

function performLogout() {
    localStorage.removeItem('loggedInUser'); // Remove o usuário logado do localStorage
    showModal('Logout realizado com sucesso.');
    window.location.href = '/index.html';
}

// Adiciona listener para o botão de logout em qualquer página que o contenha
if (logoutButton) {
    logoutButton.addEventListener('click', performLogout);
}


// --- Lógica para o Status de Pagamento (Simulado) ---
// Será usada na area_associado.html e admin_panel.html
function checkPaymentStatus(dataCadastro) {
    if (!dataCadastro) return 'Status Desconhecido';

    const [anoCadastro, mesCadastro, diaCadastro] = dataCadastro.split('-').map(Number);
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth() + 1; // getMonth() retorna 0-11
    const diaAtual = hoje.getDate();

    // Se a data de cadastro for no futuro (erro)
    if (new Date(dataCadastro) > hoje) {
        return 'Inválido';
    }

    // Se o ano atual for o mesmo do cadastro
    if (anoAtual === anoCadastro) {
        if (mesAtual < mesCadastro) {
             return 'Em Dia'; // Ainda não chegou no mês do primeiro pagamento
        } else if (mesAtual === mesCadastro) {
            if (diaAtual <= diaCadastro) {
                return 'Em Dia'; // Ainda dentro do dia de vencimento do primeiro mês
            } else {
                return 'Pendente'; // Passou do dia de vencimento no mês de cadastro
            }
        } else { // mesAtual > mesCadastro
            return 'Pendente'; // Já passou o mês de cadastro no mesmo ano
        }
    } else { // Se o ano atual for maior que o ano de cadastro (para os meses seguintes)
        if (mesAtual < mesCadastro) {
            return 'Em Dia'; // Ainda não chegou no mês de vencimento do ano atual
            // Apenas para simulação, um associado não deveria estar em dia se passou mais de um mês de cadastro.
            // Para um cálculo real de mensalidade, precisaríamos de uma lógica de pagamentos e datas de vencimento mensais.
        } else if (mesAtual === mesCadastro) {
            if (diaAtual <= diaCadastro) {
                return 'Em Dia'; // Ainda dentro do dia de vencimento
            } else {
                return 'Pendente'; // Passou do dia de vencimento no mês de vencimento
            }
        } else { // mesAtual > mesCadastro
            return 'Pendente'; // Já passou o mês de vencimento no ano atual
        }
    }
}


// --- Funções para Carregar Dados nas Páginas Logadas ---

// Carrega os dados do associado na área do associado
// Esta função será chamada dentro de area_associado.html
function loadAssociadoData() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser && loggedInUser !== 'admin') { // Certifica-se de que não é o admin
        try {
            const associado = JSON.parse(loggedInUser);

            // Preenche os campos da página com os dados do associado
            document.getElementById('associadoNomeSaudacao').textContent = associado.nome.split(' ')[0] || 'Associado(a)'; // Para o Bem-vindo(a), [Nome]!
            document.getElementById('associadoNomeCompleto').textContent = associado.nome || 'N/A';
            document.getElementById('associadoCpf').textContent = associado.cpf || 'N/A';
            document.getElementById('associadoMatricula').textContent = associado.matriculaMilitar || 'N/A';
            document.getElementById('associadoDataNascimento').textContent = associado.dataNascimento ? associado.dataNascimento.split('-').reverse().join('/') : 'N/A';
            document.getElementById('associadoIdMilitar').textContent = associado.idMilitar || 'N/A';
            document.getElementById('associadoCorporacao').textContent = (associado.corporacao === 'PM' ? 'Polícia Militar' : (associado.corporacao === 'BM' ? 'Bombeiros Militar' : 'N/A')) || 'N/A';
            document.getElementById('associadoDataAssociacao').textContent = associado.dataCadastro ? associado.dataCadastro.split('-').reverse().join('/') : 'N/A';

            // Atualiza o status de mensalidade simulado
            const status = checkPaymentStatus(associado.dataCadastro);
            const statusElement = document.getElementById('statusMensalidade');
            const statusTextElement = document.getElementById('statusMensalidadeText');
            
            if (statusElement && statusTextElement) {
                statusTextElement.textContent = status;
                if (status === 'Em Dia') {
                    statusElement.className = 'mb-8 p-4 bg-green-50 rounded-lg border border-green-200';
                    statusTextElement.className = 'text-green-600 font-bold text-lg';
                } else {
                    statusElement.className = 'mb-8 p-4 bg-red-50 rounded-lg border border-red-200';
                    statusTextElement.className = 'text-red-600 font-bold text-lg';
                }
            }

        } catch (e) {
            console.error("Erro ao carregar dados do associado do localStorage:", e);
            showModal('Erro ao carregar seus dados. Por favor, faça login novamente.');
            localStorage.removeItem('loggedInUser');
            window.location.href = '/index.html#area-associado';
        }

    } else {
        // Se não houver associado logado ou for o admin, redireciona para o login
        showModal('Acesso negado. Faça login como associado para acessar esta página.');
        window.location.href = '/index.html#area-associado';
    }
}

// Carrega a lista de associados no painel do administrador
// Esta função será chamada dentro de admin_panel.html
function loadAdminAssociates() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser === 'admin') {
        const associados = getAssociados();
        const associatesTableBody = document.getElementById('associatesTableBody');
        
        if (associatesTableBody) {
            associatesTableBody.innerHTML = ''; // Limpa a tabela
            if (associados.length === 0) {
                associatesTableBody.innerHTML = '<tr><td colspan="9" class="py-4 text-center text-medium-gray">Nenhum associado cadastrado ainda.</td></tr>';
                return;
            }

            associados.forEach(associado => {
                const row = associatesTableBody.insertRow();
                // Simula o status de pagamento para exibição no admin
                const status = checkPaymentStatus(associado.dataCadastro);
                const statusClass = status === 'Em Dia' ? 'text-green-600' : 'text-red-600';

                row.innerHTML = `
                    <td class="py-2 px-4 border-b text-medium-gray">${associado.nome}</td>
                    <td class="py-2 px-4 border-b text-medium-gray">${associado.cpf}</td>
                    <td class="py-2 px-4 border-b text-medium-gray">${associado.dataNascimento ? associado.dataNascimento.split('-').reverse().join('/') : 'N/A'}</td>
                    <td class="py-2 px-4 border-b text-medium-gray">${associado.matriculaMilitar || 'N/A'}</td>
                    <td class="py-2 px-4 border-b text-medium-gray">${associado.idMilitar || 'N/A'}</td>
                    <td class="py-2 px-4 border-b text-medium-gray">${(associado.corporacao === 'PM' ? 'PM' : (associado.corporacao === 'BM' ? 'BM' : 'N/A'))}</td>
                    <td class="py-2 px-4 border-b text-medium-gray">${associado.dataCadastro ? associado.dataCadastro.split('-').reverse().join('/') : 'N/A'}</td>
                    <td class="py-2 px-4 border-b ${statusClass} font-semibold">${status}</td>
                    <td class="py-2 px-4 border-b">
                        <button class="text-accent-blue-custom hover:underline text-sm mr-2 edit-btn" data-cpf="${associado.cpf}">Editar</button>
                        <button class="text-red-500 hover:underline text-sm delete-btn" data-cpf="${associado.cpf}">Excluir</button>
                    </td>
                `;
            });

            // Adicionar listeners para botões de Editar/Excluir (funcionalidade simulada)
            associatesTableBody.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const cpfToOperate = event.target.dataset.cpf;
                    if (confirm(`Tem certeza que deseja excluir o associado com CPF ${cpfToOperate}?`)) {
                        let currentAssociates = getAssociados();
                        const updatedAssociates = currentAssociates.filter(a => a.cpf !== cpfToOperate);
                        saveAssociados(updatedAssociates);
                        showModal('Associado excluído com sucesso (apenas nesta simulação).');
                        loadAdminAssociates(); // Recarrega a tabela
                    }
                });
            });

            associatesTableBody.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const cpfToOperate = event.target.dataset.cpf;
                    // Em um sistema real, aqui você carregaria os dados do associado
                    // em um formulário de edição para que o admin possa alterá-los.
                    // Por agora, apenas um modal de simulação.
                    showModal(`Simulação: Edição do associado ${cpfToOperate}. Em um sistema real, abriria um formulário de edição pré-preenchido.`);
                });
            });

        }
    } else {
        // Se não for o admin, redireciona para o login
        showModal('Acesso negado. Faça login como administrador para acessar esta página.');
        window.location.href = '/index.html#area-associado';
    }
}

// --- Simulação de envio do formulário de contato (do index.html) ---
// (Mantido do código original)
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Previne o recarregamento da página

        const nome = document.getElementById('nome').value.trim(); // <-- ATENÇÃO: ADICIONADO .trim()
        const email = document.getElementById('email').value.trim(); // <-- ATENÇÃO: ADICIONADO .trim()
        const assunto = document.getElementById('assunto').value.trim(); // <-- ATENÇÃO: ADICIONADO .trim()
        const mensagem = document.getElementById('mensagem').value.trim(); // <-- ATENÇÃO: ADICIONADO .trim()
        const anonimo = document.getElementById('anonimo').checked;

        console.log('Dados do formulário de contato:', { nome, email, assunto, mensagem, anonimo });

        showModal('Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.');

        contactForm.reset();
    });
}


// --- Funções de Inicialização (Chamadas ao carregar as páginas) ---
// Estas chamadas garantem que as funções corretas sejam executadas quando cada página é carregada.
document.addEventListener('DOMContentLoaded', () => {
    // Para a página da Área do Associado
    if (document.body.classList.contains('page-area-associado')) {
        loadAssociadoData();
    }
    // Para a página do Painel do Administrador
    if (document.body.classList.contains('page-admin-panel')) {
        loadAdminAssociates();
        // Lógica para o formulário de adicionar associado no painel do admin
        const adminAddAssociadoForm = document.getElementById('addAssociadoForm');
        if (adminAddAssociadoForm) {
            adminAddAssociadoForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const nome = document.getElementById('nomeAssociado').value.trim(); // <-- ATENÇÃO: ADICIONADO .trim()
                const cpf = formatCpf(document.getElementById('cpfAssociado').value.trim()); // <-- ATENÇÃO: ADICIONADO .trim()
                const senha = document.getElementById('senhaAssociado').value.trim(); // <-- ATENÇÃO: ADICIONADO .trim()
                const dataNascimento = document.getElementById('dataNascimentoAssociado').value;
                const matriculaMilitar = document.getElementById('matriculaAssociado').value.trim(); // <-- ATENÇÃO: ADICIONADO .trim()
                const idMilitar = document.getElementById('idMilitarAssociado').value.trim(); // <-- ATENÇÃO: ADICIONADO .trim()
                const corporacao = document.getElementById('corporacaoAssociado').value;
                const statusMensalidade = document.getElementById('statusMensalidadeAdd').value; // Status definido pelo admin
                const dataCadastro = new Date().toISOString().slice(0, 10); // Data de cadastro hoje

                let associados = getAssociados();

                // Verifica se o CPF já está cadastrado para evitar duplicidade ou sinalizar atualização
                const existingIndex = associados.findIndex(a => a.cpf === cpf);

                const novoAssociado = {
                    nome,
                    cpf,
                    senha,
                    dataNascimento: dataNascimento || '', // Use '' em vez de 'N/A' para campos vazios
                    matriculaMilitar: matriculaMilitar || '',
                    idMilitar: idMilitar || '',
                    corporacao: corporacao || '',
                    dataCadastro, // A data de cadastro sempre será a de hoje ao adicionar via admin
                    statusMensalidade: statusMensalidade // Status definido pelo admin
                };
                
                if (existingIndex !== -1) {
                    // Simula uma atualização: se o CPF existe, substitui os dados
                    associados[existingIndex] = novoAssociado;
                    showModal('Associado atualizado com sucesso (apenas nesta simulação).');
                } else {
                    associados.push(novoAssociado); // Adiciona novo
                    showModal('Associado adicionado com sucesso (apenas nesta simulação).');
                }
                
                saveAssociados(associados);
                adminAddAssociadoForm.reset();
                loadAdminAssociates(); // Recarrega a lista
            });
        }
    }
});