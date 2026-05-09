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
      subWrap.classList.add('has-footer-inner-sub-child');
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
  const children = [...block.children].filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  const [logoRow, logoLinkRow, copyrightRow, ...itemRows] = children;

  const socialLinkRows = [];
  const navSectionRows = [];
  const legalLinkRows = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    // Use cell count and querySelector for type detection
    if (cells.length === 2 && cells[0].querySelector('a') && cells[1].querySelector('ul')) {
      socialLinkRows.push(row);
    } else if (cells.length === 3) {
      navSectionRows.push(row);
    } else if (cells.length === 2 && !cells[0].querySelector('picture') && cells[0].querySelector('a')) {
      legalLinkRows.push(row);
    }
  });

  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');

  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  moveInstrumentation(logoRow, logoLink);
  logoDiv.append(logoLink);
  logoCol.append(logoDiv);
  footerHeader.append(logoCol);

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');

  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');

  socialLinkRows.forEach((row) => {
    // Fixed schema: socialLink (aem-content), hierarchy-tree (richtext)
    const [socialLinkCell, hierarchyTreeCell] = [...row.children];
    const socialLink = socialLinkCell.querySelector('a');
    if (socialLink) {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = socialLink.href;
      anchor.target = '_blank';
      // Use a generic SVG or specific ones if available in original HTML
      // For now, using a generic placeholder as original HTML has data:stripped
      anchor.innerHTML = '<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><rect width="40" height="41" fill="currentColor"/></svg>';
      
      // Check for hierarchy-tree content and move instrumentation
      if (hierarchyTreeCell) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
        moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from original cell
        
        // Apply classes to nested elements if needed, based on original HTML
        tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('footer-inner-list')); // Example class
        tempDiv.querySelectorAll('li').forEach(liItem => liItem.classList.add('list-item')); // Example class
        tempDiv.querySelectorAll('a').forEach(aItem => aItem.classList.add('nav-link')); // Example class

        // Append the transformed hierarchy to the social link or a dedicated container
        // For now, appending to the li, but this might need a specific wrapper based on design
        while (tempDiv.firstChild) {
          li.append(tempDiv.firstChild);
        }
      }

      moveInstrumentation(row, li);
      li.prepend(anchor); // Prepend anchor to li
      socialWrap.append(li);
    }
  });
  socialCol.append(socialWrap);
  footerHeader.append(socialCol);
  container.append(footerHeader);

  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');

  const menuCol = document.createElement('div');
  menuCol.classList.add('col');

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  navSectionRows.forEach((row) => {
    // Fixed schema: title (text), link (aem-content), sectionLinks (richtext)
    const [titleCell, linkCell, sectionLinksCell] = [...row.children];
    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');

    const head = document.createElement('div');
    head.classList.add('head');

    const span = document.createElement('span');
    const titleLink = document.createElement('a');
    const directLink = linkCell.querySelector('a');

    titleLink.textContent = titleCell.textContent.trim();
    if (directLink) {
      titleLink.href = directLink.href;
    } else {
      titleLink.href = 'javascript:void(0)';
    }

    span.append(titleLink);
    const small = document.createElement('small');
    head.append(span, small);

    // Read richtext content using innerHTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sectionLinksCell?.innerHTML || '';
    const subList = tempDiv.querySelector('ul'); // Find the ul inside the richtext content

    if (subList) {
      const footerInnerList = document.createElement('ul');
      footerInnerList.classList.add('footer-inner-list');
      transformNestedLists(subList);
      footerInnerList.append(...subList.children);
      head.append(footerInnerList);

      titleLink.addEventListener('click', (e) => {
        e.preventDefault();
        footerInnerList.classList.toggle('active');
        head.classList.toggle('active');
      });
    }

    moveInstrumentation(row, linkBlocks);
    linkBlocks.append(head);
    footerMenu.append(linkBlocks);
  });

  menuCol.append(footerMenu);
  footerMenuBox.append(menuCol);
  container.append(footerMenuBox);

  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');

  const secondaryNav = document.createElement('ul');
  secondaryNav.classList.add('secondary-nav');

  legalLinkRows.forEach((row) => {
    // Fixed schema: label (text), link (aem-content)
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, li);
    li.append(anchor);
    secondaryNav.append(li);
  });
  secondaryNavCol.append(secondaryNav);
  copyrightWrap.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = copyrightRow.textContent.trim();
  moveInstrumentation(copyrightRow, copyrightTextCol);
  copyrightWrap.append(copyrightTextCol);
  container.append(copyrightWrap);

  footerMain.append(container);
  block.replaceChildren(footerMain);

  footerMain.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
