import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
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
      // No specific class for sub-wrapper in original HTML, so not adding one.
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

  const logoRow = children.find((row) => row.querySelector('picture') || row.querySelector('svg'));
  const copyrightRow = children.find((row) => row.textContent.includes('©'));
  const socialLinkRows = children.filter((row) => row.children.length === 1 && row.querySelector('a') && !row.querySelector('picture') && !row.textContent.includes('©'));
  const legalLinkRows = children.filter((row) => row.children.length === 2);
  const navSectionRows = children.filter((row) => row.children.length >= 3);

  const footer = document.createElement('footer');
  // Removed 'footer-navigation' class from here as it's the block's own class and already on the outer div.

  const footerTop = document.createElement('div');
  footerTop.classList.add('row'); // Using 'row' from original HTML

  const footerBottom = document.createElement('div');
  footerBottom.classList.add('row'); // Using 'row' from original HTML

  // Logo Section
  if (logoRow) {
    const logoWrapper = document.createElement('div');
    logoWrapper.id = 'logo-footer-mobile-wrapper'; // From original HTML
    moveInstrumentation(logoRow, logoWrapper);

    const picture = logoRow.querySelector('picture');
    const svg = logoRow.querySelector('svg');

    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoWrapper.append(optimizedPic);
    } else if (svg) {
      logoWrapper.append(svg);
    }
    footerTop.append(logoWrapper);
  }

  // Navigation Sections
  if (navSectionRows.length > 0) {
    const navSectionsContainer = document.createElement('div');
    // No specific class for navSectionsContainer in original HTML, so not adding one.

    navSectionRows.forEach((row) => {
      // Fixed: Using named destructuring for fixed-schema rows
      const [titleCell, linkCell, sectionLinksCell] = [...row.children];
      const subList = sectionLinksCell?.querySelector('ul');
      const directHref = linkCell?.querySelector('a')?.href;

      const sectionCol = document.createElement('div');
      // No specific class for sectionCol in original HTML, so not adding one.
      moveInstrumentation(row, sectionCol);

      const titleElement = document.createElement('h3');
      titleElement.textContent = titleCell?.textContent.trim() || '';

      if (subList) {
        const titleLink = document.createElement('a');
        titleLink.href = directHref || 'javascript:void(0)';
        titleLink.textContent = titleElement.textContent;
        // No specific class for titleLink in original HTML, so not adding one.
        sectionCol.append(titleLink);

        const subLinksWrapper = document.createElement('div');
        // No specific class for subLinksWrapper in original HTML, so not adding one.
        subLinksWrapper.append(subList);
        transformNestedLists(subList); // Apply recursive transformation
        sectionCol.append(subLinksWrapper);

        titleLink.addEventListener('click', (e) => {
          e.preventDefault();
          sectionCol.classList.toggle('active');
          subLinksWrapper.classList.toggle('active');
        });
      } else {
        const anchor = document.createElement('a');
        if (directHref) anchor.href = directHref;
        anchor.textContent = titleElement.textContent;
        // No specific class for anchor in original HTML, so not adding one.
        sectionCol.append(anchor);
      }
      navSectionsContainer.append(sectionCol);
    });
    footerTop.append(navSectionsContainer);
  }

  // Social Links
  if (socialLinkRows.length > 0) {
    const socialLinksWrapper = document.createElement('div');
    // No specific class for socialLinksWrapper in original HTML, so not adding one.

    socialLinkRows.forEach((row) => {
      const link = row.querySelector('a');
      if (link) {
        const socialLink = document.createElement('a');
        socialLink.href = link.href;
        socialLink.textContent = link.textContent.trim();
        // No specific class for socialLink in original HTML, so not adding one.
        moveInstrumentation(row, socialLink);
        socialLinksWrapper.append(socialLink);
      }
    });
    footerTop.append(socialLinksWrapper);
  }

  // Legal Links
  if (legalLinkRows.length > 0) {
    const legalLinksWrapper = document.createElement('div');
    // No specific class for legalLinksWrapper in original HTML, so not adding one.

    legalLinkRows.forEach((row) => {
      // Fixed: Using named destructuring for fixed-schema rows
      const [labelCell, linkCell] = [...row.children];
      const link = linkCell?.querySelector('a');
      if (link) {
        const legalLink = document.createElement('a');
        legalLink.href = link.href;
        legalLink.textContent = labelCell?.textContent.trim() || '';
        // No specific class for legalLink in original HTML, so not adding one.
        moveInstrumentation(row, legalLink);
        legalLinksWrapper.append(legalLink);
      }
    });
    footerBottom.append(legalLinksWrapper);
  }

  // Copyright
  if (copyrightRow) {
    const copyrightText = document.createElement('p');
    // No specific class for copyrightText in original HTML, so not adding one.
    moveInstrumentation(copyrightRow, copyrightText);
    copyrightText.textContent = copyrightRow.textContent.trim();
    footerBottom.append(copyrightText);
  }

  footer.append(footerTop, footerBottom);
  block.replaceChildren(footer);
}
