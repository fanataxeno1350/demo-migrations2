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
      subWrap.classList.add('cmp-navigation__group'); // Use class from ORIGINAL HTML
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

  const [
    backgroundDesktopRow,
    backgroundMobileRow,
    logoDesktopRow,
    logoDesktopLinkRow,
    fssaiDesktopRow,
    logoMobileRow,
    logoMobileLinkRow,
    fssaiMobileRow,
    footerNavLinksOnePlaceholder, // Placeholder row for Footer Navigation Links One
    footerNavLinksTwoPlaceholder, // Placeholder row for Footer Navigation Links Two
    footerNavLinksThreePlaceholder, // Placeholder row for Footer Navigation Links Three
    footerLinksPlaceholder, // Placeholder row for Footer Bottom Links
    footerSocialLinksPlaceholder, // Placeholder row for Footer Social Links
    ...itemRows
  ] = children;

  const footerNavLinksOne = [];
  const footerNavLinksTwo = [];
  const footerNavLinksThree = [];
  const footerLinks = [];
  const footerSocialLinks = [];

  // Group itemRows based on their type and order
  let navItemCount = 0;
  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3) {
      // This could be footer-navigation-item or footer-social-item
      const [cell0, cell1, cell2] = cells;
      if (cell0.querySelector('picture') && cell2.querySelector('a')) {
        // This is a footer-social-item (iconDefault, iconHover, link)
        footerSocialLinks.push(row);
      } else if (cell0.textContent.trim() && cell1.querySelector('a') && cell2.querySelector('ul')) {
        // This is a footer-navigation-item (label, link, hierarchy-tree)
        // Assign to nav groups based on order, assuming fixed counts per group from original HTML
        if (navItemCount < 5) { // First group has 5 items
          footerNavLinksOne.push(row);
        } else if (navItemCount < 9) { // Second group has 4 items (5+4=9)
          footerNavLinksTwo.push(row);
        } else { // Third group has 3 items (9+3=12)
          footerNavLinksThree.push(row);
        }
        navItemCount += 1;
      }
    } else if (cells.length === 2) {
      // This is a footer-link-item (label, link)
      footerLinks.push(row);
    }
  });

  const root = document.createElement('div');
  root.classList.add('cmp-footer');

  // Background Images
  const backgroundDesktopPicture = backgroundDesktopRow?.querySelector('picture');
  const backgroundMobilePicture = backgroundMobileRow?.querySelector('picture');

  if (backgroundDesktopPicture || backgroundMobilePicture) {
    const desktopImg = backgroundDesktopPicture?.querySelector('img');
    const mobileImg = backgroundMobilePicture?.querySelector('img');

    if (desktopImg) {
      block.style.background = `url("${desktopImg.src}") 0% 0% / cover`;
      moveInstrumentation(backgroundDesktopRow, block);
    } else if (mobileImg) {
      block.style.background = `url("${mobileImg.src}") 0% 0% / cover`;
      moveInstrumentation(backgroundMobileRow, block);
    }
  }

  // Top Content
  const topContent = document.createElement('div');
  topContent.classList.add('cmp-footer__top-content');

  const navLogo = document.createElement('div');
  navLogo.classList.add('cmp-footer__nav-logo');
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo', 'image');
  const cmpImage = document.createElement('div');
  cmpImage.classList.add('cmp-image');
  const footerLogo = document.createElement('div');
  footerLogo.classList.add('footerLogo');

  const bnaturalFooterDiv = document.createElement('div');
  bnaturalFooterDiv.classList.add('bnatural-footer-div');

  // Desktop Logo and FSSAI
  const bnaturalFooterDesktopDiv = document.createElement('div');
  bnaturalFooterDesktopDiv.classList.add('bnatural-footer-desktop-div');

  const logoDesktopPicture = logoDesktopRow?.querySelector('picture');
  const logoDesktopLink = logoDesktopLinkRow?.querySelector('a');
  if (logoDesktopPicture && logoDesktopLink) {
    const linkEl = document.createElement('a');
    linkEl.href = logoDesktopLink.href;
    linkEl.classList.add('inlineBlockClass');
    const optimizedPic = createOptimizedPicture(logoDesktopPicture.querySelector('img').src, logoDesktopPicture.querySelector('img').alt, false, [{ width: '750' }]);
    linkEl.append(optimizedPic);
    moveInstrumentation(logoDesktopRow, optimizedPic); // Move instrumentation from original picture row
    moveInstrumentation(logoDesktopLinkRow, linkEl); // Move instrumentation from original link row
    bnaturalFooterDesktopDiv.append(linkEl);
  }

  const fssaiDesktopPicture = fssaiDesktopRow?.querySelector('picture');
  if (fssaiDesktopPicture) {
    const optimizedPic = createOptimizedPicture(fssaiDesktopPicture.querySelector('img').src, fssaiDesktopPicture.querySelector('img').alt, false, [{ width: '750' }]);
    optimizedPic.querySelector('img').classList.add('inlineBlockClass');
    moveInstrumentation(fssaiDesktopRow, optimizedPic); // Move instrumentation from original picture row
    bnaturalFooterDesktopDiv.append(optimizedPic);
  }
  bnaturalFooterDiv.append(bnaturalFooterDesktopDiv);

  // Mobile Logo and FSSAI
  const bnaturalFooterMobileDiv = document.createElement('div');
  bnaturalFooterMobileDiv.classList.add('bnatural-footer-mobile-div');

  const logoMobilePicture = logoMobileRow?.querySelector('picture');
  const logoMobileLink = logoMobileLinkRow?.querySelector('a');
  if (logoMobilePicture && logoMobileLink) {
    const linkEl = document.createElement('a');
    linkEl.href = logoMobileLink.href;
    linkEl.classList.add('inlineBlockClass');
    const optimizedPic = createOptimizedPicture(logoMobilePicture.querySelector('img').src, logoMobilePicture.querySelector('img').alt, false, [{ width: '750' }]);
    linkEl.append(optimizedPic);
    moveInstrumentation(logoMobileRow, optimizedPic); // Move instrumentation from original picture row
    moveInstrumentation(logoMobileLinkRow, linkEl); // Move instrumentation from original link row
    bnaturalFooterMobileDiv.append(linkEl);
  }

  const fssaiMobilePicture = fssaiMobileRow?.querySelector('picture');
  if (fssaiMobilePicture) {
    const optimizedPic = createOptimizedPicture(fssaiMobilePicture.querySelector('img').src, fssaiMobilePicture.querySelector('img').alt, false, [{ width: '750' }]);
    optimizedPic.querySelector('img').classList.add('inlineBlockClass');
    moveInstrumentation(fssaiMobileRow, optimizedPic); // Move instrumentation from original picture row
    bnaturalFooterMobileDiv.append(optimizedPic);
  }
  bnaturalFooterDiv.append(bnaturalFooterMobileDiv);

  footerLogo.append(bnaturalFooterDiv);
  cmpImage.append(footerLogo);
  logoWrapper.append(cmpImage);
  navLogo.append(logoWrapper);
  topContent.append(navLogo);

  // Navigation Links
  const footerNav = document.createElement('div');
  footerNav.classList.add('cmp-footer__nav');

  const navGroups = [
    { items: footerNavLinksOne, placeholder: footerNavLinksOnePlaceholder, classes: ['linksone', 'links'] },
    { items: footerNavLinksTwo, placeholder: footerNavLinksTwoPlaceholder, classes: ['linkstwo', 'links'] },
    { items: footerNavLinksThree, placeholder: footerNavLinksThreePlaceholder, classes: ['linksthree', 'links'] },
  ];

  navGroups.forEach((group, index) => {
    const navItemsWrapper = document.createElement('div');
    navItemsWrapper.classList.add('cmp-footer_nav-items', 'cmp-navigation_group--right');
    if (index === navGroups.length - 1) { // Last group based on original HTML
      navItemsWrapper.classList.add('unsetBorder');
      navItemsWrapper.style.borderRight = 'unset';
    } else {
      navItemsWrapper.classList.add('unsetBorder');
    }
    navItemsWrapper.style.display = 'block';

    const navigationDiv = document.createElement('div');
    navigationDiv.classList.add('navigation');
    const linksDiv = document.createElement('div');
    linksDiv.classList.add(...group.classes);

    const nav = document.createElement('nav');
    nav.classList.add('cmp-navigation');
    const ul = document.createElement('ul');
    ul.classList.add('cmp-navigation__group');

    group.items.forEach((row) => {
      const [labelCell, linkCell, hierarchyCell] = [...row.children];
      const subList = hierarchyCell?.querySelector('ul');
      const directHref = linkCell?.querySelector('a')?.href;

      const li = document.createElement('li');
      li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');
      moveInstrumentation(row, li);

      if (subList) {
        const titleLink = document.createElement('a');
        titleLink.classList.add('cmp-navigation__item-link');
        titleLink.href = directHref || 'javascript:void(0)';
        titleLink.textContent = labelCell.textContent.trim();
        li.append(titleLink);

        const subLinksContainer = document.createElement('div');
        subLinksContainer.classList.add('cmp-navigation__group'); // Use class from ORIGINAL HTML
        // Move instrumentation from hierarchyCell to the new container
        moveInstrumentation(hierarchyCell, subLinksContainer);
        // Append all children from hierarchyCell (which contains the ul)
        while (hierarchyCell.firstChild) {
          subLinksContainer.append(hierarchyCell.firstChild);
        }
        transformNestedLists(subLinksContainer);
        li.append(subLinksContainer);

        titleLink.addEventListener('click', (e) => {
          e.preventDefault();
          li.classList.toggle('active');
          subLinksContainer.classList.toggle('active');
        });
      } else {
        const anchor = document.createElement('a');
        anchor.classList.add('cmp-navigation__item-link');
        if (directHref) anchor.href = directHref;
        anchor.textContent = labelCell.textContent.trim();
        li.append(anchor);
      }
      ul.append(li);
    });
    nav.append(ul);
    linksDiv.append(nav);
    navigationDiv.append(linksDiv);
    navItemsWrapper.append(navigationDiv);
    footerNav.append(navItemsWrapper);
    moveInstrumentation(group.placeholder, navItemsWrapper);
  });
  topContent.append(footerNav);
  root.append(topContent);

  // Bottom Content
  const bottomContent = document.createElement('div');
  bottomContent.classList.add('cmp-footer__bottom-content');

  const container = document.createElement('div');
  container.classList.add('cmp-footer__container');

  // ITC Links
  const itcLinksContainer = document.createElement('div');
  itcLinksContainer.classList.add('cmp-footer__container-itclinks');

  footerLinks.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const link = document.createElement('a');
    link.classList.add('footer-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) link.href = foundLink.href;
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, link);
    itcLinksContainer.append(link);
  });
  container.append(itcLinksContainer);
  moveInstrumentation(footerLinksPlaceholder, itcLinksContainer);

  // Social Media Links
  const socialMediaContainer = document.createElement('div');
  socialMediaContainer.classList.add('cmp-footer__container__social-media');

  footerSocialLinks.forEach((row, index) => {
    const [iconDefaultCell, iconHoverCell, linkCell] = [...row.children];
    const socialIconDiv = document.createElement('div');
    socialIconDiv.classList.add(`soc_icon_${index + 1}`, 'image');

    const cmpImageDiv = document.createElement('div');
    cmpImageDiv.classList.add('cmp-image');

    const socialLink = document.createElement('a');
    socialLink.classList.add('cmp-image__link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) socialLink.href = foundLink.href;
    socialLink.target = '_blank'; // Assuming social links open in new tab

    const defaultPicture = iconDefaultCell.querySelector('picture');
    const hoverPicture = iconHoverCell.querySelector('picture');

    if (defaultPicture) {
      const optimizedPic = createOptimizedPicture(defaultPicture.querySelector('img').src, defaultPicture.querySelector('img').alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('cmp-image__image');
      socialLink.append(optimizedPic);
      moveInstrumentation(iconDefaultCell, optimizedPic); // Move instrumentation from original picture cell
    } else if (hoverPicture) { // Fallback if default is missing
      const optimizedPic = createOptimizedPicture(hoverPicture.querySelector('img').src, hoverPicture.querySelector('img').alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('cmp-image__image');
      socialLink.append(optimizedPic);
      moveInstrumentation(iconHoverCell, optimizedPic); // Move instrumentation from original picture cell
    }
    moveInstrumentation(row, socialLink);
    cmpImageDiv.append(socialLink);
    socialIconDiv.append(cmpImageDiv);
    socialMediaContainer.append(socialIconDiv);
  });
  container.append(socialMediaContainer);
  moveInstrumentation(footerSocialLinksPlaceholder, socialMediaContainer);

  bottomContent.append(container);
  root.append(bottomContent);

  block.replaceChildren(root);

  // The outer block div already has 'footer-new' and 'data-component="footer"' from AEM.
  // No need to add them again here.
  // block.classList.add('footer-new');
  // block.setAttribute('data-component', 'footer');

  // Image optimization for all pictures in the block
  // This loop should be carefully considered. If createOptimizedPicture is already used
  // for specific images, this might re-optimize or interfere.
  // For now, assuming it's a general cleanup for any remaining unoptimized images.
  block.querySelectorAll('picture > img').forEach((img) => {
    // Check if the image is already part of an optimized picture created earlier
    // by checking if its parent is a <picture> element that was just created.
    // This is a heuristic to avoid double-processing.
    if (!img.closest('picture')?.dataset.optimised) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img.closest('div'), optimizedPic); // Move instrumentation from the original div containing the picture
      optimizedPic.dataset.optimised = 'true'; // Mark as processed
      img.closest('picture').replaceWith(optimizedPic);
    }
  });
}
