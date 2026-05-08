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
      subWrap.classList.add('has-footer-sub-child'); // Class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // 'active' is a common dynamic class
          subWrap.classList.toggle('active'); // 'active' is a common dynamic class
        });
      }
    }
    // Add classes to <li> and <a> elements based on ORIGINAL HTML structure
    li.classList.add('list-item'); // Assuming a generic list item class
    if (anchor) {
      anchor.classList.add('nav-link'); // Assuming a generic nav link class
    }
  });
}

export default function decorate(block) {
  // Destructure root rows based on BlockJson model
  // [logo, logoLink, socialLinks (container), sections (container), legalLinks (container), copyright]
  // The item rows are interleaved, so we need to filter them out.
  // The BlockJson indicates 6 root fields, but 3 are containers.
  // The actual block.children will be: logo, logoLink, then all item rows, then copyright.
  const allRows = [...block.children];

  // Fixed fields based on their position and type
  const [logoRow, logoLinkRow, ...remainingRows] = allRows;
  const copyrightRow = remainingRows.pop(); // Last row is copyright

  // Filter item rows based on cell count and content
  const socialLinkRows = remainingRows.filter(
    (row) => row.children.length === 2 && row.children[0].querySelector('a') && row.children[1].querySelector('ul'),
  );
  const navSectionRows = remainingRows.filter(
    (row) => row.children.length === 3, // Footer-Section-Item has 3 cells
  );
  const legalLinkRows = remainingRows.filter(
    (row) => row.children.length === 2 && row.children[0].textContent.trim() && row.children[1].querySelector('a') && !row.children[1].querySelector('ul'),
  );

  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');
  footerMain.append(container);

  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  container.append(footerHeader);

  // Logo and Logo Link
  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeader.append(logoCol);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoCol.append(logoDiv);

  const logoAnchor = document.createElement('a');
  const logoLinkCell = logoLinkRow.children[0]; // Fixed schema for logoLink
  const foundLogoLink = logoLinkCell.querySelector('a');
  if (foundLogoLink) {
    logoAnchor.href = foundLogoLink.href;
  } else {
    logoAnchor.href = '#';
  }
  moveInstrumentation(logoLinkRow, logoAnchor);
  logoDiv.append(logoAnchor);

  const logoCell = logoRow.children[0]; // Fixed schema for logo
  const picture = logoCell.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    const optimizedImg = optimizedPic.querySelector('img');
    optimizedImg.classList.add('hiddenlogo1');
    optimizedImg.setAttribute('width', '200');
    optimizedImg.setAttribute('height', '30');
    optimizedImg.style.width = 'auto';
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoAnchor.append(optimizedPic);
  }

  // Social Links
  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialCol);

  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');
  socialCol.append(socialWrap);

  socialLinkRows.forEach((row) => {
    // Fixed schema for footer-social-item: [socialLink, hierarchy-tree]
    const [socialLinkCell, hierarchyTreeCell] = [...row.children];

    const socialLink = socialLinkCell.querySelector('a');
    const hierarchyTree = hierarchyTreeCell.querySelector('ul'); // Check for <ul> directly

    if (socialLink && hierarchyTree) {
      const li = document.createElement('li');
      // Add specific social classes from ORIGINAL HTML if available (e.g., fb, tw)
      // This would require parsing the original HTML for specific social link classes or inferring from href
      // For now, keeping it generic.
      const socialAnchor = document.createElement('a');
      socialAnchor.href = socialLink.href;
      socialAnchor.target = '_blank';
      // Hardcoded SVG is fine if it's a generic icon, but if it's specific to the social link,
      // it should be sourced from the content or a sprite.
      // Assuming this is a generic placeholder SVG.
      socialAnchor.innerHTML = `<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:stripped" x="0" y="0" width="30" height="30"></image></svg>`;
      moveInstrumentation(row, socialAnchor);
      li.append(socialAnchor);
      socialWrap.append(li);
    }
  });

  // Footer Menu Box
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBox.append(footerMenuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);

  navSectionRows.forEach((row) => {
    // Fixed schema for footer-section-item: [title, link, sectionLinks]
    const [titleCell, linkCell, sectionLinksCell] = [...row.children];
    const subList = sectionLinksCell?.querySelector('ul');
    const directHref = linkCell?.querySelector('a')?.href;

    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    footerMenu.append(linkBlocks);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');
    footerMenu.append(linkBlocks); // Append linkBlocks to footerMenu, not headDiv
    linkBlocks.append(headDiv);

    const span = document.createElement('span');
    headDiv.append(span);

    const titleAnchor = document.createElement('a');
    if (directHref && !subList) {
      titleAnchor.href = directHref;
    } else {
      titleAnchor.href = 'javascript:void(0)';
    }
    titleAnchor.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, titleAnchor);
    span.append(titleAnchor);

    const small = document.createElement('small');
    small.setAttribute('data-once', 'footerMobileInner');
    span.append(small);

    if (subList) {
      const footerInnerList = document.createElement('ul');
      footerInnerList.classList.add('footer-inner-list');
      moveInstrumentation(sectionLinksCell, footerInnerList); // Move instrumentation from the cell containing the UL
      // Append children from subList to footerInnerList
      while (subList.firstChild) {
        footerInnerList.append(subList.firstChild);
      }
      transformNestedLists(footerInnerList);
      headDiv.append(footerInnerList);

      titleAnchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        headDiv.classList.toggle('active');
        footerInnerList.classList.toggle('active');
      });
    } else if (directHref) {
      const footerInnerList = document.createElement('ul');
      footerInnerList.classList.add('footer-inner-list');
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = directHref;
      link.textContent = titleCell.textContent.trim(); // Use titleCell for text, linkCell for href
      moveInstrumentation(linkCell, link); // Instrumentation for the link itself
      li.append(link);
      footerInnerList.append(li);
      headDiv.append(footerInnerList);
    }
  });

  // Copyright and Legal Links
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const legalLinksCol = document.createElement('div');
  legalLinksCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(legalLinksCol);

  const secondaryNav = document.createElement('ul');
  secondaryNav.classList.add('secondary-nav');
  legalLinksCol.append(secondaryNav);

  legalLinkRows.forEach((row) => {
    // Fixed schema for footer-link-item: [label, link]
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor);
    li.append(anchor);
    secondaryNav.append(li);
  });

  const copyrightCol = document.createElement('div');
  copyrightCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightWrap.append(copyrightCol);

  const copyrightText = document.createElement('div'); // Use div for richtext
  copyrightText.innerHTML = copyrightRow.children[0]?.innerHTML || ''; // Read innerHTML from the cell
  moveInstrumentation(copyrightRow, copyrightText);
  copyrightCol.append(copyrightText);

  block.replaceChildren(footerMain);

  // This part seems to be a generic image optimization that might not be specific to footer
  // and could potentially re-optimize images already handled by createOptimizedPicture.
  // Review if this is truly needed or if it's a leftover from a generic block template.
  // For now, keeping it as is, but noting its potential redundancy.
  footerMain.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
