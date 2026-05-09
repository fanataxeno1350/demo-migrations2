import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
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
      subWrap.classList.add('has-footer-sub-child');
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

      // Recursively transform inner lists
      transformNestedLists(nested);
    }
  });
}

export default async function decorate(block) {
  const children = [...block.children].filter(
    (row) =>
      row.children.length > 0 &&
      [...row.children].some(
        (c) => c.children.length > 0 || c.textContent.trim() !== '',
      ),
  );

  // Reordered root row destructuring to match BlockJson and EDS structure
  const [
    logoRow,
    logoLinkRow,
    copyrightRow, // This is the 3rd root field in BlockJson
    ...itemRows // All item rows follow the root fields
  ] = children;

  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');
  footerMain.append(container);

  // Footer Header (Logo and Social Links)
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  container.append(footerHeader);

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeader.append(logoWrapper);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoWrapper.append(logoDiv);

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow?.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);

  const picture = logoRow?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: '200' },
    ]);
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }

  const socialLinksWrapper = document.createElement('div');
  socialLinksWrapper.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialLinksWrapper);

  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');
  // moveInstrumentation(socialLinksContainer, socialUl); // socialLinksContainer is not a row, it's a container field
  socialLinksWrapper.append(socialUl);

  // Footer Menu Box (Section Links)
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBox.append(footerMenuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);

  const linkBlocksContainer = document.createElement('div');
  linkBlocksContainer.classList.add('link-blocks');
  // moveInstrumentation(footerSectionsContainer, linkBlocksContainer); // footerSectionsContainer is not a row
  footerMenu.append(linkBlocksContainer);

  // Filter item rows based on their structure as per BlockJson model
  const footerSectionRows = itemRows.filter((row) => row.children.length === 3); // title, link, sectionLinks
  const footerLinkRows = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('ul')); // label, link (no ul)
  const footerSocialItemRows = itemRows.filter((row) => row.children.length === 2 && row.querySelector('ul')); // socialLink, hierarchy-tree (has ul)

  footerSectionRows.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell] = [...row.children];

    const linkBlock = document.createElement('div');
    linkBlock.classList.add('link-blocks');
    moveInstrumentation(row, linkBlock);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');
    linkBlock.append(headDiv);

    const span = document.createElement('span');
    headDiv.append(span);

    const titleAnchor = document.createElement('a');
    const directLink = linkCell?.querySelector('a');
    if (directLink) {
      titleAnchor.href = directLink.href;
    } else {
      titleAnchor.href = 'javascript:void(0)'; // Default for accordion trigger
    }
    titleAnchor.textContent = titleCell?.textContent.trim() || '';
    span.append(titleAnchor);

    const small = document.createElement('small');
    span.append(small);

    const subList = sectionLinksCell?.querySelector('ul');
    if (subList) {
      const innerList = document.createElement('ul');
      innerList.classList.add('footer-inner-list');
      // Use innerHTML to preserve nested structure, then transform
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sectionLinksCell.innerHTML;
      const ulContent = tempDiv.querySelector('ul');
      if (ulContent) {
        moveInstrumentation(sectionLinksCell, ulContent);
        transformNestedLists(ulContent); // Apply transformation for nested lists
        while (ulContent.firstChild) {
          innerList.append(ulContent.firstChild);
        }
      }
      headDiv.append(innerList);

      // Add accordion behavior
      titleAnchor.addEventListener('click', (e) => {
        e.preventDefault();
        innerList.classList.toggle('active');
        linkBlock.classList.toggle('active');
      });
    }
    footerMenu.append(linkBlock);
  });

  // Social Links
  footerSocialItemRows.forEach((row) => {
    const [socialLinkCell, hierarchyTreeCell] = [...row.children]; // hierarchyTreeCell is the second cell

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const socialAnchor = document.createElement('a');
    const foundSocialLink = socialLinkCell?.querySelector('a');
    if (foundSocialLink) {
      socialAnchor.href = foundSocialLink.href;
      socialAnchor.target = '_blank';
    }
    // Placeholder for SVG icons, as DAM paths are not allowed.
    // In a real scenario, these would be loaded from a sprite or inline SVG.
    // Original HTML has specific classes like 'fb', 'tw', 'inst', 'yt', 'in'
    // We need to extract these from the original socialLinkCell if possible,
    // or infer them from the link href. For now, adding a generic SVG.
    // TODO: Implement logic to extract specific social icon classes from original HTML or link href.
    socialAnchor.innerHTML = `<svg width="30" height="30" viewBox="0 0 40 41"><rect width="30" height="30" fill="currentColor"/></svg>`;
    li.append(socialAnchor);

    socialUl.append(li);
  });

  // Copyright and Secondary Nav
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');
  // moveInstrumentation(footerLinksContainer, secondaryNavUl); // footerLinksContainer is not a row
  secondaryNavCol.append(secondaryNavUl);

  footerLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell?.textContent.trim() || '';
    li.append(anchor);
    secondaryNavUl.append(li);
  });

  const copyrightCol = document.createElement('div');
  copyrightCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  // Corrected moveInstrumentation to use the cell, not the row
  moveInstrumentation(copyrightRow.children[0], copyrightCol);
  copyrightCol.innerHTML = copyrightRow?.children[0]?.innerHTML || '';
  copyrightWrap.append(copyrightCol);

  block.replaceChildren(footerMain);

  // Image optimization
  footerMain.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: '200' },
    ]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
