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
      subWrap.classList.add('cmp-navigation__sub-group-wrapper'); // Corrected class from original HTML
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
    // These are container fields, their item rows are mixed in `itemRows`
    // footerLinksOneContainer,
    // footerLinksTwoContainer,
    // footerLinksThreeContainer,
    // footerLinksITCContainer,
    // footerSocialLinksContainer,
    ...itemRows // All remaining rows are item rows
  ] = children;

  // Filter item rows based on their structure
  const allFooterLinkItems = itemRows.filter((row) => row.children.length === 3);
  const allSocialLinkItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('picture'));
  const allItcLinkItems = itemRows.filter((row) => row.children.length === 2); // Assuming ITC links are 2 cells

  // Create a copy to be consumed by different sections
  const footerLinkItemsForNav = [...allFooterLinkItems];
  const itcLinkItemsForBottom = [...allItcLinkItems];
  const socialLinkItemsForBottom = [...allSocialLinkItems];


  const root = document.createElement('div');
  // root.classList.add('cmp-footer'); // VIOLATION: block already has this class from AEM

  // Background Images
  const backgroundDesktopPicture = backgroundDesktopRow?.querySelector('picture');
  const backgroundMobilePicture = backgroundMobileRow?.querySelector('picture');

  if (backgroundDesktopPicture || backgroundMobilePicture) {
    const style = document.createElement('style');
    let desktopSrc = backgroundDesktopPicture?.querySelector('img')?.src;
    let mobileSrc = backgroundMobilePicture?.querySelector('img')?.src;

    if (desktopSrc) {
      desktopSrc = createOptimizedPicture(desktopSrc, '', false, [{ width: '2000' }]).querySelector('img').src;
    }
    if (mobileSrc) {
      mobileSrc = createOptimizedPicture(mobileSrc, '', false, [{ width: '768' }]).querySelector('img').src;
    }

    let css = '';
    if (desktopSrc) {
      css += `.footer { background: url("${desktopSrc}") 0% 0% / cover; }`;
    }
    if (mobileSrc) {
      css += `@media (max-width: 767px) { .footer { background: url("${mobileSrc}") 0% 0% / cover; } }`;
    }
    style.textContent = css;
    block.append(style);
  }

  // Top Content
  const topContent = document.createElement('div');
  topContent.classList.add('cmp-footer__top-content');

  const navLogo = document.createElement('div');
  navLogo.classList.add('cmp-footer__nav-logo');
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image');
  const cmpImage = document.createElement('div');
  cmpImage.classList.add('cmp-image');
  const footerLogoDiv = document.createElement('div');
  footerLogoDiv.classList.add('footerLogo');
  const bnaturalFooterDiv = document.createElement('div');
  bnaturalFooterDiv.classList.add('bnatural-footer-div');

  const bnaturalFooterDesktopDiv = document.createElement('div');
  bnaturalFooterDesktopDiv.classList.add('bnatural-footer-desktop-div');

  const logoDesktopLink = document.createElement('a');
  logoDesktopLink.classList.add('inlineBlockClass');
  const logoDesktopLinkHref = logoDesktopLinkRow?.querySelector('a')?.href;
  if (logoDesktopLinkHref) {
    logoDesktopLink.href = logoDesktopLinkHref;
  }
  const logoDesktopPicture = logoDesktopRow?.querySelector('picture');
  if (logoDesktopPicture) {
    moveInstrumentation(logoDesktopRow, logoDesktopLink);
    logoDesktopLink.append(logoDesktopPicture);
    bnaturalFooterDesktopDiv.append(logoDesktopLink);
  }

  const fssaiDesktopPicture = fssaiDesktopRow?.querySelector('picture');
  if (fssaiDesktopPicture) {
    const fssaiDesktopImg = fssaiDesktopPicture.querySelector('img');
    fssaiDesktopImg.classList.add('inlineBlockClass');
    moveInstrumentation(fssaiDesktopRow, fssaiDesktopImg);
    bnaturalFooterDesktopDiv.append(fssaiDesktopImg);
  }

  const bnaturalFooterMobileDiv = document.createElement('div');
  bnaturalFooterMobileDiv.classList.add('bnatural-footer-mobile-div');

  const logoMobileLink = document.createElement('a');
  logoMobileLink.classList.add('inlineBlockClass');
  const logoMobileLinkHref = logoMobileLinkRow?.querySelector('a')?.href;
  if (logoMobileLinkHref) {
    logoMobileLink.href = logoMobileLinkHref;
  }
  const logoMobilePicture = logoMobileRow?.querySelector('picture');
  if (logoMobilePicture) {
    moveInstrumentation(logoMobileRow, logoMobileLink);
    logoMobileLink.append(logoMobilePicture);
    bnaturalFooterMobileDiv.append(logoMobileLink);
  }

  const fssaiMobilePicture = fssaiMobileRow?.querySelector('picture');
  if (fssaiMobilePicture) {
    const fssaiMobileImg = fssaiMobilePicture.querySelector('img');
    fssaiMobileImg.classList.add('inlineBlockClass');
    moveInstrumentation(fssaiMobileRow, fssaiMobileImg);
    bnaturalFooterMobileDiv.append(fssaiMobileImg);
  }

  bnaturalFooterDiv.append(bnaturalFooterDesktopDiv, bnaturalFooterMobileDiv);
  footerLogoDiv.append(bnaturalFooterDiv);
  cmpImage.append(footerLogoDiv);
  logoDiv.append(cmpImage);
  navLogo.append(logoDiv);
  topContent.append(navLogo);

  // Navigation Links
  const cmpFooterNav = document.createElement('div');
  cmpFooterNav.classList.add('cmp-footer__nav');

  // The model defines 4 footer link containers. We need to distribute footerLinkItemsForNav among them.
  // This distribution is usually based on the original HTML structure or a specific logic.
  // For now, assuming an even split or a predefined count per container.
  // The original HTML shows 3 visible link groups and 3 hidden ones.
  const linkGroupsData = [
    { name: 'linksone', count: 5, display: 'block', border: 'unsetBorder' },
    { name: 'linkstwo', count: 4, display: 'block', border: 'unsetBorder' },
    { name: 'linksthree', count: 3, display: 'block', border: 'unsetBorder' }, // This one also has border-right: unset
    { name: 'linksfour', count: 0, display: 'none', border: '' },
    { name: 'linksfive', count: 0, display: 'none', border: '' },
    { name: 'linkssix', count: 0, display: 'none', border: '' },
  ];

  let consumedLinkItems = 0;
  linkGroupsData.forEach((group, index) => {
    const navItems = document.createElement('div');
    navItems.classList.add('cmp-footer_nav-items', 'cmp-navigation_group--right');
    if (group.border) {
      navItems.classList.add(group.border);
    }
    if (index === 2) { // The third link group has unsetBorder and border-right: unset
      navItems.style.borderRight = 'unset';
    }
    navItems.style.display = group.display;

    const navigationDiv = document.createElement('div');
    navigationDiv.classList.add('navigation');
    const linksDiv = document.createElement('div');
    linksDiv.classList.add(group.name, 'links');
    const nav = document.createElement('nav');
    nav.classList.add('cmp-navigation');
    const ul = document.createElement('ul');
    ul.classList.add('cmp-navigation__group');

    // Extract items for this container based on predefined counts
    const itemsForThisContainer = footerLinkItemsForNav.slice(consumedLinkItems, consumedLinkItems + group.count);
    consumedLinkItems += group.count;

    itemsForThisContainer.forEach((row) => {
      const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
      const li = document.createElement('li');
      li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
      const subList = tempDiv.querySelector('ul');
      const directLink = linkCell?.querySelector('a');

      if (subList) {
        const titleLink = document.createElement('a');
        titleLink.classList.add('cmp-navigation__item-link');
        titleLink.href = directLink?.href || 'javascript:void(0)';
        titleLink.textContent = labelCell.textContent.trim();
        moveInstrumentation(row, titleLink); // Move instrumentation from the row to the title link
        li.append(titleLink);

        const subLinksWrapper = document.createElement('div');
        subLinksWrapper.classList.add('cmp-navigation__sub-group-wrapper');
        const subUl = document.createElement('ul');
        subUl.classList.add('cmp-navigation__group');

        // Move instrumentation from the original hierarchyTreeCell to the tempDiv
        moveInstrumentation(hierarchyTreeCell, tempDiv);

        // Append children from tempDiv to subUl, preserving instrumentation
        while (tempDiv.firstChild) {
          const child = tempDiv.firstChild;
          if (child.tagName === 'UL') { // Only process the actual UL
            [...child.children].forEach((subLiEl) => {
              const subLi = document.createElement('li');
              subLi.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1');
              const subAnchor = subLiEl.querySelector('a');
              if (subAnchor) {
                const link = document.createElement('a');
                link.classList.add('cmp-navigation__item-link');
                link.href = subAnchor.href;
                link.textContent = subAnchor.textContent.trim();
                moveInstrumentation(subLiEl, link); // Move instrumentation from original li to new link
                subLi.append(link);
              } else {
                const span = document.createElement('span');
                span.textContent = subLiEl.textContent.trim();
                moveInstrumentation(subLiEl, span); // Move instrumentation from original li to new span
                subLi.append(span);
              }
              subUl.append(subLi);
            });
          }
          tempDiv.removeChild(child); // Remove after processing
        }
        subLinksWrapper.append(subUl);
        li.append(subLinksWrapper);

        titleLink.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subLinksWrapper.classList.toggle('active');
        });
      } else {
        const anchor = document.createElement('a');
        anchor.classList.add('cmp-navigation__item-link');
        if (directLink) {
          anchor.href = directLink.href;
        }
        anchor.textContent = labelCell.textContent.trim();
        moveInstrumentation(row, anchor);
        li.append(anchor);
      }
      ul.append(li);
    });

    // moveInstrumentation(containerRow, nav); // containerRow is not available here, it's implicit
    nav.append(ul);
    linksDiv.append(nav);
    navigationDiv.append(linksDiv);
    navItems.append(navigationDiv);
    cmpFooterNav.append(navItems);
  });
  topContent.append(cmpFooterNav);
  root.append(topContent);

  // Bottom Content
  const bottomContent = document.createElement('div');
  bottomContent.classList.add('cmp-footer__bottom-content');
  const bottomContainer = document.createElement('div');
  bottomContainer.classList.add('cmp-footer__container');

  const itcLinksContainer = document.createElement('div');
  itcLinksContainer.classList.add('cmp-footer__container-itclinks');

  itcLinkItemsForBottom.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const anchor = document.createElement('a');
    anchor.classList.add('footer-link');
    const linkHref = linkCell?.querySelector('a')?.href;
    if (linkHref) {
      anchor.href = linkHref;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor);
    itcLinksContainer.append(anchor);
  });

  const socialMediaContainer = document.createElement('div');
  socialMediaContainer.classList.add('cmp-footer__container__social-media');

  socialLinkItemsForBottom.forEach((row, index) => {
    const [iconDesktopCell, iconMobileCell, socialLinkCell] = [...row.children];
    const socialIconDiv = document.createElement('div');
    socialIconDiv.classList.add(`soc_icon_${['one', 'two', 'three', 'four', 'five'][index]}`, 'image');

    const cmpImageDiv = document.createElement('div');
    cmpImageDiv.classList.add('cmp-image');

    const socialAnchor = document.createElement('a');
    socialAnchor.classList.add('cmp-image__link');
    const socialLinkHref = socialLinkCell?.querySelector('a')?.href;
    if (socialLinkHref) {
      socialAnchor.href = socialLinkHref;
    }
    moveInstrumentation(socialLinkCell, socialAnchor);

    const picture = document.createElement('picture');
    const mobilePicture = iconMobileCell?.querySelector('picture');
    const desktopPicture = iconDesktopCell?.querySelector('picture');

    if (mobilePicture) {
      const source = document.createElement('source');
      source.media = '(max-width:767px)';
      source.srcset = mobilePicture.querySelector('img')?.src;
      picture.append(source);
    }

    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      img.classList.add('cmp-image__image');
      picture.append(img);
    } else if (mobilePicture) { // Fallback to mobile if only mobile is present
      const img = mobilePicture.querySelector('img');
      img.classList.add('cmp-image__image');
      picture.append(img);
    }

    socialAnchor.append(picture);
    cmpImageDiv.append(socialAnchor);
    socialIconDiv.append(cmpImageDiv);
    moveInstrumentation(row, socialIconDiv);
    socialMediaContainer.append(socialIconDiv);
  });

  bottomContainer.append(itcLinksContainer, socialMediaContainer);
  bottomContent.append(bottomContainer);
  root.append(bottomContent);

  block.replaceChildren(root);

  // Optimize all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
