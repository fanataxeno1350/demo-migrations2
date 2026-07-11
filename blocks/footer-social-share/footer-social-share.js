import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...socialLinkRows] = [...block.children];

  const socialShareWrap = document.createElement('div');
  socialShareWrap.classList.add('socialshare', 'cmp-share--follow-us', 'aem-GridColumn', 'aem-GridColumn--default--12');

  const cmpShareWrap = document.createElement('div');
  cmpShareWrap.classList.add('cmp-share__wrap');
  socialShareWrap.append(cmpShareWrap);

  const cmpShareContent = document.createElement('div');
  cmpShareContent.classList.add('cmp-share__content');
  cmpShareWrap.append(cmpShareContent);

  if (titleRow) {
    const cmpShareTitle = document.createElement('div');
    cmpShareTitle.classList.add('cmp-share__title');
    moveInstrumentation(titleRow, cmpShareTitle);
    cmpShareTitle.textContent = titleRow.textContent.trim();
    cmpShareContent.append(cmpShareTitle);
  }

  socialLinkRows
    .filter((row) => row.children.length === 2) // Ensure it's a social-share-item row
    .forEach((row) => {
      const [iconCell, linkCell] = [...row.children];

      const anchor = document.createElement('a');
      anchor.classList.add('cmp-share__icon');

      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
        anchor.target = '_blank'; // Assuming target blank for social links
        // Extract social platform from URL for data-social attribute
        try {
          const url = new URL(foundLink.href);
          const hostname = url.hostname;
          if (hostname.includes('facebook')) {
            anchor.dataset.social = 'facebook';
          } else if (hostname.includes('instagram')) {
            anchor.dataset.social = 'instagram';
          } else if (hostname.includes('youtube')) {
            anchor.dataset.social = 'youtube';
          }
          // Add more platforms as needed
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('Invalid social link URL:', foundLink.href, e);
        }
      }

      if (iconCell) {
        const picture = iconCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
            optimizedPic.querySelector('img').classList.add('cmp-image__image'); // Apply class from original HTML
            moveInstrumentation(iconCell, optimizedPic.querySelector('img'));
            anchor.append(optimizedPic);
          }
        }
      }

      moveInstrumentation(row, anchor);
      cmpShareContent.append(anchor);
    });

  block.replaceChildren(socialShareWrap);
}
