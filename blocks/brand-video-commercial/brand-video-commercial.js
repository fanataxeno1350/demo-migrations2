import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow, embedUrlRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('tv-sec', 'd-none');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const row = document.createElement('div');
  row.classList.add('row');
  container.append(row);

  const col = document.createElement('div');
  col.classList.add('col-md-12');
  row.append(col);

  // Headline
  const headlineCell = headlineRow?.firstElementChild;
  if (headlineCell) {
    const h2 = document.createElement('h2');
    moveInstrumentation(headlineRow, h2);
    h2.innerHTML = headlineCell.innerHTML;
    col.append(h2);
  }

  // Embed URL
  const embedUrlCell = embedUrlRow?.firstElementChild;
  if (embedUrlCell) {
    const embedUrl = embedUrlCell.textContent.trim();
    if (embedUrl) {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('height', '500');
      iframe.setAttribute('width', '100%');
      iframe.src = embedUrl;
      moveInstrumentation(embedUrlRow, iframe);
      col.append(iframe);
    }
  }

  block.replaceChildren(section);

  // Optimize all pictures within the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
