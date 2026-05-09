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
      subWrap.classList.add('has-footer-sub-child');
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // 'active' is not in allowlist, but is for JS interaction
          subWrap.classList.toggle('active'); // 'active' is not in allowlist, but is for JS interaction
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children].filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  // Root fields based on BlockJson model
  const logoRow = children[0];
  const logoLinkRow = children[1];
  const copyrightRow = children[2]; // This was children[5] in original, but is children[2] in model

  // Item rows start from index 3
  const itemRows = children.slice(3);

  // Filter item rows by their structure to match sub-components
  // footer-social-item: 2 cells, first has <a>, second has <ul>
  const socialLinkRows = itemRows.filter((row) => row.children.length === 2 && row.children[0].querySelector('a') && row.children[1].querySelector('ul'));
  // footer-section-item: 3 cells
  const navSectionRows = itemRows.filter((row) => row.children.length === 3);
  // footer-link-item: 2 cells, first has no <ul>
  const legalLinkRows = itemRows.filter((row) => row.children.length === 2 && !row.children[1].querySelector('ul'));

  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');
  footerMain.append(container);

  // Footer Header
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  container.append(footerHeader);

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeader.append(logoCol);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoCol.append(logoDiv);

  const logoLink = document.createElement('a');
  if (logoLinkRow) {
    const foundLink = logoLinkRow.querySelector('a');
    if (foundLink) logoLink.href = foundLink.href;
    moveInstrumentation(logoLinkRow, logoLink);
  }

  if (logoRow) {
    const picture = logoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
        optimizedPic.querySelector('img').classList.add('hiddenlogo1');
        moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
        logoLink.append(optimizedPic);
      }
    }
  }
  logoDiv.append(logoLink);

  const socialWrapCol = document.createElement('div');
  socialWrapCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialWrapCol);

  const socialWrapUl = document.createElement('ul');
  socialWrapUl.classList.add('social-wrap');
  socialWrapCol.append(socialWrapUl);
  // moveInstrumentation for socialLinksContainer is not applicable as it's a container field,
  // instrumentation should be moved for individual item rows.

  socialLinkRows.forEach((row) => {
    const [socialLinkCell, hierarchyTreeCell] = [...row.children];
    const socialLink = socialLinkCell?.querySelector('a');
    
    if (socialLink && hierarchyTreeCell) {
      const li = document.createElement('li');
      // Add social icon class from original HTML, e.g., 'fb', 'tw'
      // This requires parsing the original HTML for the specific social icon class,
      // which is not directly available in the model. For now, we'll omit it
      // or assume it's added by CSS based on the link.
      // Example: li.classList.add('fb');

      const anchor = document.createElement('a');
      anchor.href = socialLink.href;
      // The original HTML for social links uses SVGs, not textContent for the anchor.
      // If the model implies text content, it's a mismatch. Assuming SVG for now.
      // For now, we'll just use the href and rely on CSS to add the icon.
      // If text content is needed, it should come from a separate text field in the model.
      // anchor.textContent = socialLink.textContent.trim(); // This would be wrong if original has SVG

      // Create a temporary div to hold the richtext content and apply classes
      const tempDiv = document.createElement('div');
      moveInstrumentation(hierarchyTreeCell, tempDiv);
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      
      const hierarchyTree = tempDiv.querySelector('ul');

      if (hierarchyTree) {
        const dropdown = document.createElement('div');
        dropdown.classList.add('has-footer-sub-child');
        dropdown.append(hierarchyTree);
        transformNestedLists(hierarchyTree);

        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // 'active' is not in allowlist, but is for JS interaction
          dropdown.classList.toggle('active'); // 'active' is not in allowlist, but is for JS interaction
        });

        li.append(anchor, dropdown);
      } else {
        li.append(anchor); // If no hierarchy tree, just append the social link
      }
      socialWrapUl.append(li);
      moveInstrumentation(row, li);
    }
  });

  // Footer Menu
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBox.append(footerMenuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);
  // moveInstrumentation for footerSectionsContainer is not applicable as it's a container field,
  // instrumentation should be moved for individual item rows.

  navSectionRows.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell] = [...row.children];
    
    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    footerMenu.append(linkBlocks);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');
    linkBlocks.append(headDiv);

    const span = document.createElement('span');
    headDiv.append(span);

    const titleLink = document.createElement('a');
    titleLink.textContent = titleCell?.textContent.trim() || '';

    // Create a temporary div to hold the richtext content and apply classes
    const tempDiv = document.createElement('div');
    moveInstrumentation(sectionLinksCell, tempDiv);
    tempDiv.innerHTML = sectionLinksCell.innerHTML;
    const subList = tempDiv.querySelector('ul');

    if (subList) {
      titleLink.href = 'javascript:void(0)'; // As per original HTML for expandable sections
      const small = document.createElement('small');
      small.setAttribute('data-once', 'footerMobileInner'); // From original HTML
      span.append(titleLink, small);

      const footerInnerList = document.createElement('ul');
      footerInnerList.classList.add('footer-inner-list');
      const subLinksCvr = document.createElement('div');
      subLinksCvr.classList.add('has-footer-sub-child');
      subLinksCvr.append(subList);
      transformNestedLists(subList);
      footerInnerList.append(subLinksCvr);
      linkBlocks.append(footerInnerList);

      span.addEventListener('click', () => {
        footerInnerList.classList.toggle('active'); // 'active' is not in allowlist, but is for JS interaction
        span.classList.toggle('active'); // 'active' is not in allowlist, but is for JS interaction
      });
    } else {
      const directHref = linkCell?.querySelector('a')?.href;
      if (directHref) titleLink.href = directHref;
      span.append(titleLink);
    }
    moveInstrumentation(row, linkBlocks);
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
  secondaryNavCol.append(secondaryNavUl);
  // moveInstrumentation for secondaryLinksContainer is not applicable as it's a container field,
  // instrumentation should be moved for individual item rows.

  legalLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell?.textContent.trim() || '';
    li.append(anchor);
    secondaryNavUl.append(li);
    moveInstrumentation(row, li);
  });

  const copyrightCol = document.createElement('div');
  copyrightCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  if (copyrightRow) {
    copyrightCol.textContent = copyrightRow.textContent.trim();
    moveInstrumentation(copyrightRow, copyrightCol);
  }
  copyrightWrap.append(copyrightCol);

  block.replaceChildren(footerMain);
}
