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
      subWrap.classList.add('has-footer-sub-child'); // Use original HTML class
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

  // Root fields: logo, logoLink, copyrightText, followed by item rows
  const [logoRow, logoLinkRow, copyrightTextRow, ...itemRows] = children;

  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');

  // Footer Header Section
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const logoAnchor = document.createElement('a');
  const logoHref = logoLinkRow?.querySelector('a')?.href || '#';
  logoAnchor.href = logoHref;
  moveInstrumentation(logoLinkRow, logoAnchor);

  const picture = logoRow?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('hiddenlogo1');
      optimizedImg.width = '200';
      optimizedImg.height = '30';
      optimizedImg.style.width = 'auto';
      moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
      logoAnchor.append(optimizedPic);
    }
  }

  logoDiv.append(logoAnchor);
  logoCol.append(logoDiv);
  footerHeader.append(logoCol);

  // Social Links
  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  const socialList = document.createElement('ul');
  socialList.classList.add('social-wrap');

  // Filter for footer-social-item: 2 cells, first cell has an anchor, second cell has a UL (hierarchy-tree)
  const socialLinkRows = itemRows.filter(
    (row) => row.children.length === 2 && row.children[0].querySelector('a') && row.children[1].querySelector('ul'),
  );

  socialLinkRows.forEach((row) => {
    const [socialLinkCell, hierarchyTreeCell] = [...row.children]; // Destructuring for fixed schema
    const socialLink = socialLinkCell.querySelector('a');
    const socialHref = socialLink?.href || '#';

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = socialHref;
    anchor.target = '_blank';
    moveInstrumentation(socialLinkCell, anchor);

    // Determine social icon based on href
    let socialClass = '';
    if (socialHref.includes('facebook.com')) {
      socialClass = 'fb';
    } else if (socialHref.includes('twitter.com')) {
      socialClass = 'tw';
    } else if (socialHref.includes('instagram.com')) {
      socialClass = 'inst';
    } else if (socialHref.includes('youtube.com')) {
      socialClass = 'yt';
    } else if (socialHref.includes('linkedin.com')) {
      socialClass = 'in';
    }
    li.classList.add(socialClass);

    // Add SVG structure from original HTML
    anchor.innerHTML = `
      <svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink">
        <image xlink:href="data:stripped" x="0" y="0" width="30" height="30"></image>
      </svg>
    `;
    li.append(anchor);
    socialList.append(li);
  });

  socialCol.append(socialList);
  footerHeader.append(socialCol);
  container.append(footerHeader);

  // Footer Menu Box Section
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  // Filter for footer-section-item: 3 cells, first cell has text content
  const footerSectionRows = itemRows.filter(
    (row) => row.children.length === 3 && row.children[0].textContent.trim() !== '',
  );

  footerSectionRows.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell] = [...row.children]; // Destructuring for fixed schema
    const titleText = titleCell.textContent.trim();
    const directLinkHref = linkCell?.querySelector('a')?.href || '#';
    const subList = sectionLinksCell?.querySelector('ul'); // Check for UL directly in richtext cell

    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    moveInstrumentation(row, linkBlocks);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');

    const span = document.createElement('span');
    const titleAnchor = document.createElement('a');
    titleAnchor.href = directLinkHref;
    titleAnchor.textContent = titleText;
    span.append(titleAnchor);

    const small = document.createElement('small');
    small.setAttribute('data-once', 'footerMobileInner');
    span.append(small);
    headDiv.append(span);

    if (subList) {
      const footerInnerList = document.createElement('ul');
      footerInnerList.classList.add('footer-inner-list');
      // Create a temporary div to hold the richtext content for instrumentation and transformation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sectionLinksCell.innerHTML;
      moveInstrumentation(sectionLinksCell, tempDiv); // Move instrumentation from original cell to tempDiv

      // Apply classes to nested elements if they exist in the richtext
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('')); // Add any specific classes from ORIGINAL HTML if needed
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('')); // Add any specific classes from ORIGINAL HTML if needed
      tempDiv.querySelectorAll('li').forEach(li => li.classList.add('')); // Add any specific classes from ORIGINAL HTML if needed

      transformNestedLists(tempDiv.querySelector('ul')); // Transform nested lists within the tempDiv
      while (tempDiv.firstChild) {
        footerInnerList.append(tempDiv.firstChild); // Append children from tempDiv to footerInnerList
      }
      headDiv.append(footerInnerList);
    } else if (sectionLinksCell.textContent.trim()) {
      // If no UL but there is text content, treat as direct links
      const footerInnerList = document.createElement('ul');
      footerInnerList.classList.add('footer-inner-list');
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = directLinkHref;
      link.textContent = sectionLinksCell.textContent.trim();
      li.append(link);
      footerInnerList.append(li);
      headDiv.append(footerInnerList);
    }

    linkBlocks.append(headDiv);
    footerMenu.append(linkBlocks);
  });

  footerMenuCol.append(footerMenu);
  footerMenuBox.append(footerMenuCol);
  container.append(footerMenuBox);

  // Copyright and Secondary Links Section
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  const secondaryNav = document.createElement('ul');
  secondaryNav.classList.add('secondary-nav');

  // Filter for footer-link-item: 2 cells, first cell has no anchor (it's a label)
  const secondaryLinkRows = itemRows.filter(
    (row) => row.children.length === 2 && !row.children[0].querySelector('a') && row.children[1].querySelector('a'),
  );

  secondaryLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const label = labelCell.textContent.trim();
    const href = linkCell?.querySelector('a')?.href || '#';

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.textContent = label;
    moveInstrumentation(row, li);
    li.append(anchor);
    secondaryNav.append(li);
  });

  secondaryNavCol.append(secondaryNav);
  copyrightWrap.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  const copyrightText = copyrightTextRow?.children[0]?.textContent.trim() || '';
  copyrightTextCol.textContent = copyrightText;
  moveInstrumentation(copyrightTextRow, copyrightTextCol);
  copyrightWrap.append(copyrightTextCol);

  container.append(copyrightWrap);
  footerMain.append(container);

  block.replaceChildren(footerMain);

  // Image optimization
  footerMain.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
