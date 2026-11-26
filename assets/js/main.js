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

    const hero = document.querySelector('.hero');
    const theme = new IntersectionObserver(([entry]) => {
        header.classList.toggle('over-content', !entry.isIntersecting);
    }, { rootMargin: '-80px 0px 0px' });
    theme.observe(hero);

    // Chromium composites SVG displacement over a live backdrop. Other engines use CSS frost.
    if (!window.CSS || !CSS.supports('backdrop-filter', 'url("#refraction")')
        || !CSS.supports('-webkit-app-region', 'drag') || !window.ResizeObserver) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    const surfaces = Array.from(document.querySelectorAll('[data-refract]'));
    const filters = surfaces.map((_, index) => `
        <filter id="refraction-${index}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
            <feImage preserveAspectRatio="none" result="rim" />
            <feDisplacementMap in="SourceGraphic" in2="rim" scale="24" xChannelSelector="R" yChannelSelector="G" />
        </filter>`).join('');

    document.body.insertAdjacentHTML('beforeend', `
        <svg aria-hidden="true" width="0" height="0" style="position:absolute">
            <defs>${filters}</defs>
        </svg>`);

    const resize = new ResizeObserver(entries => {
        for (const { target } of entries) {
            const width = target.offsetWidth;
            const height = target.offsetHeight;
            if (!width || !height) continue;

            const radius = parseFloat(getComputedStyle(target).borderTopLeftRadius);
            const corner = Math.min(radius, width / 2, height / 2);
            canvas.width = width;
            canvas.height = height;
            const map = context.createImageData(width, height);

            for (let y = 0; y < height; y++) {
                const py = y + 0.5;
                const dy = py - Math.max(corner, Math.min(py, height - corner));

                for (let x = 0; x < width; x++) {
                    const px = x + 0.5;
                    const dx = px - Math.max(corner, Math.min(px, width - corner));
                    const distance = Math.hypot(dx, dy);
                    const depth = corner - distance;
                    // Sample inward along the rounded rim and fade to a flat center.
                    const strength = Math.max(0, 1 - Math.max(0, depth) / 12) * 110;
                    const offset = 4 * (y * width + x);
                    map.data[offset] = 128 - strength * dx / (distance || 1);
                    map.data[offset + 1] = 128 - strength * dy / (distance || 1);
                    map.data[offset + 3] = 255;
                }
            }

            context.putImageData(map, 0, 0);
            const id = 'refraction-' + surfaces.indexOf(target);
            const image = document.querySelector('#' + id + ' feImage');
            image.setAttribute('width', width);
            image.setAttribute('height', height);
            image.setAttribute('href', canvas.toDataURL());
            target.style.setProperty('--glass-refraction', 'url("#' + id + '")');
            target.classList.add('has-refraction');
        }
    });

    const transparency = matchMedia('(prefers-reduced-transparency: no-preference)');
    function observeSurfaces() {
        if (transparency.matches) {
            surfaces.forEach(surface => resize.observe(surface));
        } else {
            resize.disconnect();
        }
    }
    transparency.addEventListener('change', observeSurfaces);
    observeSurfaces();
})();
