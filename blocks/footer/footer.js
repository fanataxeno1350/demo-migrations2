import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, parentInstrumentationElement) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Move instrumentation from the original <li> to the new <li>
    // if the original <li> was an authored row.
    // This is crucial for Universal Editor to track the list items.
    if (parentInstrumentationElement) {
      moveInstrumentation(parentInstrumentationElement, li);
    }

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
      subWrap.classList.add('has-sub-child');
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
      // Recursively transform nested lists, passing the current li for instrumentation
      transformNestedLists(nested, li);
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
    // navigationSectionsContainer, // These are container fields, their items are in itemRows
    // itcLinksContainer,
    // socialLinksContainer,
    ...itemRows
  ] = children;

  const root = document.createElement('div');
  root.classList.add('cmp-footer');

  // Background Images
  const backgroundDesktopPicture = backgroundDesktopRow?.querySelector('picture');
  if (backgroundDesktopPicture) {
    backgroundDesktopPicture.classList.add('background-desktop');
    moveInstrumentation(backgroundDesktopRow, backgroundDesktopPicture);
    root.append(backgroundDesktopPicture);
  }

  const backgroundMobilePicture = backgroundMobileRow?.querySelector('picture');
  if (backgroundMobilePicture) {
    backgroundMobilePicture.classList.add('background-mobile');
    moveInstrumentation(backgroundMobileRow, backgroundMobilePicture);
    root.append(backgroundMobilePicture);
  }

  const topContent = document.createElement('div');
  topContent.classList.add('cmp-footer__top-content');

  const navLogo = document.createElement('div');
  navLogo.classList.add('cmp-footer__nav-logo');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image');
  const cmpImage = document.createElement('div');
  cmpImage.classList.add('cmp-image');
  const footerLogo = document.createElement('div');
  footerLogo.classList.add('footerLogo');
  const bnaturalFooterDiv = document.createElement('div');
  bnaturalFooterDiv.classList.add('bnatural-footer-div');

  const bnaturalFooterDesktopDiv = document.createElement('div');
  bnaturalFooterDesktopDiv.classList.add('bnatural-footer-desktop-div');

  const logoDesktopLink = logoDesktopLinkRow?.querySelector('a');
  if (logoDesktopLink) {
    const logoDesktopAnchor = document.createElement('a');
    logoDesktopAnchor.href = logoDesktopLink.href;
    logoDesktopAnchor.classList.add('inlineBlockClass');
    const logoDesktopPicture = logoDesktopRow?.querySelector('picture');
    if (logoDesktopPicture) {
      moveInstrumentation(logoDesktopRow, logoDesktopAnchor); // Instrumentation from logoDesktopRow
      logoDesktopAnchor.append(logoDesktopPicture);
    }
    moveInstrumentation(logoDesktopLinkRow, logoDesktopAnchor); // Instrumentation from logoDesktopLinkRow
    bnaturalFooterDesktopDiv.append(logoDesktopAnchor);
  }

  const fssaiDesktopPicture = fssaiDesktopRow?.querySelector('picture');
  if (fssaiDesktopPicture) {
    const fssaiDesktopImg = fssaiDesktopPicture.querySelector('img');
    fssaiDesktopImg.classList.add('inlineBlockClass');
    moveInstrumentation(fssaiDesktopRow, fssaiDesktopImg);
    bnaturalFooterDesktopDiv.append(fssaiDesktopImg);
  }
  bnaturalFooterDiv.append(bnaturalFooterDesktopDiv);

  const bnaturalFooterMobileDiv = document.createElement('div');
  bnaturalFooterMobileDiv.classList.add('bnatural-footer-mobile-div');

  const logoMobileLink = logoMobileLinkRow?.querySelector('a');
  if (logoMobileLink) {
    const logoMobileAnchor = document.createElement('a');
    logoMobileAnchor.href = logoMobileLink.href;
    logoMobileAnchor.classList.add('inlineBlockClass');
    const logoMobilePicture = logoMobileRow?.querySelector('picture');
    if (logoMobilePicture) {
      moveInstrumentation(logoMobileRow, logoMobileAnchor); // Instrumentation from logoMobileRow
      logoMobileAnchor.append(logoMobilePicture);
    }
    moveInstrumentation(logoMobileLinkRow, logoMobileAnchor); // Instrumentation from logoMobileLinkRow
    bnaturalFooterMobileDiv.append(logoMobileAnchor);
  }

  const fssaiMobilePicture = fssaiMobileRow?.querySelector('picture');
  if (fssaiMobilePicture) {
    const fssaiMobileImg = fssaiMobilePicture.querySelector('img');
    fssaiMobileImg.classList.add('inlineBlockClass');
    moveInstrumentation(fssaiMobileRow, fssaiMobileImg);
    bnaturalFooterMobileDiv.append(fssaiMobileImg);
  }
  bnaturalFooterDiv.append(bnaturalFooterMobileDiv);

  footerLogo.append(bnaturalFooterDiv);
  cmpImage.append(footerLogo);
  logoDiv.append(cmpImage);
  navLogo.append(logoDiv);
  topContent.append(navLogo);

  // Navigation Sections
  const nav = document.createElement('div');
  nav.classList.add('cmp-footer__nav');

  const navSectionRows = itemRows.filter((row) => row.children.length === 1 && row.querySelector('ul'));
  const itcLinkRows = itemRows.filter((row) => row.children.length === 2);
  const socialLinkRows = itemRows.filter((row) => row.children.length === 3);

  navSectionRows.forEach((row, index) => {
    const [hierarchyTreeCell] = [...row.children];
    const navItems = document.createElement('div');
    navItems.classList.add('cmp-footer_nav-items', 'cmp-navigation_group--right', 'unsetBorder');
    if (index === navSectionRows.length - 1) {
      navItems.style.borderRight = 'unset';
    }

    const navigationDiv = document.createElement('div');
    navigationDiv.classList.add('navigation');
    const linksDiv = document.createElement('div');
    linksDiv.classList.add(`links${['one', 'two', 'three', 'four', 'five', 'six'][index] || ''}`, 'links');

    const cmpNavigation = document.createElement('nav');
    cmpNavigation.classList.add('cmp-navigation');
    const cmpNavigationGroup = document.createElement('ul');
    cmpNavigationGroup.classList.add('cmp-navigation__group');

    const rootUl = hierarchyTreeCell?.querySelector('ul');
    if (rootUl) {
      // Pass the original row to transformNestedLists for instrumentation of the top-level <li>s
      transformNestedLists(rootUl, row);
      [...rootUl.children].forEach((li) => {
        li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');
        const anchor = li.querySelector(':scope > a');
        if (anchor) {
          anchor.classList.add('cmp-navigation__item-link');
        }
        cmpNavigationGroup.append(li);
      });
    }
    cmpNavigation.append(cmpNavigationGroup);
    linksDiv.append(cmpNavigation);
    navigationDiv.append(linksDiv);
    moveInstrumentation(row, navItems); // Instrumentation for the whole nav section
    navItems.append(navigationDiv);
    nav.append(navItems);
  });
  topContent.append(nav);
  root.append(topContent);

  // Bottom Content
  const bottomContent = document.createElement('div');
  bottomContent.classList.add('cmp-footer__bottom-content');

  const container = document.createElement('div');
  container.classList.add('cmp-footer__container');

  const itcLinksContainerDiv = document.createElement('div');
  itcLinksContainerDiv.classList.add('cmp-footer__container-itclinks');

  itcLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const link = linkCell?.querySelector('a');
    if (link) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = labelCell?.textContent.trim();
      anchor.classList.add('footer-link');
      moveInstrumentation(row, anchor);
      itcLinksContainerDiv.append(anchor);
    } else {
      const p = document.createElement('p');
      p.textContent = labelCell?.textContent.trim();
      p.classList.add('footer-link', 'text-decoration-none');
      moveInstrumentation(row, p);
      itcLinksContainerDiv.append(p);
    }
  });

  container.append(itcLinksContainerDiv);

  const socialMediaContainer = document.createElement('div');
  socialMediaContainer.classList.add('cmp-footer__container__social-media');

  socialLinkRows.forEach((row, index) => {
    const [iconDesktopCell, iconMobileCell, linkCell] = [...row.children];
    const link = linkCell?.querySelector('a');
    if (link) {
      const socialIconDiv = document.createElement('div');
      socialIconDiv.classList.add(`soc_icon_${['one', 'two', 'three', 'four', 'five'][index] || ''}`, 'image');

      const cmpImageDiv = document.createElement('div');
      cmpImageDiv.classList.add('cmp-image');

      const anchor = document.createElement('a');
      anchor.classList.add('cmp-image__link');
      anchor.href = link.href;
      anchor.target = '_blank';

      const picture = document.createElement('picture');
      const sourceMobile = iconMobileCell?.querySelector('source');
      const imgDesktop = iconDesktopCell?.querySelector('img');

      if (sourceMobile) {
        picture.append(sourceMobile);
      }
      if (imgDesktop) {
        picture.append(imgDesktop);
      }
      anchor.append(picture);
      cmpImageDiv.append(anchor);
      socialIconDiv.append(cmpImageDiv);
      moveInstrumentation(row, socialIconDiv);
      socialMediaContainer.append(socialIconDiv);
    }
  });

  container.append(socialMediaContainer);
  bottomContent.append(container);
  root.append(bottomContent);

  // Optimize images
  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation should be called with the original img element and the new img element inside optimizedPic
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(root);
}
