// Переключение темы (светлая/тёмная)
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        this.loadTheme();
        this.attachEventListener();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateToggleButton(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateToggleButton(newTheme);
    }

    updateToggleButton(theme) {
        this.themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    }

    attachEventListener() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});
