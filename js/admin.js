document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if(themeToggleBtn) {
        themeToggleBtn.textContent = currentTheme === 'light' ? '🌙' : '☀️';
        themeToggleBtn.addEventListener('click', () => {
            const target = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', target);
            localStorage.setItem('theme', target);
            themeToggleBtn.textContent = target === 'light' ? '🌙' : '☀️';
        });
    }

    const titleInput = document.getElementById('homepage-title');
    const subtitleInput = document.getElementById('homepage-subtitle');
    
    // Homepage Background Elements
    const homeBgType = document.getElementById('homepage-bg-type');
    const homeBgColorGroup = document.getElementById('homepage-bg-color-group');
    const homeBgColor = document.getElementById('homepage-bg-color');
    const homeBgImageGroup = document.getElementById('homepage-bg-image-group');
    const homeBgImageFile = document.getElementById('homepage-bg-image-file');
    const homeBgImage = document.getElementById('homepage-bg-image');
    const homeBgPreview = document.getElementById('homepage-bg-preview');
    const homeBgSize = document.getElementById('homepage-bg-size');
    const homeBgPosition = document.getElementById('homepage-bg-position');
    const homeGalleryCols = document.getElementById('homepage-gallery-cols');
    const homeBgOpacity = document.getElementById('homepage-bg-opacity');
    const homeBgOpacityVal = document.getElementById('homepage-bg-opacity-val');

    // Contact Page Background Elements
    const contactBgType = document.getElementById('contact-bg-type');
    const contactBgColorGroup = document.getElementById('contact-bg-color-group');
    const contactBgColor = document.getElementById('contact-bg-color');
    const contactBgImageGroup = document.getElementById('contact-bg-image-group');
    const contactBgImageFile = document.getElementById('contact-bg-image-file');
    const contactBgImage = document.getElementById('contact-bg-image');
    const contactBgPreview = document.getElementById('contact-bg-preview');
    const contactBgSize = document.getElementById('contact-bg-size');
    const contactBgPosition = document.getElementById('contact-bg-position');
    const contactBgOpacity = document.getElementById('contact-bg-opacity');
    const contactBgOpacityVal = document.getElementById('contact-bg-opacity-val');
    
    function setupBackgroundHandlers(typeSelect, colorGroup, imageGroup, fileInput, hiddenInput, previewDiv, sizeSelect, positionSelect, opacityInput, opacityVal) {
        
        const updatePreview = () => {
            if (hiddenInput.value) {
                previewDiv.style.display = 'block';
                previewDiv.style.backgroundImage = `url('${hiddenInput.value}')`;
                previewDiv.style.backgroundSize = sizeSelect ? sizeSelect.value : 'cover';
                previewDiv.style.backgroundPosition = positionSelect ? positionSelect.value : 'center';
                previewDiv.style.backgroundRepeat = 'no-repeat';
            } else {
                previewDiv.style.display = 'none';
            }
        };

        typeSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            colorGroup.style.display = val === 'color' ? 'block' : 'none';
            imageGroup.style.display = val === 'image' ? 'block' : 'none';
        });

        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const result = await res.json();
            if(result.url) {
                hiddenInput.value = result.url;
                updatePreview();
            }
        });

        if (sizeSelect) sizeSelect.addEventListener('change', updatePreview);
        if (positionSelect) positionSelect.addEventListener('change', updatePreview);
        
        if (opacityInput && opacityVal) {
            opacityInput.addEventListener('input', (e) => {
                opacityVal.textContent = e.target.value;
            });
        }
    }

    setupBackgroundHandlers(homeBgType, homeBgColorGroup, homeBgImageGroup, homeBgImageFile, homeBgImage, homeBgPreview, homeBgSize, homeBgPosition, homeBgOpacity, homeBgOpacityVal);
    setupBackgroundHandlers(contactBgType, contactBgColorGroup, contactBgImageGroup, contactBgImageFile, contactBgImage, contactBgPreview, contactBgSize, contactBgPosition, contactBgOpacity, contactBgOpacityVal);
    
    const gallerySelect = document.getElementById('gallery-select');
    const galleryContainer = document.getElementById('gallery-admin-container');
    const navContainer = document.getElementById('nav-admin-container');
    const pagesContainer = document.getElementById('pages-admin-container');
    
    const addGalleryBtn = document.getElementById('add-item-btn');
    const addNavBtn = document.getElementById('add-nav-btn');
    const addPageBtn = document.getElementById('add-page-btn');
    const form = document.getElementById('admin-form');
    
    let allGalleries = { home: [] };
    let currentGalleryId = 'home';

    // Load Data (supports local server and static hosting)
    const loadAdminData = async () => {
        if (window.SITE_DATA) return window.SITE_DATA;
        try {
            const res = await fetch('/api/data');
            if (res.ok) return await res.json();
        } catch (e) {}
        try {
            const res = await fetch('data.json');
            if (res.ok) return await res.json();
        } catch (e) {}
        throw new Error('Failed to load admin data');
    };

    loadAdminData()
        .then(data => {
            if(data.homepage) {
                titleInput.value = data.homepage.title || '';
                subtitleInput.value = data.homepage.subtitle || '';
                
                if (data.homepage.bgType) {
                    homeBgType.value = data.homepage.bgType;
                    homeBgType.dispatchEvent(new Event('change'));
                }
                if (data.homepage.bgColor) homeBgColor.value = data.homepage.bgColor;
                if (data.homepage.bgImage) {
                    homeBgImage.value = data.homepage.bgImage;
                    if (data.homepage.bgSize) homeBgSize.value = data.homepage.bgSize;
                    if (data.homepage.bgPosition) homeBgPosition.value = data.homepage.bgPosition;
                    homeBgPreview.style.backgroundImage = `url('${data.homepage.bgImage}')`;
                    homeBgPreview.style.backgroundSize = homeBgSize.value;
                    homeBgPreview.style.backgroundPosition = homeBgPosition.value;
                    homeBgPreview.style.backgroundRepeat = 'no-repeat';
                    homeBgPreview.style.display = 'block';
                }
                if (data.homepage.bgOpacity !== undefined) {
                    homeBgOpacity.value = data.homepage.bgOpacity;
                    homeBgOpacityVal.textContent = data.homepage.bgOpacity;
                }
                if (data.homepage.galleryCols) homeGalleryCols.value = data.homepage.galleryCols;
            }

            if(data.contactPage) {
                if (data.contactPage.bgType) {
                    contactBgType.value = data.contactPage.bgType;
                    contactBgType.dispatchEvent(new Event('change'));
                }
                if (data.contactPage.bgColor) contactBgColor.value = data.contactPage.bgColor;
                if (data.contactPage.bgImage) {
                    contactBgImage.value = data.contactPage.bgImage;
                    if (data.contactPage.bgSize) contactBgSize.value = data.contactPage.bgSize;
                    if (data.contactPage.bgPosition) contactBgPosition.value = data.contactPage.bgPosition;
                    contactBgPreview.style.backgroundImage = `url('${data.contactPage.bgImage}')`;
                    contactBgPreview.style.backgroundSize = contactBgSize.value;
                    contactBgPreview.style.backgroundPosition = contactBgPosition.value;
                    contactBgPreview.style.backgroundRepeat = 'no-repeat';
                    contactBgPreview.style.display = 'block';
                }
                if (data.contactPage.bgOpacity !== undefined) {
                    contactBgOpacity.value = data.contactPage.bgOpacity;
                    contactBgOpacityVal.textContent = data.contactPage.bgOpacity;
                }
            }
            
            if(data.galleries) {
                allGalleries = data.galleries;
            } else if (data.gallery) {
                // Fallback for older data format
                allGalleries = { home: data.gallery };
            }

            // Populate Gallery Select Dropdown
            updateGalleryDropdown(data.pages || []);
            
            // Render Initial Gallery
            renderCurrentGallery();
            
            if(data.navigation) {
                data.navigation.forEach((item, idx) => renderNavItem(item, idx));
            }
            
            if(data.pages) {
                data.pages.forEach((item, idx) => renderPageItem(item, idx));
            }
        });

    function updateGalleryDropdown(pages) {
        gallerySelect.innerHTML = '<option value="home">Home Page Gallery</option>';
        pages.forEach(p => {
            if (p.pageType === 'standard') return; // Skip non-gallery pages
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = `Custom Page: ${p.title} (${p.id})`;
            gallerySelect.appendChild(opt);
        });
        gallerySelect.value = currentGalleryId;
    }

    gallerySelect.addEventListener('change', (e) => {
        // Save current items to memory
        saveCurrentGalleryToMemory();
        // Switch ID
        currentGalleryId = e.target.value;
        // Render new items
        renderCurrentGallery();
    });

    function saveCurrentGalleryToMemory() {
        const currentItems = [];
        galleryContainer.querySelectorAll('.gallery-item-admin').forEach(div => {
            const hasComparison = div.querySelector('.comparison-toggle').checked;
            currentItems.push({
                id: div.dataset.id || ('item-' + Date.now() + Math.random()),
                image: div.querySelector('.img-path').value,
                image2: hasComparison ? div.querySelector('.img2-path').value : null,
                title: div.querySelector('.item-title').value,
                description: div.querySelector('.item-desc').value,
                bgType: div.querySelector('.item-bg-type').value,
                bgColor: div.querySelector('.item-bg-color').value,
                bgImage: div.querySelector('.item-bg-image-path').value,
                bgSize: div.querySelector('.item-bg-size')?.value || '100% 100%',
                overlay: div.querySelector('.item-overlay').value
            });
        });
        allGalleries[currentGalleryId] = currentItems;
    }

    function renderCurrentGallery() {
        galleryContainer.innerHTML = '';
        const items = allGalleries[currentGalleryId] || [];
        items.forEach((item, idx) => renderGalleryItem(item, idx));
    }

    function renderGalleryItem(item, index) {
        const div = document.createElement('div');
        div.className = 'admin-item gallery-item-admin';
        div.dataset.index = index;
        div.dataset.id = item.id || '';
        div.innerHTML = `
            <div class="form-group">
                <label>Primary Image (Before / Standard)</label>
                <img src="${item.image || 'images/vase.png'}" id="img-preview-${index}">
                <input type="file" accept="image/*" class="file-input" data-index="${index}">
                <input type="hidden" class="img-path" id="img-path-${index}" value="${item.image || ''}">
            </div>
            
            <div class="form-group">
                <label style="display:flex; align-items:center; gap:0.5rem; margin-top: 1rem; cursor:pointer;">
                    <input type="checkbox" class="comparison-toggle" ${item.image2 ? 'checked' : ''}>
                    Enable Before/After Comparison
                </label>
            </div>
            
            <div class="form-group secondary-image-group" style="${item.image2 ? '' : 'display:none;'} border-left: 3px solid var(--accent-color); padding-left: 1rem;">
                <label>Secondary Image (After)</label>
                <img src="${item.image2 || 'images/vase.png'}" id="img2-preview-${index}">
                <input type="file" accept="image/*" class="file-input2" data-index="${index}">
                <input type="hidden" class="img2-path" id="img2-path-${index}" value="${item.image2 || ''}">
            </div>

            <div class="form-group">
                <label>Title</label>
                <input type="text" class="item-title" value="${item.title || ''}" required>
            </div>
            <div class="form-group">
                <label>Image Overlay</label>
                <select class="item-overlay" style="padding: 0.5rem; width: 100%; border-radius: 4px; border: 1px solid var(--border-color); margin-top: 0.5rem;">
                    <option value="none" ${(!item.overlay || item.overlay === 'none') ? 'selected' : ''}>None</option>
                    <option value="coming_soon" ${item.overlay === 'coming_soon' ? 'selected' : ''}>"Coming Soon" (Marine Blue & Yellow)</option>
                    <option value="question_mark" ${item.overlay === 'question_mark' ? 'selected' : ''}>"?" (Marine Blue & Yellow)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Image Background Style (For Transparent Images)</label>
                <select class="item-bg-type" style="padding: 0.5rem; width: 100%; border-radius: 4px; border: 1px solid var(--border-color); margin-top: 0.5rem;">
                    <option value="none" ${(!item.bgType || item.bgType === 'none') && !item.useBg ? 'selected' : ''}>None (Default Card Background)</option>
                    <option value="color" ${item.bgType === 'color' || (item.useBg && !item.bgType) ? 'selected' : ''}>Solid Color</option>
                    <option value="image" ${item.bgType === 'image' ? 'selected' : ''}>Custom Image</option>
                </select>
            </div>
            
            <div class="form-group item-bg-color-group" style="${(item.bgType === 'color' || (item.useBg && !item.bgType)) ? '' : 'display:none;'} margin-top: 0.5rem;">
                <label>Background Color</label>
                <input type="color" class="item-bg-color" value="${item.bgColor || '#ffffff'}" style="height: 30px; cursor: pointer; width: 100%;">
            </div>
            
            <div class="form-group item-bg-image-group" style="${item.bgType === 'image' ? '' : 'display:none;'} margin-top: 0.5rem;">
                <label>Background Image</label>
                <input type="file" accept="image/*" class="item-bg-image-file" data-index="${index}">
                <input type="hidden" class="item-bg-image-path" value="${item.bgImage || ''}">
                <div class="item-bg-image-preview" style="margin-top: 0.5rem; height: 100px; width: 100px; border-radius: 4px; border: 1px solid var(--border-color); background-image: url('${item.bgImage || ''}'); background-size: ${item.bgSize || '100% 100%'}; background-position: center; ${item.bgImage ? '' : 'display:none;'}"></div>
                <div style="margin-top: 0.5rem;">
                    <label>Background Image Size</label>
                    <select class="item-bg-size" style="padding: 0.5rem; width: 100%; border-radius: 4px; border: 1px solid var(--border-color);">
                        <option value="100% 100%" ${(!item.bgSize || item.bgSize === '100% 100%') ? 'selected' : ''}>Full Size (100% 100% Stretch)</option>
                        <option value="cover" ${item.bgSize === 'cover' ? 'selected' : ''}>Cover (Fill Frame, Crop Edges)</option>
                        <option value="contain" ${item.bgSize === 'contain' ? 'selected' : ''}>Contain (Fit Inside)</option>
                        <option value="auto" ${item.bgSize === 'auto' ? 'selected' : ''}>Auto (Original Dimensions)</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="item-desc" rows="3" required>${item.description || ''}</textarea>
            </div>
            <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                <button type="button" class="add-btn" onclick="moveItemUp(this)" style="background-color: #6c757d !important; flex: 1;">⬆️ Move Up</button>
                <button type="button" class="add-btn" onclick="moveItemDown(this)" style="background-color: #6c757d !important; flex: 1;">⬇️ Move Down</button>
                <button type="button" class="delete-btn" onclick="this.parentElement.parentElement.remove()" style="margin-top: 0; flex: 1;">Delete Print</button>
            </div>
        `;
        galleryContainer.appendChild(div);

        const toggleBtn = div.querySelector('.comparison-toggle');
        const secondaryGroup = div.querySelector('.secondary-image-group');
        toggleBtn.addEventListener('change', (e) => {
            secondaryGroup.style.display = e.target.checked ? 'block' : 'none';
        });

        const fileInput = div.querySelector('.file-input');
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const result = await res.json();
            if(result.url) {
                div.querySelector(`#img-preview-${index}`).src = result.url;
                div.querySelector(`#img-path-${index}`).value = result.url;
            }
        });
        
        const fileInput2 = div.querySelector('.file-input2');
        fileInput2.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const result = await res.json();
            if(result.url) {
                div.querySelector(`#img2-preview-${index}`).src = result.url;
                div.querySelector(`#img2-path-${index}`).value = result.url;
            }
        });

        const bgTypeSelect = div.querySelector('.item-bg-type');
        const bgColorGroup = div.querySelector('.item-bg-color-group');
        const bgImageGroup = div.querySelector('.item-bg-image-group');

        bgTypeSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            bgColorGroup.style.display = val === 'color' ? 'block' : 'none';
            bgImageGroup.style.display = val === 'image' ? 'block' : 'none';
        });

        const bgImageFile = div.querySelector('.item-bg-image-file');
        const bgImagePath = div.querySelector('.item-bg-image-path');
        const bgImagePreview = div.querySelector('.item-bg-image-preview');
        const bgSizeSelect = div.querySelector('.item-bg-size');

        bgImageFile.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const result = await res.json();
            if(result.url) {
                bgImagePath.value = result.url;
                bgImagePreview.style.backgroundImage = `url('${result.url}')`;
                bgImagePreview.style.display = 'block';
            }
        });
        
        bgSizeSelect.addEventListener('change', (e) => {
            bgImagePreview.style.backgroundSize = e.target.value;
        });
    }

    function renderNavItem(item, index) {
        const div = document.createElement('div');
        div.className = 'admin-item nav-item-admin';
        div.innerHTML = `
            <div class="form-group">
                <label>Link Title</label>
                <input type="text" class="nav-title" value="${item.title || ''}" required>
            </div>
            <div class="form-group">
                <label>URL (e.g. 'page.html?id=about' or 'index.html')</label>
                <input type="text" class="nav-url" value="${item.url || ''}" required placeholder="e.g. page.html?id=about">
            </div>
            <button type="button" class="delete-btn" onclick="this.parentElement.remove()">Delete Link</button>
        `;
        navContainer.appendChild(div);
    }

    function renderPageItem(item, index) {
        const div = document.createElement('div');
        div.className = 'admin-item page-item-admin';
        div.innerHTML = `
            <div class="form-group">
                <label>Page ID (e.g. 'about' or 'faq')</label>
                <input type="text" class="page-id" value="${item.id || ''}" required placeholder="e.g. about">
            </div>
            <div class="form-group">
                <label>Page Title</label>
                <input type="text" class="page-title" value="${item.title || ''}" required>
            </div>
            <div class="form-group">
                <label>HTML Content</label>
                <div class="quill-editor" style="height: 200px; background: #fff; color: #000;"></div>
            </div>
            <div class="form-group" style="margin-top: 1rem;">
                <label>Page Type</label>
                <select class="page-type-select" style="padding: 0.5rem; width: 100%; border-radius: 4px; border: 1px solid var(--border-color);">
                    <option value="gallery" ${(!item.pageType || item.pageType === 'gallery') ? 'selected' : ''}>Gallery Page (Has Image Grid)</option>
                    <option value="standard" ${item.pageType === 'standard' ? 'selected' : ''}>Standard Text Page (No Grid)</option>
                </select>
            </div>
            <div class="form-group" style="margin-top: 1rem;">
                <label>Background Type</label>
                <select class="page-bg-type" style="padding: 0.5rem; width: 100%; border-radius: 4px; border: 1px solid var(--border-color);">
                    <option value="default" ${(!item.bgType || item.bgType === 'default') ? 'selected' : ''}>Default Theme Background</option>
                    <option value="color" ${item.bgType === 'color' ? 'selected' : ''}>Solid Color</option>
                    <option value="image" ${item.bgType === 'image' ? 'selected' : ''}>Image</option>
                </select>
            </div>
            <div class="form-group page-bg-color-group" style="${item.bgType === 'color' ? '' : 'display:none;'} margin-top: 1rem;">
                <label>Background Color</label>
                <input type="color" class="page-bg-color" value="${item.bgColor || '#ffffff'}" style="width: 100%; height: 40px;">
            </div>
            <div class="form-group page-bg-image-group" style="${item.bgType === 'image' ? '' : 'display:none;'} margin-top: 1rem;">
                <label>Background Image</label>
                <input type="file" accept="image/*" class="page-bg-image-file">
                <input type="hidden" class="page-bg-image" value="${item.bgImage || ''}">
                
                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                    <div class="form-group" style="flex: 1;">
                        <label>Background Size</label>
                        <select class="page-bg-size" style="padding: 0.5rem; width: 100%; border-radius: 4px; border: 1px solid var(--border-color);">
                            <option value="cover" ${item.bgSize === 'cover' ? 'selected' : ''}>Cover (Fill Screen)</option>
                            <option value="contain" ${item.bgSize === 'contain' ? 'selected' : ''}>Contain (Fit to Screen)</option>
                            <option value="auto" ${item.bgSize === 'auto' ? 'selected' : ''}>Auto (Original Size)</option>
                            <option value="100% 100%" ${item.bgSize === '100% 100%' ? 'selected' : ''}>Stretch to Fill</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label>Background Position</label>
                        <select class="page-bg-position" style="padding: 0.5rem; width: 100%; border-radius: 4px; border: 1px solid var(--border-color);">
                            <option value="center" ${item.bgPosition === 'center' ? 'selected' : ''}>Center</option>
                            <option value="top left" ${item.bgPosition === 'top left' ? 'selected' : ''}>Top Left</option>
                            <option value="top center" ${item.bgPosition === 'top center' ? 'selected' : ''}>Top Center</option>
                            <option value="top right" ${item.bgPosition === 'top right' ? 'selected' : ''}>Top Right</option>
                            <option value="bottom left" ${item.bgPosition === 'bottom left' ? 'selected' : ''}>Bottom Left</option>
                            <option value="bottom center" ${item.bgPosition === 'bottom center' ? 'selected' : ''}>Bottom Center</option>
                            <option value="bottom right" ${item.bgPosition === 'bottom right' ? 'selected' : ''}>Bottom Right</option>
                        </select>
                    </div>
                </div>
                <div class="form-group" style="margin-top: 1rem;">
                    <label>Background Opacity: <span class="page-bg-opacity-val">${item.bgOpacity !== undefined ? item.bgOpacity : '1'}</span></label>
                    <input type="range" class="page-bg-opacity" min="0.05" max="1" step="0.05" value="${item.bgOpacity !== undefined ? item.bgOpacity : '1'}" style="width: 100%;">
                </div>
                
                <label style="margin-top: 1rem; display: block;">Live Preview</label>
                <div class="page-bg-preview" style="width: 100%; height: 200px; border: 1px solid var(--border-color); border-radius: 4px; margin-top:0.5rem; ${item.bgImage ? '' : 'display:none;'} background-image: url('${item.bgImage || ''}'); background-size: ${item.bgSize || 'cover'}; background-position: ${item.bgPosition || 'center'}; background-repeat: no-repeat; opacity: ${item.bgOpacity || '1'};"></div>
            </div>
            
            <div class="form-group" style="margin-top: 1rem;">
                <label>Gallery Columns (Thumbnails Across)</label>
                <select class="page-gallery-cols" style="padding: 0.5rem; width: 100%; border-radius: 4px; border: 1px solid var(--border-color);">
                    <option value="auto" ${(!item.galleryCols || item.galleryCols === 'auto') ? 'selected' : ''}>Auto (Responsive)</option>
                    <option value="2" ${item.galleryCols === '2' ? 'selected' : ''}>2 Columns</option>
                    <option value="3" ${item.galleryCols === '3' ? 'selected' : ''}>3 Columns</option>
                    <option value="4" ${item.galleryCols === '4' ? 'selected' : ''}>4 Columns</option>
                    <option value="5" ${item.galleryCols === '5' ? 'selected' : ''}>5 Columns</option>
                </select>
            </div>
            <button type="button" class="delete-btn" onclick="this.parentElement.remove()">Delete Page</button>
        `;
        pagesContainer.appendChild(div);

        // Setup background handlers for this page
        const bgType = div.querySelector('.page-bg-type');
        const bgColorGroup = div.querySelector('.page-bg-color-group');
        const bgImageGroup = div.querySelector('.page-bg-image-group');
        const bgImageFile = div.querySelector('.page-bg-image-file');
        const bgImage = div.querySelector('.page-bg-image');
        const bgPreview = div.querySelector('.page-bg-preview');
        const bgSize = div.querySelector('.page-bg-size');
        const bgPosition = div.querySelector('.page-bg-position');
        const bgOpacity = div.querySelector('.page-bg-opacity');
        const bgOpacityVal = div.querySelector('.page-bg-opacity-val');

        setupBackgroundHandlers(bgType, bgColorGroup, bgImageGroup, bgImageFile, bgImage, bgPreview, bgSize, bgPosition, bgOpacity, bgOpacityVal);

        const editorContainer = div.querySelector('.quill-editor');
        const quill = new Quill(editorContainer, {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image']
                ]
            }
        });
        
        quill.clipboard.dangerouslyPasteHTML(item.content || '');
        div.quillInstance = quill;
    }

    addGalleryBtn.addEventListener('click', () => {
        renderGalleryItem({ id: 'item-' + Date.now(), title: 'New Print', description: 'Description here...' }, Date.now());
    });
    
    const bulkAddBtn = document.getElementById('bulk-add-btn');
    const bulkUploadInput = document.getElementById('bulk-upload-input');
    const bulkBgTypeSelect = document.getElementById('bulk-bg-type');
    const bulkBgColorInput = document.getElementById('bulk-bg-color');
    const bulkBgImageGroup = document.getElementById('bulk-bg-image-group');
    const bulkBgImageFile = document.getElementById('bulk-bg-image-file');
    const bulkBgImagePath = document.getElementById('bulk-bg-image-path');
    const bulkBgImageStatus = document.getElementById('bulk-bg-image-status');
    
    if (bulkBgTypeSelect && bulkBgColorInput && bulkBgImageGroup) {
        bulkBgTypeSelect.addEventListener('change', (e) => {
            bulkBgColorInput.style.display = e.target.value === 'color' ? 'block' : 'none';
            bulkBgImageGroup.style.display = e.target.value === 'image' ? 'flex' : 'none';
        });
    }

    if (bulkBgImageFile && bulkBgImagePath) {
        bulkBgImageFile.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            bulkBgImageStatus.style.display = 'none';
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const result = await res.json();
            if(result.url) {
                bulkBgImagePath.value = result.url;
                bulkBgImageStatus.style.display = 'inline';
            }
        });
    }
    
    if (bulkAddBtn && bulkUploadInput) {
        bulkAddBtn.addEventListener('click', () => {
            bulkUploadInput.click();
        });
        
        bulkUploadInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;
            
            const originalText = bulkAddBtn.textContent;
            bulkAddBtn.textContent = `Uploading 0 / ${files.length}...`;
            bulkAddBtn.disabled = true;
            
            const bulkBgType = bulkBgTypeSelect ? bulkBgTypeSelect.value : 'none';
            const bulkBgColor = bulkBgColorInput ? bulkBgColorInput.value : '#ffffff';
            const bulkBgImage = bulkBgImagePath ? bulkBgImagePath.value : '';
            
            let count = 0;
            for (const file of files) {
                const formData = new FormData();
                formData.append('image', file);
                try {
                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                    const result = await res.json();
                    if (result.url) {
                        const title = file.name.split('.').slice(0, -1).join('.') || 'New Print';
                        renderGalleryItem({
                            id: 'item-' + Date.now() + Math.random().toString().substr(2, 5),
                            title: title,
                            description: title,
                            image: result.url,
                            bgType: bulkBgType,
                            bgColor: bulkBgColor,
                            bgImage: bulkBgImage
                        }, Date.now());
                    }
                } catch (err) {
                    console.error('Bulk upload error', err);
                }
                count++;
                bulkAddBtn.textContent = `Uploading ${count} / ${files.length}...`;
            }
            
            bulkAddBtn.textContent = originalText;
            bulkAddBtn.disabled = false;
            bulkUploadInput.value = ''; // Reset
        });
    }
    
    addNavBtn.addEventListener('click', () => {
        renderNavItem({ title: 'New Link', url: 'page.html?id=new' }, Date.now());
    });
    
    addPageBtn.addEventListener('click', () => {
        renderPageItem({ id: 'new-page', title: 'New Page', content: '<p>Content goes here.</p>' }, Date.now());
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const saveBtn = document.getElementById('save-btn');
        saveBtn.textContent = 'Saving...';
        
        // Save the currently visible gallery to memory before final save
        saveCurrentGalleryToMemory();
        
        const newNav = [];
        navContainer.querySelectorAll('.nav-item-admin').forEach(div => {
            newNav.push({
                title: div.querySelector('.nav-title').value,
                url: div.querySelector('.nav-url').value
            });
        });
        
        const newPages = [];
        pagesContainer.querySelectorAll('.page-item-admin').forEach(div => {
            newPages.push({
                id: div.querySelector('.page-id').value,
                title: div.querySelector('.page-title').value,
                content: div.quillInstance.root.innerHTML,
                bgType: div.querySelector('.page-bg-type').value,
                bgColor: div.querySelector('.page-bg-color').value,
                bgImage: div.querySelector('.page-bg-image').value,
                bgSize: div.querySelector('.page-bg-size').value,
                bgPosition: div.querySelector('.page-bg-position').value,
                bgOpacity: div.querySelector('.page-bg-opacity').value,
                galleryCols: div.querySelector('.page-gallery-cols') ? div.querySelector('.page-gallery-cols').value : 'auto',
                pageType: div.querySelector('.page-type-select').value
            });
        });

        // Sync dropdown to make sure if they changed a page ID, it updates the dropdown next time
        // (For a perfect UX we'd update it live, but updating on save is fine for now).

        const newData = {
            homepage: {
                title: titleInput.value,
                subtitle: subtitleInput.value,
                bgType: homeBgType.value,
                bgColor: homeBgColor.value,
                bgImage: homeBgImage.value,
                bgSize: homeBgSize.value,
                bgPosition: homeBgPosition.value,
                bgOpacity: homeBgOpacity.value,
                galleryCols: homeGalleryCols.value
            },
            contactPage: {
                bgType: contactBgType.value,
                bgColor: contactBgColor.value,
                bgImage: contactBgImage.value,
                bgSize: contactBgSize.value,
                bgPosition: contactBgPosition.value,
                bgOpacity: contactBgOpacity.value
            },
            galleries: allGalleries,
            navigation: newNav,
            pages: newPages
        };

        try {
            const res = await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            });
            if (!res.ok) throw new Error('API save failed');
            saveBtn.textContent = 'Saved!';
            setTimeout(() => saveBtn.textContent = 'Save All Changes', 2000);
        } catch (err) {
            // Static hosting fallback (e.g. GitHub Pages): download updated data.json
            const blob = new Blob([JSON.stringify(newData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.json';
            a.click();
            URL.revokeObjectURL(url);
            saveBtn.textContent = 'Downloaded data.json!';
            alert('Notice: When hosted statically on GitHub Pages, direct server save is unavailable. An updated data.json file has been downloaded. Simply replace data.json in your repository and commit to update your site!');
            setTimeout(() => saveBtn.textContent = 'Save All Changes', 3000);
        }
        
        updateGalleryDropdown(newPages);
    });

    // Global functions for reordering
    window.moveItemUp = function(btn) {
        const item = btn.closest('.admin-item');
        if (item.previousElementSibling) {
            item.parentNode.insertBefore(item, item.previousElementSibling);
        }
    };

    window.moveItemDown = function(btn) {
        const item = btn.closest('.admin-item');
        if (item.nextElementSibling) {
            item.parentNode.insertBefore(item.nextElementSibling, item);
        }
    };
});
