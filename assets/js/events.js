(function($) {
        const $grid = $('#event-photo-grid');
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
                        $card.attr({
                                'data-lightbox-src': photo.src,
                                'data-lightbox-title': photo.title,
                                tabindex: 0,
                                role: 'button',
                                'aria-label': `Open ${photo.title} in full screen`
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

        renderInitial();

})(jQuery);
