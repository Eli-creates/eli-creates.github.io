(function($) {
        const $grid = $('#event-photo-grid');
        const $lightbox = $('#photo-lightbox');
        const $lightboxImage = $('#lightbox-image');
        const $lightboxCaption = $('#lightbox-caption');
        const $lightboxClose = $('.lightbox-close');

        if ($grid.length === 0) return;

        const placeholders = [
                {
                        src: 'images/pic02.jpg',
                        title: 'Sunset walk placeholder',
                        detail: 'Reserve this slot for your next golden-hour set.'
                },
                {
                        src: 'images/pic06.jpg',
                        title: 'Street series placeholder',
                        detail: 'Use this to plan parade portraits or candid moments.'
                },
                {
                        src: 'images/pic10.jpg',
                        title: 'Portrait close-up placeholder',
                        detail: 'Swap in your favorite headshots from the event.'
                },
                {
                        placeholder: true,
                        title: 'Add your next event highlight',
                        detail: 'Keep this slot open for a future favorite.'
                }
        ];

        function createPlaceholderVisual(text) {
                return $('<div>').addClass('placeholder-visual').append(
                        $('<span>').addClass('icon solid fa-image').attr('aria-hidden', 'true'),
                        $('<p>').text(text)
                );
        }

        function buildCard(photo) {
                const $card = $('<figure>').addClass('event-photo-card');

                if (photo.placeholder) {
                        $card.addClass('empty-slot');
                        $card.append(createPlaceholderVisual(photo.title));
                } else {
                        const $img = $('<img>').attr('src', photo.src).attr('alt', photo.title);
                        $card.append($img);
                        $card
                                .attr({ tabindex: 0, role: 'button', 'aria-label': `Open ${photo.title} in full screen` })
                                .on('click', () => openLightbox(photo))
                                .on('keydown', e => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                openLightbox(photo);
                                        }
                                });
                }

                const $caption = $('<figcaption>');
                $caption.append($('<strong>').text(photo.title));
                if (photo.detail) $caption.append($('<span>').text(photo.detail));
                $card.append($caption);

                return $card;
        }

        function renderInitial() {
                placeholders.forEach(photo => $grid.append(buildCard(photo)));
        }

        function openLightbox(photo) {
                if (!photo.src) return;
                $lightboxImage.attr({ src: photo.src, alt: photo.title });
                $lightboxCaption.text(photo.title);
                $lightbox.attr('aria-hidden', 'false').addClass('open');
                $('body').addClass('no-scroll');
        }

        function closeLightbox() {
                $lightbox.removeClass('open').attr('aria-hidden', 'true');
                $lightboxImage.attr({ src: '', alt: '' });
                $lightboxCaption.text('');
                $('body').removeClass('no-scroll');
        }

        $lightboxClose.on('click', closeLightbox);
        $lightbox.on('click', function(e) {
                if (e.target === this) closeLightbox();
        });

        $(document).on('keyup', function(e) {
                if (e.key === 'Escape' && $lightbox.hasClass('open')) closeLightbox();
        });

        renderInitial();

})(jQuery);
