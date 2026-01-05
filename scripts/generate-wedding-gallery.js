const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const weddingDir = path.join(rootDir, 'images', 'wedding');
const weddingHtmlPath = path.join(rootDir, 'wedding.html');

const START_MARKER = '<!-- WEDDING-GALLERY:START -->';
const END_MARKER = '<!-- WEDDING-GALLERY:END -->';

const allowedExts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

function escapeHtml(value) {
        return value
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
}

function titleCase(value) {
        return value
                .split(' ')
                .filter(Boolean)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
}

function buildTitle(filename) {
        const name = path.basename(filename, path.extname(filename));
        const spaced = name.replace(/[-_]+/g, ' ').trim();
        return titleCase(spaced || 'Wedding photo');
}

function listImages() {
        if (!fs.existsSync(weddingDir)) return [];
        return fs
                .readdirSync(weddingDir)
                .filter(file => allowedExts.has(path.extname(file).toLowerCase()))
                .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
}

function buildGalleryMarkup(files) {
        const indent = '                                                                ';

        if (files.length === 0) {
                return `${indent}<p>Add images to <strong>images/wedding/</strong> to populate the gallery.</p>`;
        }

        return files
                .map(file => {
                        const title = buildTitle(file);
                        const safeTitle = escapeHtml(title);
                        const src = `images/wedding/${file}`;
                        return [
                                `${indent}<figure class="event-photo-card" role="button" tabindex="0" data-lightbox-src="${src}" data-lightbox-title="${safeTitle}">`,
                                `${indent}        <img src="${src}" alt="${safeTitle}" />`,
                                `${indent}        <figcaption><strong>${safeTitle}</strong></figcaption>`,
                                `${indent}</figure>`
                        ].join('\n');
                })
                .join('\n');
}

function updateWeddingHtml(markup) {
        const html = fs.readFileSync(weddingHtmlPath, 'utf8');
        const pattern = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`);
        if (!pattern.test(html)) {
                throw new Error('Gallery markers not found in wedding.html.');
        }

        const replacement = `${START_MARKER}\n${markup}\n${END_MARKER}`;
        const updated = html.replace(pattern, replacement);

        if (updated !== html) {
                fs.writeFileSync(weddingHtmlPath, updated, 'utf8');
                console.log('Updated wedding.html');
        } else {
                console.log('wedding.html already up to date.');
        }
}

const files = listImages();
const markup = buildGalleryMarkup(files);
updateWeddingHtml(markup);
