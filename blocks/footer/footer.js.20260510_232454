import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.classList.add('sub-menu'); // Add class to the nested ul as per original HTML structure
  rootUl.querySelectorAll('li').forEach((li) => {
    li.classList.add('menu-item'); // Add class to nested li as per original HTML structure
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
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    }
  });
}

export default function decorate(block) {
  const allRows = [...block.children];

  // Destructure root rows based on BlockJson model
  // block.children[0]: field="logo"
  // block.children[1]: field="logoLink"
  // block.children[2]: field="copyright"
  // The remaining rows are item rows for footerLinks, socialLinks, brandLinks
  const logoRow = allRows[0];
  const logoLinkRow = allRows[1];
  const copyrightRow = allRows[2];
  const itemRows = allRows.slice(3);

  // Filter item rows based on cell count and content detection
  const footerLinkRows = itemRows.filter((row) => row.children.length === 3);
  const socialLinkRows = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));
  const brandLinkRows = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture'));

  const footer = document.createElement('footer');
  footer.classList.add('site-footer'); // From ORIGINAL HTML

  const container = document.createElement('div');
  container.classList.add('container'); // From ORIGINAL HTML
  footer.append(container);

  const row = document.createElement('div');
  row.classList.add('row'); // From ORIGINAL HTML
  container.append(row);

  const colLeft = document.createElement('div');
  colLeft.classList.add('col', 'col-left'); // From ORIGINAL HTML
  row.append(colLeft);

  const siteBranding = document.createElement('div');
  siteBranding.classList.add('site-branding'); // From ORIGINAL HTML
  colLeft.append(siteBranding);

  const logoLink = document.createElement('a');
  const logoLinkCell = logoLinkRow.children[0]; // Fixed schema: logoLink is the first cell
  const foundLogoLink = logoLinkCell.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);
  siteBranding.append(logoLink);

  const logoPictureCell = logoRow.children[0]; // Fixed schema: logo is the first cell
  const logoPicture = logoPictureCell.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }

  const colRight = document.createElement('div');
  colRight.classList.add('col', 'col-right'); // From ORIGINAL HTML
  row.append(colRight);

  // Footer Links (Navigation Hierarchy)
  if (footerLinkRows.length > 0) {
    const menuNavFooterContainer = document.createElement('div');
    menuNavFooterContainer.classList.add('menu-nav-footer-container'); // From ORIGINAL HTML
    colRight.append(menuNavFooterContainer);

    const footerMenu = document.createElement('ul');
    footerMenu.classList.add('menu'); // From ORIGINAL HTML
    footerMenu.id = 'footer-menu'; // From ORIGINAL HTML
    menuNavFooterContainer.append(footerMenu);

    footerLinkRows.forEach((rowEl, i) => {
      // Fixed schema for footer-link-item: [label, link, hierarchy-tree]
      const [labelCell, linkCell, hierarchyTreeCell] = [...rowEl.children];
      const li = document.createElement('li');
      // Use classes from ORIGINAL HTML, incrementing the ID
      li.classList.add('menu-item', `menu-item-${828 + i}`);

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
      const subList = tempDiv.querySelector('ul'); // Check for nested ul within the richtext cell
      const directHref = linkCell?.querySelector('a')?.href;

      if (subList) {
        // Dropdown accordion
        const titleLink = document.createElement('a');
        titleLink.href = directHref || 'javascript:void(0)';
        titleLink.textContent = labelCell.textContent.trim();
        li.append(titleLink);

        const subLinksContainer = document.createElement('div');
        subLinksContainer.classList.add('footer-sub-links'); // This class is not in original HTML, but seems to be for JS behavior
        // Move instrumentation from the original cell to the temporary div, then to the subList
        moveInstrumentation(hierarchyTreeCell, tempDiv);
        while (tempDiv.firstChild) subLinksContainer.append(tempDiv.firstChild);
        li.append(subLinksContainer);

        // Apply recursive transformation for nested lists
        transformNestedLists(subList); // subList is now part of subLinksContainer

        // Add event listener for accordion behavior
        titleLink.addEventListener('click', (e) => {
          if (titleLink.href === 'javascript:void(0)' || titleLink.href === window.location.href) {
            e.preventDefault();
            e.stopPropagation();
            li.classList.toggle('active');
            subLinksContainer.classList.toggle('active');
          }
        });
      } else {
        // Simple top-level link
        const anchor = document.createElement('a');
        if (directHref) anchor.href = directHref;
        anchor.textContent = labelCell.textContent.trim();
        li.append(anchor);
      }
      moveInstrumentation(rowEl, li);
      footerMenu.append(li);
    });
  }

  // Social Links
  if (socialLinkRows.length > 0) {
    const socialIcons = document.createElement('ul');
    socialIcons.classList.add('social-icons'); // From ORIGINAL HTML
    colRight.append(socialIcons);

    socialLinkRows.forEach((rowEl) => {
      // Fixed schema for footer-social-item: [socialLink, icon]
      const [socialLinkCell, iconCell] = [...rowEl.children];
      const li = document.createElement('li');
      socialIcons.append(li);

      const socialLink = document.createElement('a');
      const foundSocialLink = socialLinkCell.querySelector('a');
      if (foundSocialLink) {
        socialLink.href = foundSocialLink.href;
        socialLink.target = '_blank';
      }
      moveInstrumentation(socialLinkCell, socialLink);
      li.append(socialLink);

      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
        // Add 'svg' class to the img element inside the optimized picture as per original HTML
        optimizedPic.querySelector('img').classList.add('svg');
        moveInstrumentation(iconCell, optimizedPic.querySelector('img'));
        socialLink.append(optimizedPic);
      }
    });
  }

  // Brand Links
  if (brandLinkRows.length > 0) {
    const menuNavFooterBrandsContainer = document.createElement('div');
    menuNavFooterBrandsContainer.classList.add('menu-nav-footer-brands-container'); // From ORIGINAL HTML
    colRight.append(menuNavFooterBrandsContainer);

    const footerBrandsMenu = document.createElement('ul');
    footerBrandsMenu.classList.add('menu'); // From ORIGINAL HTML
    footerBrandsMenu.id = 'footer-brands-menu'; // From ORIGINAL HTML
    menuNavFooterBrandsContainer.append(footerBrandsMenu);

    brandLinkRows.forEach((rowEl, i) => {
      // Fixed schema for footer-brand-item: [brandLabel, brandLink]
      const [brandLabelCell, brandLinkCell] = [...rowEl.children];
      const li = document.createElement('li');
      // Use classes from ORIGINAL HTML, incrementing the ID
      li.classList.add('menu-item', 'menu-item-type-taxonomy', 'menu-item-object-product-brand', `menu-item-${174 + i}`);
      footerBrandsMenu.append(li);

      const brandLink = document.createElement('a');
      const foundBrandLink = brandLinkCell.querySelector('a');
      if (foundBrandLink) {
        brandLink.href = foundBrandLink.href;
      }
      brandLink.textContent = brandLabelCell.textContent.trim();
      moveInstrumentation(rowEl, brandLink);
      li.append(brandLink);
    });
  }

  // Copyright
  if (copyrightRow) {
    const copyrightDiv = document.createElement('div');
    copyrightDiv.classList.add('copyright'); // From ORIGINAL HTML
    // Read innerHTML from the cell, not the row, to avoid invalid nesting
    const copyrightCell = copyrightRow.children[0];
    copyrightDiv.innerHTML = copyrightCell?.innerHTML || '';
    moveInstrumentation(copyrightRow, copyrightDiv);
    colRight.append(copyrightDiv);
  }

  block.replaceChildren(footer);
}
