// Динамическая загрузка новых достижений из achievements-data.json
document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('new-achievements');
    if (!container) return;

    fetch('data/achievements-data.json')
        .then(r => r.json())
        .then(data => render(data.achievements || []))
        .catch(() => render([]));

    function render(items) {
        if (!items.length) {
            container.style.display = 'none';
            return;
        }

        const sorted = [...items].sort((a, b) => b.year - a.year);

        const levelLabel = {
            'international': '<div class="badge international">🌍 Международный</div>',
            'national':      '<div class="badge national">🇲🇩 Республика</div>',
            'regional':      '<div class="badge regional">📍 Региональный</div>'
        };

        container.innerHTML = '<h2>Новые достижения</h2>' + sorted.map(item => `
            <div class="card">
                <div class="achievement-header">
                    <h3>${item.title}</h3>
                    <div class="timeline-date">${item.year}</div>
                </div>
                <div class="achievement-content">
                    <p><strong>${item.result}</strong></p>
                    <p>${item.description}</p>
                    ${item.image ? `<div class="achievement-photo"><img src="${item.image}" alt="${item.title}" class="achievement-image"></div>` : ''}
                    <div class="achievement-details">
                        ${levelLabel[item.level] || ''}
                        ${(item.tags || []).map(tag => `<div class="badge">${tag}</div>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        container.style.display = '';
    }
});
