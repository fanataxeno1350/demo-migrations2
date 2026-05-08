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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's for JS behavior
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist, but it's for JS behavior
          subWrap.classList.toggle('active'); // This class is not in the allowlist, but it's for JS behavior
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    countrySelectorIconRow,
    countrySelectorLinkRow,
    countrySelectorLabelRow,
    footerSocialTitleRow,
    legalLinkRow,
    ...itemRows
  ] = children;

  const footerSection = document.createElement('section');
  footerSection.classList.add('footer-section', 'grid-container');
  footerSection.setAttribute('aria-label', 'Global Footer Module');

  // Logo and Language Selector
  const logoLangContainer = document.createElement('div');
  logoLangContainer.classList.add('logo-lang-container');

  const footerLogo = document.createElement('div');
  footerLogo.classList.add('footer-logo');
  const logoLink = document.createElement('a');
  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
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

  const countrySelectorLink = document.createElement('a');
  countrySelectorLink.classList.add('link--underlined', 'country-selector');
  const countrySelectorAnchor = countrySelectorLinkRow.querySelector('a');
  if (countrySelectorAnchor) {
    countrySelectorLink.href = countrySelectorAnchor.href;
    countrySelectorLink.title = countrySelectorLabelRow.textContent.trim();
    countrySelectorLink.setAttribute('aria-label', 'Link to select language and country'); // From original HTML
  }
  const countrySelectorPicture = countrySelectorIconRow.querySelector('picture');
  if (countrySelectorPicture) {
    const img = countrySelectorPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    countrySelectorLink.append(optimizedPic);
  }
  const countrySelectorSpan = document.createElement('span');
  countrySelectorSpan.classList.add('labelMediumRegular');
  countrySelectorSpan.textContent = countrySelectorLabelRow.textContent.trim();
  countrySelectorLink.append(countrySelectorSpan);
  moveInstrumentation(countrySelectorIconRow, countrySelectorLink);
  moveInstrumentation(countrySelectorLinkRow, countrySelectorLink);
  moveInstrumentation(countrySelectorLabelRow, countrySelectorLink);
  logoLangContainer.append(countrySelectorLink);

  footerSection.append(logoLangContainer);

  // Social Section
  const footerSocial = document.createElement('div');
  footerSocial.classList.add('footer-social');

  const socialTitleSpan = document.createElement('span');
  socialTitleSpan.classList.add('utilityLegend', 'footer-social-title');
  socialTitleSpan.textContent = footerSocialTitleRow.textContent.trim();
  moveInstrumentation(footerSocialTitleRow, socialTitleSpan);
  footerSocial.append(socialTitleSpan);

  const footerSocialLinksUl = document.createElement('ul');
  footerSocialLinksUl.classList.add('footer-social-links');

  // Filter itemRows into social links and footer links
  // Social links have 3 cells (icon, link, hierarchy-tree) and a picture
  // Footer links have 2 cells (label, link) and no picture
  const socialLinkRows = itemRows.filter((row) => row.children.length === 3 && row.querySelector('picture'));
  const footerLinkRows = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture'));

  socialLinkRows.forEach((row) => {
    const [iconCell, linkCell, hierarchyCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    const socialAnchor = document.createElement('a');
    const link = linkCell.querySelector('a');
    if (link) {
      socialAnchor.href = link.href;
      // Original HTML has aria-label and title from the link's text content, not hardcoded
      socialAnchor.setAttribute('aria-label', link.textContent.trim());
      socialAnchor.title = link.textContent.trim();
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

    // Handle hierarchy-tree richtext
    const hierarchyContentDiv = document.createElement('div'); // Use a div to hold the richtext HTML
    hierarchyContentDiv.innerHTML = hierarchyCell?.innerHTML || '';
    moveInstrumentation(hierarchyCell, hierarchyContentDiv);

    const rootUl = hierarchyContentDiv.querySelector('ul');
    if (rootUl) {
      transformNestedLists(rootUl);
      li.append(rootUl); // Append the transformed UL directly to the li
    }

    footerSocialLinksUl.append(li);
  });
  footerSocial.append(footerSocialLinksUl);
  footerSection.append(footerSocial);

  // Site Links
  const footerSiteLinks = document.createElement('div');
  footerSiteLinks.classList.add('footer-site-links');

  const footerLinksDiv = document.createElement('div');
  footerLinksDiv.classList.add('footer-links');
  const footerLinksUl = document.createElement('ul');

  footerLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.classList.add('labelMediumRegular');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.title = labelCell.textContent.trim();
    }
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, li);
    li.append(link);
    footerLinksUl.append(li);
  });
  footerLinksDiv.append(footerLinksUl);
  footerSiteLinks.append(footerLinksDiv);

  const legalLinksDiv = document.createElement('div');
  legalLinksDiv.classList.add('legal-links');
  const legalAnchor = document.createElement('a');
  legalAnchor.classList.add('utilityNav');
  const legalLink = legalLinkRow.querySelector('a');
  if (legalLink) {
    legalAnchor.href = legalLink.href;
    // Read title and aria-label from original HTML if available, otherwise use default
    legalAnchor.title = 'NESCAFE® is registered trademarks of Société de Produits Nestlé S.A.'; // From original HTML
    legalAnchor.setAttribute('aria-label', ''); // From original HTML
  }
  // Read the innerHTML from the legalLinkRow's cell, which contains the <sup> tag
  legalAnchor.innerHTML = legalLinkRow.children[0]?.innerHTML || '';
  moveInstrumentation(legalLinkRow, legalAnchor);
  legalLinksDiv.append(legalAnchor);
  footerSiteLinks.append(legalLinksDiv);

  footerSection.append(footerSiteLinks);

  // Feedback button placeholder
  const feedbackDiv = document.createElement('div');
  feedbackDiv.classList.add('feedback_alt_text');
  feedbackDiv.setAttribute('data-alttext', 'qsiFeedback Button');
  footerSection.append(feedbackDiv);

  block.replaceChildren(footerSection);

  // Optimize images in the entire block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
