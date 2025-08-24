// Elementos do DOM
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const manualsGridEl = document.getElementById('manualsGrid');
const emptyStateEl = document.getElementById('emptyState');

// Funções para controlar estados da UI
function showLoading() {
    console.log('Mostrando loading...');
    loadingEl.classList.remove('hidden');
    errorEl.classList.add('hidden');
    manualsGridEl.classList.add('hidden');
    emptyStateEl.classList.add('hidden');
}

function showError() {
    console.log('Mostrando erro...');
    loadingEl.classList.add('hidden');
    errorEl.classList.remove('hidden');
    manualsGridEl.classList.add('hidden');
    emptyStateEl.classList.add('hidden');

    // Restaurar mensagem padrão de erro
    const errorMessage = errorEl.querySelector('p');
    errorMessage.textContent = 'Erro ao carregar os manuais. Tente novamente.';

    // Mostrar botão de retry
    const retryBtn = errorEl.querySelector('.timer-btn');
    retryBtn.style.display = 'inline-block';
}

function showManuals() {
    console.log('Mostrando manuais...');
    loadingEl.classList.add('hidden');
    errorEl.classList.add('hidden');
    manualsGridEl.classList.remove('hidden');
    emptyStateEl.classList.add('hidden');
}

function showEmptyState() {
    console.log('Mostrando estado vazio...');
    loadingEl.classList.add('hidden');
    errorEl.classList.add('hidden');
    manualsGridEl.classList.add('hidden');
    emptyStateEl.classList.remove('hidden');
}

function showLoginRequired() {
    console.log('Mostrando login necessário...');
    loadingEl.classList.add('hidden');
    errorEl.classList.remove('hidden');
    manualsGridEl.classList.add('hidden');
    emptyStateEl.classList.add('hidden');

    // Atualizar mensagem para solicitar login
    const errorMessage = errorEl.querySelector('p');
    errorMessage.textContent = 'Você precisa estar logado para acessar os manuais. Faça login para continuar.';

    // Esconder botão de retry
    const retryBtn = errorEl.querySelector('.timer-btn');
    retryBtn.style.display = 'none';
}

// Função para extrair manuais dos dados do documento
function extractManualsFromDocument(data) {
    const manuais = [];

    try {
        console.log('Extraindo manuais dos dados do documento:', data);

        // Iterar por todos os campos do documento
        Object.keys(data).forEach((key, index) => {
            // Pular campos que não são manuais (como metadados, configurações, etc.)
            if (key.toLowerCase().includes('config') || 
                key.toLowerCase().includes('meta') || 
                key.toLowerCase().includes('settings')) {
                return;
            }

            const value = data[key];
            let manualName = key;
            let manualContent = '';

            // Se o valor é um objeto, tentar extrair título ou nome
            if (typeof value === 'object' && value !== null) {
                manualName = value.title || value.nome || value.name || key;
                manualContent = value.description || value.descricao || 'Manual disponível';
            } else if (typeof value === 'string') {
                // Se é uma string, usar como conteúdo
                manualContent = 'Manual disponível';
            }

            // Formatar nome do manual
            manualName = formatManualName(manualName);

            manuais.push({
                id: key,
                name: manualName,
                title: manualName,
                content: manualContent,
                originalData: value
            });
        });
    } catch (error) {
        console.error('Erro ao extrair manuais do documento:', error);
    }

    return manuais;
}

// Função para criar card do manual
function createManualCard(manual) {
    console.log('Criando card para:', manual);

    const card = document.createElement('a');
    card.href = `view/?const=${encodeURIComponent(manual.id)}`;
    card.className = 'manual-card';

    const title = manual.title || manual.name || formatManualName(manual.id);

    card.innerHTML = `
        <h3>${title}</h3>
    `;

    return card;
}

// Função para formatar nome do manual
function formatManualName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase().replace('-', ' ');
}

// Função principal para carregar manuais
async function loadManuals() {
    console.log('=== INICIANDO CARREGAMENTO DOS MANUAIS ===');

    // Verificar se o usuário está logado (não anônimo)
    const currentUser = auth.currentUser;
    if (!currentUser) {
        console.log('Usuário não está logado');
        showLoginRequired();
        return;
    }

    // Verificar se não é login anônimo
    if (currentUser.isAnonymous) {
        console.log('Login anônimo detectado - não permitido');
        showLoginRequired();
        return;
    }

    console.log('Usuário logado:', currentUser.email || currentUser.uid);

    try {
        showLoading();

        console.log('Acessando documento: sites/manuais');

        // Acessando o documento manuais diretamente
        const doc = await db.collection('sites').doc('manuais').get();

        console.log('Documento recebido:');
        console.log('- Existe:', doc.exists);
        console.log('- ID:', doc.id);

        if (!doc.exists) {
            console.log('Documento "manuais" não encontrado');
            showEmptyState();
            return;
        }

        const data = doc.data();
        console.log('Dados do documento:', data);

        // Verificar se o documento tem dados
        if (!data || Object.keys(data).length === 0) {
            console.log('Documento está vazio');
            showEmptyState();
            return;
        }

        // Extrair manuais dos dados do documento
        const manuais = extractManualsFromDocument(data);
        console.log('Manuais extraídos:', manuais);

        if (manuais.length === 0) {
            console.log('Nenhum manual encontrado no documento');
            showEmptyState();
            return;
        }

        // Limpar e configurar grid
        manualsGridEl.innerHTML = '';
        manualsGridEl.className = 'manuals-grid';

        // Criar cards
        console.log('=== CRIANDO CARDS ===');
        manuais.forEach((manual, index) => {
            console.log(`Criando card ${index + 1} para:`, manual.name);
            const card = createManualCard(manual);
            manualsGridEl.appendChild(card);
        });

        showManuals();
        console.log('=== MANUAIS CARREGADOS COM SUCESSO ===');

    } catch (error) {
        console.error('=== ERRO AO CARREGAR MANUAIS ===');
        console.error('Erro:', error);
        console.error('Código:', error.code);
        console.error('Mensagem:', error.message);

        // Verificar se é erro de permissão/autenticação
        if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
            showLoginRequired();
        } else {
            showError();
        }
    }
}

// Função para retry manual (chamada pelo botão)
function retryLoadManuals() {
    console.log('Tentando carregar manuais novamente...');
    loadManuals();
}

// Monitorar mudanças de estado da autenticação
auth.onAuthStateChanged((user) => {
    console.log('Estado da autenticação mudou:', user ? 'Logado' : 'Deslogado');

    if (user && !user.isAnonymous) {
        console.log('Usuário logado (não anônimo):', user.email || user.uid);
        // Carregar manuais automaticamente quando usuário logar
        loadManuals();
    } else if (user && user.isAnonymous) {
        console.log('Login anônimo detectado - não permitido');
        showLoginRequired();
    } else {
        console.log('Usuário não logado');
        showLoginRequired();
    }
});

// Inicialização quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM CARREGADO ===');
    console.log('Firebase disponível:', typeof firebase !== 'undefined');
    console.log('Firestore disponível:', typeof db !== 'undefined');
    console.log('Auth disponível:', typeof auth !== 'undefined');

    // Mostrar loading inicial enquanto verifica autenticação
    showLoading();

    // Aguardar Firebase inicializar
    setTimeout(() => {
        const currentUser = auth.currentUser;
        if (currentUser && !currentUser.isAnonymous) {
            loadManuals();
        } else {
            showLoginRequired();
        }
    }, 2000);
});

// Expor função para o botão de retry
window.retryLoadManuals = retryLoadManuals;