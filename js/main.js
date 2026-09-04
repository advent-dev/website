document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('theme', targetTheme);
            updateThemeIcon(targetTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        themeToggleBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    }

    let appData = null;
    let currentTargetGalleryId = 'home';

    // Dynamic Data Loading for Navigation and Content (compatible with static GitHub Pages & local server)
    const loadAppData = async () => {
        if (window.SITE_DATA) return window.SITE_DATA;
        try {
            const res = await fetch('data.json');
            if (res.ok) return await res.json();
        } catch (e) {}
        try {
            const res = await fetch('/api/data');
            if (res.ok) return await res.json();
        } catch (e) {}
        throw new Error('Could not load website data');
    };

    loadAppData()
        .then(data => {
            appData = data;
            // Determine current page ID
            const urlParams = new URLSearchParams(window.location.search);
            const pageId = urlParams.get('id');
            const isCustomPage = !!pageId;

            // 1. Render Navigation
            const navContainer = document.getElementById('nav-links-container');
            if (navContainer && data.navigation) {
                navContainer.innerHTML = '';
                
                // 1. Identify all gallery pages (Home is always a gallery, custom pages if pageType !== 'standard')
                const galleryPages = (data.pages || []).filter(p => !p.pageType || p.pageType === 'gallery');
                
                // 2. Render standard top-level links (exclude links to gallery pages)
                data.navigation.forEach(link => {
                    // Check if this link points to a custom gallery page
                    const isGalleryLink = galleryPages.some(gp => link.url.includes(`id=${gp.id}`));
                    // Also exclude Home from top-level if it's considered a gallery
                    const isHomeLink = link.url === 'index.html' || link.url === '/';
                    
                    if (!isGalleryLink && !isHomeLink) {
                        const a = document.createElement('a');
                        a.href = link.url;
                        a.textContent = link.title;
                        navContainer.appendChild(a);
                    }
                });

                // 3. Add a dropdown for Galleries
                const dropdownDiv = document.createElement('div');
                dropdownDiv.className = 'nav-dropdown';
                
                let dropdownHtml = `
                    <a href="#" class="dropdown-toggle" onclick="event.preventDefault()">Galleries ▾</a>
                    <div class="dropdown-content">
                        <a href="index.html">Home</a>
                `;
                galleryPages.forEach(gp => {
                    dropdownHtml += `<a href="page.html?id=${gp.id}">${gp.title || gp.id}</a>`;
                });
                dropdownHtml += `</div>`;
                
                dropdownDiv.innerHTML = dropdownHtml;
                navContainer.appendChild(dropdownDiv);
            }

            const navPageTitle = document.getElementById('nav-page-title');
            
            // 2. Render Custom Page Content
            const customPageContainer = document.getElementById('custom-page-container');
            const customPageTitle = document.getElementById('custom-page-title');
            if (customPageContainer && isCustomPage) {
                const pageData = data.pages?.find(p => p.id === pageId);
                if (pageData) {
                    if (customPageTitle) customPageTitle.textContent = pageData.title;
                    if (navPageTitle) navPageTitle.textContent = pageData.title;
                    customPageContainer.innerHTML = pageData.content;
                } else {
                    if (customPageTitle) customPageTitle.textContent = "Page Not Found";
                    if (navPageTitle) navPageTitle.textContent = "Page Not Found";
                    customPageContainer.innerHTML = "<p>The page you requested does not exist.</p>";
                }
            }

            // 3. Render Homepage Text
            const homepageTitle = document.getElementById('homepage-title');
            const homepageSubtitle = document.getElementById('homepage-subtitle');
            if (homepageTitle) homepageTitle.textContent = data.homepage?.title || '';
            if (homepageSubtitle) homepageSubtitle.textContent = data.homepage?.subtitle || '';
            
            if (!isCustomPage) {
                const currentPath = window.location.pathname;
                if (currentPath.includes('contact.html')) {
                    if (navPageTitle) navPageTitle.textContent = "Contact";
                } else if (currentPath.includes('admin.html')) {
                    if (navPageTitle) navPageTitle.textContent = "Admin Panel";
                } else {
                    if (navPageTitle) navPageTitle.textContent = data.homepage?.title || "Home";
                }
            }

            // Apply Background settings based on the current page
            let currentBgConfig = null;
            const currentPath = window.location.pathname;
            
            if (isCustomPage) {
                const pageData = data.pages?.find(p => p.id === pageId);
                if (pageData && pageData.bgType) {
                    currentBgConfig = { 
                        type: pageData.bgType, 
                        color: pageData.bgColor, 
                        image: pageData.bgImage,
                        size: pageData.bgSize,
                        position: pageData.bgPosition,
                        opacity: pageData.bgOpacity
                    };
                }
            } else if (currentPath.includes('contact.html')) {
                if (data.contactPage && data.contactPage.bgType) {
                    currentBgConfig = { 
                        type: data.contactPage.bgType, 
                        color: data.contactPage.bgColor, 
                        image: data.contactPage.bgImage,
                        size: data.contactPage.bgSize,
                        position: data.contactPage.bgPosition,
                        opacity: data.contactPage.bgOpacity
                    };
                }
            } else {
                // Default to homepage
                if (data.homepage && data.homepage.bgType) {
                    currentBgConfig = { 
                        type: data.homepage.bgType, 
                        color: data.homepage.bgColor, 
                        image: data.homepage.bgImage,
                        size: data.homepage.bgSize,
                        position: data.homepage.bgPosition,
                        opacity: data.homepage.bgOpacity
                    };
                }
            }

            let bgLayer = document.getElementById('page-bg-layer');
            if (!bgLayer) {
                bgLayer = document.createElement('div');
                bgLayer.id = 'page-bg-layer';
                bgLayer.style.position = 'fixed';
                bgLayer.style.top = '0';
                bgLayer.style.left = '0';
                bgLayer.style.width = '100vw';
                bgLayer.style.height = '100vh';
                bgLayer.style.zIndex = '-1';
                bgLayer.style.pointerEvents = 'none';
                document.body.prepend(bgLayer);
            }

            if (currentBgConfig && currentBgConfig.type !== 'default') {
                document.body.style.backgroundColor = 'transparent'; // Let the body background fall back to the CSS var
                
                if (currentBgConfig.type === 'color' && currentBgConfig.color) {
                    bgLayer.style.backgroundColor = currentBgConfig.color;
                    bgLayer.style.backgroundImage = 'none';
                    bgLayer.style.opacity = currentBgConfig.opacity !== undefined ? currentBgConfig.opacity : '1';
                } else if (currentBgConfig.type === 'image' && currentBgConfig.image) {
                    bgLayer.style.backgroundImage = `url('${currentBgConfig.image}')`;
                    bgLayer.style.backgroundSize = currentBgConfig.size || 'cover';
                    bgLayer.style.backgroundPosition = currentBgConfig.position || 'center';
                    bgLayer.style.backgroundRepeat = 'no-repeat';
                    bgLayer.style.backgroundColor = 'transparent';
                    bgLayer.style.opacity = currentBgConfig.opacity !== undefined ? currentBgConfig.opacity : '1';
                }
            } else {
                bgLayer.style.backgroundImage = 'none';
                bgLayer.style.backgroundColor = 'transparent';
                document.body.style.backgroundColor = 'var(--bg-color)';
            }

            // 4. Render Gallery (Homepage or Custom Page)
            const galleryContainer = document.getElementById('gallery-container');
            if (galleryContainer) {
                currentTargetGalleryId = isCustomPage ? pageId : 'home';
                
                let currentCols = 'auto';
                if (isCustomPage) {
                    const pageData = data.pages?.find(p => p.id === pageId);
                    if (pageData && pageData.galleryCols) currentCols = pageData.galleryCols;
                } else if (!currentPath.includes('contact.html')) {
                    if (data.homepage && data.homepage.galleryCols) currentCols = data.homepage.galleryCols;
                }
                
                if (currentCols !== 'auto') {
                    galleryContainer.setAttribute('data-cols', currentCols);
                } else {
                    galleryContainer.removeAttribute('data-cols');
                }
                
                let galleryItems = [];
                if (isCustomPage) {
                    const pageData = data.pages?.find(p => p.id === pageId);
                    if (pageData && pageData.pageType === 'standard') {
                        galleryContainer.style.display = 'none';
                        return; // Do not render gallery
                    }
                }

                if (data.galleries && data.galleries[currentTargetGalleryId]) {
                    galleryItems = data.galleries[currentTargetGalleryId];
                } else if (!isCustomPage && data.gallery) {
                    galleryItems = data.gallery;
                }

                renderGallery(galleryItems);
            }
        });

    function renderGallery(items) {
        const galleryContainer = document.getElementById('gallery-container');
        if (!galleryContainer) return;
        
        galleryContainer.innerHTML = '';
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.dataset.image = item.image;
            div.dataset.image2 = item.image2 || '';
            div.dataset.bgType = item.bgType || (item.useBg ? 'color' : 'none');
            div.dataset.bgColor = item.bgColor || '';
            div.dataset.bgImage = item.bgImage || '';
            div.dataset.bgSize = item.bgSize || '100% 100%';
            div.dataset.overlay = item.overlay || 'none';
            
            let bgStyle = '';
            if (item.bgType === 'color' || (item.useBg && (!item.bgType || item.bgType === 'none'))) {
                bgStyle = `background-color: ${item.bgColor} !important;`;
            } else if (item.bgType === 'image' && item.bgImage) {
                bgStyle = `background-image: url('${item.bgImage}') !important; background-size: ${item.bgSize || '100% 100%'} !important; background-position: center !important;`;
            }

            let overlayHtml = '';
            if (item.overlay === 'coming_soon') {
                overlayHtml = `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; z-index: 10; pointer-events: none;">
                    <span style="background-color: rgba(0, 51, 102, 0.9); color: #FFD700; font-weight: bold; font-size: 1.5rem; text-align: center; border-radius: 8px; padding: 0.5rem 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">Coming Soon</span>
                </div>`;
            } else if (item.overlay === 'question_mark') {
                overlayHtml = `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; z-index: 10; pointer-events: none;">
                    <span style="background-color: rgba(0, 51, 102, 0.9); color: #FFD700; font-weight: bold; font-size: 4rem; text-align: center; border-radius: 50%; width: 6rem; height: 6rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">?</span>
                </div>`;
            }
            
            div.innerHTML = `
                <div style="position: relative; line-height: 0;">
                    <img src="${item.image}" alt="${item.title}" style="${bgStyle}">
                    ${overlayHtml}
                </div>
                <div class="gallery-item-info">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            galleryContainer.appendChild(div);
        });
        bindModalEvents();
    }

    // Lightbox Modal
    const modal = document.getElementById('image-modal');
    const modalContentContainer = document.getElementById('modal-content-container');
    const closeBtn = document.querySelector('.close-modal');

    function bindModalEvents() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length > 0 && modal && modalContentContainer) {
            galleryItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    const overlay = item.dataset.overlay;
                    if (overlay === 'coming_soon' || overlay === 'question_mark') {
                        return; // Prevent opening modal on overlay placeholders
                    }
                    
                    const img1 = item.dataset.image;
                    const img2 = item.dataset.image2;
                    const bgType = item.dataset.bgType;
                    const bgColor = item.dataset.bgColor;
                    const bgImage = item.dataset.bgImage;
                    const bgSize = item.dataset.bgSize;
                    
                    let bgStyle = '';
                    if (bgType === 'color') {
                        bgStyle = `background-color: ${bgColor} !important;`;
                    } else if (bgType === 'image' && bgImage) {
                        bgStyle = `background-image: url('${bgImage}') !important; background-size: ${bgSize} !important; background-position: center !important;`;
                    }
                    
                    if (img2 && img2 !== 'null' && img2 !== 'undefined' && img2.trim() !== '') {
                        if (bgType === 'image' && bgImage) {
                            modalContentContainer.innerHTML = `
                                <div class="modal-comp-wrapper" style="${bgStyle}">
                                    <div class="img-comp-container modal-comp-container" style="position: relative; display: block;">
                                        <img src="${bgImage}" style="max-width: 90vw; max-height: 85vh; display: block; visibility: hidden;">
                                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                                            <img src="${img2}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px;" id="base-modal-img">
                                            <div class="img-comp-overlay" style="position: absolute; top: 0; left: 0; height: 100%; width: 50%; overflow: hidden;">
                                                <img src="${img1}" style="width: 100%; height: 100%; object-fit: contain; max-width: none; border-radius: 4px;" id="overlay-modal-img">
                                            </div>
                                            <div class="img-comp-slider"></div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        } else {
                            modalContentContainer.innerHTML = `
                                <div class="modal-comp-wrapper" style="${bgStyle}">
                                    <div class="img-comp-container modal-comp-container" style="position: relative; display: block;">
                                        <img src="${img2}" class="modal-content" style="max-width: 90vw; max-height: 85vh; display: block;" id="base-modal-img">
                                        <div class="img-comp-overlay" style="position: absolute; top: 0; left: 0; height: 100%; width: 50%; overflow: hidden;">
                                            <img src="${img1}" class="modal-content" style="height: 100%; width: auto; max-width: none;" id="overlay-modal-img">
                                        </div>
                                        <div class="img-comp-slider"></div>
                                    </div>
                                </div>
                            `;
                        }
                        
                        modal.classList.add('active');
                        
                        // Wait for images to load before setting width and init slider
                        const baseImg = document.getElementById('base-modal-img');
                        const overlayImg = document.getElementById('overlay-modal-img');
                        const sizingImg = bgType === 'image' && bgImage ? modalContentContainer.querySelector('img[style*="visibility: hidden"]') : baseImg;
                        
                        if(sizingImg.complete) {
                            setupSlider(baseImg, overlayImg);
                        } else {
                            sizingImg.onload = () => setupSlider(baseImg, overlayImg);
                        }
                    } else {
                        if (bgType === 'image' && bgImage) {
                            modalContentContainer.innerHTML = `
                                <div class="modal-comp-wrapper" style="${bgStyle}">
                                    <div style="position: relative; display: block;">
                                        <img src="${bgImage}" style="max-width: 90vw; max-height: 85vh; display: block; visibility: hidden;">
                                        <img src="${img1}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; border-radius: 4px;">
                                    </div>
                                </div>
                            `;
                        } else {
                            modalContentContainer.innerHTML = `<img src="${img1}" class="modal-content" style="${bgStyle}">`;
                        }
                        modal.classList.add('active');
                    }
                });
            });
        }
    }
    
    function setupSlider(baseImg, overlayImg) {
        // Force the overlay image to match the exact pixel dimensions of the base image
        const exactWidth = baseImg.getBoundingClientRect().width;
        overlayImg.style.width = exactWidth + "px";
        
        // Re-run this check on window resize
        window.addEventListener('resize', () => {
            if(document.getElementById('base-modal-img')) {
                overlayImg.style.width = document.getElementById('base-modal-img').getBoundingClientRect().width + "px";
            }
        });
        
        initComparisons();
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            modalContentContainer.innerHTML = ''; // clear contents
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                modalContentContainer.innerHTML = '';
            }
        });
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Basic simulation of sending
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = 'Message Sent!';
                contactForm.reset();
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // Image Comparison Slider Logic
    function initComparisons() {
        var overlays = document.getElementsByClassName("img-comp-overlay");
        for (var i = 0; i < overlays.length; i++) {
            compareImages(overlays[i]);
        }
        function compareImages(img) {
            var slider, clicked = 0;
            slider = img.parentElement.querySelector('.img-comp-slider');
            if(!slider) return;
            
            // Set initial state to 50%
            img.style.width = "50%";
            slider.style.left = "50%";
            
            // Prevent multiple bindings if called multiple times
            slider.replaceWith(slider.cloneNode(true));
            slider = img.parentElement.querySelector('.img-comp-slider');
            
            slider.addEventListener("mousedown", slideReady);
            window.addEventListener("mouseup", slideFinish);
            slider.addEventListener("touchstart", slideReady, {passive: false});
            window.addEventListener("touchend", slideFinish);
            
            function slideReady(e) {
                e.preventDefault();
                clicked = 1;
                window.addEventListener("mousemove", slideMove);
                window.addEventListener("touchmove", slideMove, {passive: false});
            }
            function slideFinish() {
                clicked = 0;
                window.removeEventListener("mousemove", slideMove);
                window.removeEventListener("touchmove", slideMove);
            }
            function slideMove(e) {
                var pos, percentage, currentW;
                if (clicked == 0) return false;
                e.preventDefault();
                currentW = img.parentElement.offsetWidth;
                pos = getCursorPos(e);
                percentage = (pos / currentW) * 100;
                
                if (percentage < 0) percentage = 0;
                if (percentage > 100) percentage = 100;
                
                img.style.width = percentage + "%";
                slider.style.left = percentage + "%";
            }
            function getCursorPos(e) {
                var a, x = 0;
                e = (e.changedTouches) ? e.changedTouches[0] : e;
                a = img.getBoundingClientRect();
                x = e.pageX - a.left;
                x = x - window.pageXOffset;
                return x;
            }
        }
    }

    // Search functionality
    const searchToggleBtn = document.getElementById('search-toggle');
    const searchInput = document.getElementById('search-input');
    
    if (searchToggleBtn && searchInput) {
        searchToggleBtn.addEventListener('click', () => {
            searchInput.classList.toggle('active');
            if (searchInput.classList.contains('active')) {
                searchInput.focus();
            } else {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input')); // clear search
            }
        });

        searchInput.addEventListener('input', (e) => {
            if (!appData) return;
            const query = e.target.value.toLowerCase().trim();
            
            if (query === '') {
                // Restore current gallery
                let galleryItems = [];
                if (appData.galleries && appData.galleries[currentTargetGalleryId]) {
                    galleryItems = appData.galleries[currentTargetGalleryId];
                } else if (appData.gallery) {
                    galleryItems = appData.gallery;
                }
                renderGallery(galleryItems);
            } else {
                // Search across all galleries
                let matchedItems = [];
                if (appData.galleries) {
                    for (const galItems of Object.values(appData.galleries)) {
                        matchedItems = matchedItems.concat(galItems.filter(item => 
                            (item.title || '').toLowerCase().includes(query) && item.overlay !== 'question_mark'
                        ));
                    }
                } else if (appData.gallery) {
                    matchedItems = appData.gallery.filter(item => 
                        (item.title || '').toLowerCase().includes(query) && item.overlay !== 'question_mark'
                    );
                }
                
                // Deduplicate items just in case the same print is in multiple galleries
                const uniqueIds = new Set();
                const uniqueItems = [];
                for (const item of matchedItems) {
                    if (!uniqueIds.has(item.id)) {
                        uniqueIds.add(item.id);
                        uniqueItems.push(item);
                    }
                }
                
                renderGallery(uniqueItems);
            }
        });
    }
});
