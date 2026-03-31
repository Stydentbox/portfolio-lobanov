// Админ-панель управления контентом
class AdminPanel {
    constructor() {
        this.currentTab = 'gallery';
        this.galleryData = [];
        this.achievementsData = [];
        this.publicationsData = [];
        this.educationData = [];
        this.hasUnsavedGallery = false;

        this.init();
    }

    init() {
        this.loadData().then(() => {
            this.setupTabs();
            this.setupGallery();
            this.setupAchievements();
            this.setupPublications();
            this.setupEducation();
        });
    }

    // Загрузка данных: для галереи — из JSON (источник правды), остальное — из localStorage
    async loadData() {
        try {
            const response = await fetch('data/gallery-data.json');
            const data = await response.json();
            this.galleryData = data.gallery || [];
        } catch (e) {
            this.galleryData = JSON.parse(localStorage.getItem('gallery') || '[]');
        }
        this.achievementsData = JSON.parse(localStorage.getItem('achievements') || '[]');
        this.publicationsData = JSON.parse(localStorage.getItem('publications') || '[]');
        this.educationData = JSON.parse(localStorage.getItem('education') || '[]');
    }

    // Сохранение данных в localStorage
    saveData(type, data) {
        localStorage.setItem(type, JSON.stringify(data));
    }

    // Показ сообщения
    showMessage(text, type = 'success') {
        const message = document.getElementById('message');
        message.textContent = text;
        message.className = `message ${type} show`;

        setTimeout(() => {
            message.classList.remove('show');
        }, 3000);
    }

    // Настройка вкладок
    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;

