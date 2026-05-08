import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Destructure root rows based on BlockJson model
  const [
    logoRow,
    logoLinkRow,
    countrySelectorIconRow,
    countrySelectorLabelRow,
    countrySelectorLinkRow,
    footerSocialTitleRow,
    legalLinksRow,
    ...itemRows
  ] = children;

  const footerSocialItemRows = itemRows.filter((row) => row.children.length === 3);
  const footerLinkItemRows = itemRows.filter((row) => row.children.length === 2);

  const root = document.createElement('section');
  root.classList.add('footer-section', 'grid-container');
  root.setAttribute('aria-label', 'Global Footer Module');

  const logoLangContainer = document.createElement('div');
  logoLangContainer.classList.add('logo-lang-container');

  // Logo
  const footerLogo = document.createElement('div');
  footerLogo.classList.add('footer-logo');
  const logoLink = document.createElement('a');
  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
    logoLink.title = 'Nescafe Logo'; // From ORIGINAL HTML
    logoLink.setAttribute('aria-label', 'Nescafe logo links to the home page'); // From ORIGINAL HTML
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    if (logoImg) {
      const optimizedPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '90' }]);
      moveInstrumentation(logoImg, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  moveInstrumentation(logoRow, footerLogo);
  moveInstrumentation(logoLinkRow, logoLink);
  footerLogo.append(logoLink);
  logoLangContainer.append(footerLogo);

  // Country Selector
  const countrySelectorLink = document.createElement('a');
  countrySelectorLink.classList.add('link--underlined', 'country-selector');
  const countryLinkAnchor = countrySelectorLinkRow.querySelector('a');
  if (countryLinkAnchor) {
    countrySelectorLink.href = countryLinkAnchor.href;
    countrySelectorLink.title = countrySelectorLabelRow.textContent.trim(); // From ORIGINAL HTML
    countrySelectorLink.setAttribute('aria-label', 'Link to select language and country'); // From ORIGINAL HTML
  }
  const countryIconPicture = countrySelectorIconRow.querySelector('picture');
  if (countryIconPicture) {
    const countryIconImg = countryIconPicture.querySelector('img');
    if (countryIconImg) {
      const optimizedPic = createOptimizedPicture(countryIconImg.src, countryIconImg.alt, false, [{ width: '24' }]);
      moveInstrumentation(countryIconImg, optimizedPic.querySelector('img'));
      countrySelectorLink.append(optimizedPic);
    }
  }
  const countryLabelSpan = document.createElement('span');
  countryLabelSpan.classList.add('labelMediumRegular');
  countryLabelSpan.textContent = countrySelectorLabelRow.textContent.trim();
  countrySelectorLink.append(countryLabelSpan);
  moveInstrumentation(countrySelectorIconRow, countrySelectorLink);
  moveInstrumentation(countrySelectorLabelRow, countryLabelSpan);
  moveInstrumentation(countrySelectorLinkRow, countrySelectorLink);
  logoLangContainer.append(countrySelectorLink);
  root.append(logoLangContainer);

  // Social Links
  const footerSocial = document.createElement('div');
  footerSocial.classList.add('footer-social');
  const socialTitle = document.createElement('span');
  socialTitle.classList.add('utilityLegend', 'footer-social-title');
  socialTitle.textContent = footerSocialTitleRow.textContent.trim();
  moveInstrumentation(footerSocialTitleRow, socialTitle);
  footerSocial.append(socialTitle);

  const socialLinksUl = document.createElement('ul');
  socialLinksUl.classList.add('footer-social-links');
  footerSocialItemRows.forEach((row) => {
    // Fixed schema: [icon, link, hierarchy-tree]
    const [socialIconCell, socialLinkCell, hierarchyTreeCell] = [...row.children];

    const li = document.createElement('li');
    const socialAnchor = document.createElement('a');
    const foundLink = socialLinkCell?.querySelector('a');
    if (foundLink) {
      socialAnchor.href = foundLink.href;
      socialAnchor.title = socialIconCell?.querySelector('img')?.alt || '';
      socialAnchor.setAttribute('aria-label', socialIconCell?.querySelector('img')?.alt || '');
    }
    const socialPicture = socialIconCell?.querySelector('picture');
    if (socialPicture) {
      const socialImg = socialPicture.querySelector('img');
      if (socialImg) {
        const optimizedPic = createOptimizedPicture(socialImg.src, socialImg.alt, false, [{ width: '24' }]);
        moveInstrumentation(socialImg, optimizedPic.querySelector('img'));
        socialAnchor.append(optimizedPic);
      }
    }
    moveInstrumentation(row, li);
    li.append(socialAnchor);

    // Handle hierarchy-tree richtext
    if (hierarchyTreeCell) {
      const hierarchyDiv = document.createElement('div');
      moveInstrumentation(hierarchyTreeCell, hierarchyDiv);
      hierarchyDiv.innerHTML = hierarchyTreeCell.innerHTML;

      // Apply classes to nested elements as per ORIGINAL HTML (if any)
      hierarchyDiv.querySelectorAll('ul').forEach((ul) => ul.classList.add('footer-nav-list'));
      hierarchyDiv.querySelectorAll('li').forEach((item) => item.classList.add('footer-nav-item'));
      hierarchyDiv.querySelectorAll('a').forEach((a) => a.classList.add('footer-nav-link'));

      li.append(hierarchyDiv);
    }

    socialLinksUl.append(li);
  });
  footerSocial.append(socialLinksUl);
  root.append(footerSocial);

  // Site Links
  const footerSiteLinks = document.createElement('div');
  footerSiteLinks.classList.add('footer-site-links');

  const footerLinksDiv = document.createElement('div');
  footerLinksDiv.classList.add('footer-links');
  const footerLinksUl = document.createElement('ul');

  footerLinkItemRows.forEach((row) => {
    // Fixed schema: [label, link]
    const [labelCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add(''); // Original HTML has empty class, keep it for fidelity
    const link = document.createElement('a');
    link.classList.add('labelMediumRegular');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.textContent = labelCell?.textContent.trim() || '';
      link.title = labelCell?.textContent.trim() || '';
      // Check for external class from original HTML
      if (foundLink.target === '_blank') {
        link.classList.add('external');
        link.setAttribute('target', '_blank');
        link.setAttribute('data-once', 'ln_datalayer_outbound_link'); // From original HTML
      }
    }
    moveInstrumentation(row, li);
    li.append(link);
    footerLinksUl.append(li);
  });
  footerLinksDiv.append(footerLinksUl);
  footerSiteLinks.append(footerLinksDiv);

  // Legal Links
  const legalLinksDiv = document.createElement('div');
  legalLinksDiv.classList.add('legal-links');
  const legalLinkAnchor = document.createElement('a');
  legalLinkAnchor.classList.add('utilityNav');
  // Read href from the actual link inside the richtext cell, not a placeholder
  const legalLinkAnchorFromCell = legalLinksRow.querySelector('a');
  if (legalLinkAnchorFromCell) {
    legalLinkAnchor.href = legalLinkAnchorFromCell.href;
    legalLinkAnchor.title = legalLinkAnchorFromCell.title;
    legalLinkAnchor.setAttribute('aria-label', legalLinkAnchorFromCell.getAttribute('aria-label') || '');
  } else {
    // Fallback if no anchor is found, though model says richtext
    legalLinkAnchor.href = '#';
  }
  // Use innerHTML for richtext content
  legalLinkAnchor.innerHTML = legalLinksRow.children[0]?.innerHTML || '';
  moveInstrumentation(legalLinksRow, legalLinkAnchor);
  legalLinksDiv.append(legalLinkAnchor);
  footerSiteLinks.append(legalLinksDiv);

  root.append(footerSiteLinks);

  // Feedback button placeholder
  const feedbackDiv = document.createElement('div');
  feedbackDiv.classList.add('feedback_alt_text');
  feedbackDiv.setAttribute('data-alttext', 'qsiFeedback Button');
  root.append(feedbackDiv);

  block.replaceChildren(root);

  // This part seems to be a generic image optimization that might not be specific to this block.
  // If it's intended for all images within the block, it should be applied after all content is added.
  // However, the original code already optimizes pictures during creation.
  // This loop might be redundant or intended for images not handled by createOptimizedPicture earlier.
  // Keeping it for now as it was in the original generated JS, but noting potential redundancy.
  root.querySelectorAll('picture > img').forEach((img) => {
    // Ensure we don't re-optimize already optimized pictures
    if (!img.closest('picture').dataset.optimized) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
      optimizedPic.dataset.optimized = 'true'; // Mark as optimized
    }
  });
}
