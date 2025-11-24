// Админ-панель управления галереей
class AdminGalleryManager {
    constructor() {
        this.images = [];
        this.galleryList = document.getElementById('gallery-list');
        this.messageDiv = document.getElementById('message');
        this.modalAdd = document.getElementById('modal-add');
        this.addImageForm = document.getElementById('add-image-form');
        this.btnAddImage = document.getElementById('btn-add-image');
        this.btnExport = document.getElementById('btn-export');

        this.init();
    }

    init() {
        this.loadGallery();
        this.attachEventListeners();
    }

    loadGallery() {
        fetch('data/gallery-data.json')
            .then(response => response.json())
            .then(data => {
                this.images = data.gallery || [];
                this.renderGalleryList();
            })
            .catch(error => {
                console.error('Ошибка загрузки галереи:', error);
                this.showMessage('Ошибка загрузки галереи', 'error');
            });
    }

    renderGalleryList() {
        this.galleryList.innerHTML = '';

        this.images.forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item-admin';
            item.dataset.id = image.id;

            item.innerHTML = `
                <img src="${image.src}" alt="${image.name}" onerror="this.src='Images/placeholder.png'">
                <div class="gallery-item-info">
                    <div>
                        <label>ID: ${image.id}</label>
                    </div>
                    <div>
                        <label>Путь к файлу</label>
                        <input type="text" class="image-src" value="${image.src}" placeholder="Images/Gallery/photo.jpg">
                    </div>
                    <div>
                        <label>Название</label>
                        <input type="text" class="image-name" value="${image.name}" placeholder="Название фото">
                    </div>
                    <div>
                        <label>Описание</label>
                        <textarea class="image-description" placeholder="Описание события" rows="3">${image.description || ''}</textarea>
                    </div>
                    <div>
                        <label>Дата</label>
                        <input type="text" class="image-date" value="${image.date || ''}" placeholder="2025-01">
                    </div>
                    <div>
                        <label>Теги</label>
                        <input type="text" class="image-tags" value="${(image.tags || []).join(', ')}" placeholder="тег1, тег2">
                    </div>
                </div>
                <div class="gallery-item-actions">
                    <button type="button" class="btn-save" onclick="adminGallery.saveItem(${image.id})">Сохранить</button>
                    <button type="button" class="btn-delete" onclick="adminGallery.deleteItem(${image.id})">Удалить</button>
                </div>
            `;

            this.galleryList.appendChild(item);
        });
    }

    saveItem(id) {
        const item = document.querySelector(`[data-id="${id}"]`);
        if (!item) return;

        const src = item.querySelector('.image-src').value.trim();
        const name = item.querySelector('.image-name').value.trim();
        const description = item.querySelector('.image-description').value.trim();
        const date = item.querySelector('.image-date').value.trim();
        const tags = item.querySelector('.image-tags').value.trim()
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag);

        if (!src || !name) {
            this.showMessage('Заполните обязательные поля (путь и название)', 'error');
            return;
        }

        const imageIndex = this.images.findIndex(img => img.id === id);
        if (imageIndex !== -1) {
            this.images[imageIndex] = {
                id,
                src,
                name,
                description,
                date,
                tags
            };

            this.saveToLocalStorage();
            this.showMessage('Изображение успешно обновлено', 'success');
        }
    }

    deleteItem(id) {
        if (confirm('Вы уверены, что хотите удалить это изображение?')) {
            this.images = this.images.filter(img => img.id !== id);
            this.saveToLocalStorage();
            this.renderGalleryList();
            this.showMessage('Изображение удалено', 'success');
        }
    }

    addNewImage(e) {
        e.preventDefault();

        const src = document.getElementById('image-src').value.trim();
        const name = document.getElementById('image-name').value.trim();
        const description = document.getElementById('image-description').value.trim();
        const date = document.getElementById('image-date').value.trim();
        const tags = document.getElementById('image-tags').value.trim()
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag);

        if (!src || !name) {
            this.showMessage('Заполните обязательные поля', 'error');
            return;
        }

        const newId = Math.max(...this.images.map(img => img.id), 0) + 1;
        const newImage = {
            id: newId,
            src,
            name,
            description,
            date,
            tags
        };

        this.images.push(newImage);
        this.saveToLocalStorage();
        this.renderGalleryList();
        this.showMessage('Новое изображение добавлено', 'success');
        this.closeModal();
        this.addImageForm.reset();
    }

    saveToLocalStorage() {
        const data = { gallery: this.images };
        localStorage.setItem('gallery-data', JSON.stringify(data));
    }

    exportJSON() {
        const data = { gallery: this.images };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gallery-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showMessage('Галерея экспортирована в gallery-data.json', 'success');
    }

    showMessage(text, type) {
        this.messageDiv.textContent = text;
        this.messageDiv.className = `message ${type}`;

        setTimeout(() => {
            this.messageDiv.className = 'message';
        }, 4000);
    }

    attachEventListeners() {
        this.btnAddImage.addEventListener('click', () => this.openModal());
        this.btnExport.addEventListener('click', () => this.exportJSON());
        this.addImageForm.addEventListener('submit', (e) => this.addNewImage(e));
    }

    openModal() {
        this.modalAdd.classList.add('active');
    }

    closeModal() {
        this.modalAdd.classList.remove('active');
    }
}

// Функции для глобального доступа
let adminGallery;

function closeModal() {
    if (adminGallery) {
        adminGallery.closeModal();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    adminGallery = new AdminGalleryManager();
});
