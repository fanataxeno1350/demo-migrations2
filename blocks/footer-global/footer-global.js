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
      subWrap.classList.add('has-sub-child'); // Placeholder class, adjust based on actual original HTML if available
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

  // Destructure root rows based on EDS BLOCK STRUCTURE and BLOCK JSON
  // The two container fields (footerSocialLinks, footerLinks) are represented by their item rows,
  // so we need to account for the actual number of root rows before item rows start.
  // Based on the EDS structure, there are 7 explicit root rows before item rows.
  // The two container fields are conceptual and their content is in the itemRows.
  const [
    logoRow, // block.children[0]
    logoLinkRow, // block.children[1]
    countrySelectorIconRow, // block.children[2]
    countrySelectorLinkRow, // block.children[3]
    countrySelectorLabelRow, // block.children[4]
    footerSocialTitleRow, // block.children[5]
    legalLinkRow, // block.children[6] - this is the legalLink field, not a container placeholder
    ...itemRows // All subsequent rows are item rows for footerSocialLinks or footerLinks
  ] = children;

  const root = document.createElement('section');
  root.classList.add('footer-section', 'grid-container');
  root.setAttribute('aria-label', 'Global Footer Module');

  const logoLangContainer = document.createElement('div');
  logoLangContainer.classList.add('logo-lang-container');

  // Footer Logo
  const footerLogo = document.createElement('div');
  footerLogo.classList.add('footer-logo');
  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    logoLink.title = 'Nescafe Logo'; // From original HTML
    logoLink.setAttribute('aria-label', 'Nescafe logo links to the home page'); // From original HTML
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  footerLogo.append(logoLink);
  logoLangContainer.append(footerLogo);

  // Country Selector
  const countrySelectorAnchor = document.createElement('a');
  countrySelectorAnchor.classList.add('link--underlined', 'country-selector');
  const foundCountrySelectorLink = countrySelectorLinkRow.querySelector('a');
  if (foundCountrySelectorLink) {
    countrySelectorAnchor.href = foundCountrySelectorLink.href;
    countrySelectorAnchor.title = 'India'; // From original HTML
    countrySelectorAnchor.setAttribute('aria-label', 'Link to select language and country'); // From original HTML
  }
  const countryIconPicture = countrySelectorIconRow.querySelector('picture');
  if (countryIconPicture) {
    const img = countryIconPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    countrySelectorAnchor.append(optimizedPic);
  }
  const countryLabelSpan = document.createElement('span');
  countryLabelSpan.classList.add('labelMediumRegular');
  countryLabelSpan.textContent = countrySelectorLabelRow.textContent.trim();
  countrySelectorAnchor.append(countryLabelSpan);

  moveInstrumentation(countrySelectorIconRow, countrySelectorAnchor);
  moveInstrumentation(countrySelectorLinkRow, countrySelectorAnchor);
  moveInstrumentation(countrySelectorLabelRow, countrySelectorAnchor);
  logoLangContainer.append(countrySelectorAnchor);

  root.append(logoLangContainer);

  // Footer Social
  const footerSocial = document.createElement('div');
  footerSocial.classList.add('footer-social');
  const socialTitle = document.createElement('span');
  socialTitle.classList.add('utilityLegend', 'footer-social-title');
  socialTitle.textContent = footerSocialTitleRow.textContent.trim();
  moveInstrumentation(footerSocialTitleRow, socialTitle);
  footerSocial.append(socialTitle);

  const socialLinksList = document.createElement('ul');
  socialLinksList.classList.add('footer-social-links');

  // Filter social item rows: 3 cells (icon, link, hierarchy-tree) and contains a picture
  const socialItemRows = itemRows.filter(
    (row) => row.children.length === 3 && row.querySelector('picture'),
  );

  socialItemRows.forEach((row) => {
    // Fixed schema for footer-social-item: icon, link, hierarchy-tree
    const [iconCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    const socialAnchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      socialAnchor.href = foundLink.href;
      socialAnchor.title = foundLink.textContent.trim(); // Use link text as title, adjust if original HTML has specific titles
      socialAnchor.setAttribute('aria-label', foundLink.textContent.trim()); // Use link text as aria-label
    }
    const socialIconPicture = iconCell.querySelector('picture');
    if (socialIconPicture) {
      const img = socialIconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      socialAnchor.append(optimizedPic);
    }
    moveInstrumentation(row, socialAnchor);
    li.append(socialAnchor);
    socialLinksList.append(li);
  });
  footerSocial.append(socialLinksList);
  root.append(footerSocial);

  // Footer Site Links
  const footerSiteLinks = document.createElement('div');
  footerSiteLinks.classList.add('footer-site-links');

  const footerLinksDiv = document.createElement('div');
  footerLinksDiv.classList.add('footer-links');
  const footerLinksUl = document.createElement('ul');

  // Filter footer link item rows: 2 cells (label, link) and does NOT contain a picture
  const footerLinkItemRows = itemRows.filter(
    (row) => row.children.length === 2 && !row.querySelector('picture'),
  );

  footerLinkItemRows.forEach((row) => {
    // Fixed schema for footer-link-item: label, link
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.classList.add('labelMediumRegular'); // From original HTML
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor);
    li.append(anchor);
    footerLinksUl.append(li);
  });
  footerLinksDiv.append(footerLinksUl);
  footerSiteLinks.append(footerLinksDiv);

  // Legal Links
  const legalLinksDiv = document.createElement('div');
  legalLinksDiv.classList.add('legal-links');
  const legalAnchor = document.createElement('a');
  legalAnchor.classList.add('utilityNav');
  const foundLegalLink = legalLinkRow.querySelector('a');
  if (foundLegalLink) {
    legalAnchor.href = foundLegalLink.href;
    legalAnchor.title = 'NESCAFE® is registered trademarks of Société de Produits Nestlé S.A.'; // From original HTML
    legalAnchor.setAttribute('aria-label', ''); // From original HTML
  }
  legalAnchor.innerHTML = 'NESCAFE<sup>®</sup> is registered trademarks of Société de Produits Nestlé S.A.'; // From original HTML
  moveInstrumentation(legalLinkRow, legalAnchor);
  legalLinksDiv.append(legalAnchor);
  footerSiteLinks.append(legalLinksDiv);

  root.append(footerSiteLinks);

  // Feedback alt text div (empty in original HTML, just has class and data-alttext)
  const feedbackDiv = document.createElement('div');
  feedbackDiv.classList.add('feedback_alt_text');
  feedbackDiv.setAttribute('data-alttext', 'qsiFeedback Button');
  root.append(feedbackDiv);

  block.replaceChildren(root);
}
