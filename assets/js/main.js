(() => {
    const header = document.querySelector('.site-header');
    const toggle = header.querySelector('.menu-toggle');
    const menu = header.querySelector('.mobile-nav');
    const desktop = matchMedia('(min-width: 901px)');

    function setMenu(open) {
        menu.hidden = !open;
        toggle.setAttribute('aria-expanded', open);
        toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    }

    toggle.addEventListener('click', () => setMenu(menu.hidden));
    menu.addEventListener('click', event => {
        const link = event.target.closest('a');
        if (!link) return;
        setMenu(false);
        if (link.hash && link.pathname === location.pathname) {
            const section = document.getElementById(link.hash.slice(1));
            if (section) {
                section.tabIndex = -1;
                section.focus({ preventScroll: true });
            }
        }
    });
    document.addEventListener('pointerdown', event => {
        if (!menu.hidden && !header.contains(event.target)) setMenu(false);
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !menu.hidden) {
            setMenu(false);
            toggle.focus();
        }
    });
    desktop.addEventListener('change', () => setMenu(false));

    const desktopNav = header.querySelector('.desktop-nav');
    const tabLens = document.createElement('span');
    tabLens.className = 'tab-lens';
    tabLens.setAttribute('aria-hidden', 'true');
    desktopNav.prepend(tabLens);
    desktopNav.classList.add('has-tab-lens');

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const currentTab = desktopNav.querySelector('[aria-current]');
    let hoveredTab;
    let displayedTab;
    let stretch;

    function positionTabLens() {
        const tab = desktop.matches && (hoveredTab || desktopNav.querySelector('a:focus-visible') || currentTab);
        const wasVisible = Boolean(displayedTab);
        const isChangingTab = wasVisible && tab && tab !== displayedTab;
        displayedTab = tab;
        tabLens.classList.toggle('is-moving', wasVisible && Boolean(tab));
        tabLens.classList.toggle('is-visible', Boolean(tab));
        if (!tab) return;

        tabLens.style.setProperty('--tab-offset', tab.offsetLeft + 'px');
        tabLens.style.setProperty('--tab-width', tab.offsetWidth + 'px');

        if (isChangingTab && !reducedMotion.matches && tabLens.animate) {
            stretch?.cancel();
            stretch = tabLens.animate([
                { scale: '1 1' },
                { scale: '1.085 .94', offset: 0.34 },
                { scale: '1 1' }
            ], { duration: 350, easing: 'ease-out' });
        }
    }

    desktopNav.addEventListener('pointermove', event => {
        if (event.pointerType === 'touch') return;
        const tab = event.target.closest('a');
        if (!tab) return;
        if (tab !== hoveredTab) {
            hoveredTab = tab;
            positionTabLens();
        }
        if (!reducedMotion.matches) {
            const bounds = tab.getBoundingClientRect();
            tabLens.style.setProperty('--tab-glint', ((event.clientX - bounds.left) / bounds.width * 100) + '%');
        }
    });
    desktopNav.addEventListener('pointerleave', () => {
        hoveredTab = null;
        tabLens.style.removeProperty('--tab-glint');
        positionTabLens();
    });
    desktopNav.addEventListener('focusin', positionTabLens);
    desktopNav.addEventListener('focusout', () => requestAnimationFrame(positionTabLens));
    desktop.addEventListener('change', () => {
        hoveredTab = null;
        positionTabLens();
    });
    reducedMotion.addEventListener('change', () => {
        stretch?.cancel();
        tabLens.style.removeProperty('--tab-glint');
    });
    if (window.ResizeObserver) new ResizeObserver(positionTabLens).observe(desktopNav);
    positionTabLens();

    const hero = document.querySelector('.hero');
    const theme = new IntersectionObserver(([entry]) => {
        header.classList.toggle('over-content', !entry.isIntersecting);
    }, { rootMargin: '-80px 0px 0px' });
    theme.observe(hero);

    if (!window.ResizeObserver || !window.CSS) return;

    // Only Chromium samples an arbitrary live backdrop with an SVG filter.
    const liveBackdrop = CSS.supports('-webkit-app-region', 'drag')
        && CSS.supports('backdrop-filter', 'url("#refraction")');
    if (!liveBackdrop && !CSS.supports('filter', 'url("#refraction")')) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    const surfaces = Array.from(document.querySelectorAll(
        liveBackdrop ? '[data-refract], .studio-brand' : '.hero [data-refract]'
    ));
    const channels = [
        { color: 'red', factor: 0.86, matrix: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0' },
        { color: 'green', factor: 1, matrix: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0' },
        { color: 'blue', factor: 1.14, matrix: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0' }
    ];
    const passes = channels.map(({ color, matrix }) => `
        <feDisplacementMap in="SourceGraphic" in2="lens" result="${color}-shift"
            scale="0" xChannelSelector="R" yChannelSelector="G" />
        <feColorMatrix in="${color}-shift" type="matrix" values="${matrix}" result="${color}" />`).join('');
    const filters = surfaces.map((_, index) => `
        <filter id="refraction-${index}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
            <feImage preserveAspectRatio="none" result="lens" />
            ${passes}
            <feComposite in="red" in2="green" operator="arithmetic" k2="1" k3="1" result="red-green" />
            <feComposite in="red-green" in2="blue" operator="arithmetic" k2="1" k3="1" />
        </filter>`).join('');

    document.body.insertAdjacentHTML('beforeend', `
        <svg aria-hidden="true" width="0" height="0" style="position:absolute">
            <defs>${filters}</defs>
        </svg>`);

    const photoScenes = new Map();
    if (!liveBackdrop) {
        surfaces.forEach(surface => {
            surface.insertAdjacentHTML('afterbegin', `
                <span class="lens-photo" aria-hidden="true">
                    <span class="lens-sample"><span class="lens-scene"></span></span>
                </span>`);
            photoScenes.set(surface, surface.querySelector('.lens-scene'));
        });
    }

    function alignHeroPhoto() {
        const heroBox = hero.getBoundingClientRect();
        const { backgroundColor, backgroundImage, backgroundPosition, backgroundSize } = getComputedStyle(hero);

        for (const [surface, scene] of photoScenes) {
            const control = surface.getBoundingClientRect();
            Object.assign(scene.style, {
                width: heroBox.width + 'px',
                height: heroBox.height + 'px',
                left: heroBox.left - control.left - surface.clientLeft + 'px',
                top: heroBox.top - control.top - surface.clientTop + 'px',
                backgroundColor, backgroundImage, backgroundPosition, backgroundSize
            });
        }
    }

    function makeDisplacementMap(width, height, corner) {
        canvas.width = width;
        canvas.height = height;
        const map = context.createImageData(width, height);
        const depthLimit = Math.min(38, Math.min(width, height) * 0.47);

        for (let y = 0; y < height; y++) {
            const py = y + 0.5;
            const dy = py - Math.max(corner, Math.min(py, height - corner));

            for (let x = 0; x < width; x++) {
                const px = x + 0.5;
                const dx = px - Math.max(corner, Math.min(px, width - corner));
                const length = Math.hypot(dx, dy);
                const depth = Math.max(0, corner - length);
                // Sample inward along a curved shoulder and return to unity in the center.
                const bend = 116 * Math.pow(Math.max(0, 1 - depth / depthLimit), 1.55) / (length || 1);
                const offset = 4 * (y * width + x);
                map.data[offset] = 128 - bend * dx;
                map.data[offset + 1] = 128 - bend * dy;
                map.data[offset + 3] = 255;
            }
        }

        context.putImageData(map, 0, 0);
        return canvas.toDataURL();
    }

    const resize = new ResizeObserver(entries => {
        for (const { target } of entries) {
            const index = surfaces.indexOf(target);
            if (index === -1) continue;
            const width = liveBackdrop ? target.offsetWidth : target.clientWidth;
            const height = liveBackdrop ? target.offsetHeight : target.clientHeight;
            if (!width || !height) continue;

            const radius = parseFloat(getComputedStyle(target).borderTopLeftRadius);
            const corner = Math.min(radius, width / 2, height / 2);
            const id = 'refraction-' + index;
            const filter = document.getElementById(id);
            const image = filter.querySelector('feImage');
            image.setAttribute('width', width);
            image.setAttribute('height', height);
            image.setAttribute('href', makeDisplacementMap(width, height, corner));
            const scale = Math.min(Math.min(width, height) * 0.69, 76);
            filter.querySelectorAll('feDisplacementMap').forEach((pass, channel) => {
                pass.setAttribute('scale', scale * channels[channel].factor);
            });
            target.style.setProperty('--glass-refraction', 'url("#' + id + '")');
            target.classList.add(liveBackdrop ? 'has-refraction' : 'has-photo-refraction');
        }

        if (!liveBackdrop) alignHeroPhoto();
    });

    const reduceTransparency = matchMedia('(prefers-reduced-transparency: reduce)');
    function observeSurfaces() {
        if (!reduceTransparency.matches) {
            surfaces.forEach(surface => resize.observe(surface));
            if (!liveBackdrop) resize.observe(hero);
        } else {
            resize.disconnect();
        }
    }
    reduceTransparency.addEventListener('change', observeSurfaces);
    observeSurfaces();
})();
