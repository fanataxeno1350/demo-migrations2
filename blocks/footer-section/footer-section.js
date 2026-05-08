import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Correct fixed fields based on blockJson:
  // logo, logoLink, countrySelectorIcon, countrySelectorLabel, countrySelectorLink, footerSocialTitle
  // These are children[0] through children[5].
  // Then container fields footerSocialLinks and footerLinks.
  // Then legalLink, which is the very last field.

  // Destructure fixed fields and remaining item rows
  const [
    logoRow,
    logoLinkRow,
    countrySelectorIconRow,
    countrySelectorLabelRow,
    countrySelectorLinkRow,
    footerSocialTitleRow,
    ...itemAndLegalRows // This now contains all item rows and the final legalLink row
  ] = children;

  // The last row in itemAndLegalRows is the legalLink field
  const legalLinkFieldRow = itemAndLegalRows.pop(); // This is block.children[6] as per EDS structure
  const itemRows = itemAndLegalRows; // Remaining rows are actual item rows

  const root = document.createElement('section');
  root.classList.add('grid-container');
  root.setAttribute('aria-label', 'Global Footer Module');

  // Logo and Language Container
  const logoLangContainer = document.createElement('div');
  logoLangContainer.classList.add('logo-lang-container');

  const footerLogo = document.createElement('div');
  footerLogo.classList.add('footer-logo');
  const logoLink = document.createElement('a');
  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
    // Title and aria-label should come from authored content if possible, or be generic
    logoLink.title = logoRow.querySelector('img')?.alt || 'Nescafe Logo';
    logoLink.setAttribute('aria-label', logoRow.querySelector('img')?.alt || 'Nescafe logo links to the home page');
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, footerLogo);
  moveInstrumentation(logoLinkRow, logoLink);
  footerLogo.append(logoLink);
  logoLangContainer.append(footerLogo);

  const countrySelectorLink = document.createElement('a');
  countrySelectorLink.classList.add('link--underlined', 'country-selector');
  const countryLinkAnchor = countrySelectorLinkRow.querySelector('a');
  if (countryLinkAnchor) {
    countrySelectorLink.href = countryLinkAnchor.href;
    countrySelectorLink.title = countrySelectorLabelRow.textContent.trim();
    countrySelectorLink.setAttribute('aria-label', countrySelectorLabelRow.textContent.trim() || 'Link to select language and country');
  }
  const countryIconPicture = countrySelectorIconRow.querySelector('picture');
  if (countryIconPicture) {
    const img = countryIconPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    countrySelectorLink.append(optimizedPic);
  }
  const countryLabelSpan = document.createElement('span');
  countryLabelSpan.classList.add('labelMediumRegular');
  countryLabelSpan.textContent = countrySelectorLabelRow.textContent.trim();
  countrySelectorLink.append(countryLabelSpan);
  moveInstrumentation(countrySelectorIconRow, countrySelectorLink);
  moveInstrumentation(countrySelectorLabelRow, countrySelectorLink);
  moveInstrumentation(countrySelectorLinkRow, countrySelectorLink);
  logoLangContainer.append(countrySelectorLink);
  root.append(logoLangContainer);

  // Footer Social Section
  const footerSocial = document.createElement('div');
  footerSocial.classList.add('footer-social');

  const socialTitle = document.createElement('span');
  socialTitle.classList.add('utilityLegend', 'footer-social-title');
  socialTitle.textContent = footerSocialTitleRow.textContent.trim();
  moveInstrumentation(footerSocialTitleRow, socialTitle);
  footerSocial.append(socialTitle);

  const socialLinksList = document.createElement('ul');
  socialLinksList.classList.add('footer-social-links');

  // Separate item rows based on structure
  const footerSocialItemRows = [];
  const footerLinkItemRows = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    // footer-social-item has 3 cells: icon (reference), link (aem-content), hierarchy-tree (richtext)
    // footer-link-item has 2 cells: label (text), link (aem-content)
    // The presence of 'hierarchy-tree' is a distinguishing factor, but it's a richtext cell.
    // The social item has 3 cells, the link item has 2. This is the primary differentiator.
    if (cells.length === 3) { // Social item with icon, link, hierarchy
      footerSocialItemRows.push(row);
    } else if (cells.length === 2) { // Link item with label, link
      footerLinkItemRows.push(row);
    }
  });

  footerSocialItemRows.forEach((row) => {
    // For footer-social-item: [icon, link, hierarchy-tree]
    const [iconCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    const socialAnchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      socialAnchor.href = foundLink.href;
      socialAnchor.title = iconCell.querySelector('img')?.alt || '';
      socialAnchor.setAttribute('aria-label', iconCell.querySelector('img')?.alt || '');
    }
    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      socialAnchor.append(optimizedPic);
    }
    moveInstrumentation(row, li);
    li.append(socialAnchor);

    // Handle hierarchy-tree richtext content
    if (hierarchyTreeCell) {
      const hierarchyDiv = document.createElement('div');
      moveInstrumentation(hierarchyTreeCell, hierarchyDiv);
      hierarchyDiv.innerHTML = hierarchyTreeCell.innerHTML; // Preserve HTML structure
      // Apply classes to nested elements if needed, based on ORIGINAL HTML for hierarchy-tree
      // Example: hierarchyDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('nav-menu'));
      // Example: hierarchyDiv.querySelectorAll('a').forEach(a => a.classList.add('nav-link'));
      li.append(hierarchyDiv); // Append the hierarchy structure
    }

    socialLinksList.append(li);
  });
  footerSocial.append(socialLinksList);
  root.append(footerSocial);

  // Footer Site Links
  const footerSiteLinks = document.createElement('div');
  footerSiteLinks.classList.add('footer-site-links');

  const footerLinks = document.createElement('div');
  footerLinks.classList.add('footer-links');
  const footerLinksUl = document.createElement('ul');

  footerLinkItemRows.forEach((row) => {
    // For footer-link-item: [label, link]
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.classList.add('labelMediumRegular');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.title = labelCell.textContent.trim();
      if (foundLink.target === '_blank') {
        li.classList.add('external');
        link.target = '_blank';
        link.setAttribute('data-once', 'ln_datalayer_outbound_link');
      }
    }
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, li);
    li.append(link);
    footerLinksUl.append(li);
  });
  footerLinks.append(footerLinksUl);
  footerSiteLinks.append(footerLinks);

  // Legal Links
  const legalLinks = document.createElement('div');
  legalLinks.classList.add('legal-links');
  const legalAnchor = document.createElement('a');
  legalAnchor.classList.add('utilityNav');
  const foundLegalLink = legalLinkFieldRow.querySelector('a');
  if (foundLegalLink) {
    legalAnchor.href = foundLegalLink.href;
    // Title and text content should come from authored content
    legalAnchor.title = foundLegalLink.title || legalLinkFieldRow.textContent.trim();
    legalAnchor.setAttribute('aria-label', foundLegalLink.getAttribute('aria-label') || legalLinkFieldRow.textContent.trim());
    legalAnchor.innerHTML = legalLinkFieldRow.innerHTML; // Use innerHTML to preserve <sup> tags
  }
  moveInstrumentation(legalLinkFieldRow, legalAnchor);
  legalLinks.append(legalAnchor);
  footerSiteLinks.append(legalLinks);

  root.append(footerSiteLinks);

  // Feedback alt text (from original HTML, no authored field)
  const feedbackAltText = document.createElement('div');
  feedbackAltText.classList.add('feedback_alt_text');
  feedbackAltText.setAttribute('data-alttext', 'qsiFeedback Button');
  root.append(feedbackAltText);

  block.replaceChildren(root);

  // This loop is redundant as createOptimizedPicture is called inline for each image.
  // If there are any images not handled above, this would catch them.
  // For now, it's safe to keep but could be removed if all images are handled explicitly.
  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
