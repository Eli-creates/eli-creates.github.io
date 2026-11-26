(() => {
    const lightbox = document.getElementById('photo-lightbox');
    const image = document.getElementById('lightbox-image');
    const caption = document.getElementById('lightbox-caption');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const background = Array.from(document.querySelectorAll('body > .skip-link, body > .site-header, body > main, body > footer'));
    let trigger;

    function openPhoto(target) {
        trigger = target;
        image.src = target.dataset.lightboxSrc;
        image.alt = target.dataset.lightboxTitle || '';
        caption.textContent = image.alt;
        lightbox.setAttribute('aria-hidden', 'false');
        lightbox.classList.add('open');
        document.body.classList.add('no-scroll');
        background.forEach(element => { element.inert = true; });
        closeButton.focus({ preventScroll: true });
    }

    function closePhoto() {
        if (!trigger) return;
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        image.removeAttribute('src');
        image.alt = '';
        caption.textContent = '';
        document.body.classList.remove('no-scroll');
        background.forEach(element => { element.inert = false; });
        trigger.focus({ preventScroll: true });
        trigger = null;
    }

    document.addEventListener('click', event => {
        const target = event.target.closest('[data-lightbox-src]');
        if (target) openPhoto(target);
        if (event.target === lightbox || closeButton.contains(event.target)) closePhoto();
    });

    document.addEventListener('keydown', event => {
        if (trigger) {
            if (event.key === 'Escape') closePhoto();
            if (event.key === 'Tab') event.preventDefault();
            return;
        }

        // Event and wedding galleries include focusable figures generated from photo data.
        const target = event.target.closest('figure[data-lightbox-src]');
        if (target && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            openPhoto(target);
        }
    });
})();
