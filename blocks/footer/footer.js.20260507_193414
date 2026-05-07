import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Add classes from ORIGINAL HTML to <li> and <a> elements
    li.classList.add('nav-menu-item', 'list-item'); // Example classes, adjust based on original HTML
    if (anchor) {
      anchor.classList.add('nav-link'); // Example class, adjust based on original HTML
    }

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
      subWrap.classList.add('has-sub-child'); // Class from original HTML
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

export default async function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    contactTitleRow,
    contactLinkRow,
    followUsLabelRow,
    footerCertificationImageRow,
    copyrightRow,
    ...itemRows
  ] = children;

  const footerSectionRows = [];
  const footerSocialLinkRows = [];
  const footerBottomLinkRows = [];

  itemRows.forEach((row) => {
    // Use content detection for item type differentiation
    const cells = [...row.children];
    if (cells.length === 4) { // footer-section-item
      footerSectionRows.push(row);
    } else if (cells.length === 2 && cells[0].querySelector('picture')) { // footer-social-item
      footerSocialLinkRows.push(row);
    } else if (cells.length === 2 && !cells[0].querySelector('picture')) { // footer-link-item
      footerBottomLinkRows.push(row);
    }
  });

  const footer = document.createElement('div');
  footer.classList.add('footer', 'hidden-xs'); // Classes from ORIGINAL HTML

  const footerTop = document.createElement('div');
  footerTop.classList.add('footer-top'); // Class from ORIGINAL HTML
  footer.append(footerTop);

  const container = document.createElement('div');
  container.classList.add('container'); // Class from ORIGINAL HTML
  footerTop.append(container);

  const columnWrapper = document.createElement('div');
  columnWrapper.classList.add('column'); // Class from ORIGINAL HTML
  container.append(columnWrapper);

  // Logo and Logo Link
  const logoColElement = document.createElement('div');
  logoColElement.classList.add('colum-element'); // Class from ORIGINAL HTML
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo'); // Class from ORIGINAL HTML
  logoLink.href = logoLinkRow?.querySelector('a')?.href || '#';
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '94' }]);
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoColElement.append(logoLink);
  columnWrapper.append(logoColElement);

  // Footer Sections
  footerSectionRows.forEach((row) => {
    // Fixed schema for footer-section-item, use destructuring
    const [titleCell, linkCell, sectionLinksCell, hierarchyTreeCell] = [...row.children];
    const columElement = document.createElement('div');
    columElement.classList.add('colum-element'); // Class from ORIGINAL HTML
    moveInstrumentation(row, columElement);

    const ul = document.createElement('ul');
    const liTitle = document.createElement('li');
    liTitle.classList.add('title'); // Class from ORIGINAL HTML

    const directLink = linkCell?.querySelector('a');
    if (directLink && !sectionLinksCell?.querySelector('ul') && !hierarchyTreeCell?.querySelector('ul')) {
      const titleAnchor = document.createElement('a');
      titleAnchor.href = directLink.href;
      titleAnchor.textContent = titleCell?.textContent.trim();
      liTitle.append(titleAnchor);
    } else {
      liTitle.textContent = titleCell?.textContent.trim();
    }
    ul.append(liTitle);

    const sectionLinksUl = sectionLinksCell?.querySelector('ul');
    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');

    if (sectionLinksUl) {
      // Ensure moveInstrumentation is called for the richtext cell
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sectionLinksCell.innerHTML;
      moveInstrumentation(sectionLinksCell, tempDiv);

      [...tempDiv.children].forEach((child) => {
        if (child.tagName === 'UL') {
          [...child.children].forEach((linkLi) => {
            const linkAnchor = linkLi.querySelector('a');
            if (linkAnchor) {
              const li = document.createElement('li');
              const a = document.createElement('a');
              a.href = linkAnchor.href;
              a.textContent = linkAnchor.textContent.trim();
              li.append(a);
              ul.append(li);
            }
          });
        } else if (child.tagName === 'P') {
          // Handle direct <p> content if any, though model suggests <ul>
          const li = document.createElement('li');
          li.innerHTML = child.innerHTML; // Preserve HTML inside <p>
          ul.append(li);
        }
      });
    } else if (hierarchyUl) {
      // Ensure moveInstrumentation is called for the richtext cell
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv);

      const rootHierarchyUl = tempDiv.querySelector('ul');
      if (rootHierarchyUl) {
        // Apply classes to all nested <a>, <ul>, <li> elements
        rootHierarchyUl.querySelectorAll('a').forEach(a => a.classList.add('nav-link')); // Example class
        rootHierarchyUl.querySelectorAll('ul').forEach(ulElem => ulElem.classList.add('nested-list')); // Example class
        rootHierarchyUl.querySelectorAll('li').forEach(liElem => liElem.classList.add('list-item')); // Example class

        transformNestedLists(rootHierarchyUl);
        // Append children from the temporary div to the main ul
        while (rootHierarchyUl.firstChild) {
          ul.append(rootHierarchyUl.firstChild);
        }
      }
    }
    columElement.append(ul);
    columnWrapper.append(columElement);
  });

  // Contact Us and Follow Us
  const contactFollowColElement = document.createElement('div');
  contactFollowColElement.classList.add('colum-element'); // Class from ORIGINAL HTML

  const contactTitleDiv = document.createElement('div');
  contactTitleDiv.classList.add('title'); // Class from ORIGINAL HTML
  const contactLink = document.createElement('a');
  contactLink.href = contactLinkRow?.querySelector('a')?.href || '#';
  contactLink.textContent = contactTitleRow?.textContent.trim();
  moveInstrumentation(contactTitleRow, contactLink);
  moveInstrumentation(contactLinkRow, contactLink);
  contactTitleDiv.append(contactLink);
  contactFollowColElement.append(contactTitleDiv);

  const followUsDiv = document.createElement('div');
  followUsDiv.classList.add('follow-us'); // Class from ORIGINAL HTML
  const followUsP = document.createElement('p');
  followUsP.textContent = followUsLabelRow?.textContent.trim();
  moveInstrumentation(followUsLabelRow, followUsP);
  followUsDiv.append(followUsP);

  const socialLinkDiv = document.createElement('div');
  socialLinkDiv.classList.add('link-social'); // Class from ORIGINAL HTML

  footerSocialLinkRows.forEach((row) => {
    // Fixed schema for footer-social-item, use destructuring
    const [socialLinkCell, socialHrefCell] = [...row.children];
    const socialAnchor = document.createElement('a');
    socialAnchor.href = socialHrefCell?.querySelector('a')?.href || '#';
    moveInstrumentation(socialHrefCell, socialAnchor);

    const socialPicture = socialLinkCell?.querySelector('picture');
    if (socialPicture) {
      const img = socialPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '26' }]);
      moveInstrumentation(socialLinkCell, optimizedPic.querySelector('img'));
      socialAnchor.append(optimizedPic);
    }
    socialLinkDiv.append(socialAnchor);
  });
  contactFollowColElement.append(socialLinkDiv);

  const certificationImageP = document.createElement('p');
  const certificationPicture = footerCertificationImageRow?.querySelector('picture');
  if (certificationPicture) {
    const img = certificationPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '70' }]);
    moveInstrumentation(footerCertificationImageRow, optimizedPic.querySelector('img'));
    certificationImageP.append(optimizedPic);
  }
  contactFollowColElement.append(certificationImageP);
  columnWrapper.append(contactFollowColElement);

  // Footer Bottom
  const footerBottom = document.createElement('div');
  footerBottom.classList.add('footer-bottom'); // Class from ORIGINAL HTML
  footer.append(footerBottom);

  const copyrightDiv = document.createElement('div');
  copyrightDiv.classList.add('txt-copyright'); // Class from ORIGINAL HTML
  copyrightDiv.textContent = copyrightRow?.textContent.trim();
  moveInstrumentation(copyrightRow, copyrightDiv);
  footerBottom.append(copyrightDiv);

  const termsDiv = document.createElement('div');
  termsDiv.classList.add('txt-terms'); // Class from ORIGINAL HTML

  footerBottomLinkRows.forEach((row) => {
    // Fixed schema for footer-link-item, use destructuring
    const [labelCell, linkCell] = [...row.children];
    const anchor = document.createElement('a');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    anchor.textContent = labelCell?.textContent.trim();
    moveInstrumentation(row, anchor);
    termsDiv.append(anchor);
  });
  footerBottom.append(termsDiv);

  block.replaceChildren(footer);
}
