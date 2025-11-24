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
            { id: 1, src: 'Images/Gallery/0C4A2320.jpg', name: 'Событие 2024', description: 'Интерактивное мероприятие' },
            { id: 2, src: 'Images/Gallery/IMG20240218130011.jpg', name: 'Проект с учениками', description: 'Совместная работа' },
            { id: 3, src: 'Images/Gallery/IMG20241004093018.jpg', name: 'Олимпиада 2024', description: 'Республиканская олимпиада' },
            { id: 4, src: 'Images/Gallery/IMG20241011120835.jpg', name: 'Конкурс по программированию', description: 'Марафон программирования' },
            { id: 5, src: 'Images/Gallery/IMG20241013170727.jpg', name: 'Работа с командой', description: 'Проект ИИ' },
            { id: 6, src: 'Images/Gallery/IMG20241223135830.jpg', name: 'Новогодний проект', description: 'Праздничный проект' },
            { id: 7, src: 'Images/Gallery/585096515_1145110854458818_142450807801969116_n.jpg', name: 'Социальная сеть', description: 'Публикация' },
            { id: 8, src: 'Images/Gallery/IMG20250331095610.jpg', name: 'Весенний проект', description: 'Веб-разработка' },
            { id: 9, src: 'Images/Gallery/IMG20250607130107.jpg', name: 'Летние разработки', description: 'Мобильные приложения' },
            { id: 10, src: 'Images/Gallery/IMG20250901082948.jpg', name: 'Осенний семинар', description: 'Машинное обучение' },
            { id: 11, src: 'Images/Gallery/IMG20251029103648.jpg', name: 'Октябрьское событие', description: 'Конференция' },
            { id: 12, src: 'Images/Gallery/IMG20251105110219.jpg', name: 'Ноябрьская конференция', description: 'Всероссийская конференция' },
            { id: 13, src: 'Images/Gallery/TA-210.jpg', name: 'Техническое оборудование', description: 'Лабораторное оборудование' }
        ];
        this.renderGallery();
    }

    renderGallery() {
        this.galleryGrid.innerHTML = '';
        this.images.forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <img src="${image.src}" alt="${image.name}" loading="lazy">
                <div class="gallery-item-overlay">
                    <div class="gallery-item-overlay-text">
                        <div class="gallery-item-overlay-icon">🖼️</div>
                        <div>${image.name}</div>
                    </div>
                </div>
            `;
            item.addEventListener('click', () => this.openModal(index));
            this.galleryGrid.appendChild(item);
        });
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
        this.modalImage.src = image.src;
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
