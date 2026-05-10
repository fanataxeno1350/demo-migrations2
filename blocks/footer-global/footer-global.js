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
      subWrap.classList.add('has-sub-child'); // This class is not in ORIGINAL HTML, but seems to be for JS functionality
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in ORIGINAL HTML, but seems to be for JS functionality
          subWrap.classList.toggle('active'); // This class is not in ORIGINAL HTML, but seems to be for JS functionality
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields based on BlockJson model and EDS Block Structure
  // block.children[0]: field="footerLogo"
  // block.children[1]: field="legal"
  // block.children[2]: field="welcomeHeadline"
  // block.children[3]: field="promoBody"
  // block.children[4]: field="cookieBody"
  // block.children[5]: field="acceptCookieLabel"
  // The remaining children are item rows for various containers.

  const footerLogoRow = children[0];
  const legalTextRow = children[1];
  const welcomeHeadlineRow = children[2];
  const promoBodyRow = children[3];
  const cookieBodyRow = children[4];
  const acceptCookieLabelRow = children[5];

  // Item rows start from index 6
  const itemRows = children.slice(6);

  // Filter item rows based on their structure (cell count and content)
  const footerSocialMobileItems = itemRows.filter(
    (row) => row.children.length === 3 && row.querySelector('ul'), // Social items have 3 cells and a hierarchy-tree (ul)
  );
  const footerSocialDesktopItems = itemRows.filter(
    (row) => row.children.length === 3 && row.querySelector('ul'), // Social items have 3 cells and a hierarchy-tree (ul)
  );
  const footerSectionItems = itemRows.filter(
    (row) => row.children.length === 3 && !row.querySelector('ul'), // Section items have 3 cells but NO hierarchy-tree (ul)
  );
  const footerAddressItems = itemRows.filter(
    (row) => row.children.length === 5, // Address items have 5 cells
  );
  const beRelatedLinkItems = itemRows.filter(
    (row) => row.children.length === 2 && row.querySelector('a'), // Related links have 2 cells and a link
  );
  // footerLinkItems is not explicitly defined in the BlockJson as a top-level container,
  // but it's present in the original filtering logic. Based on the BlockJson,
  // all item rows are accounted for by the above filters.
  // Removing the unused footerLinkItems filter.

  const section = document.createElement('section');
  section.classList.add('component-global-footer', 'notranslate');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const mainRow = document.createElement('div');
  mainRow.classList.add('row');
  container.append(mainRow);

  // Footer Social Mobile
  const col12 = document.createElement('div');
  col12.classList.add('col-12');
  // No direct container row for footerSocialMobile, so instrumentation is moved from the first item
  // moveInstrumentation(footerSocialMobileContainer, col12); // This variable is no longer a root row
  mainRow.append(col12);

  const footerSocialMobile = document.createElement('div');
  footerSocialMobile.classList.add('footer-social', 'mobile');
  col12.append(footerSocialMobile);

  footerSocialMobileItems.forEach((row) => {
    const [linkCell, platformCell, hierarchyTreeCell] = [...row.children]; // Destructuring for fixed schema

    const linkEl = document.createElement('a');
    if (linkCell?.querySelector('a')) {
      linkEl.href = linkCell.querySelector('a').href;
      linkEl.target = '_blank';
      linkEl.setAttribute('aria-label', `${platformCell.textContent.trim()} - open in a new tab`);
      linkEl.classList.add(platformCell.textContent.trim().toLowerCase());
      const icon = document.createElement('i');
      icon.classList.add('fa', `fa-${platformCell.textContent.trim().toLowerCase()}`);
      icon.setAttribute('aria-hidden', 'true');
      linkEl.append(icon);
    }
    moveInstrumentation(row, linkEl);
    footerSocialMobile.append(linkEl);
  });

  // Footer Sections
  const footerSectionsWrapper = document.createElement('div');
  footerSectionsWrapper.classList.add('footer-sections-wrapper'); // Custom wrapper for sections
  mainRow.append(footerSectionsWrapper);

  footerSectionItems.forEach((row, index) => {
    const [titleCell, linkCell, sectionLinksCell] = [...row.children]; // Destructuring for fixed schema

    const colLg2 = document.createElement('div');
    colLg2.classList.add('col-lg-2');
    if (index === 0) {
      colLg2.classList.add('offset-lg-1');
    }
    moveInstrumentation(row, colLg2);
    footerSectionsWrapper.append(colLg2);

    const headSpan = document.createElement('span');
    headSpan.classList.add('head');
    headSpan.textContent = titleCell.textContent.trim();
    const openIcon = document.createElement('div');
    openIcon.classList.add('open-icon');
    headSpan.append(openIcon);
    colLg2.append(headSpan);

    const ul = document.createElement('ul');
    const subList = sectionLinksCell?.querySelector('ul'); // Check for UL inside richtext cell
    const directHref = linkCell?.querySelector('a')?.href; // Get href from aem-content cell

    if (subList) {
      // Create a temporary div to hold the content and apply instrumentation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sectionLinksCell.innerHTML;
      moveInstrumentation(sectionLinksCell, tempDiv); // Move instrumentation from the original cell
      const tempSubList = tempDiv.querySelector('ul'); // Get the UL from the temporary div

      if (tempSubList) {
        transformNestedLists(tempSubList);
        [...tempSubList.children].forEach((li) => {
          li.classList.add('footer-menu-track');
          ul.append(li);
        });
      }
    } else if (directHref) {
      const li = document.createElement('li');
      li.classList.add('footer-menu-track');
      const anchor = document.createElement('a');
      anchor.href = directHref;
      anchor.textContent = titleCell.textContent.trim();
      li.append(anchor);
      ul.append(li);
    }
    colLg2.append(ul);

    headSpan.addEventListener('click', () => {
      colLg2.classList.toggle('active'); // This class is not in ORIGINAL HTML, but seems to be for JS functionality
      ul.classList.toggle('active'); // This class is not in ORIGINAL HTML, but seems to be for JS functionality
    });
  });

  // Footer Social Desktop
  const colLg3 = document.createElement('div');
  colLg3.classList.add('col-lg-3', 'offset-lg-1');
  // No direct container row for footerSocialDesktop, so instrumentation is moved from the first item
  // moveInstrumentation(footerSocialDesktopContainer, colLg3); // This variable is no longer a root row
  mainRow.append(colLg3);

  const footerSocialDesktop = document.createElement('div');
  footerSocialDesktop.classList.add('footer-social', 'desktop');
  colLg3.append(footerSocialDesktop);

  footerSocialDesktopItems.forEach((row) => {
    const [linkCell, platformCell, hierarchyTreeCell] = [...row.children]; // Destructuring for fixed schema

    const linkEl = document.createElement('a');
    if (linkCell?.querySelector('a')) {
      linkEl.href = linkCell.querySelector('a').href;
      linkEl.target = '_blank';
      linkEl.setAttribute('aria-label', `${platformCell.textContent.trim()} - open in a new tab`);
      linkEl.classList.add(platformCell.textContent.trim().toLowerCase());
      const icon = document.createElement('i');
      icon.classList.add('fa', `fa-${platformCell.textContent.trim().toLowerCase()}`);
      icon.setAttribute('aria-hidden', 'true');
      linkEl.append(icon);
    }
    moveInstrumentation(row, linkEl);
    footerSocialDesktop.append(linkEl);
  });

  // Footer Info (Logo and Address)
  const footerInfo = document.createElement('div');
  footerInfo.classList.add('footer-info');
  colLg3.append(footerInfo);

  const headlineDiv = document.createElement('div');
  headlineDiv.classList.add('headline');
  const logoPicture = footerLogoRow.querySelector('picture');
  if (logoPicture) {
    const optimizedPic = createOptimizedPicture(logoPicture.querySelector('img').src, logoPicture.querySelector('img').alt, false, [{ width: '750' }]);
    moveInstrumentation(footerLogoRow, optimizedPic.querySelector('img'));
    headlineDiv.append(optimizedPic);
  } else {
    moveInstrumentation(footerLogoRow, headlineDiv);
  }
  footerInfo.append(headlineDiv);

  const addressDiv = document.createElement('div');
  addressDiv.classList.add('address');
  // No direct container row for footerAddresses, so instrumentation is moved from the first item
  // moveInstrumentation(footerAddressesContainer, addressDiv); // This variable is no longer a root row

  footerAddressItems.forEach((row) => {
    const [addressLinkCell, addressLine1Cell, addressLine2Cell, phoneLinkCell, phoneNumberCell] = [...row.children]; // Destructuring for fixed schema

    const addressLink = document.createElement('a');
    if (addressLinkCell?.querySelector('a')) {
      addressLink.href = addressLinkCell.querySelector('a').href;
      addressLink.target = '_blank';
      addressLink.setAttribute('aria-label', `${addressLine1Cell.textContent.trim()} ${addressLine2Cell.textContent.trim()} - open in a new tab`);
    }
    const p1 = document.createElement('p');
    p1.textContent = addressLine1Cell.textContent.trim();
    addressLink.append(p1);
    const p2 = document.createElement('p');
    p2.textContent = addressLine2Cell.textContent.trim();
    addressLink.append(p2);
    addressDiv.append(addressLink);

    const phoneLink = document.createElement('a');
    if (phoneLinkCell?.querySelector('a')) {
      phoneLink.href = phoneLinkCell.querySelector('a').href;
    }
    const p3 = document.createElement('p');
    p3.textContent = phoneNumberCell.textContent.trim();
    phoneLink.append(p3);
    addressDiv.append(phoneLink);
    moveInstrumentation(row, addressDiv.lastElementChild); // Move instrumentation to the last appended element
  });
  footerInfo.append(addressDiv);

  // Also of Interest Links
  const beIxLinkBlock = document.createElement('div');
  beIxLinkBlock.classList.add('be-ix-link-block');
  // No direct container row for beRelatedLinks, so instrumentation is moved from the first item
  // moveInstrumentation(beRelatedLinksContainer, beIxLinkBlock); // This variable is no longer a root row
  container.append(beIxLinkBlock);

  const beRelatedLinkContainer = document.createElement('div');
  beRelatedLinkContainer.classList.add('be-related-link-container');
  beIxLinkBlock.append(beRelatedLinkContainer);

  const beLabel = document.createElement('div');
  beLabel.classList.add('be-label');
  beLabel.textContent = 'Also of Interest'; // This is hardcoded, but it's a label, not content from AEM.
  beRelatedLinkContainer.append(beLabel);

  const beList = document.createElement('ul');
  beList.classList.add('be-list');
  beRelatedLinkContainer.append(beList);

  beRelatedLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema

    const li = document.createElement('li');
    li.classList.add('be-list-item');
    const link = document.createElement('a');
    link.classList.add('be-related-link');
    if (linkCell?.querySelector('a')) link.href = linkCell.querySelector('a').href;
    link.textContent = labelCell.textContent.trim();
    li.append(link);
    moveInstrumentation(row, li);
    beList.append(li);
  });

  // Footer Legal Section
  const footerLegalSection = document.createElement('div');
  footerLegalSection.classList.add('row', 'footer-legal-section');
  container.append(footerLegalSection);

  const colXs11 = document.createElement('div');
  colXs11.classList.add('col-xs-11', 'offset-lg-1');
  moveInstrumentation(legalTextRow, colXs11);
  footerLegalSection.append(colXs11);

  const legalP = document.createElement('p');
  legalP.classList.add('legal');
  // Richtext cell, read innerHTML directly
  legalP.innerHTML = legalTextRow.children[0]?.innerHTML || '';
  colXs11.append(legalP);

  // First Time Banner
  const firstTimeBanner = document.createElement('div');
  firstTimeBanner.classList.add('first-time-banner');
  firstTimeBanner.style.display = 'block';
  section.append(firstTimeBanner);

  const bannerContainer = document.createElement('div');
  bannerContainer.classList.add('container');
  firstTimeBanner.append(bannerContainer);

  const welcomeDiv = document.createElement('div');
  welcomeDiv.classList.add('welcome');
  bannerContainer.append(welcomeDiv);

  const welcomeH4 = document.createElement('h4');
  moveInstrumentation(welcomeHeadlineRow, welcomeH4);
  welcomeH4.textContent = welcomeHeadlineRow.children[0].textContent.trim();
  welcomeDiv.append(welcomeH4);

  const promoBodyDiv = document.createElement('div');
  promoBodyDiv.classList.add('promo-body');
  moveInstrumentation(promoBodyRow, promoBodyDiv);
  // Richtext cell, read innerHTML directly
  promoBodyDiv.innerHTML = promoBodyRow.children[0]?.innerHTML || '';
  welcomeDiv.append(promoBodyDiv);

  const gdprMessage = document.createElement('div');
  gdprMessage.classList.add('gdpr-message');
  bannerContainer.append(gdprMessage);

  const gdprRow = document.createElement('div');
  gdprRow.classList.add('row');
  gdprMessage.append(gdprRow);

  const colMd6Cookie = document.createElement('div');
  colMd6Cookie.classList.add('col-md-6');
  gdprRow.append(colMd6Cookie);

  const cookieBodyDiv = document.createElement('div');
  cookieBodyDiv.classList.add('cookie-body');
  moveInstrumentation(cookieBodyRow, cookieBodyDiv);
  // Richtext cell, read innerHTML directly
  cookieBodyDiv.innerHTML = cookieBodyRow.children[0]?.innerHTML || '';
  colMd6Cookie.append(cookieBodyDiv);

  const colMd6Cta = document.createElement('div');
  colMd6Cta.classList.add('col-md-6');
  gdprRow.append(colMd6Cta);

  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('cta');
  colMd6Cta.append(ctaDiv);

  const acceptCookieBtn = document.createElement('a');
  acceptCookieBtn.classList.add('btn', 'bg-white', 'accept-cookie');
  moveInstrumentation(acceptCookieLabelRow, acceptCookieBtn);
  acceptCookieBtn.textContent = acceptCookieLabelRow.children[0].textContent.trim();
  acceptCookieBtn.tabIndex = 0;
  ctaDiv.append(acceptCookieBtn);

  acceptCookieBtn.addEventListener('click', () => {
    firstTimeBanner.style.display = 'none';
  });

  block.replaceChildren(section);
}