                // Переключение активной кнопки
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Переключение контента
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `tab-${tabName}`) {
                        content.classList.add('active');
                    }
                });

                this.currentTab = tabName;
            });
        });
    }

    // ============== ГАЛЕРЕЯ ==============
    setupGallery() {
        const dropzone = document.getElementById('gallery-dropzone');
        const fileInput = document.getElementById('gallery-file-input');
        const form = document.getElementById('gallery-form');
        const formCard = document.getElementById('gallery-form-card');
        const cancelBtn = document.getElementById('cancel-gallery');
        const exportBtn = document.getElementById('export-gallery');
        const importBtn = document.getElementById('import-gallery');

        // Drag and drop
        dropzone.addEventListener('click', () => fileInput.click());

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');

            const files = Array.from(e.dataTransfer.files);
            this.handleImageFiles(files);
        });

        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleImageFiles(files);
        });

        // Форма
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addGalleryItem(new FormData(form));
            form.reset();
            formCard.style.display = 'none';
        });

        cancelBtn.addEventListener('click', () => {
            formCard.style.display = 'none';
            form.reset();
        });

        // Экспорт/импорт
        exportBtn.addEventListener('click', () => this.exportGallery());
        importBtn.addEventListener('click', () => this.importGallery());

        this.renderGallery();
    }

    handleImageFiles(files) {
        const validFiles = files.filter(file => {
            const isImage = file.type.startsWith('image/');
            const isValidSize = file.size <= 15 * 1024 * 1024; // 15MB

            if (!isImage) {
                this.showMessage('Можно загружать только изображения', 'error');
                return false;
            }
            if (!isValidSize) {
                this.showMessage('Размер файла не должен превышать 15 МБ', 'error');
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            this.processImageFiles(validFiles);
        }
    }

    processImageFiles(files) {
        const formCard = document.getElementById('gallery-form-card');
        const srcInput = document.getElementById('gallery-src');
        const progressContainer = document.getElementById('upload-progress');
        const progressBar = document.getElementById('progress-bar-fill');
        const uploadFilename = document.getElementById('upload-filename');
        const uploadSize = document.getElementById('upload-size');
        const uploadPercentage = document.getElementById('upload-percentage');

        const file = files[0];
        const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);

        progressContainer.style.display = 'block';
        uploadFilename.textContent = file.name;
        uploadSize.textContent = `${originalSizeMB} МБ`;
        uploadPercentage.textContent = 'Оптимизация...';
        progressBar.style.width = '30%';

        const img = new Image();
        const objectURL = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectURL);

            // Масштабирование: максимум 1920px по длинной стороне
            const MAX_PX = 1920;
            let { naturalWidth: w, naturalHeight: h } = img;
            if (w > MAX_PX || h > MAX_PX) {
                if (w >= h) { h = Math.round(h * MAX_PX / w); w = MAX_PX; }
                else        { w = Math.round(w * MAX_PX / h); h = MAX_PX; }
            }

            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);

            progressBar.style.width = '60%';

            // Снижаем качество JPEG итеративно до тех пор, пока файл < 1 МБ
            const MAX_BYTES = 1024 * 1024;
            let quality = 0.85;

            const tryCompress = () => {
                canvas.toBlob((blob) => {
                    if (blob.size > MAX_BYTES && quality > 0.10) {
                        quality = Math.max(0.10, quality - 0.05);
                        tryCompress();
                        return;
                    }

                    const optimizedSizeMB = (blob.size / (1024 * 1024)).toFixed(2);
                    const baseName = file.name.replace(/\.[^.]+$/, '');
                    const optimizedName = `${baseName}.jpg`;

                    srcInput.value = `Images/Gallery/${optimizedName}`;

                    progressBar.style.width = '100%';
                    uploadSize.textContent = `${originalSizeMB} → ${optimizedSizeMB} МБ`;
                    uploadPercentage.textContent = '100%';

                    this.showOptimizedDownload(blob, optimizedName);

                    setTimeout(() => { progressContainer.style.display = 'none'; }, 800);

                    formCard.style.display = 'block';
                    formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                    const sizeInfo = file.size > blob.size
                        ? `${originalSizeMB} МБ → ${optimizedSizeMB} МБ (качество ${Math.round(quality * 100)}%)`
                        : `${optimizedSizeMB} МБ (уже в норме)`;
                    this.showMessage(`Оптимизировано: ${sizeInfo}. Скачайте файл и сохраните в Images/Gallery/`, 'success');
                }, 'image/jpeg', quality);
            };

            tryCompress();
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectURL);
            progressContainer.style.display = 'none';
            this.showMessage('Ошибка при обработке изображения', 'error');
        };

        img.src = objectURL;
    }

    showOptimizedDownload(blob, filename) {
        const existing = document.getElementById('optimized-download');
        if (existing) {
            URL.revokeObjectURL(existing.querySelector('a').href);
            existing.remove();
        }

        const url = URL.createObjectURL(blob);
        const div = document.createElement('div');
        div.id = 'optimized-download';
        div.className = 'optimized-download';
        div.innerHTML = `
            <p>Скачайте оптимизированный файл и сохраните в <code>Images/Gallery/</code>:</p>
            <a href="${url}" download="${filename}" class="btn">Скачать ${filename}</a>
        `;
        document.getElementById('gallery-dropzone').insertAdjacentElement('afterend', div);
    }

    addGalleryItem(formData) {
        const newItem = {
            id: Date.now(),
            src: formData.get('src'),
            name: formData.get('name'),
            description: formData.get('description'),
            date: formData.get('date'),
            tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        this.galleryData.push(newItem);
        this.markUnsaved();
        this.renderGallery();

        this.showMessage('Фотография добавлена. Нажмите «Экспортировать JSON» для сохранения.', 'success');
    }

    deleteGalleryItem(id) {
        if (confirm('Удалить эту фотографию из галереи?')) {
            this.galleryData = this.galleryData.filter(item => item.id !== id);
            this.markUnsaved();
            this.renderGallery();
            this.showMessage('Удалено. Нажмите «Экспортировать JSON» чтобы сохранить изменения.', 'success');
        }
    }

    updateGalleryItem(id, btn) {
        const card = btn.closest('.gallery-item-card');
        const index = this.galleryData.findIndex(item => item.id === id);
        if (index === -1) return;

        this.galleryData[index] = {
            ...this.galleryData[index],
            name: card.querySelector('.edit-name').value.trim(),
            description: card.querySelector('.edit-description').value.trim(),
            date: card.querySelector('.edit-date').value.trim(),
            tags: card.querySelector('.edit-tags').value.split(',').map(t => t.trim()).filter(t => t)
        };

        this.markUnsaved();
        this.showMessage('Изменения сохранены в памяти. Нажмите «Экспортировать JSON» для записи в файл.', 'success');
    }

    markUnsaved() {
        this.hasUnsavedGallery = true;
        const btn = document.getElementById('export-gallery');
        if (btn) btn.textContent = 'Экспортировать JSON ⚠️';
    }

    renderGallery() {
        const container = document.getElementById('gallery-items');

        if (this.galleryData.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📷</div>
                    <p>Галерея пуста. Добавьте первую фотографию!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.galleryData.map(item => `
            <div class="gallery-item-card">
                <img src="${item.src}" alt="${item.name}" onerror="this.src='Images/favicon-32x32.png'">
                <div class="gallery-item-info">
                    <div class="form-group">
                        <label>Название</label>
                        <input type="text" class="edit-name" value="${this._esc(item.name)}">
                    </div>
                    <div class="form-group">
                        <label>Описание</label>
                        <textarea class="edit-description" rows="2">${this._esc(item.description || '')}</textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Дата (ГГГГ-ММ)</label>
                            <input type="text" class="edit-date" value="${this._esc(item.date || '')}">
                        </div>
                        <div class="form-group">
                            <label>Теги</label>
                            <input type="text" class="edit-tags" value="${this._esc((item.tags || []).join(', '))}">
                        </div>
                    </div>
                    <div class="gallery-item-actions">
                        <button class="btn" onclick="adminPanel.updateGalleryItem(${item.id}, this)">Сохранить</button>
                        <button class="btn btn-delete" onclick="adminPanel.deleteGalleryItem(${item.id})">Удалить</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    _esc(str) {
        return String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    exportGallery() {
        const dataStr = JSON.stringify({ gallery: this.galleryData }, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', 'gallery-data.json');
        linkElement.click();

        this.hasUnsavedGallery = false;
        const btn = document.getElementById('export-gallery');
        if (btn) btn.textContent = 'Экспортировать JSON';

        this.showMessage('Скачайте файл и замените data/gallery-data.json в папке проекта', 'success');
    }

    importGallery() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data.gallery && Array.isArray(data.gallery)) {
                        this.galleryData = data.gallery;
                        this.markUnsaved();
                        this.renderGallery();
                        this.showMessage('Данные галереи импортированы!', 'success');
                    } else {
                        this.showMessage('Неверный формат файла', 'error');
                    }
                } catch (error) {
                    this.showMessage('Ошибка при чтении файла', 'error');
                }
            };

            reader.readAsText(file);
        };

        input.click();
    }

    // ============== ДОСТИЖЕНИЯ ==============
    setupAchievements() {
        const addBtn = document.getElementById('add-achievement');
        const form = document.getElementById('achievement-form');
        const formCard = document.getElementById('achievement-form-card');
        const cancelBtn = document.getElementById('cancel-achievement');

        addBtn.addEventListener('click', () => {
            formCard.style.display = formCard.style.display === 'none' ? 'block' : 'none';
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAchievement(new FormData(form));
            form.reset();
            formCard.style.display = 'none';
        });

        cancelBtn.addEventListener('click', () => {
            formCard.style.display = 'none';
            form.reset();
        });

        this.renderAchievements();
    }

    addAchievement(formData) {
        const newItem = {
            id: Date.now(),
            title: formData.get('title'),
            year: formData.get('year'),
            result: formData.get('result'),
            description: formData.get('description'),
            level: formData.get('level'),
            category: formData.get('category'),
            tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
            image: formData.get('image')
        };

        this.achievementsData.push(newItem);
        this.saveData('achievements', this.achievementsData);
        this.renderAchievements();

        this.showMessage('Достижение добавлено!', 'success');
    }

    deleteAchievement(id) {
        if (confirm('Удалить это достижение?')) {
            this.achievementsData = this.achievementsData.filter(item => item.id !== id);
            this.saveData('achievements', this.achievementsData);
            this.renderAchievements();
            this.showMessage('Достижение удалено', 'success');
        }
    }

    renderAchievements() {
        const container = document.getElementById('achievements-items');

        if (this.achievementsData.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🏆</div>
                    <p>Нет добавленных достижений</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.achievementsData.map(item => `
            <div class="item-card">
                <div class="item-card-header">
                    <div class="item-card-title">
                        <h4>${item.title}</h4>
                        <div class="item-card-meta">
                            <span>📅 ${item.year}</span>
                            <span>🏅 ${item.result}</span>
                            <span>🌍 ${this.getLevelLabel(item.level)}</span>
                        </div>
                    </div>
                </div>
                <div class="item-card-content">
                    <p>${item.description}</p>
                </div>
                ${item.tags && item.tags.length > 0 ? `
                    <div class="item-card-tags">
                        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="item-card-actions">
                    <button class="btn btn-delete btn-icon" onclick="adminPanel.deleteAchievement(${item.id})">🗑️ Удалить</button>
                </div>
            </div>
        `).join('');
    }

    getLevelLabel(level) {
        const labels = {
            'international': 'Международный',
            'national': 'Республиканский',
            'regional': 'Региональный'
        };
        return labels[level] || level;
    }

    // ============== ПУБЛИКАЦИИ ==============
    setupPublications() {
        const addBtn = document.getElementById('add-publication');
        const form = document.getElementById('publication-form');
        const formCard = document.getElementById('publication-form-card');
        const cancelBtn = document.getElementById('cancel-publication');

        addBtn.addEventListener('click', () => {
            formCard.style.display = formCard.style.display === 'none' ? 'block' : 'none';
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPublication(new FormData(form));
            form.reset();
            formCard.style.display = 'none';
        });

        cancelBtn.addEventListener('click', () => {
            formCard.style.display = 'none';
            form.reset();
        });

        this.renderPublications();
    }

    addPublication(formData) {
        const newItem = {
            id: Date.now(),
            authors: formData.get('authors'),
            title: formData.get('title'),
            source: formData.get('source'),
            year: formData.get('year'),
            pages: formData.get('pages'),
            type: formData.get('type')
        };

        this.publicationsData.push(newItem);
        this.saveData('publications', this.publicationsData);
        this.renderPublications();

        this.showMessage('Публикация добавлена!', 'success');
    }

    deletePublication(id) {
        if (confirm('Удалить эту публикацию?')) {
            this.publicationsData = this.publicationsData.filter(item => item.id !== id);
            this.saveData('publications', this.publicationsData);
            this.renderPublications();
            this.showMessage('Публикация удалена', 'success');
        }
    }

    renderPublications() {
        const container = document.getElementById('publications-items');

        if (this.publicationsData.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📚</div>
                    <p>Нет добавленных публикаций</p>
                </div>
            `;
            return;
        }

        // Сортировка по году (новые первыми)
        const sorted = [...this.publicationsData].sort((a, b) => b.year - a.year);

        container.innerHTML = sorted.map(item => `
            <div class="item-card">
                <div class="item-card-header">
                    <div class="item-card-title">
                        <h4>${item.title}</h4>
                        <div class="item-card-meta">
                            <span>📅 ${item.year}</span>
                            <span>✍️ ${item.authors}</span>
                        </div>
                    </div>
                </div>
                <div class="item-card-content">
                    <p><strong>Источник:</strong> ${item.source}</p>
                    ${item.pages ? `<p><strong>Страницы:</strong> ${item.pages}</p>` : ''}
                </div>
                <div class="item-card-actions">
                    <button class="btn btn-delete btn-icon" onclick="adminPanel.deletePublication(${item.id})">🗑️ Удалить</button>
                </div>
            </div>
        `).join('');
    }

    // ============== ОБРАЗОВАНИЕ ==============
    setupEducation() {
        const addBtn = document.getElementById('add-education');
        const form = document.getElementById('education-form');
        const formCard = document.getElementById('education-form-card');
        const cancelBtn = document.getElementById('cancel-education');

        addBtn.addEventListener('click', () => {
            formCard.style.display = formCard.style.display === 'none' ? 'block' : 'none';
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addEducation(new FormData(form));
            form.reset();
            formCard.style.display = 'none';
        });

        cancelBtn.addEventListener('click', () => {
            formCard.style.display = 'none';
            form.reset();
        });

        this.renderEducation();
    }

    addEducation(formData) {
        const newItem = {
            id: Date.now(),
            institution: formData.get('institution'),
            program: formData.get('program'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            hours: formData.get('hours'),
            city: formData.get('city'),
            documentType: formData.get('documentType'),
            description: formData.get('description'),
            tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        this.educationData.push(newItem);
        this.saveData('education', this.educationData);
        this.renderEducation();

        this.showMessage('Курс добавлен!', 'success');
    }

    deleteEducation(id) {
        if (confirm('Удалить этот курс?')) {
            this.educationData = this.educationData.filter(item => item.id !== id);
            this.saveData('education', this.educationData);
            this.renderEducation();
            this.showMessage('Курс удален', 'success');
        }
    }

    renderEducation() {
        const container = document.getElementById('education-items');

        if (this.educationData.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🎓</div>
                    <p>Нет добавленных курсов</p>
                </div>
            `;
            return;
        }

        // Сортировка по дате начала (новые первыми)
        const sorted = [...this.educationData].sort((a, b) =>
            new Date(b.startDate) - new Date(a.startDate)
        );

        container.innerHTML = sorted.map(item => `
            <div class="item-card">
                <div class="item-card-header">
                    <div class="item-card-title">
                        <h4>${item.institution}</h4>
                        <div class="item-card-meta">
                            <span>📅 ${this.formatDate(item.startDate)} - ${this.formatDate(item.endDate)}</span>
                            <span>⏱️ ${item.hours} часов</span>
                            ${item.city ? `<span>📍 ${item.city}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="item-card-content">
                    <p><strong>Программа:</strong> ${item.program}</p>
                    <p><strong>Документ:</strong> ${this.getDocumentTypeLabel(item.documentType)}</p>
                    ${item.description ? `<p>${item.description}</p>` : ''}
                </div>
                ${item.tags && item.tags.length > 0 ? `
                    <div class="item-card-tags">
                        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="item-card-actions">
                    <button class="btn btn-delete btn-icon" onclick="adminPanel.deleteEducation(${item.id})">🗑️ Удалить</button>
                </div>
            </div>
        `).join('');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    getDocumentTypeLabel(type) {
        const labels = {
            'certificate': 'Удостоверение о повышении квалификации',
            'diploma': 'Диплом о проф. переподготовке',
            'other': 'Другое'
        };
        return labels[type] || type;
    }
}

// Инициализация при загрузке страницы
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});

window.addEventListener('beforeunload', (e) => {
    if (adminPanel && adminPanel.hasUnsavedGallery) {
        e.preventDefault();
        e.returnValue = '';
    }
});
