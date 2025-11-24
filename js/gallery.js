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
        this.images = [
            { src: 'Images/Gallery/0C4A2320.jpg', name: 'Событие 2024' },
            { src: 'Images/Gallery/IMG20240218130011.jpg', name: 'Проект с учениками' },
            { src: 'Images/Gallery/IMG20241004093018.jpg', name: 'Олимпиада 2024' },
            { src: 'Images/Gallery/IMG20241011120835.jpg', name: 'Конкурс по программированию' },
            { src: 'Images/Gallery/IMG20241013170727.jpg', name: 'Работа с командой' },
            { src: 'Images/Gallery/IMG20241223135830.jpg', name: 'Новогодний проект' },
            { src: 'Images/Gallery/585096515_1145110854458818_142450807801969116_n.jpg', name: 'Социальная сеть' },
            { src: 'Images/Gallery/IMG20250331095610.jpg', name: 'Весенний проект' },
            { src: 'Images/Gallery/IMG20250607130107.jpg', name: 'Летние разработки' },
            { src: 'Images/Gallery/IMG20250901082948.jpg', name: 'Осенний семинар' },
            { src: 'Images/Gallery/IMG20251029103648.jpg', name: 'Октябрьское событие' },
            { src: 'Images/Gallery/IMG20251105110219.jpg', name: 'Ноябрьская конференция' },
            { src: 'Images/Gallery/TA-210.jpg', name: 'Техническое оборудование' }
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
