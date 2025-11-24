// Поиск и фильтрация публикаций
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('publication-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        const publications = document.querySelectorAll('.publication');
        let visibleCount = 0;

        publications.forEach(pub => {
            const text = pub.textContent.toLowerCase();
            const matches = text.includes(searchTerm) || searchTerm === '';

            if (matches) {
                pub.style.display = 'block';
                pub.style.opacity = '1';
                visibleCount++;
            } else {
                pub.style.display = 'none';
            }
        });

        // Обновляем сообщение о результатах
        const searchResults = document.getElementById('search-results');
        if (searchTerm) {
            searchResults.textContent = visibleCount === 0
                ? 'Публикации не найдены'
                : 'Найдено: ' + visibleCount;
        } else {
            searchResults.textContent = '';
        }
    });
});
