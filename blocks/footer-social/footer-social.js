import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const socialLinksContainer = document.createElement('ul');
  socialLinksContainer.classList.add('site-footer-social');

  // The first row is the container placeholder for "socialLinks"
  // All subsequent rows are "footer-social-item" items
  const [socialLinksPlaceholderRow, ...socialItemRows] = [...block.children];

  // Move instrumentation from the placeholder row to the new container
  moveInstrumentation(socialLinksPlaceholderRow, socialLinksContainer);

  socialItemRows.forEach((row) => {
    const [iconCell, linkCell, labelCell] = [...row.children];

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const picture = iconCell.querySelector('picture');
    const img = picture ? picture.querySelector('img') : null;
    const foundLink = linkCell.querySelector('a');
    const labelText = labelCell.textContent.trim();

    if (foundLink) {
      anchor.href = foundLink.href;
    }

    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      anchor.append(optimizedPic);
    }

    if (labelText) {
      const span = document.createElement('span');
      span.classList.add('a11y-sr-only');
      span.textContent = labelText;
      anchor.append(span);
    }

    moveInstrumentation(row, li);
    li.append(anchor);
    socialLinksContainer.append(li);
  });

  block.replaceChildren(socialLinksContainer);
}
