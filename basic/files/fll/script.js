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
    errorMessage.textContent = 'Erro ao carregar os arquivos. Tente novamente.';

    // Mostrar botão de retry
    const retryBtn = errorEl.querySelector('.timer-btn');
    retryBtn.style.display = 'inline-block';
}

function showManuals() {
    console.log('Mostrando arquivos...');
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

// Função melhorada para validar se um link é válido
function isValidUrl(string) {
    if (!string || typeof string !== 'string') return false;

    try {
        new URL(string);
        return true;
    } catch (_) {
        // Verificar se é um link mega.nz incompleto ou outros padrões válidos
        if (string.includes('mega.nz') || 
            string.includes('drive.google.com') || 
            string.includes('dropbox.com') ||
            string.startsWith('http://') || 
            string.startsWith('https://')) {
            return true;
        }
        return false;
    }
}

// Função para extrair manuais dos dados do documento
function extractManualsFromDocument(data) {
    const manuais = [];

    try {
        console.log('Extraindo arquivos dos dados do documento:', data);

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
            let manualLink = '';
            let manualDescription = '';

            console.log(`Processando item "${key}":`, value);

            // Se o valor é um objeto, tentar extrair link e outras informações
            if (typeof value === 'object' && value !== null) {
                // Priorizar title, depois name, depois nome, e só usar a chave como último recurso
                manualName = value.title || value.name || value.nome || key;
                manualLink = value.link || value.url || value.href || '';
                manualDescription = value.description || value.descricao || value.desc || '';

                // Log para debug
                console.log(`- Nome encontrado no objeto: "${value.title || value.name || value.nome || 'não encontrado'}"`);
                console.log(`- Chave do documento: "${key}"`);
                console.log(`- Nome que será usado: "${manualName}"`);
                console.log(`- Link extraído: "${manualLink}"`);
                console.log(`- Descrição extraída: "${manualDescription}"`);
            } else if (typeof value === 'string') {
                // Se é uma string, verificar se é um link válido
                if (isValidUrl(value)) {
                    manualLink = value;
                } else {
                    // Se não é um link, usar como descrição
                    manualDescription = value;
                }
            }

            // Pular itens que não têm título válido no objeto
            if (typeof value === 'object' && value !== null) {
                if (!value.title && !value.name && !value.nome) {
                    console.warn(`Item "${key}" não possui título válido (title, name ou nome):`, value);
                    return;
                }
            }

            // Validação do link
            if (!manualLink || !isValidUrl(manualLink)) {
                console.warn(`Item "${key}" não possui link válido:`, manualLink);
                return;
            }

            // Formatar nome do manual
            const formattedName = formatManualName(manualName);

            manuais.push({
                id: key,
                name: formattedName,
                title: formattedName,
                link: manualLink,
                description: manualDescription || 'Arquivo disponível',
                originalData: value
            });

            console.log(`✓ Manual adicionado: "${formattedName}" - ${manualLink}`);
        });
    } catch (error) {
        console.error('Erro ao extrair arquivos do documento:', error);
    }

    return manuais;
}

// Função para criar card do manual
function createManualCard(manual) {
    console.log('Criando card para:', manual);

    const card = document.createElement('div');
    card.className = 'manual-card';
    card.style.cursor = 'pointer';

    const title = manual.title;
    const description = manual.description || 'Clique para acessar o arquivo';

    card.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
    `;

    // Adicionar evento de clique para redirecionar
    card.addEventListener('click', () => {
        console.log(`Redirecionando para: ${manual.link}`);

        // Verificar se o link é válido antes de redirecionar
        if (manual.link && manual.link.trim() !== '') {
            // Abrir em nova aba
            window.open(manual.link, '_blank', 'noopener,noreferrer');
        } else {
            console.error('Link inválido:', manual.link);
            alert('Link inválido ou não encontrado.');
        }
    });

    return card;
}

// Função melhorada para formatar nome do manual
function formatManualName(name) {
    if (!name || typeof name !== 'string') {
        return 'Manual sem título';
    }

    // Formatação padrão (sem adicionar prefixos para números)
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/[-_]/g, ' ');
}

// Função principal para carregar manuais
async function loadManuals() {
    console.log('=== INICIANDO CARREGAMENTO DOS ARQUIVOS FLL ===');

    try {
        showLoading();

        console.log('Acessando documento: files/FLL');

        // Acessando o documento FLL na collection "files"
        const doc = await db.collection('files').doc('FLL').get();

        console.log('Documento recebido:');
        console.log('- Existe:', doc.exists);
        console.log('- ID:', doc.id);

        if (!doc.exists) {
            console.log('Documento "FLL" não encontrado');
            showEmptyState();
            return;
        }

        const data = doc.data();
        console.log('Dados completos do documento:', JSON.stringify(data, null, 2));

        // Verificar se o documento tem dados
        if (!data || Object.keys(data).length === 0) {
            console.log('Documento está vazio');
            showEmptyState();
            return;
        }

        // Extrair manuais dos dados do documento
        const manuais = extractManualsFromDocument(data);
        console.log('Arquivos extraídos:', manuais);

        if (manuais.length === 0) {
            console.log('Nenhum arquivo válido encontrado no documento');

            // Debug: mostrar todos os campos do documento
            console.log('Campos disponíveis no documento:', Object.keys(data));
            console.log('Valores dos campos:', Object.values(data));

            showEmptyState();
            return;
        }

        // Limpar e configurar grid
        manualsGridEl.innerHTML = '';
        manualsGridEl.className = 'manuals-grid';

        // Criar cards
        console.log('=== CRIANDO CARDS ===');
        manuais.forEach((manual, index) => {
            console.log(`Criando card ${index + 1} para: "${manual.name}" - Link: "${manual.link}"`);
            const card = createManualCard(manual);
            manualsGridEl.appendChild(card);
        });

        showManuals();
        console.log(`=== ${manuais.length} ARQUIVOS FLL CARREGADOS COM SUCESSO ===`);

    } catch (error) {
        console.error('=== ERRO AO CARREGAR ARQUIVOS FLL ===');
        console.error('Erro:', error);
        console.error('Código:', error.code);
        console.error('Mensagem:', error.message);

        showError();
    }
}

// Função para retry manual (chamada pelo botão)
function retryLoadManuals() {
    console.log('Tentando carregar arquivos novamente...');
    loadManuals();
}

// Inicialização quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM CARREGADO ===');
    console.log('Firebase disponível:', typeof firebase !== 'undefined');
    console.log('Firestore disponível:', typeof db !== 'undefined');

    // Iniciar carregamento dos arquivos imediatamente
    loadManuals();
});

// Expor função para o botão de retry
window.retryLoadManuals = retryLoadManuals;