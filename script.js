var element = document.getElementById('menu');
var centro = document.getElementById('centro');
var terra = document.getElementById('terra');

firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        element.innerHTML = `<h1>TechMinds</h1>
        <a href="login/"><button>Login</button></a>`;
    } else{
        element.innerHTML = `<h1>TechMinds</h1>
        <div class="user-info">
            <span class="user-email">${user.email}</span>
            <button type="button" class="clear" onclick="logout()">Sair</button>
        </div>`;

        terra.innerHTML = `<section class="p2">
        <div class="centro">
            <a href="ultra/scorecalculator/">
                <div class="botaoGrande" id="botaoGrande1">
                    <img src="img/calculadoraultra.png" class="botaoimg" alt="spike">
                    <p>Calculadora Ultra</p>
                </div>
            </a>
        </div>

        </section>`;
        
        centro.innerHTML = `
        <div class="footer-content">
                <br>
                <p>&copy; 2025 TechMinds. Todos os direitos reservados.</p>
                <p>Desenvolvido por C1Studios</p>
            </div>`;
    }
})

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}