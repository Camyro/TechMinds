// Firebase database instance
const db = firebase.firestore();

let todasPontuacoes = [];
let rankingData = [];

// Carregar dados quando a página carrega
document.addEventListener('DOMContentLoaded', function () {
    carregarDados();
});

// Função para carregar dados do Firestore
async function carregarDados() {
    try {
        const snapshot = await db.collection("pontosOBR").orderBy("data", "desc").get();
        todasPontuacoes = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            todasPontuacoes.push({
                id: doc.id,
                ...data
            });
        });

        exibirEstatisticas();
        exibirPontuacoes();
        criarRanking();

        document.getElementById('loading').style.display = 'none';
        document.getElementById('pontuacoes-container').style.display = 'block';

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        document.getElementById('loading').innerHTML = '<p>Erro ao carregar dados: ' + error.message + '</p>';
    }
}

// Exibir estatísticas
function exibirEstatisticas() {
    const totalAvaliacoes = todasPontuacoes.length;
    const usuariosUnicos = new Set(todasPontuacoes.map(p => p.email)).size;
    const pontuacaoMedia = Math.round(todasPontuacoes.reduce((sum, p) => sum + p.pontosOBR, 0) / totalAvaliacoes) || 0;
    const maiorPontuacao = Math.max(...todasPontuacoes.map(p => p.pontosOBR)) || 0;

    document.getElementById('total-avaliacoes').textContent = totalAvaliacoes;
    document.getElementById('usuarios-unicos').textContent = usuariosUnicos;
    document.getElementById('pontuacao-media').textContent = pontuacaoMedia;
    document.getElementById('maior-pontuacao').textContent = maiorPontuacao;
}

// Exibir lista de pontuações
function exibirPontuacoes() {
    const container = document.getElementById('pontuacoes-container');
    container.innerHTML = '';

    todasPontuacoes.forEach((pontuacao, index) => {
        const item = document.createElement('div');
        item.className = 'pontuacao-item';
        item.onclick = () => mostrarDetalhes(pontuacao, index);

        const data = new Date(pontuacao.data).toLocaleString('pt-BR');

        item.innerHTML = `
            <div class="pontuacao-info">
                <div class="email">${pontuacao.email}</div>
                <div class="data">${data}</div>
            </div>
            <div class="pontuacao">${pontuacao.pontosOBR}</div>
        `;

        container.appendChild(item);
    });
}

// Criar ranking
function criarRanking() {
    // Agrupar por email e pegar a pontuação mais recente de cada
    const usuariosMap = new Map();

    todasPontuacoes.forEach(pontuacao => {
        if (!usuariosMap.has(pontuacao.email) ||
            new Date(pontuacao.data) > new Date(usuariosMap.get(pontuacao.email).data)) {
            usuariosMap.set(pontuacao.email, pontuacao);
        }
    });

    // Converter para array e ordenar por pontuação
    rankingData = Array.from(usuariosMap.values())
        .sort((a, b) => b.pontosOBR - a.pontosOBR);

    exibirRanking();
}

// Exibir ranking
function exibirRanking() {
    const container = document.getElementById('ranking-container');
    container.innerHTML = '';

    rankingData.forEach((pontuacao, index) => {
        const item = document.createElement('div');
        item.className = 'ranking-item';

        const posicao = index + 1;
        let rankClass = 'rank-other';
        if (posicao === 1) rankClass = 'rank-1';
        else if (posicao === 2) rankClass = 'rank-2';
        else if (posicao === 3) rankClass = 'rank-3';

        const data = new Date(pontuacao.data).toLocaleString('pt-BR');

        item.innerHTML = `
            <div class="rank-position ${rankClass}">${posicao}</div>
            <div class="rank-info">
                <div class="email">${pontuacao.email}</div>
                <div class="data">Última avaliação: ${data}</div>
            </div>
            <div class="pontuacao">${pontuacao.pontosOBR}</div>
        `;

        container.appendChild(item);
    });
}

