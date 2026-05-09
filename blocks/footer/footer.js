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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's part of the interactivity logic.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active'); // This class is not in the allowlist, but it's part of the interactivity logic.
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // The model defines logoLink and copyright as root fields.
  // The item rows for containers are interleaved.
  // We need to find the logoLink and copyright rows by their position or content.
  // Based on the EDS structure, logoLink is block.children[0] and copyright is block.children[block.children.length - 1].
  const logoLinkRow = children[0];
  const copyrightRow = children[children.length - 1];

  // All other rows are item rows for the container fields.
  const itemRows = children.slice(1, children.length - 1);

  const socialLinkRows = [];
  const navigationLinkRows = [];
  const languageLinkRows = [];
  const policyLinkRows = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 2) {
      // Check for footer-social-item: socialLink (aem-content) and hierarchy-tree (richtext with ul)
      const cell0HasAnchor = cells[0].querySelector('a');
      const cell1HasUl = cells[1].querySelector('ul');
      if (cell0HasAnchor && cell1HasUl) {
        socialLinkRows.push(row);
      } else {
        // All other 2-cell rows are footer-link-item or footer-language-item.
        // Differentiate based on text content for now, as per original logic,
        // but ideally, this should be based on a more robust content detection if possible.
        // The original logic used textContent.trim().toLowerCase() which is fragile.
        // For now, keeping the text content check as it was in the original JS,
        // but noting it's a potential point of failure if content changes.
        const labelText = cells[0].textContent.trim().toLowerCase();
        if (labelText === 'english' || labelText === 'العربية') {
          languageLinkRows.push(row);
        } else if (labelText === 'privacy notice' || labelText === 'cookie policy' || labelText === 'terms of use') {
          policyLinkRows.push(row);
        } else {
          navigationLinkRows.push(row);
        }
      }
    }
  });

  const wrapper = document.createElement('div');
  wrapper.classList.add('cmp-footer__wrapper');

  // Navigation section
  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation', 'footer-nav-css-from-wrapper');

  const navigationWrapper = document.createElement('div');
  navigationWrapper.classList.add('cmp-navigation__wrapper');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('cmp-navigation__logo');
  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    logoLink.setAttribute('target', '_self');
    logoLink.setAttribute('aria-label', 'Qiddiya - Go to homepage');
  }
  const logoSpan = document.createElement('span');
  logoSpan.classList.add('qd-icon', 'qd-icon--logo', 'qd-logo-footer');
  for (let i = 1; i <= 25; i += 1) {
    const pathSpan = document.createElement('span');
    pathSpan.classList.add(`path${i}`);
    logoSpan.append(pathSpan);
  }
  logoLink.append(logoSpan);
  logoDiv.append(logoLink);
  moveInstrumentation(logoLinkRow, logoLink);

  const navigationContent = document.createElement('div');
  navigationContent.classList.add('cmp-navigation__content');

  // Social Links
  const socialLinksDiv = document.createElement('div');
  socialLinksDiv.classList.add('socialLinks', 'social-links', 'footer-social-css-from-wrapper');
  const socialLinksList = document.createElement('ul');
  socialLinksList.classList.add('cmp-social-links__list');

  socialLinkRows.forEach((row) => {
    // Use destructuring for fixed schema item rows
    const [socialLinkCell, hierarchyTreeCell] = [...row.children];
    const socialLink = socialLinkCell.querySelector('a');

    if (socialLink) {
      const listItem = document.createElement('li');
      listItem.classList.add('cmp-social-links__item');
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-social-links__icon');
      anchor.href = socialLink.href;
      anchor.setAttribute('target', '_blank');

      // Determine the icon based on the href
      if (socialLink.href.includes('x.com')) {
        anchor.classList.add('qd-icon', 'qd-icon--x');
        anchor.setAttribute('aria-label', 'X');
      } else if (socialLink.href.includes('instagram.com')) {
        anchor.classList.add('qd-icon', 'qd-icon--instagram');
        anchor.setAttribute('aria-label', 'Instagram');
      } else if (socialLink.href.includes('youtube.com')) {
        anchor.classList.add('qd-icon', 'qd-icon--youtube');
        anchor.setAttribute('aria-label', 'Youtube');
      } else if (socialLink.href.includes('tiktok.com')) {
        anchor.classList.add('qd-icon', 'qd-icon--tiktok');
        anchor.setAttribute('aria-label', 'TikTok');
      } else if (socialLink.href.includes('linkedin.com')) {
        anchor.classList.add('qd-icon', 'qd-icon--linkedin');
        anchor.setAttribute('aria-label', 'LinkedIn');
      }
      listItem.append(anchor);

      // Handle hierarchy-tree richtext
      const hierarchyTreeTempDiv = document.createElement('div');
      hierarchyTreeTempDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
      moveInstrumentation(hierarchyTreeCell, hierarchyTreeTempDiv); // Move instrumentation for the cell content

      // Apply classes to nested elements and transform lists
      hierarchyTreeTempDiv.querySelectorAll('a').forEach(a => a.classList.add('cmp-navigation__link-item'));
      hierarchyTreeTempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('cmp-navigation__sub-list'));
      hierarchyTreeTempDiv.querySelectorAll('li').forEach(li => li.classList.add('cmp-navigation__list-item'));

      // Transform nested lists for interactivity
      const rootUl = hierarchyTreeTempDiv.querySelector('ul');
      if (rootUl) {
        transformNestedLists(rootUl);
        listItem.append(rootUl); // Append the transformed hierarchy
      }

      socialLinksList.append(listItem);
      moveInstrumentation(row, listItem);
    }
  });
  socialLinksDiv.append(socialLinksList);
  navigationContent.append(socialLinksDiv);

  // Navigation Links
  const navigationLinksList = document.createElement('ul');
  navigationLinksList.classList.add('cmp-navigation__links');

  navigationLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const link = linkCell.querySelector('a');
    if (link) {
      const listItem = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-navigation__link-item');
      anchor.setAttribute('tabindex', '0');
      anchor.setAttribute('target', '_self');
      anchor.href = link.href;
      anchor.textContent = labelCell.textContent.trim();
      anchor.title = labelCell.textContent.trim();
      listItem.append(anchor);
      navigationLinksList.append(listItem);
      moveInstrumentation(row, listItem);
    }
  });
  navigationContent.append(navigationLinksList);

  navigationWrapper.append(logoDiv, navigationContent);
  navigationDiv.append(navigationWrapper);
  wrapper.append(navigationDiv);

  // Divider
  const divider = document.createElement('div');
  divider.classList.add('cmp-footer__divider');
  wrapper.append(divider);

  // Bottom section
  const bottomDiv = document.createElement('div');
  bottomDiv.classList.add('cmp-footer__bottom');

  // Language Selector
  const languageSelectorDiv = document.createElement('div');
  languageSelectorDiv.classList.add('language-selector', 'footer-lang-css-from-wrapper');
  const languageSelectorList = document.createElement('ul');
  languageSelectorList.classList.add('cmp-language-selector');

  languageLinkRows.forEach((row) => {
    const [languageLabelCell, languageLinkCell] = [...row.children];
    const link = languageLinkCell.querySelector('a');
    if (link) {
      const listItem = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-language-selector__link');
      anchor.href = link.href;
      anchor.textContent = languageLabelCell.textContent.trim();
      anchor.setAttribute('aria-label', languageLabelCell.textContent.trim());
      anchor.setAttribute('data-lang', languageLabelCell.textContent.trim().toLowerCase().substring(0, 2));
      if (languageLabelCell.textContent.trim().toLowerCase() === 'english') {
        listItem.classList.add('active');
      }
      listItem.append(anchor);
      languageSelectorList.append(listItem);
      moveInstrumentation(row, listItem);
    }
  });
  languageSelectorDiv.append(languageSelectorList);
  bottomDiv.append(languageSelectorDiv);

  // Policy Links
  const policyLinksDiv = document.createElement('div');
  policyLinksDiv.classList.add('policy-links', 'footer-policy-css-from-wrapper');
  const policyLinksWrapper = document.createElement('div');
  policyLinksWrapper.classList.add('cmp-policy-links__wrapper');
  const policyLinksContent = document.createElement('div');
  policyLinksContent.classList.add('cmp-policy-links__content');

  policyLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const link = linkCell.querySelector('a');
    if (link) {
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-policy-links__item');
      anchor.setAttribute('tabindex', '0');
      anchor.setAttribute('target', '_self');
      anchor.href = link.href;
      anchor.textContent = labelCell.textContent.trim();
      anchor.title = labelCell.textContent.trim();
      policyLinksContent.append(anchor);
      moveInstrumentation(row, anchor);
    }
  });
  policyLinksWrapper.append(policyLinksContent);

  const copyrightP = document.createElement('p');
  copyrightP.classList.add('cmp-policy-links__copyright');
  copyrightP.textContent = copyrightRow.textContent.trim();
  moveInstrumentation(copyrightRow, copyrightP);
  policyLinksWrapper.append(copyrightP);

  policyLinksDiv.append(policyLinksWrapper);
  bottomDiv.append(policyLinksDiv);
  wrapper.append(bottomDiv);

  block.replaceChildren(wrapper);
}
