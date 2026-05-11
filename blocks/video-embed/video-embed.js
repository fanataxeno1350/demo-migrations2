import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow, videoUrlRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('tv-sec', 'd-none');
  // moveInstrumentation(block, section); // Removed: block already has instrumentation, no need to move it to a new root element.

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const row = document.createElement('div');
  row.classList.add('row');
  container.append(row);

  const col = document.createElement('div');
  col.classList.add('col-md-12');
  row.append(col);

  if (headlineRow) {
    const headline = document.createElement('h2');
    moveInstrumentation(headlineRow, headline);
    // headline is a text field, not richtext. Use textContent.trim()
    headline.textContent = headlineRow.textContent.trim();
    col.append(headline);
  }

  if (videoUrlRow) {
    const videoUrl = videoUrlRow.textContent.trim(); // Read textContent directly from the row
    if (videoUrl) {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('width', '100%');
      iframe.setAttribute('height', '500');
      iframe.src = videoUrl;
      moveInstrumentation(videoUrlRow, iframe);
      col.append(iframe);
    }
  }

  block.replaceChildren(section);

  // Image optimization (if any images were present in the block)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
