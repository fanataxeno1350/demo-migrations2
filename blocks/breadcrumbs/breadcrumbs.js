import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const root = document.createElement('section');
  // root.classList.add('brands-bcrumbs-sec1'); // Removed: outer block div already has this class

  const container = document.createElement('div');
  container.classList.add('container');
  root.append(container);

  const brandsBreadcrumbs = document.createElement('div');
  brandsBreadcrumbs.classList.add('brands-breadcrumbs');
  container.append(brandsBreadcrumbs);

  const breadcrumbList = document.createElement('ul');
  breadcrumbList.classList.add('mr-auto');
  brandsBreadcrumbs.append(breadcrumbList);

  const socialInfo = document.createElement('div');
  socialInfo.classList.add('social-info', 'bg_icon');
  brandsBreadcrumbs.append(socialInfo);

  const socialList = document.createElement('ul');
  socialInfo.append(socialList);

  const allRows = [...block.children];

  // breadcrumb-item has 3 cells, social-link-item has 1 cell
  const breadcrumbItemRows = allRows.filter((row) => row.children.length === 3);
  const socialLinkRows = allRows.filter((row) => row.children.length === 1);

  breadcrumbItemRows.forEach((row, index) => {
    // According to BlockJson, breadcrumb-item has: label (text), link (aem-content), hierarchy-tree (richtext)
    // The hierarchy-tree is not used in the final rendered HTML based on ORIGINAL HTML,
    // so we destructure only the used cells.
    const [labelCell, linkCell] = [...row.children]; // hierarchyTreeCell is at index 2, but not used

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');

    if (foundLink) {
      anchor.href = foundLink.href;
    } else {
      anchor.href = 'javascript:void(0);'; // Fallback for missing link
    }
    anchor.textContent = labelCell.textContent.trim();

    moveInstrumentation(row, li);
    li.append(anchor);

    if (index === breadcrumbItemRows.length - 1) {
      li.classList.add('active');
    }
    breadcrumbList.append(li);
  });

  socialLinkRows.forEach((row) => {
    // According to BlockJson, social-link-item has: link (aem-content)
    const [linkCell] = [...row.children];
    const foundLink = linkCell.querySelector('a');
    const href = foundLink ? foundLink.href : '#';

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.target = '_blank';

    let iconClass = '';
    let liClass = '';

    // Determine icon and li class based on href or text content
    if (href.includes('facebook')) {
      iconClass = 'fa-facebook-f';
      liClass = 'fb';
    } else if (href.includes('twitter')) {
      iconClass = 'fa-twitter';
      liClass = 'twit';
    } else if (href.includes('youtube')) {
      iconClass = 'fa-youtube';
      liClass = 'you-t';
    } else if (href.includes('instagram')) {
      iconClass = 'fa-instagram';
      liClass = 'insta';
    }

    if (iconClass) {
      const icon = document.createElement('i');
      icon.classList.add('fab', iconClass);
      icon.setAttribute('aria-hidden', 'true');
      anchor.append(icon);
    }

    li.classList.add(liClass);
    moveInstrumentation(row, li);
    li.append(anchor);
    socialList.append(li);
  });

  block.replaceChildren(root);

  // Image optimization (if any images were present, though none in this block)
  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