// Mostrar detalhes da pontuação
function mostrarDetalhes(pontuacao, index) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');

    // Encontrar próxima pontuação do mesmo usuário para comparação
    const proximaPontuacao = encontrarProximaPontuacao(pontuacao.email, pontuacao.data);

    const data = new Date(pontuacao.data).toLocaleString('pt-BR');

    let comparacaoHTML = '';
    if (proximaPontuacao) {
        const diferenca = pontuacao.pontosOBR - proximaPontuacao.pontosOBR;
        const classDiferenca = diferenca > 0 ? 'positiva' : diferenca < 0 ? 'negativa' : 'neutro';
        const sinal = diferenca > 0 ? '+' : '';
        const dataProxima = new Date(proximaPontuacao.data).toLocaleString('pt-BR');

        comparacaoHTML = `
            <div class="comparacao">
                <h4>Comparação com a Pontuação Anterior</h4>
                <p><strong>Pontuação anterior:</strong> ${proximaPontuacao.pontosOBR} pontos (${dataProxima})</p>
                <p><strong>Diferença:</strong> <span class="diferenca ${classDiferenca}">${sinal}${diferenca} pontos</span></p>
            </div>
        `;
    }

    modalBody.innerHTML = `
        <div>
            <p><strong>Email:</strong> ${pontuacao.email}</p>
            <p><strong>Data:</strong> ${data}</p>
            <p><strong>Pontuação Total:</strong> <span style="font-size: 1.5em; color: #8d2c2c; font-weight: bold;">${pontuacao.pontosOBR}</span></p>
        </div>

        <div class="detalhes-grid">
            <div class="detalhes-section">
                <h4>Ladrilhos</h4>
                <div class="detalhe-item">
                    <span>Primeira Tentativa:</span>
                    <span>${pontuacao.lista?.ladrilhos1 || 0}</span>
                </div>
                <div class="detalhe-item">
                    <span>Segunda Tentativa:</span>
                    <span>${pontuacao.lista?.ladrilhos2 || 0}</span>
                </div>
                <div class="detalhe-item">
                    <span>Terceira Tentativa:</span>
                    <span>${pontuacao.lista?.ladrilhos3 || 0}</span>
                </div>
            </div>

            <div class="detalhes-section">
                <h4>Perigos</h4>
                <div class="detalhe-item">
                    <span>Beco sem Saída:</span>
                    <span>${pontuacao.lista?.becoSaida || 0}</span>
                </div>
                <div class="detalhe-item">
                    <span>Gangorra:</span>
                    <span>${pontuacao.lista?.gangorra || 0}</span>
                </div>
                <div class="detalhe-item">
                    <span>Obstáculo:</span>
                    <span>${pontuacao.lista?.obstaculo || 0}</span>
                </div>
                <div class="detalhe-item">
                    <span>Gap:</span>
                    <span>${pontuacao.lista?.gap || 0}</span>
                </div>
                <div class="detalhe-item">
                    <span>Rampa:</span>
                    <span>${pontuacao.lista?.rampa || 0}</span>
                </div>
                <div class="detalhe-item">
                    <span>Lombada:</span>
                    <span>${pontuacao.lista?.lombada || 0}</span>
                </div>
            </div>

            <div class="detalhes-section">
                <h4>Resgate</h4>
                <div class="detalhe-item">
                    <span>Área Verde - Vítima Viva 1:</span>
                    <span>${pontuacao.lista?.vitimaVivaVerde1 ? '✅' : '❌'}</span>
                </div>
                <div class="detalhe-item">
                    <span>Área Verde - Vítima Viva 2:</span>
                    <span>${pontuacao.lista?.vitimaVivaVerde2 ? '✅' : '❌'}</span>
                </div>
                <div class="detalhe-item">
                    <span>Área Verde - Vítima Morta:</span>
                    <span>${pontuacao.lista?.vitimaMortaVerde ? '✅' : '❌'}</span>
                </div>
                <div class="detalhe-item">
                    <span>Área Vermelha - Vítima Viva 1:</span>
                    <span>${pontuacao.lista?.vitimaVivaVermelha1 ? '✅' : '❌'}</span>
                </div>
                <div class="detalhe-item">
                    <span>Área Vermelha - Vítima Viva 2:</span>
                    <span>${pontuacao.lista?.vitimaVivaVermelha2 ? '✅' : '❌'}</span>
                </div>
                <div class="detalhe-item">
                    <span>Área Vermelha - Vítima Morta:</span>
                    <span>${pontuacao.lista?.vitimaMortaVermelha ? '✅' : '❌'}</span>
                </div>
            </div>

            <div class="detalhes-section">
                <h4>Outros</h4>
                <div class="detalhe-item">
                    <span>Saiu do Ladrilho Inicial:</span>
                    <span>${pontuacao.lista?.inicio ? '✅' : '❌'}</span>
                </div>
                <div class="detalhe-item">
                    <span>Desafio Surpresa:</span>
                    <span>${pontuacao.lista?.desafioSurpresa ? '✅' : '❌'}</span>
                </div>
                <div class="detalhe-item">
                    <span>Final Completo:</span>
                    <span>${pontuacao.lista?.finalCompleto ? '✅' : '❌'}</span>
                </div>
                <div class="detalhe-item">
                    <span>Tentativas Último Checkpoint:</span>
                    <span>${pontuacao.lista?.tentativasUltimoCheckpoint || 0}</span>
                </div>
            </div>
        </div>

        ${comparacaoHTML}
    `;

    modal.style.display = 'block';
}

// Encontrar próxima pontuação do mesmo usuário
function encontrarProximaPontuacao(email, dataAtual) {
    const pontuacoesUsuario = todasPontuacoes
        .filter(p => p.email === email && new Date(p.data) < new Date(dataAtual))
        .sort((a, b) => new Date(b.data) - new Date(a.data));

    return pontuacoesUsuario[0] || null;
}

// Trocar abas
function showTab(tabName) {
    // Remover active de todas as abas
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Ativar aba selecionada
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Fechar modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Fechar modal clicando fora
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}