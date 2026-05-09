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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's internal to the JS logic for nested lists.
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
  const [logoLinkRow, copyrightRow, ...itemRows] = children;

  const footerWrapper = document.createElement('div');
  footerWrapper.classList.add('cmp-footer__wrapper');
  moveInstrumentation(block, footerWrapper); // Move instrumentation from block to new wrapper

  const navigationSection = document.createElement('div');
  navigationSection.classList.add('navigation', 'footer-nav-css-from-wrapper');
  footerWrapper.append(navigationSection);

  const navigationWrapper = document.createElement('div');
  navigationWrapper.classList.add('cmp-navigation__wrapper');
  navigationSection.append(navigationWrapper);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('cmp-navigation__logo');
  const logoAnchor = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoAnchor.href = foundLogoLink.href;
    logoAnchor.setAttribute('aria-label', 'Qiddiya - Go to homepage');
    logoAnchor.target = '_self';
  }
  const logoSpan = document.createElement('span');
  logoSpan.classList.add('qd-icon', 'qd-icon--logo', 'qd-logo-footer');
  for (let i = 1; i <= 25; i += 1) {
    const pathSpan = document.createElement('span');
    pathSpan.classList.add(`path${i}`);
    logoSpan.append(pathSpan);
  }
  logoAnchor.append(logoSpan);
  logoDiv.append(logoAnchor);
  moveInstrumentation(logoLinkRow, logoDiv);
  navigationWrapper.append(logoDiv);

  const navigationContent = document.createElement('div');
  navigationContent.classList.add('cmp-navigation__content');
  navigationWrapper.append(navigationContent);

  const socialLinksDiv = document.createElement('div');
  socialLinksDiv.classList.add('socialLinks', 'social-links', 'footer-social-css-from-wrapper');
  const socialLinksList = document.createElement('ul');
  socialLinksList.classList.add('cmp-social-links__list');
  socialLinksDiv.append(socialLinksList);

  const navigationLinksList = document.createElement('ul');
  navigationLinksList.classList.add('cmp-navigation__links');

  const languageSelectorDiv = document.createElement('div');
  languageSelectorDiv.classList.add('language-selector', 'footer-lang-css-from-wrapper');
  const languageSelectorList = document.createElement('ul');
  languageSelectorList.classList.add('cmp-language-selector');
  languageSelectorDiv.append(languageSelectorList);

  const policyLinksDiv = document.createElement('div');
  policyLinksDiv.classList.add('policy-links', 'footer-policy-css-from-wrapper');
  const policyLinksWrapper = document.createElement('div');
  policyLinksWrapper.classList.add('cmp-policy-links__wrapper');
  const policyLinksContent = document.createElement('div');
  policyLinksContent.classList.add('cmp-policy-links__content');
  policyLinksWrapper.append(policyLinksContent);
  policyLinksDiv.append(policyLinksWrapper);

  itemRows.forEach((row) => {
    const [cell0, cell1] = [...row.children]; // Destructuring for fixed-schema rows

    // Determine item type based on content and position (as per BlockJson filters)
    // footer-social-item: socialLink (aem-content) | hierarchy-tree (richtext)
    // This is the only item type with richtext (ul) in cell1
    if (cell0.querySelector('a') && cell1.querySelector('ul')) {
      const socialLinkCell = cell0;
      const hierarchyTreeCell = cell1;

      const socialItem = document.createElement('li');
      socialItem.classList.add('cmp-social-links__item');
      const socialAnchor = document.createElement('a');
      socialAnchor.classList.add('cmp-social-links__icon', 'qd-icon');
      const foundSocialLink = socialLinkCell.querySelector('a');
      if (foundSocialLink) {
        socialAnchor.href = foundSocialLink.href;
        socialAnchor.target = '_blank';
        // Determine icon class based on href
        if (foundSocialLink.href.includes('x.com')) {
          socialAnchor.classList.add('qd-icon--x');
          socialAnchor.setAttribute('aria-label', 'X');
        } else if (foundSocialLink.href.includes('instagram.com')) {
          socialAnchor.classList.add('qd-icon--instagram');
          socialAnchor.setAttribute('aria-label', 'Instagram');
        } else if (foundSocialLink.href.includes('youtube.com')) {
          socialAnchor.classList.add('qd-icon--youtube');
          socialAnchor.setAttribute('aria-label', 'Youtube');
        } else if (foundSocialLink.href.includes('tiktok.com')) {
          socialAnchor.classList.add('qd-icon--tiktok');
          socialAnchor.setAttribute('aria-label', 'TikTok');
        } else if (foundSocialLink.href.includes('linkedin.com')) {
          socialAnchor.classList.add('qd-icon--linkedin');
          socialAnchor.setAttribute('aria-label', 'LinkedIn');
        }
      }
      socialItem.append(socialAnchor);
      moveInstrumentation(row, socialItem);
      socialLinksList.append(socialItem);

      // Handle hierarchy-tree richtext
      const hierarchyTempDiv = document.createElement('div');
      hierarchyTempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      const rootUl = hierarchyTempDiv.querySelector('ul');
      if (rootUl) {
        rootUl.classList.add('cmp-navigation__sub-links'); // Add class from ORIGINAL HTML if applicable
        rootUl.querySelectorAll('li').forEach((li) => li.classList.add('cmp-navigation__sub-item'));
        rootUl.querySelectorAll('a').forEach((a) => a.classList.add('cmp-navigation__sub-link'));
        transformNestedLists(rootUl);
        // Append the transformed list to a suitable container, e.g., a new div within socialItem
        const hierarchyContainer = document.createElement('div');
        hierarchyContainer.classList.add('cmp-navigation__hierarchy'); // Example class
        moveInstrumentation(hierarchyTreeCell, hierarchyContainer);
        while (hierarchyTempDiv.firstChild) {
          hierarchyContainer.append(hierarchyTempDiv.firstChild);
        }
        socialItem.append(hierarchyContainer); // Append to socialItem or another appropriate parent
      }
    }
    // footer-navigation-item: label (text) | link (aem-content)
    // This comes after social-item in the BlockJson filter order
    else if (!cell0.querySelector('a') && cell1.querySelector('a') && cell0.textContent.trim() !== '') {
      const labelCell = cell0;
      const linkCell = cell1;

      const navItem = document.createElement('li');
      const navLink = document.createElement('a');
      navLink.classList.add('cmp-navigation__link-item');
      navLink.setAttribute('tabindex', '0');
      navLink.target = '_self';
      navLink.textContent = labelCell.textContent.trim();
      const foundNavLink = linkCell.querySelector('a');
      if (foundNavLink) {
        navLink.href = foundNavLink.href;
        navLink.title = labelCell.textContent.trim();
      }
      navItem.append(navLink);
      moveInstrumentation(row, navItem);
      navigationLinksList.append(navItem);
    }
    // footer-language-item: languageLabel (text) | languageLink (aem-content)
    // This comes after navigation-item in the BlockJson filter order
    else if (!cell0.querySelector('a') && cell1.querySelector('a') && cell0.textContent.trim() !== '') {
      const languageLabelCell = cell0;
      const languageLinkCell = cell1;

      const langItem = document.createElement('li');
      if (languageLabelCell.textContent.trim().toLowerCase() === 'english') {
        langItem.classList.add('active');
      }
      const langLink = document.createElement('a');
      langLink.classList.add('cmp-language-selector__link');
      langLink.textContent = languageLabelCell.textContent.trim();
      langLink.setAttribute('aria-label', languageLabelCell.textContent.trim());
      langLink.dataset.lang = languageLabelCell.textContent.trim().toLowerCase().substring(0, 2);
      const foundLangLink = languageLinkCell.querySelector('a');
      if (foundLangLink) {
        langLink.href = foundLangLink.href;
      }
      langItem.append(langLink);
      moveInstrumentation(row, langItem);
      languageSelectorList.append(langItem);
    }
    // footer-policy-link-item: policyLabel (text) | policyLink (aem-content)
    // This comes after language-item in the BlockJson filter order
    else if (!cell0.querySelector('a') && cell1.querySelector('a') && cell0.textContent.trim() !== '') {
      const policyLabelCell = cell0;
      const policyLinkCell = cell1;

      const policyLink = document.createElement('a');
      policyLink.classList.add('cmp-policy-links__item');
      policyLink.setAttribute('tabindex', '0');
      policyLink.target = '_self';
      policyLink.textContent = policyLabelCell.textContent.trim();
      const foundPolicyLink = policyLinkCell.querySelector('a');
      if (foundPolicyLink) {
        policyLink.href = foundPolicyLink.href;
        policyLink.title = policyLabelCell.textContent.trim();
      }
      moveInstrumentation(row, policyLink);
      policyLinksContent.append(policyLink);
    }
  });

  navigationContent.append(socialLinksDiv);
  navigationContent.append(navigationLinksList);

  const divider = document.createElement('div');
  divider.classList.add('cmp-footer__divider');
  footerWrapper.append(divider);

  const bottomSection = document.createElement('div');
  bottomSection.classList.add('cmp-footer__bottom');
  footerWrapper.append(bottomSection);

  bottomSection.append(languageSelectorDiv);
  bottomSection.append(policyLinksDiv);

  const copyrightP = document.createElement('p');
  copyrightP.classList.add('cmp-policy-links__copyright');
  copyrightP.textContent = copyrightRow.textContent.trim();
  moveInstrumentation(copyrightRow, copyrightP);
  policyLinksWrapper.append(copyrightP);

  block.replaceChildren(footerWrapper);
}
