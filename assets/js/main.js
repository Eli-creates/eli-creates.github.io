/*
	Prologue by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$nav = $('#nav');

	// Breakpoints.
		breakpoints({
			wide:      [ '961px',  '1880px' ],
			normal:    [ '961px',  '1620px' ],
			narrow:    [ '961px',  '1320px' ],
			narrower:  [ '737px',  '960px'  ],
			mobile:    [ null,     '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Nav.
                var $nav_a = $nav.find('a');
                var $nav_scrolly = $nav_a.filter(function() {
                        var href = $(this).attr('href') || '';
                        return href.charAt(0) == '#';
                });

                $nav_scrolly
                        .addClass('scrolly')
                        .on('click', function(e) {

                                var $this = $(this);

                                // External link? Bail.
                                        if ($this.attr('href').charAt(0) != '#')
                                                return;

				// Prevent default.
					e.preventDefault();

				// Deactivate all links.
					$nav_a.removeClass('active');

				// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
					$this
						.addClass('active')
						.addClass('active-locked');

			})
			.each(function() {

				var	$this = $(this),
					id = $this.attr('href'),
					$section = $(id);

				// No section for this link? Bail.
					if ($section.length < 1)
						return;

				// Scrollex.
					$section.scrollex({
						mode: 'middle',
						top: '-10vh',
						bottom: '-10vh',
						initialize: function() {

							// Deactivate section.
								$section.addClass('inactive');

						},
						enter: function() {

							// Activate section.
								$section.removeClass('inactive');

							// No locked links? Deactivate all links and activate this section's one.
								if ($nav_a.filter('.active-locked').length == 0) {

									$nav_a.removeClass('active');
									$this.addClass('active');

								}

							// Otherwise, if this section's link is the one that's locked, unlock it.
								else if ($this.hasClass('active-locked'))
									$this.removeClass('active-locked');

						}
					});

			});

	// Scrolly.
		$('.scrolly').scrolly();

	// Header (narrower + mobile).

		// Toggle.
			$(
				'<div id="headerToggle">' +
					'<a href="#header" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Header.
			$('#header')
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
                                        visibleClass: 'header-visible'
                                });

})(jQuery);

(function($) {

        const events = [
                {
                        title: 'Sunset Portrait Walk',
                        date: '2024-10-05T18:00:00',
                        location: 'St. Petersburg Pier',
                        blurb: 'Golden hour portraits along the water with live lighting demos and creative prompts.',
                        cta: 'mailto:elijahjoseph1226@gmail.com?subject=Sunset%20Portrait%20Walk',
                },
                {
                        title: 'Winter Gallery Pop-Up',
                        date: '2024-12-12T19:00:00',
                        location: 'Tampa Heights Market Hall',
                        blurb: 'A curated selection of prints, behind-the-scenes reels, and a Q&A on storytelling techniques.',
                        cta: 'mailto:elijahjoseph1226@gmail.com?subject=Winter%20Gallery%20RSVP',
                },
                {
                        title: 'Pride Parade Street Series',
                        date: '2024-03-23T11:00:00',
                        location: 'Central Ave, St. Pete',
                        blurb: 'Documentary-style coverage of the parade with on-the-spot portraits for attendees.',
                        cta: 'mailto:elijahjoseph1226@gmail.com?subject=Pride%20Parade%20Prints',
                }
        ];

        const $grid = $('#events-grid');
        const $filters = $('.event-filter');

        if ($grid.length === 0) return;

        const dateFormatter = new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
        });

        const now = new Date();

        function getEventStatus(date) {
                return date >= now ? 'upcoming' : 'past';
        }

        function buildCard(event, status) {
                const $card = $('<article>').addClass('event-card');
                const $title = $('<h3>').text(event.title);
                const $status = $('<span>').addClass('event-status').text(status === 'upcoming' ? 'Upcoming' : 'Past highlight');

                const $metaDate = $('<div>').addClass('event-meta').text(dateFormatter.format(event.dateObj));
                const $metaLocation = $('<div>').addClass('event-meta').text(event.location);
                const $blurb = $('<p>').text(event.blurb);
                const $cta = $('<a>').addClass('event-cta').attr('href', event.cta).text('RSVP / Learn more').prepend($('<span>').addClass('icon solid fa-envelope'));

                $card.append($title, $status, $metaDate, $metaLocation, $blurb, $cta);
                return $card;
        }

        function render(filter) {
                $grid.empty();
                const filtered = events
                        .map(event => ({ ...event, dateObj: new Date(event.date) }))
                        .filter(event => getEventStatus(event.dateObj) === filter)
                        .sort((a, b) => filter === 'upcoming' ? a.dateObj - b.dateObj : b.dateObj - a.dateObj);

                if (filtered.length === 0) {
                        $grid.append($('<p>').text('More dates are being scheduled—check back soon!'));
                        return;
                }

                filtered.forEach(event => {
                        const status = getEventStatus(event.dateObj);
                        $grid.append(buildCard(event, status));
                });
        }

        $filters.on('click', function() {
                const filter = $(this).data('filter');
                $filters.removeClass('active');
                $(this).addClass('active');
                render(filter);
        });

        render('upcoming');

        const events = [
                {
                        title: 'Sunset Portrait Walk',
                        date: '2024-10-05T18:00:00',
                        location: 'St. Petersburg Pier',
                        blurb: 'Golden hour portraits along the water with live lighting demos and creative prompts.',
                        cta: 'mailto:elijahjoseph1226@gmail.com?subject=Sunset%20Portrait%20Walk',
                },
                {
                        title: 'Winter Gallery Pop-Up',
                        date: '2024-12-12T19:00:00',
                        location: 'Tampa Heights Market Hall',
                        blurb: 'A curated selection of prints, behind-the-scenes reels, and a Q&A on storytelling techniques.',
                        cta: 'mailto:elijahjoseph1226@gmail.com?subject=Winter%20Gallery%20RSVP',
                },
                {
                        title: 'Pride Parade Street Series',
                        date: '2024-03-23T11:00:00',
                        location: 'Central Ave, St. Pete',
                        blurb: 'Documentary-style coverage of the parade with on-the-spot portraits for attendees.',
                        cta: 'mailto:elijahjoseph1226@gmail.com?subject=Pride%20Parade%20Prints',
                }
        ];

        const $grid = $('#events-grid');
        const $filters = $('.event-filter');

        if ($grid.length === 0) return;

        const dateFormatter = new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
        });

        const now = new Date();

        function getEventStatus(date) {
                return date >= now ? 'upcoming' : 'past';
        }

        function buildCard(event, status) {
                const $card = $('<article>').addClass('event-card');
                const $title = $('<h3>').text(event.title);
                const $status = $('<span>').addClass('event-status').text(status === 'upcoming' ? 'Upcoming' : 'Past highlight');

                const $metaDate = $('<div>').addClass('event-meta').text(dateFormatter.format(event.dateObj));
                const $metaLocation = $('<div>').addClass('event-meta').text(event.location);
                const $blurb = $('<p>').text(event.blurb);
                const $cta = $('<a>').addClass('event-cta').attr('href', event.cta).text('RSVP / Learn more').prepend($('<span>').addClass('icon solid fa-envelope'));

                $card.append($title, $status, $metaDate, $metaLocation, $blurb, $cta);
                return $card;
        }

        function render(filter) {
                $grid.empty();
                const filtered = events
                        .map(event => ({ ...event, dateObj: new Date(event.date) }))
                        .filter(event => getEventStatus(event.dateObj) === filter)
                        .sort((a, b) => filter === 'upcoming' ? a.dateObj - b.dateObj : b.dateObj - a.dateObj);

                if (filtered.length === 0) {
                        $grid.append($('<p>').text('More dates are being scheduled—check back soon!'));
                        return;
                }

                filtered.forEach(event => {
                        const status = getEventStatus(event.dateObj);
                        $grid.append(buildCard(event, status));
                });
        }

        $filters.on('click', function() {
                const filter = $(this).data('filter');
                $filters.removeClass('active').attr('aria-pressed', 'false');
                $(this).addClass('active').attr('aria-pressed', 'true');
                render(filter);
        });

        render('upcoming');

})(jQuery);
