var element = document.getElementById('menu');

firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        element.innerHTML = `<h1>TechMinds</h1>
        <a href="login"><button>Login</button></a>`;
    } else{
        element.innerHTML = `<h1>TechMinds</h1>
        <div class="user-info">
            <span class="user-email">${user.email}</span>
            <button type="button" class="clear" onclick="logout()">Sair</button>
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