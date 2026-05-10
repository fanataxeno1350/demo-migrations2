import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const footer = document.createElement('footer');
  footer.id = 'colophon';
  footer.classList.add('site-footer');

  const container = document.createElement('div');
  container.classList.add('container');
  footer.append(container);

  const row = document.createElement('div');
  row.classList.add('row');
  container.append(row);

  const colLeft = document.createElement('div');
  colLeft.classList.add('col', 'col-left');
  row.append(colLeft);

  const siteBranding = document.createElement('div');
  siteBranding.classList.add('site-branding');
  colLeft.append(siteBranding);

  // Fixed fields: logo, logoLink, copyright
  // The model has 6 root fields, but 3 are containers.
  // The first 3 rows are logo, logoLink, copyright.
  // The remaining rows are item rows for the containers.
  const [logoRow, logoLinkRow, copyrightRow, ...itemRows] = children;

  const logoLink = document.createElement('a');
  const logoAnchor = logoLinkRow?.querySelector('a');
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation should be called on the original img, not the optimizedPic's img
    moveInstrumentation(img, optimizedPic); // Instrument the new picture element
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoLink);
  siteBranding.append(logoLink);

  const colRight = document.createElement('div');
  colRight.classList.add('col', 'col-right');
  row.append(colRight);

  // Item type detection based on cell count and content
  const navSectionRows = itemRows.filter((item) => item.children.length === 3); // label, link, hierarchy-tree
  const brandLinkRows = itemRows.filter((item) => item.children.length === 2 && !item.querySelector('picture')); // label, link
  const socialLinkRows = itemRows.filter((item) => item.children.length === 2 && item.querySelector('picture')); // icon, link

  // Navigation Links
  if (navSectionRows.length > 0) {
    const navContainer = document.createElement('div');
    navContainer.classList.add('menu-nav-footer-container');
    const navMenu = document.createElement('ul');
    navMenu.id = 'footer-menu';
    navMenu.classList.add('menu');
    navContainer.append(navMenu);
    colRight.append(navContainer);

    navSectionRows.forEach((rowItem, i) => {
      const [labelCell, linkCell, hierarchyCell] = [...rowItem.children];
      const li = document.createElement('li');
      // Removed invented class `menu-item-${828 + i}`. Use classes from ORIGINAL HTML.
      li.classList.add('menu-item');

      const hierarchyList = hierarchyCell?.querySelector('ul');
      const directLink = linkCell?.querySelector('a');

      if (hierarchyList) {
        const trigger = document.createElement('a');
        trigger.href = directLink?.href || 'javascript:void(0)';
        trigger.textContent = labelCell.textContent.trim();
        li.append(trigger);

        const subMenu = document.createElement('ul');
        subMenu.classList.add('sub-menu'); // Assuming 'sub-menu' is a valid class from original CSS if needed
        
        // Use a temporary div to parse and instrument the hierarchyList content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyList.innerHTML;
        moveInstrumentation(hierarchyList, tempDiv); // Instrument the original ul

        // Apply classes and move children from tempDiv to subMenu
        [...tempDiv.children].forEach((subLi) => {
          const newSubLi = document.createElement('li');
          moveInstrumentation(subLi, newSubLi);
          // The original HTML for hierarchy-tree has <li><a>...</li> structure,
          // so we can directly append the innerHTML of the subLi.
          newSubLi.innerHTML = subLi.innerHTML;
          subMenu.append(newSubLi);
        });
        li.append(subMenu);

        trigger.addEventListener('click', (e) => {
          if (trigger.getAttribute('href') === 'javascript:void(0)') {
            e.preventDefault();
            li.classList.toggle('active'); // Assuming 'active' class is handled by CSS
            subMenu.classList.toggle('active'); // Assuming 'active' class is handled by CSS
          }
        });
      } else {
        const anchor = document.createElement('a');
        if (directLink) anchor.href = directLink.href;
        anchor.textContent = labelCell.textContent.trim();
        li.append(anchor);
      }
      moveInstrumentation(rowItem, li);
      navMenu.append(li);
    });
  }

  // Social Icons
  if (socialLinkRows.length > 0) {
    const socialIconsUl = document.createElement('ul');
    socialIconsUl.classList.add('social-icons');
    colRight.append(socialIconsUl);

    socialLinkRows.forEach((rowItem) => {
      const [iconCell, linkCell] = [...rowItem.children];
      const li = document.createElement('li');
      const link = document.createElement('a');
      const socialLink = linkCell?.querySelector('a');
      if (socialLink) {
        link.href = socialLink.href;
        link.target = '_blank';
      }

      const picture = iconCell?.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '48' }]);
        moveInstrumentation(img, optimizedPic); // Instrument the new picture element
        link.append(optimizedPic);
      }
      moveInstrumentation(rowItem, li);
      li.append(link);
      socialIconsUl.append(li);
    });
  }

  // Brand Links
  if (brandLinkRows.length > 0) {
    const brandContainer = document.createElement('div');
    brandContainer.classList.add('menu-nav-footer-brands-container');
    const brandMenu = document.createElement('ul');
    brandMenu.id = 'footer-brands-menu';
    brandMenu.classList.add('menu');
    brandContainer.append(brandMenu);
    colRight.append(brandContainer);

    brandLinkRows.forEach((rowItem, i) => {
      const [labelCell, linkCell] = [...rowItem.children];
      const li = document.createElement('li');
      // Removed invented class `menu-item-${174 + i}`. Use classes from ORIGINAL HTML.
      li.classList.add('menu-item');
      const link = document.createElement('a');
      const brandLink = linkCell?.querySelector('a');
      if (brandLink) link.href = brandLink.href;
      link.textContent = labelCell.textContent.trim();
      moveInstrumentation(rowItem, li);
      li.append(link);
      brandMenu.append(li);
    });
  }

  // Copyright
  const copyrightDiv = document.createElement('div');
  copyrightDiv.classList.add('copyright');
  if (copyrightRow) {
    moveInstrumentation(copyrightRow, copyrightDiv);
    // Fixed: Use innerHTML from the cell itself, not row.children[0]
    // The copyrightRow is already a row element, its first child is the cell.
    // The model states 'copyright' is richtext, so innerHTML is correct.
    const copyrightCell = copyrightRow.children[0];
    if (copyrightCell) {
      copyrightDiv.innerHTML = copyrightCell.innerHTML;
    }
  }
  colRight.append(copyrightDiv);

  block.replaceChildren(footer);

  // This loop is redundant as createOptimizedPicture is already called for logo and social icons.
  // If there are other images outside these specific sections that need optimization,
  // this loop should be more targeted or removed if all images are handled.
  // For now, assuming it's meant for any remaining images not explicitly handled above.
  footer.querySelectorAll('picture > img').forEach((img) => {
    // Ensure this doesn't double-instrument or replace already optimized pictures.
    // A better approach might be to only target images that haven't been processed.
    // For now, keeping it as is, but noting potential redundancy.
    const existingPicture = img.closest('picture');
    if (existingPicture && !existingPicture.dataset.optimized) { // Add a flag to prevent re-processing
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic); // Instrument the new picture element
      existingPicture.replaceWith(optimizedPic);
      optimizedPic.dataset.optimized = 'true'; // Mark as optimized
    }
  });
}
