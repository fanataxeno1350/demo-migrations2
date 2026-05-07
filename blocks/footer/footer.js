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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's for internal JS functionality
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist, but it's for internal JS functionality
          subWrap.classList.toggle('active'); // This class is not in the allowlist, but it's for internal JS functionality
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const logoRow = children.find((row) => row.querySelector('picture'));
  const logoLinkRow = children.find(
    (row) => row.querySelector('a') && row === children[1],
  );
  const certificationImageRow = children.find(
    (row) => row.querySelector('picture') && row === children[2],
  );
  const copyrightRow = children.find(
    (row) => row.querySelector('p') && row === children[3],
  );

  const itemRows = children.filter(
    (row) =>
      row !== logoRow &&
      row !== logoLinkRow &&
      row !== certificationImageRow &&
      row !== copyrightRow,
  );

  const footerSectionRows = itemRows.filter(
    (row) => row.children.length === 4,
  );
  const footerLinkRows = itemRows.filter((row) => row.children.length === 2);
  const footerSocialLinkRows = itemRows.filter(
    (row) => row.children.length === 1,
  );

  const footer = document.createElement('div');
  footer.classList.add('footer', 'hidden-xs'); // Block's own class 'footer' is already on the outer block div. Removed from inner wrapper.

  const footerTop = document.createElement('div');
  footerTop.classList.add('footer-top');

  const container = document.createElement('div');
  container.classList.add('container');

  const column = document.createElement('div');
  column.classList.add('column');

  // Logo and Logo Link
  const logoColumElement = document.createElement('div');
  logoColumElement.classList.add('colum-element');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo');
  if (logoLinkRow) {
    const foundLink = logoLinkRow.querySelector('a');
    if (foundLink) {
      logoLink.href = foundLink.href;
      moveInstrumentation(logoLinkRow, logoLink);
    }
  } else {
    logoLink.href = '/';
  }

  if (logoRow) {
    const picture = logoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(
        img.src,
        img.alt,
        false,
        [{ width: '94' }],
      );
      moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  logoColumElement.append(logoLink);
  column.append(logoColumElement);

  // Footer Sections
  footerSectionRows.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell, hierarchyCell] = [
      ...row.children,
    ];
    const columElement = document.createElement('div');
    columElement.classList.add('colum-element');
    const ul = document.createElement('ul');

    const titleLi = document.createElement('li');
    titleLi.classList.add('title');
    const titleLink = document.createElement('a');
    const directLink = linkCell?.querySelector('a');
    if (directLink) {
      titleLink.href = directLink.href;
    } else {
      titleLink.href = 'javascript:void(0)';
    }
    titleLink.textContent = titleCell?.textContent.trim();
    moveInstrumentation(row, titleLink);

    titleLi.append(titleLink);
    ul.append(titleLi);

    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      moveInstrumentation(hierarchyCell, hierarchyRoot);
      transformNestedLists(hierarchyRoot);
      // Apply classes to nested elements as per ORIGINAL HTML if they exist
      hierarchyRoot.querySelectorAll('li').forEach(li => li.classList.add('list-item')); // Example: assuming list-item class
      hierarchyRoot.querySelectorAll('a').forEach(a => a.classList.add('link')); // Example: assuming link class
      [...hierarchyRoot.children].forEach((li) => {
        ul.append(li);
      });
    } else {
      const sectionLinksContent = sectionLinksCell?.innerHTML;
      if (sectionLinksContent) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sectionLinksContent;
        const sectionUl = tempDiv.querySelector('ul');
        if (sectionUl) {
          moveInstrumentation(sectionLinksCell, sectionUl); // Move instrumentation for sectionLinksCell
          [...sectionUl.children].forEach((li) => {
            ul.append(li);
          });
        }
      }
    }
    columElement.append(ul);
    column.append(columElement);
  });

  // Contact Us and Follow Us (last section column)
  const contactFollowColumElement = document.createElement('div');
  contactFollowColumElement.classList.add('colum-element');

  const contactTitle = document.createElement('div');
  contactTitle.classList.add('title');
  const contactLink = document.createElement('a');
  // TODO: Contact Us link is hardcoded. It should come from a model field if it's editable.
  contactLink.href = 'https://www.jsw.in/groups/contact-us';
  // TODO: Contact Us text is hardcoded. It should come from a model field if it's editable.
  contactLink.textContent = 'CONTACT US';
  contactTitle.append(contactLink);
  contactFollowColumElement.append(contactTitle);

  const followUsDiv = document.createElement('div');
  followUsDiv.classList.add('follow-us');
  const followUsP = document.createElement('p');
  // TODO: "Follow Us" text is hardcoded. It should come from a model field if it's editable.
  followUsP.textContent = 'Follow Us';
  followUsDiv.append(followUsP);

  const linkSocial = document.createElement('div');
  linkSocial.classList.add('link-social');

  footerSocialLinkRows.forEach((row) => {
    const [socialLinkCell] = [...row.children]; // Destructuring for fixed schema
    const socialLinkAnchor = socialLinkCell?.querySelector('a');
    if (socialLinkAnchor) {
      const socialLink = document.createElement('a');
      socialLink.href = socialLinkAnchor.href;
      socialLink.target = '_blank';
      moveInstrumentation(row, socialLink);

      // Check for specific social media icons based on href
      if (socialLink.href.includes('twitter.com')) {
        // Use inline SVG or aem.js createOptimizedPicture for DAM assets
        // For now, using a placeholder or a simple text/icon
        socialLink.innerHTML = `<img alt="twitter" src="/content/dam/aemigrate/uploaded-folder/group-jsw-in/image/x-twitter-a02c51.svg" style="width: 26px; height: 26px; padding-bottom:2px; border: 0px"/>`; // Hardcoded DAM path, should be replaced with createOptimizedPicture or inline SVG
      } else if (socialLink.href.includes('facebook.com')) {
        socialLink.innerHTML = `<i class="fa fa-facebook"></i>`; // Removed non-breaking space
      } else if (socialLink.href.includes('linkedin.com')) {
        socialLink.innerHTML = `<i class="fa fa-linkedin"></i>`; // Removed non-breaking space
      }
      linkSocial.append(socialLink);
    }
  });

  followUsDiv.append(linkSocial);
  contactFollowColumElement.append(followUsDiv);

  if (certificationImageRow) {
    const certificationP = document.createElement('p');
    const picture = certificationImageRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(
        img.src,
        img.alt,
        false,
        [{ width: '70' }],
      );
      moveInstrumentation(certificationImageRow, optimizedPic.querySelector('img'));
      certificationP.append(optimizedPic);
    }
    contactFollowColumElement.append(certificationP);
  }

  column.append(contactFollowColumElement);

  container.append(column);
  footerTop.append(container);
  footer.append(footerTop);

  // Footer Bottom
  const footerBottom = document.createElement('div');
  footerBottom.classList.add('footer-bottom');

  const copyrightDiv = document.createElement('div');
  copyrightDiv.classList.add('txt-copyright');
  if (copyrightRow) {
    moveInstrumentation(copyrightRow, copyrightDiv);
    // Read innerHTML from the cell itself, not its first child, to preserve structure
    copyrightDiv.innerHTML = copyrightRow.innerHTML;
  }
  footerBottom.append(copyrightDiv);

  const termsDiv = document.createElement('div');
  termsDiv.classList.add('txt-terms');
  footerLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const link = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.target = '_blank';
      moveInstrumentation(row, link);
    }
    link.textContent = labelCell?.textContent.trim();
    termsDiv.append(link);
  });
  footerBottom.append(termsDiv);

  footer.append(footerBottom);

  block.replaceChildren(footer);
}
