import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    // Handle label-only nodes
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
      // Use class from ORIGINAL HTML: cmp-navigation__sub-group-wrapper
      subWrap.classList.add('cmp-navigation__sub-group-wrapper');
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
    logoLinkDesktopRow,
    fssaiLogoDesktopRow,
    logoMobileRow,
    logoLinkMobileRow,
    fssaiLogoMobileRow,
    // These are not actual rows, but placeholders for container fields.
    // The item rows for these containers are filtered from `itemRows`.
    // We keep them here for `moveInstrumentation` later if needed for the container itself.
    footerLinksOneContainer, // This is block.children[8]
    footerLinksTwoContainer, // This is block.children[9]
    footerLinksThreeContainer, // This is block.children[10]
    footerItcLinksContainer, // This is block.children[11]
    footerSocialLinksContainer, // This is block.children[12]
    ...itemRows // All subsequent rows are item rows
  ] = children;

  const footerRoot = document.createElement('div');
  footerRoot.classList.add('cmp-footer');

  // Background Images
  const backgroundDesktopPicture = backgroundDesktopRow.querySelector('picture');
  const backgroundMobilePicture = backgroundMobileRow.querySelector('picture');

  if (backgroundDesktopPicture) {
    const img = backgroundDesktopPicture.querySelector('img');
    if (img) {
      footerRoot.style.backgroundImage = `url(${img.src})`;
      footerRoot.style.backgroundSize = 'cover';
      footerRoot.style.backgroundPosition = '0% 0%';
      moveInstrumentation(backgroundDesktopRow, footerRoot);
    }
  }
  // Move instrumentation for mobile background row even if not used for style
  moveInstrumentation(backgroundMobileRow, footerRoot);

  // Optimize images
  // This loop should be applied to the final structure, not the initial block children
  // For now, it's fine as it targets pictures within footerRoot
  footerRoot.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation(img, optimizedPic.querySelector('img')); // Instrumentation should be moved from the row, not the img
    img.closest('picture').replaceWith(optimizedPic);
  });

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

  const desktopLogoLink = document.createElement('a');
  desktopLogoLink.classList.add('inlineBlockClass');
  const desktopLogoImg = logoDesktopRow.querySelector('picture');
  const desktopLogoHref = logoLinkDesktopRow.querySelector('a')?.href;
  if (desktopLogoHref) desktopLogoLink.href = desktopLogoHref;
  if (desktopLogoImg) {
    moveInstrumentation(logoDesktopRow, desktopLogoLink);
    desktopLogoLink.append(desktopLogoImg);
  }
  bnaturalFooterDesktopDiv.append(desktopLogoLink);

  const desktopFssaiImg = fssaiLogoDesktopRow.querySelector('picture');
  if (desktopFssaiImg) {
    const fssaiImgElement = desktopFssaiImg.querySelector('img');
    if (fssaiImgElement) fssaiImgElement.classList.add('inlineBlockClass');
    moveInstrumentation(fssaiLogoDesktopRow, desktopFssaiImg);
    bnaturalFooterDesktopDiv.append(desktopFssaiImg);
  }
  bnaturalFooterDiv.append(bnaturalFooterDesktopDiv);

  const bnaturalFooterMobileDiv = document.createElement('div');
  bnaturalFooterMobileDiv.classList.add('bnatural-footer-mobile-div');

  const mobileLogoLink = document.createElement('a');
  mobileLogoLink.classList.add('inlineBlockClass');
  const mobileLogoImg = logoMobileRow.querySelector('picture');
  const mobileLogoHref = logoLinkMobileRow.querySelector('a')?.href;
  if (mobileLogoHref) mobileLogoLink.href = mobileLogoHref;
  if (mobileLogoImg) {
    moveInstrumentation(logoMobileRow, mobileLogoLink);
    mobileLogoLink.append(mobileLogoImg);
  }
  bnaturalFooterMobileDiv.append(mobileLogoLink);

  const mobileFssaiImg = fssaiLogoMobileRow.querySelector('picture');
  if (mobileFssaiImg) {
    const fssaiImgElement = mobileFssaiImg.querySelector('img');
    if (fssaiImgElement) fssaiImgElement.classList.add('inlineBlockClass');
    moveInstrumentation(fssaiLogoMobileRow, mobileFssaiImg);
    bnaturalFooterMobileDiv.append(mobileFssaiImg);
  }
  bnaturalFooterDiv.append(bnaturalFooterMobileDiv);

  footerLogoDiv.append(bnaturalFooterDiv);
  cmpImage.append(footerLogoDiv);
  logoDiv.append(cmpImage);
  navLogo.append(logoDiv);
  topContent.append(navLogo);

  const footerNav = document.createElement('div');
  footerNav.classList.add('cmp-footer__nav');

  // Filter item rows based on their structure
  // footer-link-item: 3 cells, last cell is richtext (ul)
  // footer-social-item: 3 cells, first two are pictures
  const footerLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[2]?.querySelector('ul');
  });
  const footerSocialItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0]?.querySelector('picture') && cells[1]?.querySelector('picture');
  });

  let footerLinksOne = [];
  let footerLinksTwo = [];
  let footerLinksThree = [];
  let footerItcLinks = [];
  let footerSocialLinks = [];

  // Distribute footer-link-item rows to their respective containers based on original HTML structure
  // The original HTML shows fixed counts for each section
  let linkItemIndex = 0;
  const numFooterLinksOne = 5;
  const numFooterLinksTwo = 4;
  const numFooterLinksThree = 3;
  const numFooterItcLinks = 2; // ITC Portal and Copyright

  for (let i = 0; i < numFooterLinksOne && linkItemIndex < footerLinkItems.length; i++) {
    footerLinksOne.push(footerLinkItems[linkItemIndex++]);
  }
  for (let i = 0; i < numFooterLinksTwo && linkItemIndex < footerLinkItems.length; i++) {
    footerLinksTwo.push(footerLinkItems[linkItemIndex++]);
  }
  for (let i = 0; i < numFooterLinksThree && linkItemIndex < footerLinkItems.length; i++) {
    footerLinksThree.push(footerLinkItems[linkItemIndex++]);
  }
  for (let i = 0; i < numFooterItcLinks && linkItemIndex < footerLinkItems.length; i++) {
    footerItcLinks.push(footerLinkItems[linkItemIndex++]);
  }

  // Social links are identified by their specific cell structure (pictures).
  footerSocialLinks = footerSocialItems;

  const processLinkSection = (rows, containerRow, extraClasses) => {
    const navItemsDiv = document.createElement('div');
    navItemsDiv.classList.add('cmp-footer_nav-items', 'cmp-navigation_group--right', ...extraClasses);
    // Remove 'border-right: unset;' from classList.add, it's a style, not a class
    if (extraClasses.includes('unsetBorder')) navItemsDiv.style.display = 'block';

    const navigationDiv = document.createElement('div');
    navigationDiv.classList.add('navigation');
    const linksDiv = document.createElement('div');
    linksDiv.classList.add(extraClasses[0], 'links'); // First class is specific link group name

    const nav = document.createElement('nav');
    nav.classList.add('cmp-navigation');
    const ul = document.createElement('ul');
    ul.classList.add('cmp-navigation__group');

    rows.forEach((row) => {
      const [labelCell, linkCell, hierarchyTreeCell] = [...row.children]; // Destructuring for fixed schema
      const subList = hierarchyTreeCell?.querySelector('ul');
      const directHref = linkCell?.querySelector('a')?.href;

      const li = document.createElement('li');
      li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');

      if (subList) {
        const titleLink = document.createElement('a');
        titleLink.classList.add('cmp-navigation__item-link');
        titleLink.href = directHref || 'javascript:void(0)'; // If no direct link, use JS void
        titleLink.textContent = labelCell.textContent.trim();
        li.append(titleLink);

        const subLinksWrapper = document.createElement('div');
        subLinksWrapper.classList.add('cmp-navigation__sub-group-wrapper'); // Class from ORIGINAL HTML
        // Move instrumentation for the hierarchyTreeCell to the subLinksWrapper
        moveInstrumentation(hierarchyTreeCell, subLinksWrapper);
        subLinksWrapper.append(subList);
        transformNestedLists(subList); // Apply recursive transformation
        li.append(subLinksWrapper);

        titleLink.addEventListener('click', (e) => {
          e.preventDefault();
          li.classList.toggle('active');
          subLinksWrapper.classList.toggle('active');
        });
      } else {
        const anchor = document.createElement('a');
        anchor.classList.add('cmp-navigation__item-link');
        if (directHref) anchor.href = directHref;
        anchor.textContent = labelCell.textContent.trim();
        // Move instrumentation for the linkCell to the anchor
        moveInstrumentation(linkCell, anchor);
        li.append(anchor);
      }
      moveInstrumentation(row, li); // Move instrumentation for the whole row to the li
      ul.append(li);
    });

    nav.append(ul);
    linksDiv.append(nav);
    navigationDiv.append(linksDiv);
    navItemsDiv.append(navigationDiv);
    moveInstrumentation(containerRow, navItemsDiv); // Move instrumentation for the container placeholder row
    footerNav.append(navItemsDiv);
  };

  processLinkSection(footerLinksOne, footerLinksOneContainer, ['linksone', 'unsetBorder']);
  processLinkSection(footerLinksTwo, footerLinksTwoContainer, ['linkstwo', 'unsetBorder']);
  processLinkSection(footerLinksThree, footerLinksThreeContainer, ['linksthree', 'unsetBorder']);

  // For ITC links, they are usually flat and don't have hierarchy-tree
  const itcLinksDiv = document.createElement('div');
  itcLinksDiv.classList.add('cmp-footer__bottom-content');
  const itcContainer = document.createElement('div');
  itcContainer.classList.add('cmp-footer__container');
  const itcLinksWrapper = document.createElement('div');
  itcLinksWrapper.classList.add('cmp-footer__container-itclinks');

  footerItcLinks.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const anchor = document.createElement('a');
    anchor.classList.add('footer-link');
    const href = linkCell?.querySelector('a')?.href;
    if (href) anchor.href = href;
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor);
    itcLinksWrapper.append(anchor);
  });
  moveInstrumentation(footerItcLinksContainer, itcLinksWrapper); // Move instrumentation for the container placeholder row
  itcContainer.append(itcLinksWrapper);

  const socialMediaContainer = document.createElement('div');
  socialMediaContainer.classList.add('cmp-footer__container__social-media');

  footerSocialLinks.forEach((row, index) => {
    const [iconDefaultCell, iconHoverCell, socialLinkCell] = [...row.children]; // Destructuring for fixed schema
    const socialIconDiv = document.createElement('div');
    socialIconDiv.classList.add(`soc_icon_${index + 1}`, 'image');

    const cmpImageDiv = document.createElement('div');
    cmpImageDiv.classList.add('cmp-image');

    const socialLink = socialLinkCell.querySelector('a')?.href;
    const socialAnchor = document.createElement('a');
    socialAnchor.classList.add('cmp-image__link');
    if (socialLink) socialAnchor.href = socialLink;
    socialAnchor.target = '_blank';

    const picture = document.createElement('picture');
    const defaultImg = iconDefaultCell.querySelector('picture > img');
    const hoverImg = iconHoverCell.querySelector('picture > img');

    if (hoverImg) {
      const source = document.createElement('source');
      source.media = '(max-width:767px)';
      source.srcset = hoverImg.src;
      picture.append(source);
    }

    if (defaultImg) {
      const img = document.createElement('img');
      img.src = defaultImg.src;
      img.loading = 'lazy';
      img.fetchPriority = 'low';
      img.classList.add('cmp-image__image');
      img.alt = defaultImg.alt || '';
      picture.append(img);
    }

    socialAnchor.append(picture);
    cmpImageDiv.append(socialAnchor);
    socialIconDiv.append(cmpImageDiv);
    moveInstrumentation(row, socialIconDiv); // Move instrumentation for the social item row
    socialMediaContainer.append(socialIconDiv);
  });

  moveInstrumentation(footerSocialLinksContainer, socialMediaContainer); // Move instrumentation for the container placeholder row
  itcContainer.append(socialMediaContainer);
  itcLinksDiv.append(itcContainer);

  topContent.append(footerNav);
  footerRoot.append(topContent);
  footerRoot.append(itcLinksDiv);

  // Ensure all root-level rows have their instrumentation moved
  moveInstrumentation(logoLinkDesktopRow, footerRoot);
  moveInstrumentation(logoMobileRow, footerRoot);
  moveInstrumentation(logoLinkMobileRow, footerRoot);
  // The other root rows (logoDesktopRow, fssaiLogoDesktopRow, fssaiLogoMobileRow)
  // already have moveInstrumentation called when their elements are created.

  block.replaceChildren(footerRoot);
}
