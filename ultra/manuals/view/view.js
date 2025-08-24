// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    findTransactions();
});

function findTransactions() {
    // Verifica se o Firebase está inicializado e se firestore está disponível
    if (typeof firebase === 'undefined' || !firebase.firestore) {
        console.error('Firebase ou Firestore não inicializado.');
        addTransactionsToScreen([{ site: 'Erro: Firebase não inicializado' }]);
        return;
    }

    firebase.firestore()
        .collection('sites')
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                addTransactionsToScreen([{ site: 'Nenhum dado encontrado' }]);
                return;
            }
            const teste = snapshot.docs.map(doc => doc.data());
            addTransactionsToScreen(teste);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
            addTransactionsToScreen([{ site: 'Erro ao carregar dados: ' + error.message }]);
        });
}

function addTransactionsToScreen(teste) {
    // Obter parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const siteParam = urlParams.get('const');
    console.info("const is " + siteParam);

    var element = document.getElementById('element');
    if (element && teste.length > 0) {
        const propertyName = siteParam; // Se siteParam estiver presente, use isso, caso contrário, use 'site'
        const siteValue = teste[0][propertyName] || 'Dados não encontrados'; // Acessa a propriedade dinamicamente
        document.getElementById("title").innerHTML = propertyName + " - View Ultra" || 'Erro - View Ultra';
        document.getElementById("titlePage").innerHTML = propertyName + " - View Ultra" || 'Erro - View Ultra';
        element.innerHTML = siteValue;
    } else if (!element) {
        console.error('Elemento com id "element" não encontrado no DOM.');
    }
}