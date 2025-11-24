// Анимация счетчиков статистики
class StatisticsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-counter');
        this.init();
    }

    init() {
        if (this.counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && \!entry.target.classList.contains('animated')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target')) || 0;
        const duration = 1500;
        const steps = 60;
        const increment = target / steps;
        let current = 0;

        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(interval);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, duration / steps);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StatisticsCounter();
});
