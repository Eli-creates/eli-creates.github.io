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

				e.preventDefault();

				$nav_a.removeClass('active');

				$this
					.addClass('active')
					.addClass('active-locked');

			})
			.each(function() {

				var	$this = $(this),
					href = $this.attr('href'),
					id = href.substring(href.indexOf('#')),
					$section = $(id);

				if ($section.length < 1)
					return;

				$section.scrollex({
					mode: 'middle',
					top: '-10vh',
					bottom: '-10vh',
					initialize: function() {

						$section.addClass('inactive');

					},
					enter: function() {

						$section.removeClass('inactive');

						if ($nav_a.filter('.active-locked').length == 0) {

							$nav_a.removeClass('active');
							$this.addClass('active');

						}

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
					'<a href="#header" class="toggle" aria-label="Toggle navigation" aria-controls="header"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Header.
			$('#header')
				.panel({
					delay: 300,
					hideOnClick: true,
                    hideOnEscape: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
                                        visibleClass: 'header-visible'
                                });


	// Refract the backdrop along the rounded rim of the mobile menu.
	// Chromium composites SVG displacement over the live backdrop. Other engines keep the CSS blur.
	if (window.CSS && CSS.supports('backdrop-filter', 'url("#glass-refraction")')
		&& CSS.supports('-webkit-app-region', 'drag')
		&& typeof ResizeObserver !== 'undefined') {

		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');

		if (context) {
			const surfaces = [
				{ element: document.querySelector('#header'), id: 'drawer-refraction', radius: 24 },
				{ element: document.querySelector('#headerToggle .toggle'), id: 'toggle-refraction', radius: 22 }
			];

			const resize = new ResizeObserver(entries => {
				entries.forEach(({ target }) => {
					const width = target.offsetWidth;
					const height = target.offsetHeight;
					if (!width || !height) return;

					const { id, radius } = surfaces.find(surface => surface.element === target);
					const corner = Math.min(radius, width / 2, height / 2);
					canvas.width = width;
					canvas.height = height;
					const map = context.createImageData(width, height);

					for (let y = 0; y < height; y++) {
						for (let x = 0; x < width; x++) {
							// Measure from the rounded rectangle's inner corner or straight edge.
							const px = x + 0.5;
							const py = y + 0.5;
							const dx = px - Math.max(corner, Math.min(px, width - corner));
							const dy = py - Math.max(corner, Math.min(py, height - corner));
							const distance = Math.hypot(dx, dy);
							const depth = corner - distance;
							// Bias sampling inward near the lip and taper it toward the flat center.
							const strength = Math.max(0, 1 - Math.max(0, depth) / 11) * 110;
							const offset = 4 * (y * width + x);
							map.data[offset] = 128 - strength * dx / (distance || 1);
							map.data[offset + 1] = 128 - strength * dy / (distance || 1);
							map.data[offset + 3] = 255;
						}
					}

					context.putImageData(map, 0, 0);
					const image = document.querySelector('#' + id + ' feImage');
					image.setAttribute('width', width);
					image.setAttribute('height', height);
					image.setAttribute('href', canvas.toDataURL());
					target.style.setProperty('--glass-refraction', 'url("#' + id + '")');
					target.classList.add('has-refraction');
				});
			});

			const filters = surfaces.map(({ id }) => `
				<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
					<feImage preserveAspectRatio="none" result="rim" />
					<feDisplacementMap in="SourceGraphic" in2="rim" scale="22" xChannelSelector="R" yChannelSelector="G" />
				</filter>`).join('');

			document.body.insertAdjacentHTML('beforeend', `
				<svg aria-hidden="true" width="0" height="0" style="position:absolute">
					<defs>${filters}</defs>
				</svg>`);

			const mobileGlass = matchMedia('(max-width: 960px) and (not (prefers-reduced-transparency: reduce))');
			function observeMobileGlass() {
				if (mobileGlass.matches) {
					surfaces.forEach(({ element }) => resize.observe(element));
				} else {
					resize.disconnect();
				}
			}

			mobileGlass.addEventListener('change', observeMobileGlass);
			observeMobileGlass();
		}
	}

})(jQuery);

