firebase.auth().onAuthStateChanged(user => {
    if (user) {
        window.location.href = "../";
    }
})

function onChangeEmail() {
    //Verifica o email
    toggleButtonsDisable();
    toggleEmailErrors();
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
        return "Usuário nao encontrado";
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
    //abilita ou desabilita o botão de login
    const emailValid = isEmailValid();
    const passwordValid = isPasswordValid();
    const loginButton = form.loginButton();

    if (loginButton) {
        loginButton.disabled = !emailValid || !passwordValid;
    }
}

function isEmailValid() {
    //Verifica se o email é valido
    const email = form.email().value;
    if (!email) {
        return false;
    }
    return validateEmail(email);
}

function isPasswordValid() {
    //Verifica se a senha é valida
    return form.password().value ? true : false;
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