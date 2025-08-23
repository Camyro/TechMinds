// Adicione este JavaScript ao final do seu arquivo script.js ou em uma nova tag script



class Timer {
    constructor() {
        this.totalTime = 300; // 300 segundos
        this.currentTime = this.totalTime;
        this.isRunning = false;
        this.isPaused = false;
        this.interval = null;

        this.display = document.getElementById('timer-display');
        this.status = document.getElementById('timer-status');
        this.startBtn = document.getElementById('start-timer');
        this.pauseBtn = document.getElementById('pause-timer');
        this.resetBtn = document.getElementById('reset-timer');

        // VERIFICAÇÃO
        if (!this.display) {
            console.error("Elemento timer-display não encontrado!");
            return;
        }

        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.isPaused = false;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.status.textContent = 'Timer iniciado...';

            this.interval = setInterval(() => {
                this.currentTime--;
                this.updateDisplay();

                if (this.currentTime <= 0) {
                    this.finish();
                }
            }, 1000);
        }
    }

    pause() {
        if (this.isRunning && !this.isPaused) {
            this.isPaused = true;
            this.isRunning = false;
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.status.textContent = 'Timer pausado';
            clearInterval(this.interval);
        }
    }

    reset() {
        // Para o timer completamente primeiro
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        // Reseta todos os estados
        this.isRunning = false;
        this.isPaused = false;
        this.currentTime = this.totalTime;

        console.log("Reset - currentTime:", this.currentTime); // DEBUG

        // Reseta os botões
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;

        // Reseta o visual
        this.status.textContent = 'Pronto para iniciar';
        this.display.classList.remove('timer-finished');

        // Verificação segura para o timer-section
        const timerSection = document.querySelector('.timer-section');
        if (timerSection) {
            timerSection.classList.remove('timer-finished');
        }

        // Atualiza o display
        this.updateDisplay();
        console.log("Display text:", this.display.textContent); // DEBUG
    }

    finish() {
        this.isRunning = false;
        this.isPaused = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.status.textContent = '⏰ Tempo esgotado!';
        this.display.classList.add('timer-finished');
        clearInterval(this.interval);

        // Notificação
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Tech Minds Calculator', {
                body: 'Tempo de 300 segundos esgotado!',
                icon: '/favicon.ico'
            });
        }
    }

    updateDisplay() {
        this.display.textContent = this.currentTime.toString();
        console.log("Atualizando display para:", this.currentTime); // DEBUG
    }
}

// Inicializa o timer quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    // Solicita permissão para notificações
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // Cria o timer
    const timer = new Timer();
});