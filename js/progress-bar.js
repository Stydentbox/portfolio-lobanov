// Прогресс-бар прокрутки страницы
class ProgressBar {
    constructor() {
        this.progressBar = document.querySelector('.progress-bar');
        if (\!this.progressBar) {
            this.createProgressBar();
        }
        this.init();
    }

    createProgressBar() {
        const bar = document.createElement('div');
        bar.className = 'progress-bar';
        document.body.insertBefore(bar, document.body.firstChild);
        this.progressBar = bar;
    }

    init() {
        window.addEventListener('scroll', () => this.updateProgress());
    }

    updateProgress() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollTop = window.scrollY;
        const progress = (scrollTop / windowHeight) * 100;
        
        this.progressBar.style.width = progress + '%';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProgressBar();
});
