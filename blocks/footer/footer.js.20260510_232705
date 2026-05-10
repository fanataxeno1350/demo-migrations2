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
      subWrap.classList.add('has-sub-child'); // This class is not in original HTML, but seems to be for JS functionality
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

  const logoRow = children.find((row) => row.querySelector('picture'));
  const logoLinkRow = children.find(
    (row) => !row.querySelector('picture') && row.querySelector('a'),
  );
  const copyrightRow = children.find(
    (row) =>
      !row.querySelector('picture') &&
      !row.querySelector('a') &&
      row.children.length === 1,
  );

  const itemRows = children.filter(
    (row) =>
      row !== logoRow && row !== logoLinkRow && row !== copyrightRow,
  );

  const footerLinkRows = itemRows.filter((row) => row.children.length === 3);
  const footerSocialRows = itemRows.filter(
    (row) => row.children.length === 2 && row.querySelector('picture'),
  );
  const footerBrandRows = itemRows.filter(
    (row) => row.children.length === 2 && !row.querySelector('picture'),
  );

  const footer = document.createElement('footer');
  footer.id = 'colophon';
  footer.classList.add('site-footer');

  const container = document.createElement('div');
  container.classList.add('container');
  footer.append(container);

  const row = document.createElement('div');
  row.classList.add('row');
  container.append(row);

  // Left Column (Logo)
  const colLeft = document.createElement('div');
  colLeft.classList.add('col', 'col-left');
  row.append(colLeft);

  const siteBranding = document.createElement('div');
  siteBranding.classList.add('site-branding');
  colLeft.append(siteBranding);

  if (logoRow && logoLinkRow) {
    const logoLink = document.createElement('a');
    const foundLogoLink = logoLinkRow.querySelector('a');
    if (foundLogoLink) logoLink.href = foundLogoLink.href;

    const logoPicture = logoRow.querySelector('picture');
    if (logoPicture) {
      const img = logoPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(
          img.src,
          img.alt,
          false,
          [{ width: '750' }],
        );
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        logoLink.append(optimizedPic);
      }
    }
    moveInstrumentation(logoRow, logoLink);
    moveInstrumentation(logoLinkRow, logoLink);
    siteBranding.append(logoLink);
  }

  // Right Column (Navigation, Social, Brands, Copyright)
  const colRight = document.createElement('div');
  colRight.classList.add('col', 'col-right');
  row.append(colRight);

  // Footer Links (Navigation)
  if (footerLinkRows.length > 0) {
    const menuNavFooterContainer = document.createElement('div');
    menuNavFooterContainer.classList.add('menu-nav-footer-container');
    colRight.append(menuNavFooterContainer);

    const footerMenu = document.createElement('ul');
    footerMenu.id = 'footer-menu';
    footerMenu.classList.add('menu');
    menuNavFooterContainer.append(footerMenu);

    footerLinkRows.forEach((linkRow, i) => {
      const [labelCell, linkCell, hierarchyTreeCell] = [...linkRow.children];
      const listItem = document.createElement('li');
      // Original HTML has menu-item-type-post_type_archive, menu-item-object-recipe, etc.
      // These are specific to WordPress and not directly replicable or needed in EDS.
      // Keeping 'menu-item' and a unique ID.
      listItem.classList.add('menu-item', `menu-item-${828 + i}`);

      const subListContainer = document.createElement('div'); // Temporary container for innerHTML
      moveInstrumentation(hierarchyTreeCell, subListContainer); // Move instrumentation from original cell
      subListContainer.innerHTML = hierarchyTreeCell?.innerHTML || '';
      const subList = subListContainer.querySelector('ul'); // Get the actual UL from the richtext

      const directHref = linkCell?.querySelector('a')?.href;
      const labelText = labelCell?.textContent.trim();

      if (subList) {
        // Apply classes to nested elements from original HTML if applicable
        subList.querySelectorAll('li').forEach(li => li.classList.add('menu-item'));
        subList.querySelectorAll('a').forEach(a => {
          // No specific classes for anchors in original HTML, but good to keep in mind
        });

        const titleLink = document.createElement('a');
        titleLink.href = directHref || 'javascript:void(0)'; // If no direct link, make it a toggle
        titleLink.textContent = labelText;
        listItem.append(titleLink);

        const subLinksCvr = document.createElement('div');
        subLinksCvr.classList.add('has-sub-child'); // This class is not in original HTML, but seems to be for JS functionality
        // Move children from the temporary container to the actual subLinksCvr
        while (subListContainer.firstChild) {
          subLinksCvr.append(subListContainer.firstChild);
        }
        listItem.append(subLinksCvr);

        titleLink.addEventListener('click', (e) => {
          if (titleLink.href === 'javascript:void(0)') {
            e.preventDefault();
            listItem.classList.toggle('active');
            subLinksCvr.classList.toggle('active');
          }
        });
        // transformNestedLists expects a UL directly, so pass the extracted subList
        if (subList) {
          transformNestedLists(subList);
        }
      } else {
        const anchor = document.createElement('a');
        if (directHref) anchor.href = directHref;
        anchor.textContent = labelText;
        listItem.append(anchor);
      }
      moveInstrumentation(linkRow, listItem);
      footerMenu.append(listItem);
    });
  }

  // Social Icons
  if (footerSocialRows.length > 0) {
    const socialIcons = document.createElement('ul');
    socialIcons.classList.add('social-icons');
    colRight.append(socialIcons);

    footerSocialRows.forEach((socialRow) => {
      const [socialLinkCell, iconCell] = [...socialRow.children];
      const listItem = document.createElement('li');
      const socialLink = document.createElement('a');
      const foundSocialLink = socialLinkCell.querySelector('a');
      if (foundSocialLink) {
        socialLink.href = foundSocialLink.href;
        socialLink.target = '_blank'; // From original HTML
      }

      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(
            img.src,
            img.alt,
            false,
            [{ width: '750' }],
          );
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          socialLink.append(optimizedPic);
        }
      }
      moveInstrumentation(socialRow, listItem);
      listItem.append(socialLink);
      socialIcons.append(listItem);
    });
  }

  // Footer Brand Links
  if (footerBrandRows.length > 0) {
    const menuNavFooterBrandsContainer = document.createElement('div');
    menuNavFooterBrandsContainer.classList.add('menu-nav-footer-brands-container');
    colRight.append(menuNavFooterBrandsContainer);

    const footerBrandsMenu = document.createElement('ul');
    footerBrandsMenu.id = 'footer-brands-menu';
    footerBrandsMenu.classList.add('menu');
    menuNavFooterBrandsContainer.append(footerBrandsMenu);

    footerBrandRows.forEach((brandRow, i) => {
      const [labelCell, linkCell] = [...brandRow.children];
      const listItem = document.createElement('li');
      // Original HTML has menu-item-type-taxonomy, menu-item-object-product-brand, etc.
      // These are specific to WordPress and not directly replicable or needed in EDS.
      // Keeping 'menu-item' and a unique ID.
      listItem.classList.add('menu-item', `menu-item-${174 + i}`);

      const brandLink = document.createElement('a');
      const foundBrandLink = linkCell.querySelector('a');
      if (foundBrandLink) brandLink.href = foundBrandLink.href;
      brandLink.textContent = labelCell?.textContent.trim();

      moveInstrumentation(brandRow, listItem);
      listItem.append(brandLink);
      footerBrandsMenu.append(listItem);
    });
  }

  // Copyright
  if (copyrightRow) {
    const copyrightDiv = document.createElement('div');
    copyrightDiv.classList.add('copyright');
    moveInstrumentation(copyrightRow, copyrightDiv);
    const [copyrightCell] = [...copyrightRow.children]; // Fixed: Use destructuring for cell access
    copyrightDiv.innerHTML = copyrightCell?.innerHTML || ''; // Fixed: Ensure innerHTML is read from the cell
    colRight.append(copyrightDiv);
  }

  block.replaceChildren(footer);

  // Image optimization
  footer.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
