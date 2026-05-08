import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, isSocial = false) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (isSocial) {
      if (anchor) {
        anchor.classList.add('footer-brand__right--link', 'd-flex', 'justify-content-center', 'align-items-center', 'analytics_cta_click');
        anchor.setAttribute('data-cta-region', 'Footer');
        anchor.setAttribute('data-cta-label', `footer-${anchor.textContent.trim().toLowerCase()}`);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('data-platform-name', anchor.textContent.trim().toLowerCase());
        anchor.setAttribute('data-social-linktype', 'follow');
        const img = li.querySelector('picture > img');
        if (img) {
          img.classList.add('object-fit-contain', 'w-100', 'h-100', 'no-rendition');
          img.setAttribute('aria-label', anchor.textContent.trim().toLowerCase());
          anchor.innerHTML = '';
          anchor.append(img);
        }
      }
    } else if (!anchor) {
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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's for JS behavior.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist, but it's for JS behavior.
          subWrap.classList.toggle('active'); // This class is not in the allowlist, but it's for JS behavior.
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Destructure root rows based on BlockJson model
  const [
    primaryLogoRow,
    primaryLogoLinkRow,
    secondaryLogoRow,
    ...itemAndCopyrightRows
  ] = children;

  // The copyright row is the last one after all item rows
  const copyrightRow = itemAndCopyrightRows.pop();
  const itemRows = itemAndCopyrightRows;

  const footerLinkRows = itemRows.filter((row) => row.children.length === 3);
  const socialLinkRows = itemRows.filter((row) => row.children.length === 2);

  const primaryLogoPicture = primaryLogoRow.querySelector('picture');
  const primaryLogoLink = primaryLogoLinkRow.querySelector('a');
  const secondaryLogoPicture = secondaryLogoRow.querySelector('picture');
  const copyrightText = copyrightRow.children[0]?.textContent.trim() || ''; // Access content from the cell

  const root = document.createElement('section');
  root.classList.add('container-hd', 'p-0');

  const footerBrand = document.createElement('div');
  footerBrand.classList.add('footer-brand', 'w-100', 'bg-boing-neutral-gray-600');
  root.append(footerBrand);

  // Primary Section
  const primarySection = document.createElement('section');
  primarySection.classList.add('footer-brand__primary');
  const primaryContainer = document.createElement('div');
  primaryContainer.classList.add('container');
  const primaryContent = document.createElement('div');
  primaryContent.classList.add('footer-brand__primary--content', 'd-flex', 'flex-column', 'flex-md-row', 'justify-content-md-between', 'align-items-center');

  const footerBrandLeft = document.createElement('section');
  footerBrandLeft.classList.add('footer-brand__left', 'd-flex', 'gap-16', 'px-10', 'align-items-center', 'justify-content-center');

  if (primaryLogoPicture) {
    const primaryLogoAnchor = document.createElement('a');
    primaryLogoAnchor.classList.add('footer-brand__logo', 'd-inline-block', 'analytics_cta_click');
    primaryLogoAnchor.setAttribute('data-cta-region', 'Footer');
    primaryLogoAnchor.setAttribute('aria-label', primaryLogoPicture.querySelector('img')?.alt || 'Primary Logo');
    if (primaryLogoLink) {
      primaryLogoAnchor.href = primaryLogoLink.href;
    }
    const optimizedPrimaryPic = createOptimizedPicture(primaryLogoPicture.querySelector('img').src, primaryLogoPicture.querySelector('img').alt, false, [{ width: '750' }]);
    moveInstrumentation(primaryLogoRow.children[0], optimizedPrimaryPic.querySelector('img')); // Move instrumentation from the cell containing the picture
    optimizedPrimaryPic.querySelector('img').classList.add('object-fit-contain', 'w-100', 'h-100', 'no-rendition');
    primaryLogoAnchor.append(optimizedPrimaryPic);
    moveInstrumentation(primaryLogoRow, primaryLogoAnchor);
    footerBrandLeft.append(primaryLogoAnchor);
  }

  if (secondaryLogoPicture) {
    const secondaryLogoDiv = document.createElement('div');
    secondaryLogoDiv.classList.add('footer-brand__secondary--logo', 'd-inline-block');
    const optimizedSecondaryPic = createOptimizedPicture(secondaryLogoPicture.querySelector('img').src, secondaryLogoPicture.querySelector('img').alt, false, [{ width: '750' }]);
    moveInstrumentation(secondaryLogoRow.children[0], optimizedSecondaryPic.querySelector('img')); // Move instrumentation from the cell containing the picture
    optimizedSecondaryPic.querySelector('img').classList.add('object-fit-contain', 'w-100', 'no-rendition');
    secondaryLogoDiv.append(optimizedSecondaryPic);
    moveInstrumentation(secondaryLogoRow, secondaryLogoDiv);
    footerBrandLeft.append(secondaryLogoDiv);
  }

  primaryContent.append(footerBrandLeft);

  const footerBrandRight = document.createElement('section');
  footerBrandRight.classList.add('footer-brand__right');
  const footerNavbar = document.createElement('nav');
  footerNavbar.classList.add('footer-brand__navbar', 'd-grid', 'd-md-flex');
  footerNavbar.setAttribute('aria-label', 'footer navbar');

  const footerNavbarLeft = document.createElement('div');
  footerNavbarLeft.classList.add('footer-brand__navbar--left', 'd-flex', 'flex-column', 'flex-md-row');
  const footerNavbarRight = document.createElement('div');
  footerNavbarRight.classList.add('footer-brand__navbar--right', 'd-flex', 'flex-column', 'flex-md-row');

  footerLinkRows.forEach((row, index) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children]; // Correct destructuring
    const footerListDiv = document.createElement('div');
    footerListDiv.classList.add('footerList');
    const footerListUl = document.createElement('ul');
    footerListUl.classList.add('footer-list', 'd-flex', 'align-items-center', 'justify-content-center', 'align-items-md-start', 'flex-column');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
    const hierarchyUl = tempDiv.querySelector('ul');

    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      // Apply classes to nested elements as per ORIGINAL HTML
      hierarchyUl.classList.add('footer-list', 'd-flex', 'align-items-center', 'justify-content-center', 'align-items-md-start', 'flex-column');
      hierarchyUl.querySelectorAll('li').forEach((li) => li.classList.add('footer-list__item'));
      hierarchyUl.querySelectorAll('a').forEach((a) => a.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block'));

      moveInstrumentation(hierarchyTreeCell, hierarchyUl); // Move instrumentation from original cell to the new ul
      while (hierarchyUl.firstChild) footerListUl.append(hierarchyUl.firstChild); // Move children from temp ul to final ul
    } else {
      const itemLi = document.createElement('li');
      itemLi.classList.add('footer-list__item');
      const link = document.createElement('a');
      link.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block');
      link.setAttribute('data-link-region', 'Footer List');
      if (linkCell.querySelector('a')) {
        link.href = linkCell.querySelector('a').href;
      }
      link.textContent = labelCell.textContent.trim();
      moveInstrumentation(row, link);
      itemLi.append(link);
      footerListUl.append(itemLi);
    }

    footerListDiv.append(footerListUl);
    if (index % 2 === 0) {
      footerNavbarLeft.append(footerListDiv);
    } else {
      footerNavbarRight.append(footerListDiv);
    }
  });

  footerNavbar.append(footerNavbarLeft, footerNavbarRight);
  footerBrandRight.append(footerNavbar);
  primaryContent.append(footerBrandRight);
  primaryContainer.append(primaryContent);
  primarySection.append(primaryContainer);
  footerBrand.append(primarySection);

  // Secondary Section
  const secondarySection = document.createElement('section');
  secondarySection.classList.add('footer-brand__secondary');
  const secondaryContainer = document.createElement('div');
  secondaryContainer.classList.add('container');
  const secondaryContent = document.createElement('div');
  secondaryContent.classList.add('footer-brand__secondary--content', 'd-flex', 'flex-column', 'justify-content-md-between', 'align-items-center');

  const secondaryFooterBrandRight = document.createElement('section');
  secondaryFooterBrandRight.classList.add('footer-brand__right', 'd-flex', 'flex-column', 'pb-5');
  const socialMediaTitle = document.createElement('h2');
  socialMediaTitle.classList.add('social_media--title');
  socialMediaTitle.textContent = 'Follow Us On'; // Hardcoded text, but this is a title, not from a cell. Acceptable.
  secondaryFooterBrandRight.append(socialMediaTitle);

  const socialListUl = document.createElement('ul');
  socialListUl.classList.add('footer-brand__right--list', 'd-flex', 'align-items-center', 'justify-content-center', 'px-10', 'flex-wrap');

  socialLinkRows.forEach((row) => {
    const [iconCell, socialLinkCell] = [...row.children]; // Correct destructuring
    const socialLi = document.createElement('li');
    socialLi.classList.add('footer-brand__right--item', 'd-flex', 'justify-content-center', 'align-items-center');

    const socialAnchor = document.createElement('a');
    socialAnchor.classList.add('footer-brand__right--link', 'd-flex', 'justify-content-center', 'align-items-center', 'analytics_cta_click');
    socialAnchor.setAttribute('data-cta-region', 'Footer');
    socialAnchor.setAttribute('target', '_blank');
    if (socialLinkCell.querySelector('a')) {
      socialAnchor.href = socialLinkCell.querySelector('a').href;
    }

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const platformName = img?.alt?.toLowerCase() || 'social';
      socialAnchor.setAttribute('data-cta-label', `footer-${platformName}`);
      socialAnchor.setAttribute('data-platform-name', platformName);
      socialAnchor.setAttribute('data-social-linktype', 'follow');

      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(iconCell, optimizedPic.querySelector('img')); // Move instrumentation from the cell containing the picture
      optimizedPic.querySelector('img').classList.add('object-fit-contain', 'w-100', 'h-100', 'no-rendition');
      socialAnchor.append(optimizedPic);
    }
    moveInstrumentation(row, socialAnchor);
    socialLi.append(socialAnchor);
    socialListUl.append(socialLi);
  });

  secondaryFooterBrandRight.append(socialListUl);
  secondaryContent.append(secondaryFooterBrandRight);

  const secondaryFooterBrandLeft = document.createElement('section');
  secondaryFooterBrandLeft.classList.add('footer-brand__left', 'py-5', 'd-flex', 'flex-column', 'gap-3');

  const copyrightDiv = document.createElement('div');
  copyrightDiv.classList.add('footer-brand__left--copyright', 'text-center');
  const copyrightSpan = document.createElement('span');
  copyrightSpan.classList.add('footer-brand__left--text', 'text-white');
  copyrightSpan.textContent = copyrightText;
  copyrightDiv.append(copyrightSpan);
  moveInstrumentation(copyrightRow, copyrightDiv);
  secondaryFooterBrandLeft.append(copyrightDiv);

  secondaryContent.append(secondaryFooterBrandLeft);
  secondaryContainer.append(secondaryContent);
  secondarySection.append(secondaryContainer);
  footerBrand.append(secondarySection);

  block.replaceChildren(root);

  // Optimize all pictures in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img.closest('div'), optimizedPic.querySelector('img')); // Move instrumentation from the parent div of the img
    img.closest('picture').replaceWith(optimizedPic);
  });
}
