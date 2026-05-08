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
      subWrap.classList.add('has-sub-child'); // This class is not in original HTML, but seems to be for JS behavior
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in original HTML, but seems to be for JS behavior
          subWrap.classList.toggle('active'); // This class is not in original HTML, but seems to be for JS behavior
        });
      }
    }
    // Add classes to nested list items as per original HTML if applicable,
    // though original HTML only shows classes on top-level social links.
    // Assuming nested lists are for navigation, adding generic list item classes.
    li.classList.add('cmp-navigation__link-item'); // Assuming this is for nested nav lists
    if (anchor) {
      anchor.classList.add('cmp-navigation__link-item'); // Assuming this is for nested nav links
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields are at fixed indices
  const logoLinkRow = children[0];
  const copyrightRow = children[1];

  const socialLinkRows = [];
  const navigationLinkRows = [];
  const languageLinkRows = [];
  const policyLinkRows = [];

  // Categorize item rows based on cell count and content
  children.slice(2).forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3 && cells[2].querySelector('ul')) {
      // This is a footer-social-item with hierarchy-tree (3 cells, last cell has a UL)
      socialLinkRows.push(row);
    } else if (cells.length === 2) {
      // This could be footer-link-item, footer-language-item, or footer-policy-item (all 2 cells)
      // Distinguish by content and relative position (as per BlockJson filter order)
      const [cell0, cell1] = cells; // Destructuring for fixed-schema 2-cell rows

      // Language links often have specific href patterns or are explicitly labeled
      const linkHref = cell1.querySelector('a')?.href;
      const labelText = cell0.textContent.trim().toLowerCase();

      // Check for language links first (e.g., /ar/ in href or specific labels like 'english', 'العربية')
      if (linkHref && (linkHref.includes('/ar/') || labelText === 'english' || labelText === 'العربية')) {
        languageLinkRows.push(row);
      } else if (labelText.includes('privacy') || labelText.includes('cookie') || labelText.includes('terms')) {
        // Policy links
        policyLinkRows.push(row);
      } else {
        // Default to navigation links if not language or policy
        navigationLinkRows.push(row);
      }
    }
    // The single-cell social link case is likely covered by the 3-cell social item,
    // as the model specifies 3 cells for social items. If a single-cell social link
    // is possible, its model would need to be defined.
  });

  const wrapper = document.createElement('div');
  wrapper.classList.add('cmp-footer__wrapper');
  moveInstrumentation(block, wrapper); // Move instrumentation from block to the main wrapper

  // Navigation section
  const navigation = document.createElement('div');
  navigation.classList.add('navigation', 'footer-nav-css-from-wrapper');

  const navigationWrapper = document.createElement('div');
  navigationWrapper.classList.add('cmp-navigation__wrapper');

  const logo = document.createElement('div');
  logo.classList.add('cmp-navigation__logo');
  const logoAnchor = document.createElement('a');
  const logoLink = logoLinkRow.querySelector('a');
  if (logoLink) {
    logoAnchor.href = logoLink.href;
  }
  logoAnchor.setAttribute('aria-label', 'Qiddiya - Go to homepage');
  // Hardcoded SVG from ORIGINAL HTML
  logoAnchor.innerHTML = '<span class="qd-icon qd-icon--logo qd-logo-footer"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span><span class="path16"></span><span class="path17"></span><span class="path18"></span><span class="path19"></span><span class="path20"></span><span class="path21"></span><span class="path22"></span><span class="path23"></span><span class="path24"></span><span class="path25"></span></span>';
  moveInstrumentation(logoLinkRow, logoAnchor);
  logo.append(logoAnchor);
  navigationWrapper.append(logo);

  const navigationContent = document.createElement('div');
  navigationContent.classList.add('cmp-navigation__content');

  // Social Links
  const socialLinksDiv = document.createElement('div');
  socialLinksDiv.classList.add('socialLinks', 'social-links', 'footer-social-css-from-wrapper');
  const socialLinksList = document.createElement('ul');
  socialLinksList.classList.add('cmp-social-links__list');

  socialLinkRows.forEach((row) => {
    // Fixed schema for footer-social-item: link, label, hierarchy-tree
    const [linkCell, labelCell, hierarchyTreeCell] = [...row.children];
    const socialLink = linkCell.querySelector('a');
    const socialLabel = labelCell.textContent.trim();
    // Read richtext content using innerHTML
    const hierarchyTreeContent = hierarchyTreeCell.innerHTML;

    const listItem = document.createElement('li');
    listItem.classList.add('cmp-social-links__item');

    if (hierarchyTreeContent.includes('<ul')) { // Check if hierarchy-tree actually contains a UL
      // Handle hierarchical social link (accordion style)
      const trigger = document.createElement('a');
      // Use label for icon class if it maps to a known icon, otherwise fallback to text
      if (socialLabel.toLowerCase() === 'x') trigger.classList.add('qd-icon', 'qd-icon--x');
      else if (socialLabel.toLowerCase() === 'instagram') trigger.classList.add('qd-icon', 'qd-icon--instagram');
      else if (socialLabel.toLowerCase() === 'youtube') trigger.classList.add('qd-icon', 'qd-icon--youtube');
      else if (socialLabel.toLowerCase() === 'tiktok') trigger.classList.add('qd-icon', 'qd-icon--tiktok');
      else if (socialLabel.toLowerCase() === 'linkedin') trigger.classList.add('qd-icon', 'qd-icon--linkedin');
      else trigger.textContent = socialLabel; // Fallback to text if no icon class

      if (socialLink) trigger.href = socialLink.href;
      trigger.setAttribute('aria-label', socialLabel);
      // If no icon class was added, ensure text is present
      if (!trigger.textContent && !trigger.querySelector('.qd-icon')) {
        trigger.textContent = socialLabel;
      }

      const dropdown = document.createElement('div');
      dropdown.classList.add('social-links-dropdown'); // This class is not in original HTML, but seems to be for JS behavior

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeContent;
      const hierarchyUl = tempDiv.querySelector('ul');

      if (hierarchyUl) {
        moveInstrumentation(hierarchyTreeCell, hierarchyUl); // Move instrumentation from richtext cell to the UL
        transformNestedLists(hierarchyUl); // Apply transformations to nested lists
        dropdown.append(hierarchyUl);
      }

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('active'); // This class is not in original HTML, but seems to be for JS behavior
        trigger.classList.toggle('active'); // This class is not in original HTML, but seems to be for JS behavior
      });

      moveInstrumentation(row, trigger); // Move instrumentation from row to the trigger
      listItem.append(trigger, dropdown);
    } else if (socialLink) {
      // Simple social link
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-social-links__icon');
      // Map common social labels to icons based on original HTML
      if (socialLabel.toLowerCase() === 'x') anchor.classList.add('qd-icon', 'qd-icon--x');
      else if (socialLabel.toLowerCase() === 'instagram') anchor.classList.add('qd-icon', 'qd-icon--instagram');
      else if (socialLabel.toLowerCase() === 'youtube') anchor.classList.add('qd-icon', 'qd-icon--youtube');
      else if (socialLabel.toLowerCase() === 'tiktok') anchor.classList.add('qd-icon', 'qd-icon--tiktok');
      else if (socialLabel.toLowerCase() === 'linkedin') anchor.classList.add('qd-icon', 'qd-icon--linkedin');
      else anchor.textContent = socialLabel; // Fallback to text if no icon class

      anchor.href = socialLink.href;
      anchor.setAttribute('aria-label', socialLabel);
      moveInstrumentation(row, anchor); // Move instrumentation from row to the anchor
      listItem.append(anchor);
    }
    socialLinksList.append(listItem);
  });
  socialLinksDiv.append(socialLinksList);
  navigationContent.append(socialLinksDiv);

  // Navigation Links
  const navigationLinksList = document.createElement('ul');
  navigationLinksList.classList.add('cmp-navigation__links');
  navigationLinkRows.forEach((row) => {
    // Fixed schema for footer-link-item: label, link
    const [labelCell, linkCell] = [...row.children];
    const label = labelCell.textContent.trim();
    const link = linkCell.querySelector('a');

    const listItem = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.classList.add('cmp-navigation__link-item');
    if (link) anchor.href = link.href;
    anchor.textContent = label;
    moveInstrumentation(row, anchor); // Move instrumentation from row to the anchor
    listItem.append(anchor);
    navigationLinksList.append(listItem);
  });
  navigationContent.append(navigationLinksList);
  navigationWrapper.append(navigationContent);
  navigation.append(navigationWrapper);
  wrapper.append(navigation);

  const divider = document.createElement('div');
  divider.classList.add('cmp-footer__divider');
  wrapper.append(divider);

  // Bottom section
  const bottom = document.createElement('div');
  bottom.classList.add('cmp-footer__bottom');

  // Language Selector
  const languageSelectorDiv = document.createElement('div');
  languageSelectorDiv.classList.add('language-selector', 'footer-lang-css-from-wrapper');
  const languageSelectorList = document.createElement('ul');
  languageSelectorList.classList.add('cmp-language-selector');
  languageLinkRows.forEach((row) => {
    // Fixed schema for footer-language-item: label, link
    const [labelCell, linkCell] = [...row.children];
    const label = labelCell.textContent.trim();
    const link = linkCell.querySelector('a');

    const listItem = document.createElement('li');
    if (label.toLowerCase() === 'english') listItem.classList.add('active');
    const anchor = document.createElement('a');
    anchor.classList.add('cmp-language-selector__link');
    if (link) anchor.href = link.href;
    anchor.setAttribute('aria-label', label);
    anchor.dataset.lang = label.toLowerCase().substring(0, 2); // 'en', 'ar'
    anchor.textContent = label;
    moveInstrumentation(row, anchor); // Move instrumentation from row to the anchor
    listItem.append(anchor);
    languageSelectorList.append(listItem);
  });
  languageSelectorDiv.append(languageSelectorList);
  bottom.append(languageSelectorDiv);

  // Policy Links
  const policyLinksDiv = document.createElement('div');
  policyLinksDiv.classList.add('policy-links', 'footer-policy-css-from-wrapper');
  const policyLinksWrapper = document.createElement('div');
  policyLinksWrapper.classList.add('cmp-policy-links__wrapper');
  const policyLinksContent = document.createElement('div');
  policyLinksContent.classList.add('cmp-policy-links__content');
  policyLinkRows.forEach((row) => {
    // Fixed schema for footer-link-item: label, link
    const [labelCell, linkCell] = [...row.children];
    const label = labelCell.textContent.trim();
    const link = linkCell.querySelector('a');

    const anchor = document.createElement('a');
    anchor.classList.add('cmp-policy-links__item');
    if (link) anchor.href = link.href;
    anchor.setAttribute('tabindex', '0');
    anchor.setAttribute('title', label);
    anchor.textContent = label;
    moveInstrumentation(row, anchor); // Move instrumentation from row to the anchor
    policyLinksContent.append(anchor);
  });
  policyLinksWrapper.append(policyLinksContent);

  // Copyright
  const copyrightText = document.createElement('p');
  copyrightText.classList.add('cmp-policy-links__copyright');
  if (copyrightRow) {
    moveInstrumentation(copyrightRow, copyrightText); // Move instrumentation from copyright row to the paragraph
    copyrightText.textContent = copyrightRow.textContent.trim();
  }
  policyLinksWrapper.append(copyrightText);
  policyLinksDiv.append(policyLinksWrapper);
  bottom.append(policyLinksDiv);
  wrapper.append(bottom);

  block.replaceChildren(wrapper);
}
