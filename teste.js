// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    findTransactions();
});

function findTransactions() {
    // Verifica se o Firebase está inicializado e se firestore está disponível
    if (typeof firebase === 'undefined' || !firebase.firestore) {
        console.error('Firebase ou Firestore não inicializado.');
        addTransactionsToScreen([{site: 'Erro: Firebase não inicializado'}]);
        return;
    }

    firebase.firestore()
        .collection('teste')
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                addTransactionsToScreen([{site: 'Nenhum dado encontrado'}]);
                return;
            }
            const teste = snapshot.docs.map(doc => doc.data());
            addTransactionsToScreen(teste);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
            addTransactionsToScreen([{site: 'Erro ao carregar dados: ' + error.message}]);
        });
}

function addTransactionsToScreen(teste) {
    // Verifica se document.getElementById retorna um elemento antes de tentar acessá-lo
    var element = document.getElementById('element');
    if (element && teste.length > 0) {
        element.innerHTML = teste[0].site || 'Dados não encontrados';
    } else if (!element) {
        console.error('Elemento com id "element" não encontrado no DOM.');
    }
}

// Função para obter uma cor aleatória para os confetes
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Função para criar confetes
function createConfetti() {
    // Verifica se o body existe antes de adicionar elementos
    if (!document.body) {
        return;
    }

    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    confetti.style.backgroundColor = getRandomColor();
    document.body.appendChild(confetti);

    // Remove o confete após a animação
    setTimeout(() => {
        if (confetti.parentNode) {
            confetti.remove();
        }
    }, 5000);
}

// Função para iniciar a animação de confetes
function startConfetti() {
    // Cria confetes em intervalos regulares
    for (let i = 0; i < 20; i++) { // Ajuste o número de confetes conforme necessário
        setTimeout(createConfetti, i * 100); // Intervalo entre a criação de cada confete
    }
}

// Inicia os confetes quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    startConfetti();
});

// Fallback para window.load caso DOMContentLoaded já tenha passado
window.addEventListener('load', () => {
    if (document.body) {
        startConfetti();
    }
});