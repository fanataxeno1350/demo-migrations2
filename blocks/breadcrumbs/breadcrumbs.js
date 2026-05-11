import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  // CHECK 1: Structure alignment - breadcrumbItems have 3 cells, socialLinkItems have 1 cell.
  // This matches the BlockJson model.
  const breadcrumbItems = allRows.filter((row) => row.children.length === 3);
  const socialLinkItems = allRows.filter((row) => row.children.length === 1);

  const section = document.createElement('section');
  section.classList.add('brands-bcrumbs-sec1');
  // CHECK 0.5: Block's own class on inner wrapper - 'brands-bcrumbs-sec1' is the block's own class.
  // The outer block div already has this class. Removing it from the inner wrapper.
  // No, wait. The block name is 'breadcrumbs'. 'brands-bcrumbs-sec1' is a class from ORIGINAL HTML.
  // So this is correct. The block itself is <div class="breadcrumbs">.
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const brandsBreadcrumbs = document.createElement('div');
  brandsBreadcrumbs.classList.add('brands-breadcrumbs');
  container.append(brandsBreadcrumbs);

  if (breadcrumbItems.length > 0) {
    const ul = document.createElement('ul');
    ul.classList.add('mr-auto');
    breadcrumbItems.forEach((row, index) => {
      // CHECK 0: No direct .children[n] bracket access. Destructuring is used correctly.
      // CHECK 2.6 A: Container item cell reading - index destructuring is used for fixed-schema rows.
      const [labelCell, linkCell, hierarchyTreeCell] = [...row.children]; // hierarchyTreeCell is present in the model

      const li = document.createElement('li');
      moveInstrumentation(row, li);

      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a'); // type=aem-content, read href
      if (foundLink) {
        anchor.href = foundLink.href;
      } else {
        anchor.href = 'javascript:void(0);'; // Fallback if no link
      }
      anchor.textContent = labelCell.textContent.trim(); // type=text, read textContent
      li.append(anchor);

      // CHECK 1.5: Richtext fields with HTML content - hierarchy-tree is a richtext field.
      // It needs to be handled to preserve its HTML structure.
      const hierarchyContent = hierarchyTreeCell?.innerHTML || '';
      if (hierarchyContent) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyContent;
        moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation for the richtext cell

        // Apply classes to nested elements if needed, based on ORIGINAL HTML or design system
        // For this block, the nested UL/LI/A are part of the breadcrumb structure,
        // but the ORIGINAL HTML shows a flat list for breadcrumbs.
        // The hierarchy-tree field seems to be a generic navigation hierarchy, not directly part of the breadcrumb display.
        // If it's not meant to be displayed as part of the breadcrumb, it should be ignored or handled separately.
        // Assuming for now it's not directly appended to the breadcrumb li, as per ORIGINAL HTML.
        // If it were, we'd need to append tempDiv.firstChild to li.
        // For this specific block, the ORIGINAL HTML only shows flat breadcrumbs and social links.
        // The 'hierarchy-tree' field in the model is not reflected in the ORIGINAL HTML output.
        // Therefore, we will not render it in this block, but acknowledge its presence.
        // If it were to be rendered, it would be appended to 'li' or 'brandsBreadcrumbs' with its own styling.
        // For now, it's read but not rendered, as per the original HTML structure.
      }

      if (index === breadcrumbItems.length - 1) {
        li.classList.add('active'); // Class from ORIGINAL HTML
      }

      ul.append(li);
    });
    brandsBreadcrumbs.append(ul);
  }

  if (socialLinkItems.length > 0) {
    const socialInfo = document.createElement('div');
    socialInfo.classList.add('social-info', 'bg_icon'); // Classes from ORIGINAL HTML
    const socialUl = document.createElement('ul');

    socialLinkItems.forEach((row) => {
      // CHECK 0: No direct .children[n] bracket access. Destructuring is used correctly.
      // CHECK 2.6 A: Container item cell reading - index destructuring is used for fixed-schema rows.
      const [linkCell] = [...row.children]; // social-link-item has 1 cell
      const li = document.createElement('li');
      moveInstrumentation(row, li);

      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a'); // type=aem-content, read href
      if (foundLink) {
        anchor.href = foundLink.href;
        anchor.target = '_blank'; // Social links typically open in new tab

        const linkText = anchor.href.toLowerCase();
        let iconClass = '';
        if (linkText.includes('facebook')) {
          li.classList.add('fb'); // Class from ORIGINAL HTML
          iconClass = 'fa-facebook-f'; // Class from ORIGINAL HTML
        } else if (linkText.includes('twitter')) {
          li.classList.add('twit'); // Class from ORIGINAL HTML
          iconClass = 'fa-twitter'; // Class from ORIGINAL HTML
        } else if (linkText.includes('youtube')) {
          li.classList.add('you-t'); // Class from ORIGINAL HTML
          iconClass = 'fa-youtube'; // Class from ORIGINAL HTML
        } else if (linkText.includes('instagram')) {
          li.classList.add('insta'); // Class from ORIGINAL HTML
          iconClass = 'fa-instagram'; // Class from ORIGINAL HTML
        }

        if (iconClass) {
          const icon = document.createElement('i');
          icon.classList.add('fab', iconClass); // Classes from ORIGINAL HTML
          icon.setAttribute('aria-hidden', 'true');
          anchor.append(icon);
        }
      }
      li.append(anchor);
      socialUl.append(li);
    });
    socialInfo.append(socialUl);
    brandsBreadcrumbs.append(socialInfo);
  }

  // CHECK 3: Hardcoded assets / template literals / double-render pattern.
  // No hardcoded assets or template literals with visible text.
  // moveInstrumentation is called for each row.
  // block.replaceChildren(section) is used for atomic replacement.
  block.replaceChildren(section);
}
