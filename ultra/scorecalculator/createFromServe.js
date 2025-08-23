// Script para enviar pontuação para Firebase Firestore (compatível com Firebase v8)

// Variável para armazenar o ID do documento atual (será perdido ao recarregar a página)
let documentoAtualId = null;

// Função para obter o email do usuário logado
function obterEmailUsuario() {
    if (!firebase.auth) {
        return "firebase-auth-indisponivel";
    }

    const user = firebase.auth().currentUser;
    if (user && user.email) {
        return user.email;
    } else {
        return "usuario-nao-logado";
    }
}

// Função para coletar todos os dados do formulário
function coletarDados() {
    // Pegar a pontuação diretamente do elemento #resultado
    const pontuacaoElement = document.getElementById('resultado');
    const pontuacaoTotal = Math.round(parseFloat(pontuacaoElement.textContent) || 0);

    return {
        data: new Date().toISOString(),
        email: obterEmailUsuario(),
        lista: {
            // Ladrilhos
            ladrilhos1: parseInt(document.getElementById('ladrilhoDe1').value) || 0,
            ladrilhos2: parseInt(document.getElementById('ladrilhoDe2').value) || 0,
            ladrilhos3: parseInt(document.getElementById('ladrilhoDe3').value) || 0,

            // Perigos
            becoSaida: parseInt(document.getElementById('BecoESaida').value) || 0,
            gangorra: parseInt(document.getElementById('Gangorra').value) || 0,
            obstaculo: parseInt(document.getElementById('obstaculo').value) || 0,
            gap: parseInt(document.getElementById('gap').value) || 0,
            rampa: parseInt(document.getElementById('rampa').value) || 0,
            lombada: parseInt(document.getElementById('lombada').value) || 0,

            // Checkboxes
            inicio: document.getElementById('inicio').checked,
            vitimaVivaVerde1: document.getElementById('GG').checked,
            vitimaVivaVerde2: document.getElementById('GG2').checked,
            vitimaMortaVerde: document.getElementById('GR').checked,
            vitimaVivaVermelha1: document.getElementById('RG').checked,
            vitimaVivaVermelha2: document.getElementById('RG2').checked,
            vitimaMortaVermelha: document.getElementById('RR').checked,
            desafioSurpresa: document.getElementById('desafio').checked,
            finalCompleto: document.getElementById('final').checked,

            // Tentativas
            tentativasUltimoCheckpoint: parseInt(document.getElementById('tentativas').value) || 0
        },
        pontos: pontuacaoTotal
    };
}

// Função para enviar dados para o Firestore (Firebase v8)
function enviarParaServidor() {
    // Verificar se Firebase está disponível
    if (typeof firebase === 'undefined') {
        alert('Firebase não está carregado. Verifique a conexão.');
        return;
    }

    // Verificar se Firestore está disponível
    if (!firebase.firestore) {
        alert('Firestore não está disponível. Verifique se firebase-firestore.js foi carregado.');
        return;
    }

    // Verificar se a pontuação é maior que 0
    const pontuacaoElement = document.getElementById('resultado');
    const pontuacao = Math.round(parseFloat(pontuacaoElement.textContent) || 0);

    if (pontuacao <= 0) {
        alert('Não é possível enviar dados com pontuação igual a 0. Complete a avaliação primeiro.');
        return;
    }

    const btnSalvar = document.getElementById('btn-salvar');
    const textoOriginal = btnSalvar.textContent;
    const emailUsuario = obterEmailUsuario();

    try {
        // Mostrar loading no botão
        btnSalvar.textContent = 'Enviando...';
        btnSalvar.disabled = true;

        // Coletar dados
        const dados = coletarDados();

        // Usar Firebase v8 sintaxe
        const db = firebase.firestore();

        // Se já existe um documento ID, atualizar. Caso contrário, criar novo
        if (documentoAtualId) {
            // Atualizar documento existente
            db.collection("pontos").doc(documentoAtualId).set(dados)
                .then(() => {
                    console.log("Documento atualizado com ID: ", documentoAtualId);
                    alert(`Dados atualizados com sucesso! Email: ${emailUsuario}`);
                })
                .catch((error) => {
                    console.error("Erro ao atualizar documento: ", error);
                    alert('Erro ao atualizar dados: ' + error.message);
                })
                .finally(() => {
                    // Restaurar botão
                    btnSalvar.textContent = textoOriginal;
                    btnSalvar.disabled = false;
                });
        } else {
            // Criar novo documento
            db.collection("pontos").add(dados)
                .then((docRef) => {
                    documentoAtualId = docRef.id; // Salvar ID para próximas atualizações
                    console.log("Documento criado com ID: ", docRef.id);
                    alert(`Dados enviados com sucesso! Email: ${emailUsuario}`);
                })
                .catch((error) => {
                    console.error("Erro ao salvar documento: ", error);
                    alert('Erro ao enviar dados: ' + error.message);
                })
                .finally(() => {
                    // Restaurar botão
                    btnSalvar.textContent = textoOriginal;
                    btnSalvar.disabled = false;
                });
        }

    } catch (error) {
        console.error("Erro ao enviar dados: ", error);
        alert('Erro ao enviar dados: ' + error.message);
        btnSalvar.textContent = textoOriginal;
        btnSalvar.disabled = false;
    }
}

// Função opcional para limpar formulário
function limparFormulario() {
    // Limpar inputs numéricos
    const inputs = ['ladrilhoDe1', 'ladrilhoDe2', 'ladrilhoDe3', 'BecoESaida', 'Gangorra', 
                   'obstaculo', 'gap', 'rampa', 'lombada', 'tentativas'];
    inputs.forEach(id => {
        document.getElementById(id).value = '';
    });

    // Limpar checkboxes
    const checkboxes = ['inicio', 'GG', 'GG2', 'GR', 'RG', 'RG2', 'RR', 'desafio', 'final'];
    checkboxes.forEach(id => {
        document.getElementById(id).checked = false;
    });
}

// Aguardar DOM e Firebase estarem carregados
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar Firebase estar totalmente carregado
    setTimeout(() => {
        // Event listener para o botão de enviar
        const btnSalvar = document.getElementById('btn-salvar');
        if (btnSalvar) {
            btnSalvar.addEventListener('click', enviarParaServidor);
        }
    }, 500);
});