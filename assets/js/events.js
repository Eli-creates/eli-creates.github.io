(function($) {
        const $lightbox = $('#photo-lightbox');
        const $lightboxImage = $('#lightbox-image');
        const $lightboxCaption = $('#lightbox-caption');
        const $lightboxClose = $('.lightbox-close');

        if ($lightbox.length === 0) return;

        function createPlaceholderVisual(text) {
                return $('<div>').addClass('placeholder-visual').append(
                        $('<span>').addClass('icon solid fa-image').attr('aria-hidden', 'true'),
                        $('<p>').text(text)
                );
        }

        function openLightbox(photo) {
                if (!photo.src) return;
                $lightboxImage.attr({ src: photo.src, alt: photo.title });
                $lightboxCaption.text(photo.title || 'Full-screen photo');
                $lightbox.attr('aria-hidden', 'false').addClass('open');
                $('body').addClass('no-scroll');
        }

        function closeLightbox() {
                $lightbox.removeClass('open').attr('aria-hidden', 'true');
                $lightboxImage.attr({ src: '', alt: '' });
                $lightboxCaption.text('');
                $('body').removeClass('no-scroll');
        }

        function buildCard(photo) {
                const $card = $('<figure>').addClass('event-photo-card');

                if (photo.placeholder) {
                        $card.addClass('empty-slot');
                        $card.append(createPlaceholderVisual(photo.title));
                } else {
                        const $img = $('<img>').attr('src', photo.src).attr('alt', photo.title || 'Gallery image');
                        $card.append($img);
                        $card
                                .attr({ tabindex: 0, role: 'button', 'aria-label': `Open ${photo.title || 'photo'} in full screen` })
                                .on('click', () => openLightbox(photo))
                                .on('keydown', e => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                openLightbox(photo);
                                        }
                                });
                }

                const $caption = $('<figcaption>');
                $caption.append($('<strong>').text(photo.title || 'Untitled photo'));
                if (photo.detail) $caption.append($('<span>').text(photo.detail));
                $card.append($caption);

                return $card;
        }

        function renderGallery($grid, photos) {
                if (!$grid.length) return;
                $grid.empty();
                photos.forEach(photo => $grid.append(buildCard(photo)));
        }

        function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
        }

        function initUploads($grid, $fileInput, $dropzone) {
                if (!$fileInput?.length || !$dropzone?.length) return;

                function addUploads(files) {
                        const uploads = Array.from(files);

                        uploads.forEach(file => {
                                const src = URL.createObjectURL(file);
                                const title = file.name || 'New upload';

                                const photo = {
                                        src,
                                        title,
                                        detail: 'Fresh upload preview — saved locally until you refresh.'
                                };

                                $grid.append(buildCard(photo));
                        });
                }

                $fileInput.on('change', function() {
                        if (this.files && this.files.length) {
                                addUploads(this.files);
                                this.value = '';
                        }
                });

                $dropzone
                        .attr({ tabindex: 0, role: 'button', 'aria-label': 'Upload or drop event photos' })
                        .on('keydown', function(e) {
                                if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        $fileInput.trigger('click');
                                }
                        });

                $dropzone
                        .on('dragenter dragover', function(e) {
                                preventDefaults(e);
                                $dropzone.addClass('drag-active');
                        })
                        .on('dragleave dragend drop', function(e) {
                                preventDefaults(e);
                                $dropzone.removeClass('drag-active');
                        })
                        .on('drop', function(e) {
                                if (e.originalEvent.dataTransfer?.files?.length) {
                                        addUploads(e.originalEvent.dataTransfer.files);
                                }
                        });
        }

        $lightboxClose.on('click', closeLightbox);
        $lightbox.on('click', function(e) {
                if (e.target === this) closeLightbox();
        });

        $(document).on('keyup', function(e) {
                if (e.key === 'Escape' && $lightbox.hasClass('open')) closeLightbox();
        });

        // Event uploads page
        const $eventGrid = $('#event-photo-grid');
        if ($eventGrid.length) {
                const eventPlaceholders = [
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
                                detail: 'Upload to replace this reserved spot.'
                        }
                ];

                renderGallery($eventGrid, eventPlaceholders);
                initUploads($eventGrid, $('#event-photo-input'), $('#upload-dropzone'));
        }

        // Wedding gallery page
        const $weddingGrid = $('#wedding-photo-grid');
        if ($weddingGrid.length) {
                const weddingPhotos = [
                        {
                                src: 'images/pic02.jpg',
                                title: 'Swinging baby',
                                detail: 'A playful moment to showcase candid joy.'
                        },
                        {
                                src: 'images/pic06.jpg',
                                title: 'Street celebration',
                                detail: 'Colorful energy perfect for reception coverage.'
                        },
                        {
                                src: 'images/pic10.jpg',
                                title: 'Portrait close-up',
                                detail: 'Demonstrating portrait sharpness and detail.'
                        },
                        {
                                src: 'images/pic14.jpg',
                                title: 'Festive sendoff',
                                detail: 'Nighttime lighting reference for sparkler exits.'
                        },
                        {
                                placeholder: true,
                                title: 'Add your ceremony favorite',
                                detail: 'Drop in the hero shot from the aisle or vows.'
                        },
                        {
                                placeholder: true,
                                title: 'Save space for reception details',
                                detail: 'Use this slot for décor, cake, and ring close-ups.'
                        }
                ];

                renderGallery($weddingGrid, weddingPhotos);
        }

})(jQuery);
