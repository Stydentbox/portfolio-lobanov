// Поиск и фильтрация публикаций
class PublicationFilter {
    constructor() {
        this.searchInput = document.getElementById('publication-search');
        this.publications = document.querySelectorAll('.publication');
        this.init();
    }

    init() {
        if (\!this.searchInput) return;

        this.searchInput.addEventListener('input', (e) => this.filterPublications(e.target.value));
    }

    filterPublications(query) {
        const searchTerm = query.toLowerCase().trim();

        this.publications.forEach(pub => {
            const text = pub.textContent.toLowerCase();
            const matches = text.includes(searchTerm);
            
            pub.style.display = matches ? 'flex' : 'none';
            if (matches && searchTerm) {
                pub.style.opacity = '1';
                pub.style.animation = 'fadeIn 0.3s ease';
            }
        });

        this.updateResultsMessage(searchTerm);
    }

    updateResultsMessage(query) {
        let resultsDiv = document.getElementById('search-results');
        if (\!resultsDiv) {
            resultsDiv = document.createElement('div');
            resultsDiv.id = 'search-results';
            this.searchInput.parentNode.appendChild(resultsDiv);
        }

        if (\!query) {
            resultsDiv.textContent = '';
            return;
        }

        const visibleCount = Array.from(this.publications).filter(pub => 
            pub.style.display \!== 'none'
        ).length;

        resultsDiv.textContent = visibleCount === 0 
            ? 'Публикации не найдены' 
            : 'Найдено: ' + visibleCount;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PublicationFilter();
});
