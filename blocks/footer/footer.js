import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    li.classList.add('list-item'); // Add class from ORIGINAL HTML
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (anchor) {
      anchor.classList.add('nav-menu-item'); // Add class from ORIGINAL HTML
    } else {
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
      nested.classList.add('footer-inner-list'); // Add class from ORIGINAL HTML
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-footer-sub-child'); // Add class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // 'active' is a common interactive class
          subWrap.classList.toggle('active');
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields are fixed schema, use destructuring
  const [logoRow, logoLinkRow, copyrightRow, ...itemRows] = children;

  const socialLinkRows = [];
  const navSectionRows = [];
  const legalLinkRows = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 2 && cells[0].querySelector('a') && cells[1].querySelector('ul')) {
      // This is a social link item with a hierarchy-tree
      socialLinkRows.push(row);
    } else if (cells.length === 3) {
      // This is a footer section item
      navSectionRows.push(row);
    } else if (cells.length === 2 && !cells[0].querySelector('picture')) {
      // This is a footer link item (label, link)
      legalLinkRows.push(row);
    }
  });

  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');

  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  // Logo
  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  const logoPic = logoRow.children[0].querySelector('picture'); // Access cell via children[0]
  const logoImg = logoPic ? logoPic.querySelector('img') : null;
  if (logoImg) {
    const optimizedPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '200' }]);
    moveInstrumentation(logoPic, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  const foundLogoLink = logoLinkRow.children[0].querySelector('a'); // Access cell via children[0]
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);
  logoCol.append(logoDiv);
  footerHeader.append(logoCol);

  // Social Links
  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');

  socialLinkRows.forEach((row) => {
    // Fixed schema for footer-social-item: socialLink, hierarchy-tree
    const [socialLinkCell, hierarchyTreeCell] = [...row.children];

    const socialLi = document.createElement('li');
    // The original HTML has classes like 'fb', 'tw' on the <li>.
    // We need to extract this from the socialLinkCell's content if possible,
    // or assume it's handled by CSS based on the SVG content.
    // For now, we'll just add a generic class if needed, or rely on CSS.

    const socialLink = document.createElement('a');
    const foundSocialLink = socialLinkCell.querySelector('a');
    if (foundSocialLink) {
      socialLink.href = foundSocialLink.href;
      // For social links, the text content might be an SVG or just an empty anchor
      // We need to check if there's an SVG within the cell and append it
      const svg = foundSocialLink.querySelector('svg');
      if (svg) {
        socialLink.append(svg.cloneNode(true));
      } else {
        socialLink.textContent = foundSocialLink.textContent.trim();
      }
    }
    moveInstrumentation(socialLinkCell, socialLink); // Move instrumentation from the cell
    socialLi.append(socialLink);

    // Handle hierarchy-tree for social links (if any)
    const subList = hierarchyTreeCell.querySelector('ul');
    if (subList) {
      // The original HTML does not show nested lists directly under social links,
      // but the model allows it. If present, we should process it.
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from the cell
      transformNestedLists(tempDiv.querySelector('ul')); // Transform the nested list
      while (tempDiv.firstChild) {
        socialLi.append(tempDiv.firstChild);
      }
    }

    socialUl.append(socialLi);
  });
  socialCol.append(socialUl);
  footerHeader.append(socialCol);
  container.append(footerHeader);

  // Footer Menu Box (Sections)
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  navSectionRows.forEach((row) => {
    // Fixed schema for footer-section-item: title, link, sectionLinks
    const [titleCell, linkCell, sectionLinksCell] = [...row.children];
    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    const headDiv = document.createElement('div');
    headDiv.classList.add('head');
    const span = document.createElement('span');
    const sectionTitleLink = document.createElement('a');
    sectionTitleLink.textContent = titleCell.textContent.trim();

    const subList = sectionLinksCell.querySelector('ul');
    if (subList) {
      // This is an accordion section
      sectionTitleLink.href = 'javascript:void(0)'; // Placeholder for accordion toggle
      const small = document.createElement('small');
      small.dataset.once = 'footerMobileInner'; // Add data attribute from ORIGINAL HTML
      span.append(sectionTitleLink, small);
      headDiv.append(span);

      const footerInnerList = document.createElement('ul');
      footerInnerList.classList.add('footer-inner-list');

      // Use a temporary div to parse and move instrumentation for the richtext content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sectionLinksCell.innerHTML;
      moveInstrumentation(sectionLinksCell, tempDiv); // Move instrumentation from the cell

      const parsedUl = tempDiv.querySelector('ul');
      if (parsedUl) {
        [...parsedUl.children].forEach((li) => {
          const newLi = document.createElement('li');
          newLi.classList.add('list-item'); // Add class from ORIGINAL HTML
          const anchor = li.querySelector('a');
          if (anchor) {
            const newAnchor = document.createElement('a');
            newAnchor.href = anchor.href;
            newAnchor.textContent = anchor.textContent.trim();
            newAnchor.classList.add('nav-menu-item'); // Add class from ORIGINAL HTML
            newLi.append(newAnchor);
            const nestedUl = li.querySelector('ul');
            if (nestedUl) {
              const subChildDiv = document.createElement('div');
              subChildDiv.classList.add('has-footer-sub-child');
              subChildDiv.append(nestedUl);
              transformNestedLists(nestedUl); // Recursively transform nested lists
              newLi.append(subChildDiv);
            }
          } else {
            newLi.textContent = li.textContent.trim();
          }
          footerInnerList.append(newLi);
        });
      }
      linkBlocks.append(headDiv, footerInnerList);

      // Add accordion toggle functionality
      span.addEventListener('click', () => {
        footerInnerList.classList.toggle('active');
        headDiv.classList.toggle('active');
      });
    } else {
      // Simple top-level link
      const directLink = linkCell.querySelector('a');
      if (directLink) {
        sectionTitleLink.href = directLink.href;
      }
      span.append(sectionTitleLink);
      headDiv.append(span);
      linkBlocks.append(headDiv);
    }
    moveInstrumentation(row, linkBlocks);
    footerMenu.append(linkBlocks);
  });

  footerMenuCol.append(footerMenu);
  footerMenuBox.append(footerMenuCol);
  container.append(footerMenuBox);

  // Copyright and Legal Links
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const legalNavCol = document.createElement('div');
  legalNavCol.classList.add('col-12', 'col-lg-6');
  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');

  legalLinkRows.forEach((row) => {
    // Fixed schema for footer-link-item: label, link
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, link);
    li.append(link);
    secondaryNavUl.append(li);
  });
  legalNavCol.append(secondaryNavUl);
  copyrightWrap.append(legalNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = copyrightRow.children[0].textContent.trim(); // Access cell via children[0]
  moveInstrumentation(copyrightRow, copyrightTextCol);
  copyrightWrap.append(copyrightTextCol);
  container.append(copyrightWrap);

  footerMain.append(container);
  block.replaceChildren(footerMain);

  // Image optimization
  footerMain.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
