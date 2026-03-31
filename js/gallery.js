// Галерея с динамической загрузкой изображений
class GalleryManager {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.modal = document.getElementById('gallery-modal');
        this.modalImage = document.getElementById('modal-image');
        this.modalTitle = document.getElementById('modal-title');
        this.modalCounter = document.getElementById('modal-counter');
        this.galleryGrid = document.getElementById('gallery-grid');

        this.init();
    }

    init() {
        this.loadImages();
        this.attachEventListeners();
    }

    loadImages() {
        fetch('data/gallery-data.json')
            .then(response => response.json())
            .then(data => {
                this.images = data.gallery || [];
                this.renderGallery();
            })
            .catch(error => {
                console.error('Ошибка загрузки галереи:', error);
                this.loadFallbackImages();
            });
    }

    loadFallbackImages() {
        this.images = [
            { id: 1, src: 'Images/Gallery/0C4A2320.jpg', name: 'На встрече с Президентом Республики Молдова', description: 'На встрече с Президентом Республики Молдова' },
            { id: 2, src: 'Images/Gallery/IMG20240218130011.jpg', name: 'MoldSEF 2024 - награждение', description: 'MoldSEF 2024' },
            { id: 3, src: 'Images/Gallery/IMG20241004093018.jpg', name: 'С выпускниками 2024', description: 'Мы дружно вместе работали, в добрый путь, друзья!' },
            { id: 4, src: 'Images/Gallery/IMG20241011120835.jpg', name: 'Победа на конкурсе STEAM проектов', description: 'Мы победили на конкурсе STEAM проектов!' },
            { id: 5, src: 'Images/Gallery/IMG20241013170727.jpg', name: 'Работа с командой', description: 'Проект ИИ' },
            { id: 6, src: 'Images/Gallery/IMG20241223135830.jpg', name: 'В президентуре с ИИ проектом', description: 'Проект ИИ' },
            { id: 8, src: 'Images/Gallery/IMG20250331095610.jpg', name: 'Победа на Олимпиаде по информатике 2025', description: 'Победа на Олимпиаде по информатике 2025' },
            { id: 9, src: 'Images/Gallery/IMG20250607130107.jpg', name: 'Представляем ИИ проект', description: 'Представляем ИИ проект' },
            { id: 10, src: 'Images/Gallery/IMG20250901082948.jpg', name: 'Начало нового учебного года', description: 'Начало нового учебного года 2025-2026' },
            { id: 11, src: 'Images/Gallery/IMG20251029103648.jpg', name: 'С 7Б "едем" на мастер-класс по Веб-разработке', description: 'Конференция' },
            { id: 12, src: 'Images/Gallery/IMG20251105110219.jpg', name: 'Даем интервью Радио Молдова', description: 'Даем интервью Радио Молдова' },
            { id: 13, src: 'Images/Gallery/TA-210.jpg', name: 'Награждение победителей конкурса Intel AI Global Impact 2025', description: 'Intel AI Global Impact 2025' }
        ];
        this.renderGallery();
    }

    renderGallery() {
        this.galleryGrid.innerHTML = '';
        this.images.forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';

            // Создаем структуру с прогрессивной загрузкой
            const imgElement = document.createElement('img');
            imgElement.className = 'progressive-image loading';
            imgElement.alt = image.name;
            imgElement.dataset.src = image.src;

            // Placeholder - серый фон с blur эффектом
            imgElement.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cfilter id="b"%3E%3CfeGaussianBlur stdDeviation="12"%3E%3C/feGaussianBlur%3E%3C/filter%3E%3Crect width="400" height="400" fill="%23ddd" filter="url(%23b)"%3E%3C/rect%3E%3C/svg%3E';

            const overlay = document.createElement('div');
            overlay.className = 'gallery-item-overlay';
            overlay.innerHTML = `
                <div class="gallery-item-overlay-text">
                    <div class="gallery-item-overlay-icon">🖼️</div>
                    <div>${image.name}</div>
                </div>
            `;

            item.appendChild(imgElement);
            item.appendChild(overlay);
            item.addEventListener('click', () => this.openModal(index));
            this.galleryGrid.appendChild(item);

            // Прогрессивная загрузка с Intersection Observer
            this.loadProgressiveImage(imgElement);
        });
    }

    loadProgressiveImage(imgElement) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const fullSrc = img.dataset.src;

                    // Создаем новый Image объект для предзагрузки
                    const fullImage = new Image();

                    fullImage.onload = () => {
                        // Когда полное изображение загружено, плавно заменяем
                        img.src = fullSrc;
                        img.classList.remove('loading');
                        img.classList.add('loaded');
                    };

                    fullImage.onerror = () => {
                        // В случае ошибки убираем класс loading
                        img.classList.remove('loading');
                        img.classList.add('error');
                    };

                    fullImage.src = fullSrc;
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // Начинаем загрузку за 50px до появления в viewport
        });

        observer.observe(imgElement);
    }

    openModal(index) {
        this.currentIndex = index;
        this.updateModal();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    updateModal() {
        const image = this.images[this.currentIndex];

        // Добавляем класс loading и показываем placeholder
        this.modalImage.classList.add('loading');
        this.modalImage.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Cfilter id="b"%3E%3CfeGaussianBlur stdDeviation="12"%3E%3C/feGaussianBlur%3E%3C/filter%3E%3Crect width="800" height="600" fill="%23ddd" filter="url(%23b)"%3E%3C/rect%3E%3C/svg%3E';

        // Предзагрузка полного изображения
        const fullImage = new Image();
        fullImage.onload = () => {
            this.modalImage.src = image.src;
            this.modalImage.classList.remove('loading');
            this.modalImage.classList.add('loaded');
        };

        fullImage.onerror = () => {
            this.modalImage.classList.remove('loading');
            this.modalImage.classList.add('error');
        };

        fullImage.src = image.src;

        this.modalImage.alt = image.name;
        this.modalTitle.textContent = image.name;
        this.modalCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateModal();
    }

    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateModal();
    }

    attachEventListeners() {
        document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        document.querySelector('.modal-next').addEventListener('click', () => this.nextImage());
        document.querySelector('.modal-prev').addEventListener('click', () => this.prevImage());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;
            if (e.key === 'ArrowRight') this.nextImage();
            if (e.key === 'ArrowLeft') this.prevImage();
            if (e.key === 'Escape') this.closeModal();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GalleryManager();
});
