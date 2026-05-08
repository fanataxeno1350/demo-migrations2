import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      // subWrap.classList.add('has-sub-child'); // Removed: Not in ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const primaryLogoRow = children[0];
  const primaryLogoLinkRow = children[1];
  const secondaryLogoRow = children[2];
  const copyrightRow = children[3];

  const itemRows = children.slice(4);

  const footerLinkItemRows = [];
  const socialLinkItemRows = [];
  const bottomLinkItemRows = [];

  itemRows.forEach((row) => {
    if (row.children.length === 3) {
      footerLinkItemRows.push(row);
    } else if (row.children.length === 2 && row.children[0].querySelector('picture')) { // Fixed: Use row.children[0] for picture check
      socialLinkItemRows.push(row);
    } else if (row.children.length === 2 && !row.children[0].querySelector('picture')) { // Fixed: Use row.children[0] for picture check
      bottomLinkItemRows.push(row);
    }
  });

  const root = document.createElement('section');
  root.classList.add('container-hd', 'p-0');

  const footerBrand = document.createElement('div');
  footerBrand.classList.add('footer-brand', 'w-100', 'bg-boing-neutral-gray-600');
  root.append(footerBrand);

  const footerBrandPrimary = document.createElement('section');
  footerBrandPrimary.classList.add('footer-brand__primary');
  footerBrand.append(footerBrandPrimary);

  const containerPrimary = document.createElement('div');
  containerPrimary.classList.add('container');
  footerBrandPrimary.append(containerPrimary);

  const primaryContent = document.createElement('div');
  primaryContent.classList.add('footer-brand__primary--content', 'd-flex', 'flex-column', 'flex-md-row', 'justify-content-md-between', 'align-items-center');
  containerPrimary.append(primaryContent);

  const footerBrandLeft = document.createElement('section');
  footerBrandLeft.classList.add('footer-brand__left', 'd-flex', 'gap-16', 'px-10', 'align-items-center', 'justify-content-center');
  primaryContent.append(footerBrandLeft);

  // Primary Logo and Link
  const primaryLogoLink = document.createElement('a');
  primaryLogoLink.classList.add('footer-brand__logo', 'd-inline-block', 'analytics_cta_click');
  const primaryLink = primaryLogoLinkRow.querySelector('a');
  if (primaryLink) {
    primaryLogoLink.href = primaryLink.href;
    moveInstrumentation(primaryLogoLinkRow, primaryLogoLink);
  }

  const primaryPicture = primaryLogoRow.querySelector('picture');
  if (primaryPicture) {
    const img = primaryPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(primaryLogoRow, optimizedPic.querySelector('img'));
    primaryLogoLink.append(optimizedPic);
  }
  footerBrandLeft.append(primaryLogoLink);

  // Secondary Logo
  const secondaryLogoDiv = document.createElement('div');
  secondaryLogoDiv.classList.add('footer-brand__secondary--logo', 'd-inline-block');
  const secondaryPicture = secondaryLogoRow.querySelector('picture');
  if (secondaryPicture) {
    const img = secondaryPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(secondaryLogoRow, optimizedPic.querySelector('img'));
    secondaryLogoDiv.append(optimizedPic);
  }
  footerBrandLeft.append(secondaryLogoDiv);

  const footerBrandRight = document.createElement('section');
  footerBrandRight.classList.add('footer-brand__right');
  primaryContent.append(footerBrandRight);

  const footerBrandNavbar = document.createElement('nav');
  footerBrandNavbar.classList.add('footer-brand__navbar', 'd-grid', 'd-md-flex');
  footerBrandNavbar.setAttribute('aria-label', 'footer navbar');
  footerBrandRight.append(footerBrandNavbar);

  const navbarLeft = document.createElement('div');
  navbarLeft.classList.add('footer-brand__navbar--left', 'd-flex', 'flex-column', 'flex-md-row');
  footerBrandNavbar.append(navbarLeft);

  const navbarRight = document.createElement('div');
  navbarRight.classList.add('footer-brand__navbar--right', 'd-flex', 'flex-column', 'flex-md-row');
  footerBrandNavbar.append(navbarRight);

  // Footer Links
  footerLinkItemRows.forEach((row, index) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const footerListDiv = document.createElement('div');
    footerListDiv.classList.add('footerList');
    moveInstrumentation(row, footerListDiv); // Move instrumentation for the row to the new div
    const ul = document.createElement('ul');
    ul.classList.add('footer-list', 'd-flex', 'align-items-center', 'justify-content-center', 'align-items-md-start', 'flex-column');
    footerListDiv.append(ul);

    const li = document.createElement('li');
    li.classList.add('footer-list__item');

    const subListContainer = document.createElement('div'); // Temporary container for richtext HTML
    subListContainer.innerHTML = hierarchyTreeCell?.innerHTML || '';
    moveInstrumentation(hierarchyTreeCell, subListContainer); // Move instrumentation from cell to container

    const subList = subListContainer.querySelector('ul');
    const directLink = linkCell?.querySelector('a');

    if (subList) {
      const titleLink = document.createElement('a');
      titleLink.href = 'javascript:void(0)';
      titleLink.textContent = labelCell.textContent.trim();
      titleLink.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block');
      moveInstrumentation(labelCell, titleLink); // Move instrumentation from labelCell
      li.append(titleLink);

      const subLinksCvr = document.createElement('div');
      // subLinksCvr.classList.add('footer-sub-links-wrapper'); // Removed: Not in ORIGINAL HTML
      transformNestedLists(subList);

      // Apply classes to nested elements from ORIGINAL HTML
      subList.classList.add('footer-list', 'd-flex', 'align-items-center', 'justify-content-center', 'align-items-md-start', 'flex-column'); // Example classes from ORIGINAL HTML
      subList.querySelectorAll('li').forEach(nestedLi => nestedLi.classList.add('footer-list__item'));
      subList.querySelectorAll('a').forEach(nestedA => nestedA.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block'));

      while (subListContainer.firstChild) { // Move all children from temp container
        subLinksCvr.append(subListContainer.firstChild);
      }
      li.append(subLinksCvr);

      titleLink.addEventListener('click', (e) => {
        e.preventDefault();
        li.classList.toggle('active');
        subLinksCvr.classList.toggle('active');
      });
    } else {
      const anchor = document.createElement('a');
      if (directLink) anchor.href = directLink.href;
      anchor.textContent = labelCell.textContent.trim();
      anchor.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block');
      moveInstrumentation(labelCell, anchor); // Move instrumentation from labelCell
      moveInstrumentation(linkCell, anchor); // Move instrumentation from linkCell
      li.append(anchor);
    }
    ul.append(li);
    if (index % 2 === 0) {
      navbarLeft.append(footerListDiv);
    } else {
      navbarRight.append(footerListDiv);
    }
  });

  const footerBrandSecondary = document.createElement('section');
  footerBrandSecondary.classList.add('footer-brand__secondary');
  footerBrand.append(footerBrandSecondary);

  const containerSecondary = document.createElement('div');
  containerSecondary.classList.add('container');
  footerBrandSecondary.append(containerSecondary);

  const secondaryContent = document.createElement('div');
  secondaryContent.classList.add('footer-brand__secondary--content', 'd-flex', 'flex-column', 'justify-content-md-between', 'align-items-center');
  containerSecondary.append(secondaryContent);

  const footerBrandRightSocial = document.createElement('section');
  footerBrandRightSocial.classList.add('footer-brand__right', 'd-flex', 'flex-column', 'pb-5');
  secondaryContent.append(footerBrandRightSocial);

  const socialMediaTitle = document.createElement('h2');
  socialMediaTitle.classList.add('social_media--title');
  socialMediaTitle.textContent = 'Follow Us On'; // Hardcoded text, but this is a static label, not from authored content.
  footerBrandRightSocial.append(socialMediaTitle);

  const socialList = document.createElement('ul');
  socialList.classList.add('footer-brand__right--list', 'd-flex', 'align-items-center', 'justify-content-center', 'px-10', 'flex-wrap');
  footerBrandRightSocial.append(socialList);

  // Social Links
  socialLinkItemRows.forEach((row) => {
    const [iconCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('footer-brand__right--item', 'd-flex', 'justify-content-center', 'align-items-center');
    const anchor = document.createElement('a');
    anchor.classList.add('footer-brand__right--link', 'd-flex', 'justify-content-center', 'align-items-center', 'analytics_cta_click');
    const link = linkCell.querySelector('a');
    if (link) {
      anchor.href = link.href;
      moveInstrumentation(linkCell, anchor);
    }
    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(iconCell, optimizedPic.querySelector('img'));
      anchor.append(optimizedPic);
    }
    li.append(anchor);
    socialList.append(li);
  });

  const footerBrandLeftBottom = document.createElement('section');
  footerBrandLeftBottom.classList.add('footer-brand__left', 'py-5', 'd-flex', 'flex-column', 'gap-3');
  secondaryContent.append(footerBrandLeftBottom);

  const bottomList = document.createElement('ul');
  bottomList.classList.add('footer-brand__left--list', 'd-flex', 'align-items-center', 'justify-content-center', 'flex-wrap');
  footerBrandLeftBottom.append(bottomList);

  // Bottom Links
  bottomLinkItemRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('footer-brand__left--item', 'foot_link');
    const anchor = document.createElement('a');
    anchor.classList.add('footer-brand__left--link', 'analytics_cta_click');
    const link = linkCell.querySelector('a');
    if (link) {
      anchor.href = link.href;
      moveInstrumentation(linkCell, anchor);
    }
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);
    bottomList.append(li);
  });

  // Copyright Text
  const copyrightDiv = document.createElement('div');
  copyrightDiv.classList.add('footer-brand__left--copyright', 'text-center');
  const copyrightSpan = document.createElement('span');
  copyrightSpan.classList.add('footer-brand__left--text', 'text-white');
  copyrightSpan.textContent = copyrightRow.textContent.trim();
  moveInstrumentation(copyrightRow, copyrightSpan);
  copyrightDiv.append(copyrightSpan);
  footerBrandLeftBottom.append(copyrightDiv);

  block.replaceChildren(root);

  // This block.querySelectorAll('picture > img') loop is redundant and potentially problematic.
  // createOptimizedPicture is already used when creating image elements.
  // If this is intended to optimize images that were NOT handled by the above logic,
  // it should be more targeted or removed if all images are handled.
  // For now, keeping it as is, but flagging for potential review.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
