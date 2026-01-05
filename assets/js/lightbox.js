(function($) {
        const $lightbox = $('#photo-lightbox');
        const $lightboxImage = $('#lightbox-image');
        const $lightboxCaption = $('#lightbox-caption');
        const $lightboxClose = $('.lightbox-close');
        const imageSelector = '.image.fit img, .image.featured img, .event-photo-card img';

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

        function prepTargets() {
                $('[data-lightbox-src]').each(function() {
                        const $item = $(this);
                        $item.addClass('lightbox-target');
                        if (!$item.attr('tabindex')) $item.attr('tabindex', 0);
                        if (!$item.attr('role')) $item.attr('role', 'button');
                });

                $(imageSelector).each(function() {
                        const $img = $(this);
                        if ($img.closest('[data-lightbox-src]').length) return;
                        $img.addClass('lightbox-target').attr('tabindex', 0);
                });
        }

        function getTrigger(target) {
                const $target = $(target);
                const $dataTrigger = $target.closest('[data-lightbox-src]');
                if ($dataTrigger.length) return $dataTrigger;

                const $imgTrigger = $target.closest(imageSelector);
                if ($imgTrigger.length) return $imgTrigger;

                return null;
        }

        $(document).on('click', function(e) {
                const $trigger = getTrigger(e.target);
                if (!$trigger) return;

                if ($trigger.is('[data-lightbox-src]')) {
                        openLightbox($trigger.data('lightbox-src'), $trigger.data('lightbox-title'));
                        return;
                }

                openLightbox($trigger.attr('src'), $trigger.attr('alt'));
        });

        $(document).on('keydown', function(e) {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                const $trigger = getTrigger(e.target);
                if (!$trigger) return;
                e.preventDefault();

                if ($trigger.is('[data-lightbox-src]')) {
                        openLightbox($trigger.data('lightbox-src'), $trigger.data('lightbox-title'));
                        return;
                }

                openLightbox($trigger.attr('src'), $trigger.attr('alt'));
        });

        $lightboxClose.on('click', closeLightbox);
        $lightbox.on('click', function(e) {
                if (e.target === this) closeLightbox();
        });

        $(document).on('keyup', function(e) {
                if (e.key === 'Escape' && $lightbox.hasClass('open')) closeLightbox();
        });

        prepTargets();
})(jQuery);
