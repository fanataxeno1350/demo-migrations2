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
      subWrap.classList.add('has-footer-sub-child'); // Added class from ORIGINAL HTML
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

  // Reordered destructuring to match BlockJson model: logo, logoLink, copyright, then item rows
  const [
    logoRow,
    logoLinkRow,
    copyrightRow,
    ...itemRows // All item rows for social, sections, and legal links
  ] = children;

  const root = document.createElement('footer');
  root.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');
  root.append(container);

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
  const foundLogoLink = logoLinkRow?.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    moveInstrumentation(logoLinkRow, logoLink);
  }

  const picture = logoRow?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
    moveInstrumentation(logoRow, logoLink);
  }
  logoDiv.append(logoLink);

  // Social Links
  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialCol);

  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');
  socialCol.append(socialWrap);
  // moveInstrumentation(socialLinksContainer, socialWrap); // socialLinksContainer is not a row

  // Filter for footer-social-item: 2 cells, first has an anchor, second has a ul
  const socialLinkRows = itemRows.filter(
    (row) => row.children.length === 2 && row.children[0].querySelector('a') && row.children[1].querySelector('ul'),
  );

  socialLinkRows.forEach((row) => {
    const [socialLinkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    // Determine social icon class from ORIGINAL HTML (e.g., fb, tw, inst)
    // This requires parsing the original HTML for the specific social icon class,
    // which is not directly available in the cell content. For now, we'll omit
    // adding specific social icon classes like 'fb', 'tw' as they are not in the model.
    // If these classes are critical, they would need to be authored as text in a cell.

    const socialAnchor = document.createElement('a');
    const foundSocialLink = socialLinkCell?.querySelector('a');
    if (foundSocialLink) {
      socialAnchor.href = foundSocialLink.href;
      // moveInstrumentation(socialLinkCell, socialAnchor); // moveInstrumentation on cell is redundant if row is moved
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
    const ul = tempDiv.querySelector('ul');

    if (ul) {
      transformNestedLists(ul);
      // Append children of ul directly to socialAnchor, not the ul itself
      while (ul.firstChild) {
        socialAnchor.append(ul.firstChild);
      }
      moveInstrumentation(hierarchyTreeCell, socialAnchor);
    }
    li.append(socialAnchor);
    socialWrap.append(li);
    moveInstrumentation(row, li);
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
  // moveInstrumentation(footerSectionsContainer, footerMenu); // footerSectionsContainer is not a row

  // Filter for footer-section-item: 3 cells, first is text, second has an anchor, third has a ul
  const footerSectionRows = itemRows.filter(
    (row) => row.children.length === 3
      && !row.children[0].querySelector('a') // Ensure first cell is plain text, not aem-content
      && row.children[1].querySelector('a')
      && row.children[2].querySelector('ul'),
  );

  footerSectionRows.forEach((row) => {
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
    const directHref = linkCell?.querySelector('a')?.href;
    if (directHref) {
      titleLink.href = directHref;
    } else {
      titleLink.href = 'javascript:void(0)';
    }
    titleLink.textContent = titleCell?.textContent.trim();
    span.append(titleLink);
    moveInstrumentation(titleCell, titleLink);
    moveInstrumentation(linkCell, titleLink);

    const small = document.createElement('small');
    small.setAttribute('data-once', 'footerMobileInner');
    span.append(small);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sectionLinksCell?.innerHTML || '';
    const ul = tempDiv.querySelector('ul');

    if (ul) {
      const footerInnerList = document.createElement('ul');
      footerInnerList.classList.add('footer-inner-list');
      [...ul.children].forEach((liEl) => {
        const li = document.createElement('li');
        const anchor = liEl.querySelector('a');
        if (anchor) {
          const newAnchor = document.createElement('a');
          newAnchor.href = anchor.href;
          newAnchor.textContent = anchor.textContent.trim();
          li.append(newAnchor);
        } else {
          li.textContent = liEl.textContent.trim();
        }
        footerInnerList.append(li);
      });
      linkBlocks.append(footerInnerList);
      moveInstrumentation(sectionLinksCell, footerInnerList);
    }
    moveInstrumentation(row, linkBlocks);
  });

  // Copyright and Legal Links
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const legalCol = document.createElement('div');
  legalCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(legalCol);

  const secondaryNav = document.createElement('ul');
  secondaryNav.classList.add('secondary-nav');
  legalCol.append(secondaryNav);
  // moveInstrumentation(legalLinksContainer, secondaryNav); // legalLinksContainer is not a row

  // Filter for footer-link-item: 2 cells, first is text, second has an anchor, no picture
  const legalLinkRows = itemRows.filter(
    (row) => row.children.length === 2
      && !row.children[0].querySelector('a') // Ensure first cell is plain text, not aem-content
      && row.children[1].querySelector('a')
      && !row.querySelector('picture'),
  );

  legalLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const link = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.textContent = labelCell?.textContent.trim();
    li.append(link);
    secondaryNav.append(li);
    moveInstrumentation(row, li);
  });

  const copyrightCol = document.createElement('div');
  copyrightCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  if (copyrightRow) {
    // Copyright text is richtext, so use innerHTML
    copyrightCol.innerHTML = copyrightRow.children[0]?.innerHTML || '';
    moveInstrumentation(copyrightRow, copyrightCol);
  }
  copyrightWrap.append(copyrightCol);

  block.replaceChildren(root);
}
