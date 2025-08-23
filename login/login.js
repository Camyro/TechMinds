firebase.auth().onAuthStateChanged(user => {
    if (user) {
        window.location.href = "../";
    }
})

function onChangeEmail() {
    //Verifica o email
    toggleButtonsDisable();
    toggleEmailErrors();
    toggleRecoverPasswordButton(); // Adiciona controle do botão de recuperar senha
}

function onChangePassword() {
    //Verifica a senha
    toggleButtonsDisable();
    togglePasswordErrors();
}

function login() {
    firebase.auth().signInWithEmailAndPassword(
        form.email().value, form.password().value
    ).then(response => {
        window.location.href = "../";
    }).catch(error => {
        alert(getErrorMessage(error));
    });
}

function getErrorMessage(error) {
    if (error.code == "auth/user-not-found") {
        return "Usuário não encontrado";
    }
    if (error.code == "auth/invalid-email") {
        return "Email inválido";
    }
    if (error.code == "auth/user-disabled") {
        return "Usuário desabilitado";
    }
    return error.message;
}

function toggleEmailErrors() {
    //Verifica se o email está vazio
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";

    form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block";
}

function togglePasswordErrors() {
    //Verifica se a senha está vazia
    const password = form.password().value;
    form.passwordRequiredError().style.display = password ? "none" : "block";
}

function toggleButtonsDisable() {
    //habilita ou desabilita o botão de login
    const emailValid = isEmailValid();
    const passwordValid = isPasswordValid();
    const loginButton = form.loginButton();

    if (loginButton) {
        loginButton.disabled = !emailValid || !passwordValid;
    }
}

// Nova função para controlar o botão de recuperar senha
function toggleRecoverPasswordButton() {
    const emailValid = isEmailValid();
    const recoverButton = form.recoverPasswordButton();

    if (recoverButton) {
        recoverButton.disabled = !emailValid;
    }
}

function isEmailValid() {
    //Verifica se o email é válido
    const email = form.email().value;
    if (!email) {
        return false;
    }
    return validateEmail(email);
}

function isPasswordValid() {
    //Verifica se a senha é válida
    return form.password().value ? true : false;
}

// Função validateEmail caso não exista em validations.js
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Funções de loading simuladas (substitua por suas implementações reais)
function showLoading() {
    const recoverButton = form.recoverPasswordButton();
    if (recoverButton) {
        recoverButton.disabled = true;
        recoverButton.textContent = "Enviando...";
    }
}

function hideLoading() {
    const recoverButton = form.recoverPasswordButton();
    if (recoverButton) {
        recoverButton.disabled = isEmailValid() ? false : true;
        recoverButton.textContent = "Recuperar senha";
    }
}

const form = {
    email: () => document.getElementById("email"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    loginButton: () => document.getElementById("login-button"),
    password: () => document.getElementById("password"),
    passwordRequiredError: () => document.getElementById("password-required-error"),
    recoverPasswordButton: () => document.getElementById("recover-password-button"),
}

function recoverPassword() {
    const email = form.email().value;

    // Validação antes de enviar
    if (!email) {
        alert("Por favor, digite seu email primeiro.");
        return;
    }

    if (!validateEmail(email)) {
        alert("Por favor, digite um email válido.");
        return;
    }

    showLoading();

    firebase.auth().sendPasswordResetEmail(email).then(() => {
        hideLoading();
        alert('Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
    }).catch(error => {
        hideLoading();
        alert(getErrorMessage(error));
    });
}

// Inicializar o estado dos botões quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    toggleButtonsDisable();
    toggleRecoverPasswordButton();
});

function register() {
    window.location.href = "https://forms.gle/dN9LfYrZAK3x7yV56";
}