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
    var element = document.getElementById('element');
    if (element && teste.length > 0) {
        element.innerHTML = teste[0].site || 'Dados não encontrados';
    } else if (!element) {
        console.error('Elemento com id "element" não encontrado no DOM.');
    }
}