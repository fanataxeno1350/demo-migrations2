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
      subWrap.classList.add('has-footer-sub-child'); // Use a generic class if original doesn't specify
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

  // Destructure root rows based on BlockJson model and EDS Block Structure
  const [
    logoRow,
    logoLinkRow,
    countrySelectorIconRow,
    countrySelectorLabelRow,
    countrySelectorLinkRow,
    footerSocialTitleRow,
    legalLinkRow, // Legal link is the last single row before item rows
    ...itemRows // All remaining rows are item rows
  ] = children;

  const footerSection = document.createElement('section');
  footerSection.classList.add('footer-section', 'grid-container');
  footerSection.setAttribute('aria-label', 'Global Footer Module');

  const logoLangContainer = document.createElement('div');
  logoLangContainer.classList.add('logo-lang-container');

  // Footer Logo
  const footerLogo = document.createElement('div');
  footerLogo.classList.add('footer-logo');
  const logoLink = document.createElement('a');
  const logoA = logoLinkRow.querySelector('a');
  if (logoA) {
    logoLink.href = logoA.href;
    logoLink.title = 'Nescafe Logo'; // From original HTML
    logoLink.setAttribute('aria-label', 'Nescafe logo links to the home page'); // From original HTML
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '90' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  moveInstrumentation(logoRow, footerLogo);
  moveInstrumentation(logoLinkRow, logoLink);
  footerLogo.append(logoLink);
  logoLangContainer.append(footerLogo);

  // Country Selector
  const countrySelectorLink = document.createElement('a');
  const countryLinkA = countrySelectorLinkRow.querySelector('a');
  if (countryLinkA) {
    countrySelectorLink.href = countryLinkA.href;
    countrySelectorLink.title = countrySelectorLabelRow.textContent.trim(); // From original HTML
    countrySelectorLink.setAttribute('aria-label', 'Link to select language and country'); // From original HTML
    countrySelectorLink.classList.add('link--underlined', 'country-selector');
  }
  const countryIconPicture = countrySelectorIconRow.querySelector('picture');
  if (countryIconPicture) {
    const img = countryIconPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]); // Assuming small icon
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      countrySelectorLink.append(optimizedPic);
    }
  }
  const countryLabelSpan = document.createElement('span');
  countryLabelSpan.classList.add('labelMediumRegular');
  countryLabelSpan.textContent = countrySelectorLabelRow.textContent.trim();
  countrySelectorLink.append(countryLabelSpan);
  moveInstrumentation(countrySelectorIconRow, countrySelectorLink);
  moveInstrumentation(countrySelectorLabelRow, countrySelectorLink);
  moveInstrumentation(countrySelectorLinkRow, countrySelectorLink);
  logoLangContainer.append(countrySelectorLink);

  footerSection.append(logoLangContainer);

  // Footer Social
  const footerSocial = document.createElement('div');
  footerSocial.classList.add('footer-social');
  const socialTitleSpan = document.createElement('span');
  socialTitleSpan.classList.add('utilityLegend', 'footer-social-title');
  socialTitleSpan.textContent = footerSocialTitleRow.textContent.trim();
  moveInstrumentation(footerSocialTitleRow, socialTitleSpan);
  footerSocial.append(socialTitleSpan);

  const footerSocialLinksUl = document.createElement('ul');
  footerSocialLinksUl.classList.add('footer-social-links');

  // Filter for footer-social-item (3 cells: icon, link, hierarchy-tree)
  const socialLinkRows = itemRows.filter((row) => row.children.length === 3 && row.querySelector('picture'));
  socialLinkRows.forEach((row) => {
    // Destructure all three cells for footer-social-item
    const [iconCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    const socialAnchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      socialAnchor.href = foundLink.href;
      socialAnchor.title = foundLink.textContent.trim(); // Use link text as title
      socialAnchor.setAttribute('aria-label', foundLink.textContent.trim()); // Use link text as aria-label
    }
    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]); // Assuming small icon
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        socialAnchor.append(optimizedPic);
      }
    }
    moveInstrumentation(row, li);
    li.append(socialAnchor);

    // Handle hierarchy-tree richtext
    if (hierarchyTreeCell && hierarchyTreeCell.innerHTML.trim()) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv);
      const rootUl = tempDiv.querySelector('ul');
      if (rootUl) {
        // Apply classes from original HTML if available, or generic ones
        rootUl.classList.add('nav-menu', 'list-unstyled'); // Example classes, adjust as needed
        transformNestedLists(rootUl);
        li.append(rootUl);
      }
    }

    footerSocialLinksUl.append(li);
  });
  footerSocial.append(footerSocialLinksUl);
  footerSection.append(footerSocial);
  // No moveInstrumentation for footerSocialLinksContainer as it's not a real row

  // Footer Site Links
  const footerSiteLinks = document.createElement('div');
  footerSiteLinks.classList.add('footer-site-links');

  const footerLinksDiv = document.createElement('div');
  footerLinksDiv.classList.add('footer-links');
  const footerLinksUl = document.createElement('ul');

  // Filter for footer-link-item (2 cells: label, link)
  const footerLinkRows = itemRows.filter((row) => row.children.length === 2);
  footerLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.textContent = labelCell.textContent.trim();
      anchor.title = labelCell.textContent.trim();
      anchor.classList.add('labelMediumRegular');
      if (foundLink.target === '_blank') { // Check for external links
        anchor.target = '_blank';
        li.classList.add('external');
      }
    }
    moveInstrumentation(row, li);
    li.append(anchor);
    footerLinksUl.append(li);
  });
  footerLinksDiv.append(footerLinksUl);
  footerSiteLinks.append(footerLinksDiv);
  // No moveInstrumentation for footerLinksContainer as it's not a real row

  // Legal Links
  const legalLinksDiv = document.createElement('div');
  legalLinksDiv.classList.add('legal-links');
  const legalAnchor = document.createElement('a');
  const legalLinkA = legalLinkRow.querySelector('a');
  if (legalLinkA) {
    legalAnchor.href = legalLinkA.href;
    // Read title and aria-label from original HTML or derive from content
    legalAnchor.title = legalLinkA.title || legalLinkA.textContent.trim();
    legalAnchor.setAttribute('aria-label', legalLinkA.getAttribute('aria-label') || legalLinkA.textContent.trim());
    legalAnchor.classList.add('utilityNav');
    // Read innerHTML from the cell, not hardcoded
    legalAnchor.innerHTML = legalLinkRow.children[0]?.innerHTML || '';
  }
  moveInstrumentation(legalLinkRow, legalAnchor);
  legalLinksDiv.append(legalAnchor);
  footerSiteLinks.append(legalLinksDiv);

  footerSection.append(footerSiteLinks);

  // Feedback alt text div - this is a placeholder in original HTML, no content to move
  const feedbackAltTextDiv = document.createElement('div');
  feedbackAltTextDiv.classList.add('feedback_alt_text');
  feedbackAltTextDiv.setAttribute('data-alttext', 'qsiFeedback Button');
  footerSection.append(feedbackAltTextDiv);

  // Optimize images in the entire footer section
  footerSection.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(footerSection);
}
