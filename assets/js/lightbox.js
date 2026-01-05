(function($) {
        const $lightbox = $('#photo-lightbox');
        const $lightboxImage = $('#lightbox-image');
        const $lightboxCaption = $('#lightbox-caption');
        const $lightboxClose = $('.lightbox-close');

        if ($lightbox.length === 0) return;

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

        const $targets = $('.image.fit img, .image.featured img, .event-photo-card img');
        $targets.addClass('lightbox-target').attr('tabindex', 0);

        $targets.on('click', function() {
                const $img = $(this);
                openLightbox($img.attr('src'), $img.attr('alt'));
        });

        $targets.on('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const $img = $(this);
                        openLightbox($img.attr('src'), $img.attr('alt'));
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
