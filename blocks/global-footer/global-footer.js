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
      subWrap.classList.add('has-sub-child');
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

  const [
    logoRow,
    logoLinkRow,
    countrySelectorIconRow,
    countrySelectorLabelRow,
    countrySelectorLinkRow,
    socialTitleRow,
    copyrightLinkRow,
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
  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
    logoLink.title = 'Nescafe Logo'; // Hardcoded title, not in model
    logoLink.setAttribute('aria-label', 'Nescafe logo links to the home page'); // Hardcoded aria-label, not in model
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

  // Country Selector
  const countrySelectorLink = document.createElement('a');
  countrySelectorLink.classList.add('link--underlined', 'country-selector');
  const countryLinkAnchor = countrySelectorLinkRow.querySelector('a');
  if (countryLinkAnchor) {
    countrySelectorLink.href = countryLinkAnchor.href;
    countrySelectorLink.title = countrySelectorLabelRow.textContent.trim();
    countrySelectorLink.setAttribute('aria-label', 'Link to select language and country'); // Hardcoded aria-label, not in model
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

  footerSection.append(logoLangContainer);

  // Social Links
  const footerSocial = document.createElement('div');
  footerSocial.classList.add('footer-social');
  const socialTitleSpan = document.createElement('span');
  socialTitleSpan.classList.add('utilityLegend', 'footer-social-title');
  socialTitleSpan.textContent = socialTitleRow.textContent.trim();
  moveInstrumentation(socialTitleRow, socialTitleSpan);
  footerSocial.append(socialTitleSpan);

  const socialLinksList = document.createElement('ul');
  socialLinksList.classList.add('footer-social-links');

  // Filter for social link rows (3 cells: icon, link, hierarchy-tree)
  const socialLinkRows = itemRows.filter(
    (row) => row.children.length === 3 && row.querySelector('picture'),
  );

  socialLinkRows.forEach((row) => {
    const [iconCell, linkCell, hierarchyCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    const link = document.createElement('a');
    const anchor = linkCell.querySelector('a');
    if (anchor) {
      link.href = anchor.href;
      link.setAttribute('aria-label', iconCell.querySelector('img')?.alt || '');
      link.title = iconCell.querySelector('img')?.alt || '';
    }
    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      link.append(optimizedPic);
    }
    moveInstrumentation(row, li);
    li.append(link);

    // Handle hierarchy-tree richtext
    const hierarchyContent = hierarchyCell?.innerHTML || '';
    if (hierarchyContent) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyContent;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation for the richtext cell

      const rootUl = tempDiv.querySelector('ul');
      if (rootUl) {
        // Apply classes from original HTML if available, or default
        rootUl.classList.add('nav-menu-list'); // Example class, adjust based on original HTML
        transformNestedLists(rootUl); // Apply interactivity and structure

        // Append all children from tempDiv to li
        while (tempDiv.firstChild) {
          li.append(tempDiv.firstChild);
        }
      }
    }
    socialLinksList.append(li);
  });
  footerSocial.append(socialLinksList);
  footerSection.append(footerSocial);

  // Site Links
  const footerSiteLinks = document.createElement('div');
  footerSiteLinks.classList.add('footer-site-links');

  const footerLinks = document.createElement('div');
  footerLinks.classList.add('footer-links');
  const footerLinksUl = document.createElement('ul');

  // Filter for site link rows (2 cells: label, link)
  const siteLinkRows = itemRows.filter(
    (row) => row.children.length === 2 && !row.querySelector('picture'),
  );

  siteLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.classList.add('labelMediumRegular');
    const anchor = linkCell.querySelector('a');
    if (anchor) {
      link.href = anchor.href;
      link.title = labelCell.textContent.trim();
      if (anchor.target === '_blank') {
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

  // Legal Links (Copyright)
  const legalLinks = document.createElement('div');
  legalLinks.classList.add('legal-links');
  const copyrightAnchor = document.createElement('a');
  copyrightAnchor.classList.add('utilityNav');
  const originalCopyrightLink = copyrightLinkRow.querySelector('a');
  if (originalCopyrightLink) {
    copyrightAnchor.href = originalCopyrightLink.href;
    copyrightAnchor.title = originalCopyrightLink.textContent.trim();
    copyrightAnchor.setAttribute('aria-label', ''); // Original HTML has empty aria-label
    copyrightAnchor.innerHTML = originalCopyrightLink.textContent.trim();
  }
  moveInstrumentation(copyrightLinkRow, copyrightAnchor);
  legalLinks.append(copyrightAnchor);
  footerSiteLinks.append(legalLinks);

  footerSection.append(footerSiteLinks);

  // Feedback alt text
  const feedbackAltText = document.createElement('div');
  feedbackAltText.classList.add('feedback_alt_text');
  feedbackAltText.setAttribute('data-alttext', 'qsiFeedback Button');
  footerSection.append(feedbackAltText);

  block.replaceChildren(footerSection);

  // Image optimization - this should ideally be handled by createOptimizedPicture directly
  // and not as a separate block-level loop after replaceChildren.
  // Keeping it for now as it's in the original generated code, but flagging for future review.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
