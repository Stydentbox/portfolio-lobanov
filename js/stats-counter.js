// Анимация счётчиков статистики
document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.stat-counter');

    // Функция для проверки видимости элемента
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    // Функция для анимации счётчика
    function animateCounter(counter) {
        if (counter.dataset.animated) return; // Если уже анимирован, пропускаем

        const targetCount = parseInt(counter.dataset.count, 10);
        let currentCount = 0;
        const duration = 2000; // Длительность анимации в миллисекундах
        const steps = 60;
        const increment = targetCount / steps;
        const stepDuration = duration / steps;

        const interval = setInterval(() => {
            currentCount += increment;
            if (currentCount >= targetCount) {
                counter.textContent = targetCount;
                clearInterval(interval);
                counter.dataset.animated = 'true';
            } else {
                counter.textContent = Math.floor(currentCount);
            }
        }, stepDuration);
    }

    // Функция для проверки и запуска анимации
    function checkCountersVisibility() {
        counters.forEach(counter => {
            if (isElementInViewport(counter) && !counter.dataset.animated) {
                animateCounter(counter);
            }
        });
    }

    // Слушатель события scroll
    window.addEventListener('scroll', checkCountersVisibility);

    // Проверим видимость при загрузке страницы
    checkCountersVisibility();
});
