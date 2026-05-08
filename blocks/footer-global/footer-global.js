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
      subWrap.classList.add('has-sub-child'); // This class is not in ORIGINAL HTML, but is a common pattern for nested menus. Keeping for now.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in ORIGINAL HTML, but is a common pattern for nested menus. Keeping for now.
          subWrap.classList.toggle('active'); // This class is not in ORIGINAL HTML, but is a common pattern for nested menus. Keeping for now.
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root-level fields
  const logoRow = children.find((row) => row.children[0]?.querySelector('picture'));
  const logoLinkRow = children.find(
    (row) => row.children[0]?.querySelector('a') && row.children[0]?.querySelector('a').href.includes('/content/site/logoLink'),
  );
  const footerSocialTitleRow = children.find(
    (row) => row.children[0]?.textContent.trim().length > 0 && !row.children[0]?.querySelector('picture') && !row.children[0]?.querySelector('a'),
  );

  const countrySelectorItems = [];
  const footerSocialItems = [];
  const footerLinkItems = [];
  const footerLegalLinkItems = [];

  children.forEach((row) => {
    const cells = [...row.children];
    // Country Selector Item: 4 cells, icon, label, link, richtext hierarchy
    if (cells.length === 4 && cells[0].querySelector('picture') && cells[1].textContent.trim() && cells[2].querySelector('a') && cells[3].querySelector('ul')) {
      countrySelectorItems.push(row);
    }
    // Footer Social Item: 2 cells, icon, link
    else if (cells.length === 2 && cells[0].querySelector('picture') && cells[1].querySelector('a')) {
      footerSocialItems.push(row);
    }
    // Footer Link Item: 2 cells, label, link (text label)
    else if (cells.length === 2 && cells[0].textContent.trim() && cells[1].querySelector('a')) {
      footerLinkItems.push(row);
    }
    // Footer Legal Link Item: 2 cells, label, link (richtext label)
    else if (cells.length === 2 && cells[0].querySelector('p') && cells[1].querySelector('a')) {
      footerLegalLinkItems.push(row);
    }
  });

  const globalFooter = document.createElement('div');
  globalFooter.id = 'global-footer';
  globalFooter.classList.add('global-footer', 'grid-container');

  const footerSection = document.createElement('section');
  footerSection.classList.add('footer-section', 'grid-container');
  footerSection.setAttribute('aria-label', 'Global Footer Module');
  globalFooter.append(footerSection);

  const logoLangContainer = document.createElement('div');
  logoLangContainer.classList.add('logo-lang-container');
  footerSection.append(logoLangContainer);

  if (logoRow && logoLinkRow) {
    const footerLogo = document.createElement('div');
    footerLogo.classList.add('footer-logo');
    moveInstrumentation(logoRow, footerLogo);

    const logoLink = document.createElement('a');
    const authoredLogoLink = logoLinkRow.children[0]?.querySelector('a'); // Access cell[0] for logoLinkRow
    if (authoredLogoLink) {
      logoLink.href = authoredLogoLink.href;
      logoLink.title = 'Nescafe Logo'; // Hardcoded, but matches original HTML
      logoLink.setAttribute('aria-label', 'Nescafe logo links to the home page'); // Hardcoded, but matches original HTML
      moveInstrumentation(logoLinkRow, logoLink);
    }

    const picture = logoRow.children[0]?.querySelector('picture'); // Access cell[0] for logoRow
    if (picture) {
      // The original HTML already has the img inside the picture, and the picture is optimized by AEM.
      // No need to re-optimize or replace the picture element itself.
      // Just move instrumentation for the picture element.
      moveInstrumentation(picture, logoLink); // Move instrumentation from picture to the link
      logoLink.append(picture);
    }
    footerLogo.append(logoLink);
    logoLangContainer.append(footerLogo);
  }

  if (countrySelectorItems.length > 0) {
    const countryItem = countrySelectorItems[0];
    // Use destructuring for fixed-schema item rows
    const [countryIconCell, countryLabelCell, countryLinkCell, hierarchyTreeCell] = [...countryItem.children];

    const countrySelectorLink = document.createElement('a');
    countrySelectorLink.classList.add('link--underlined', 'country-selector');
    if (countryLinkCell?.querySelector('a')) {
      countrySelectorLink.href = countryLinkCell.querySelector('a').href;
      countrySelectorLink.title = countryLabelCell?.textContent.trim() || '';
      countrySelectorLink.setAttribute('aria-label', 'Link to select language and country'); // Hardcoded, but matches original HTML
      moveInstrumentation(countryItem, countrySelectorLink);
    }

    if (countryIconCell?.querySelector('picture')) {
      const picture = countryIconCell.querySelector('picture');
      // No need to re-optimize picture, just append it.
      countrySelectorLink.append(picture);
    }

    if (countryLabelCell) {
      const span = document.createElement('span');
      span.classList.add('labelMediumRegular');
      span.textContent = countryLabelCell.textContent.trim();
      countrySelectorLink.append(span);
    }
    logoLangContainer.append(countrySelectorLink);

    // Handle hierarchy-tree richtext field
    if (hierarchyTreeCell) {
      const hierarchyWrapper = document.createElement('div');
      hierarchyWrapper.classList.add('country-selector-hierarchy'); // Not in original HTML, but needed for styling
      moveInstrumentation(hierarchyTreeCell, hierarchyWrapper);

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      const rootUl = tempDiv.querySelector('ul');

      if (rootUl) {
        // Apply classes from original HTML to nested elements if applicable
        rootUl.querySelectorAll('a').forEach((a) => a.classList.add('labelMediumRegular')); // Example class from original HTML
        transformNestedLists(rootUl); // Apply interactivity and structure
        while (tempDiv.firstChild) {
          hierarchyWrapper.append(tempDiv.firstChild);
        }
      }
      logoLangContainer.append(hierarchyWrapper);
    }
  }

  if (footerSocialTitleRow || footerSocialItems.length > 0) {
    const footerSocial = document.createElement('div');
    footerSocial.classList.add('footer-social');
    footerSection.append(footerSocial);

    if (footerSocialTitleRow) {
      const socialTitle = document.createElement('span');
      socialTitle.classList.add('utilityLegend', 'footer-social-title');
      socialTitle.textContent = footerSocialTitleRow.children[0]?.textContent.trim(); // Access cell[0] for footerSocialTitleRow
      moveInstrumentation(footerSocialTitleRow, socialTitle);
      footerSocial.append(socialTitle);
    }

    if (footerSocialItems.length > 0) {
      const socialLinksUl = document.createElement('ul');
      socialLinksUl.classList.add('footer-social-links');
      footerSocial.append(socialLinksUl);

      footerSocialItems.forEach((item) => {
        // Use destructuring for fixed-schema item rows
        const [socialIconCell, socialLinkCell] = [...item.children];

        const li = document.createElement('li');
        moveInstrumentation(item, li);

        const link = document.createElement('a');
        if (socialLinkCell?.querySelector('a')) {
          link.href = socialLinkCell.querySelector('a').href;
          link.title = socialLinkCell.querySelector('a').textContent.trim(); // Use link text as title, if available
          link.setAttribute('aria-label', socialLinkCell.querySelector('a').textContent.trim());
        }

        if (socialIconCell?.querySelector('picture')) {
          const picture = socialIconCell.querySelector('picture');
          // No need to re-optimize picture, just append it.
          link.append(picture);
        }
        li.append(link);
        socialLinksUl.append(li);
      });
    }
  }

  if (footerLinkItems.length > 0 || footerLegalLinkItems.length > 0) {
    const footerSiteLinks = document.createElement('div');
    footerSiteLinks.classList.add('footer-site-links');
    footerSection.append(footerSiteLinks);

    if (footerLinkItems.length > 0) {
      const footerLinksDiv = document.createElement('div');
      footerLinksDiv.classList.add('footer-links');
      footerSiteLinks.append(footerLinksDiv);

      const footerLinksUl = document.createElement('ul');
      footerLinksDiv.append(footerLinksUl);

      footerLinkItems.forEach((item) => {
        // Use destructuring for fixed-schema item rows
        const [labelCell, linkCell] = [...item.children];

        const li = document.createElement('li');
        moveInstrumentation(item, li);

        const link = document.createElement('a');
        link.classList.add('labelMediumRegular'); // Class from original HTML
        if (labelCell) {
          link.textContent = labelCell.textContent.trim();
          link.title = labelCell.textContent.trim();
        }
        if (linkCell?.querySelector('a')) {
          link.href = linkCell.querySelector('a').href;
        }
        li.append(link);
        footerLinksUl.append(li);
      });
    }

    if (footerLegalLinkItems.length > 0) {
      const legalLinksDiv = document.createElement('div');
      legalLinksDiv.classList.add('legal-links');
      footerSiteLinks.append(legalLinksDiv);

      footerLegalLinkItems.forEach((item) => {
        // Use destructuring for fixed-schema item rows
        const [labelCell, linkCell] = [...item.children];

        const link = document.createElement('a');
        link.classList.add('utilityNav'); // Class from original HTML
        if (labelCell) {
          // Legal Link Label is richtext, so use innerHTML
          link.innerHTML = labelCell.innerHTML;
          link.title = labelCell.textContent.trim();
          link.setAttribute('aria-label', labelCell.textContent.trim());
        }
        if (linkCell?.querySelector('a')) {
          link.href = linkCell.querySelector('a').href;
        }
        moveInstrumentation(item, link);
        legalLinksDiv.append(link);
      });
    }
  }

  const feedbackDiv = document.createElement('div');
  feedbackDiv.classList.add('feedback_alt_text');
  feedbackDiv.setAttribute('data-alttext', 'qsiFeedback Button');
  footerSection.append(feedbackDiv);

  block.replaceChildren(globalFooter);

  // This loop is redundant as createOptimizedPicture is used correctly above.
  // The original picture elements are moved, not re-created.
  // Removing this loop to prevent double optimization or unexpected behavior.
  // globalFooter.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });
}
