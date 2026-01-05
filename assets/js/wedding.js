(function($) {
        const $grid = $('#wedding-photo-grid');
        const $lightbox = $('#photo-lightbox');
        const $lightboxImage = $('#lightbox-image');
        const $lightboxCaption = $('#lightbox-caption');
        const $lightboxClose = $('.lightbox-close');

        if ($grid.length === 0) return;

        function openLightbox(src, title) {
                if (!src) return;
                $lightboxImage.attr({ src, alt: title || '' });
                $lightboxCaption.text(title || '');
                $lightbox.attr('aria-hidden', 'false').addClass('open');
                $('body').addClass('no-scroll');
        }

        function closeLightbox() {
                $lightbox.removeClass('open').attr('aria-hidden', 'true');
                $lightboxImage.attr({ src: '', alt: '' });
                $lightboxCaption.text('');
                $('body').removeClass('no-scroll');
        }

        $grid.on('click', '[data-lightbox-src]', function() {
                const $item = $(this);
                openLightbox($item.data('lightbox-src'), $item.data('lightbox-title'));
        });

        $grid.on('keydown', '[data-lightbox-src]', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const $item = $(this);
                        openLightbox($item.data('lightbox-src'), $item.data('lightbox-title'));
                }
        });

        $lightboxClose.on('click', closeLightbox);
        $lightbox.on('click', function(e) {
                if (e.target === this) closeLightbox();
        });

        $(document).on('keyup', function(e) {
                if (e.key === 'Escape' && $lightbox.hasClass('open')) closeLightbox();
        });
})(jQuery);
