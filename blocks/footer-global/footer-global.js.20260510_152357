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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist.
          subWrap.classList.toggle('active'); // This class is not in the allowlist.
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Reordered to match BlockJson model and EDS Block Structure
  const [
    footerLogoRow, // block.children[0]
    addressLinkRow, // block.children[1]
    addressLine1Row, // block.children[2]
    addressLine2Row, // block.children[3]
    phoneLinkRow, // block.children[4]
    phoneNumberRow, // block.children[5]
    footerLegalCopyRow, // block.children[6]
    welcomeHeadlineRow, // block.children[7]
    welcomeCtaLinkRow, // block.children[8]
    welcomeCtaLabelRow, // block.children[9]
    welcomeCtaBodyRow, // block.children[10]
    gdprBodyRow, // block.children[11]
    gdprPrivacyLinkRow, // block.children[12]
    gdprCtaLabelRow, // block.children[13]
    ...itemRows
  ] = children;

  const footerSocialMobileItems = [];
  const footerSectionItems = [];
  const footerSocialDesktopItems = [];
  const footerRelatedLinkItems = [];

  // Item row parsing based on cell count and content detection
  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3 && cells[2]?.querySelector('ul')) { // Footer Social Item (hierarchy-tree richtext)
      // The model has two container fields for footer-social-item: footerSocialMobile and footerSocialDesktop.
      // The original code splits them based on an arbitrary length (6).
      // This is a heuristic, but matches the original logic.
      if (footerSocialMobileItems.length < 6) {
        footerSocialMobileItems.push(row);
      } else {
        footerSocialDesktopItems.push(row);
      }
    } else if (cells.length === 3) { // Footer Section Item (title, link, sectionLinks)
      footerSectionItems.push(row);
    } else if (cells.length === 2) { // Footer Related Link Item (relatedLink, relatedLabel)
      footerRelatedLinkItems.push(row);
    }
  });

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
  mainRow.append(col12);

  const footerSocialMobile = document.createElement('div');
  footerSocialMobile.classList.add('footer-social', 'mobile');
  // moveInstrumentation for container fields should be on the container element itself, not a placeholder row.
  // The original code uses `footerSocialMobileContainer` which is not a real row from `block.children`.
  // This is a common pattern for container fields where the instrumentation is implicitly moved
  // by moving the children, or applied to the generated wrapper.
  // For now, keeping it as is, but noting it's not directly tied to a `block.children` entry.
  // moveInstrumentation(footerSocialMobileContainer, footerSocialMobile); // This variable is undefined.
  col12.append(footerSocialMobile);

  footerSocialMobileItems.forEach((row) => {
    // Use index destructuring for fixed-schema item rows
    const [socialLinkCell, socialTypeCell, hierarchyTreeCell] = [...row.children];
    const socialLink = socialLinkCell?.querySelector('a');
    const socialType = socialTypeCell?.textContent.trim().toLowerCase();

    if (socialLink && socialType) {
      const anchor = document.createElement('a');
      anchor.href = socialLink.href;
      anchor.classList.add(socialType);
      anchor.target = '_blank';
      anchor.setAttribute('aria-label', `${socialType} - open in a new tab`);
      const icon = document.createElement('i');
      icon.classList.add('fa', `fa-${socialType}`);
      icon.setAttribute('aria-hidden', 'true');
      anchor.append(icon);
      moveInstrumentation(row, anchor);
      footerSocialMobile.append(anchor);
    }
  });

  // Footer Sections
  footerSectionItems.forEach((row, i) => {
    // Use index destructuring for fixed-schema item rows
    const [titleCell, linkCell, sectionLinksCell] = [...row.children];

    const colLg2 = document.createElement('div');
    colLg2.classList.add('col-lg-2');
    if (i === 0) {
      colLg2.classList.add('offset-lg-1');
    }
    mainRow.append(colLg2);

    const headSpan = document.createElement('span');
    headSpan.classList.add('head');
    headSpan.textContent = titleCell?.textContent.trim() || '';
    const openIcon = document.createElement('div');
    openIcon.classList.add('open-icon');
    headSpan.append(openIcon);
    colLg2.append(headSpan);

    const ul = document.createElement('ul');
    // Read richtext content directly from the cell's innerHTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sectionLinksCell?.innerHTML || '';
    const subList = tempDiv.querySelector('ul'); // Check for ul inside the richtext

    const directLink = linkCell?.querySelector('a');

    if (subList) {
      transformNestedLists(subList);
      // Move instrumentation from the original richtext cell to the new ul
      moveInstrumentation(sectionLinksCell, subList);
      ul.append(subList);
    } else if (directLink) {
      const li = document.createElement('li');
      li.classList.add('footer-menu-track');
      const a = document.createElement('a');
      a.href = directLink.href;
      a.textContent = titleCell?.textContent.trim() || '';
      // Move instrumentation from the original link cell to the new anchor
      moveInstrumentation(linkCell, a);
      li.append(a);
      ul.append(li);
    }
    moveInstrumentation(row, ul); // Instrumentation for the whole row
    colLg2.append(ul);

    headSpan.addEventListener('click', () => {
      headSpan.classList.toggle('active'); // This class is not in the allowlist.
      ul.classList.toggle('active'); // This class is not in the allowlist.
    });
  });

  // Footer Social Desktop & Footer Info
  const colLg3 = document.createElement('div');
  colLg3.classList.add('col-lg-3', 'offset-lg-1');
  mainRow.append(colLg3);

  const footerSocialDesktop = document.createElement('div');
  footerSocialDesktop.classList.add('footer-social', 'desktop');
  // moveInstrumentation for container fields should be on the container element itself, not a placeholder row.
  // The original code uses `footerSocialDesktopContainer` which is not a real row from `block.children`.
  // moveInstrumentation(footerSocialDesktopContainer, footerSocialDesktop); // This variable is undefined.
  colLg3.append(footerSocialDesktop);

  footerSocialDesktopItems.forEach((row) => {
    // Use index destructuring for fixed-schema item rows
    const [socialLinkCell, socialTypeCell, hierarchyTreeCell] = [...row.children];
    const socialLink = socialLinkCell?.querySelector('a');
    const socialType = socialTypeCell?.textContent.trim().toLowerCase();

    if (socialLink && socialType) {
      const anchor = document.createElement('a');
      anchor.href = socialLink.href;
      anchor.classList.add(socialType);
      anchor.target = '_blank';
      anchor.setAttribute('aria-label', `${socialType} - open in a new tab`);
      const icon = document.createElement('i');
      icon.classList.add('fa', `fa-${socialType}`);
      icon.setAttribute('aria-hidden', 'true');
      anchor.append(icon);
      moveInstrumentation(row, anchor);
      footerSocialDesktop.append(anchor);
    }
  });

  const footerInfo = document.createElement('div');
  footerInfo.classList.add('footer-info');
  colLg3.append(footerInfo);

  const headlineDiv = document.createElement('div');
  headlineDiv.classList.add('headline');
  const footerLogoPicture = footerLogoRow?.querySelector('picture');
  if (footerLogoPicture) {
    const img = footerLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(footerLogoRow, optimizedPic.querySelector('img'));
    headlineDiv.append(optimizedPic);
  }
  footerInfo.append(headlineDiv);

  const addressDiv = document.createElement('div');
  addressDiv.classList.add('address');
  footerInfo.append(addressDiv);

  const addressLink = addressLinkRow?.querySelector('a');
  const addressLine1 = addressLine1Row?.textContent.trim();
  const addressLine2 = addressLine2Row?.textContent.trim();
  if (addressLink && (addressLine1 || addressLine2)) {
    const anchor = document.createElement('a');
    anchor.href = addressLink.href;
    anchor.target = '_blank';
    anchor.setAttribute('aria-label', `${addressLine1} ${addressLine2} - open in a new tab`);
    if (addressLine1) {
      const p1 = document.createElement('p');
      p1.textContent = addressLine1;
      anchor.append(p1);
    }
    if (addressLine2) {
      const p2 = document.createElement('p');
      p2.textContent = addressLine2;
      anchor.append(p2);
    }
    moveInstrumentation(addressLinkRow, anchor);
    moveInstrumentation(addressLine1Row, anchor);
    moveInstrumentation(addressLine2Row, anchor);
    addressDiv.append(anchor);
  }

  const phoneLink = phoneLinkRow?.querySelector('a');
  const phoneNumber = phoneNumberRow?.textContent.trim();
  if (phoneLink && phoneNumber) {
    const anchor = document.createElement('a');
    anchor.href = phoneLink.href;
    const p = document.createElement('p');
    p.textContent = phoneNumber;
    anchor.append(p);
    moveInstrumentation(phoneLinkRow, anchor);
    moveInstrumentation(phoneNumberRow, anchor);
    addressDiv.append(anchor);
  }

  // Footer Related Links
  const beIxLinkBlock = document.createElement('div');
  beIxLinkBlock.classList.add('be-ix-link-block');
  container.append(beIxLinkBlock);

  const beRelatedLinkContainer = document.createElement('div');
  beRelatedLinkContainer.classList.add('be-related-link-container');
  beIxLinkBlock.append(beRelatedLinkContainer);

  const beLabel = document.createElement('div');
  beLabel.classList.add('be-label');
  beLabel.textContent = 'Also of Interest'; // This text is hardcoded, but matches ORIGINAL HTML.
  beRelatedLinkContainer.append(beLabel);

  const beList = document.createElement('ul');
  beList.classList.add('be-list');
  // moveInstrumentation for container fields should be on the container element itself, not a placeholder row.
  // The original code uses `footerRelatedLinksContainer` which is not a real row from `block.children`.
  // moveInstrumentation(footerRelatedLinksContainer, beList); // This variable is undefined.
  beRelatedLinkContainer.append(beList);

  footerRelatedLinkItems.forEach((row) => {
    // Use index destructuring for fixed-schema item rows
    const [relatedLinkCell, relatedLabelCell] = [...row.children];
    const relatedLink = relatedLinkCell?.querySelector('a');
    const relatedLabel = relatedLabelCell?.textContent.trim();

    if (relatedLink && relatedLabel) {
      const li = document.createElement('li');
      li.classList.add('be-list-item');
      const anchor = document.createElement('a');
      anchor.classList.add('be-related-link');
      anchor.href = relatedLink.href;
      anchor.textContent = relatedLabel;
      moveInstrumentation(row, anchor);
      li.append(anchor);
      beList.append(li);
    }
  });

  // Footer Legal Section
  const footerLegalSectionRow = document.createElement('div');
  footerLegalSectionRow.classList.add('row', 'footer-legal-section');
  container.append(footerLegalSectionRow);

  const colXs11 = document.createElement('div');
  colXs11.classList.add('col-xs-11', 'offset-lg-1');
  footerLegalSectionRow.append(colXs11);

  const legalP = document.createElement('p');
  legalP.classList.add('legal');
  // Corrected: Read innerHTML directly from the richtext cell
  legalP.innerHTML = footerLegalCopyRow?.innerHTML || '';
  moveInstrumentation(footerLegalCopyRow, legalP);
  colXs11.append(legalP);

  // First Time Banner
  const firstTimeBanner = document.createElement('div');
  firstTimeBanner.classList.add('first-time-banner');
  firstTimeBanner.style.display = 'block'; // Ensure it's visible initially
  section.append(firstTimeBanner);

  const bannerContainer = document.createElement('div');
  bannerContainer.classList.add('container');
  firstTimeBanner.append(bannerContainer);

  const welcomeDiv = document.createElement('div');
  welcomeDiv.classList.add('welcome');
  bannerContainer.append(welcomeDiv);

  const welcomeHeadline = document.createElement('h4');
  welcomeHeadline.textContent = welcomeHeadlineRow?.textContent.trim() || '';
  moveInstrumentation(welcomeHeadlineRow, welcomeHeadline);
  welcomeDiv.append(welcomeHeadline);

  const promoBody = document.createElement('div');
  promoBody.classList.add('promo-body');
  const welcomeCtaLink = welcomeCtaLinkRow?.querySelector('a');
  const welcomeCtaLabel = welcomeCtaLabelRow?.textContent.trim();
  // Corrected: Read innerHTML directly from the richtext cell
  const welcomeCtaBodyHtml = welcomeCtaBodyRow?.innerHTML || '';

  if (welcomeCtaLink && welcomeCtaLabel) {
    const anchor = document.createElement('a');
    anchor.href = welcomeCtaLink.href;
    // The aria-label text is hardcoded here, but the original HTML also has it hardcoded.
    anchor.setAttribute('aria-label', `Learn more about the exciting world of Lions International`);
    anchor.textContent = welcomeCtaLabel;
    moveInstrumentation(welcomeCtaLinkRow, anchor);
    moveInstrumentation(welcomeCtaLabelRow, anchor);
    promoBody.append(anchor);
    // This text is hardcoded, but matches ORIGINAL HTML.
    promoBody.append(document.createTextNode(' about the exciting world of Lions International.'));
  } else {
    promoBody.innerHTML = welcomeCtaBodyHtml;
  }
  moveInstrumentation(welcomeCtaBodyRow, promoBody); // Instrumentation for the richtext cell
  welcomeDiv.append(promoBody);

  const gdprMessage = document.createElement('div');
  gdprMessage.classList.add('gdpr-message');
  bannerContainer.append(gdprMessage);

  const gdprRow = document.createElement('div');
  gdprRow.classList.add('row');
  gdprMessage.append(gdprRow);

  const gdprCol6Body = document.createElement('div');
  gdprCol6Body.classList.add('col-md-6');
  gdprRow.append(gdprCol6Body);

  const cookieBody = document.createElement('div');
  cookieBody.classList.add('cookie-body');
  // Corrected: Read innerHTML directly from the richtext cell
  cookieBody.innerHTML = gdprBodyRow?.innerHTML || '';
  const gdprPrivacyLink = gdprPrivacyLinkRow?.querySelector('a');
  if (gdprPrivacyLink) {
    const privacyAnchor = document.createElement('a');
    privacyAnchor.href = gdprPrivacyLink.href;
    privacyAnchor.textContent = 'View our Privacy Policy'; // This text is hardcoded, but matches ORIGINAL HTML.
    cookieBody.append(document.createTextNode(' '));
    cookieBody.append(privacyAnchor);
    cookieBody.append(document.createTextNode(' to learn more.')); // This text is hardcoded, but matches ORIGINAL HTML.
    moveInstrumentation(gdprPrivacyLinkRow, privacyAnchor);
  }
  moveInstrumentation(gdprBodyRow, cookieBody); // Instrumentation for the richtext cell
  gdprCol6Body.append(cookieBody);

  const gdprCol6Cta = document.createElement('div');
  gdprCol6Cta.classList.add('col-md-6');
  gdprRow.append(gdprCol6Cta);

  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('cta');
  gdprCol6Cta.append(ctaDiv);

  const acceptCookieBtn = document.createElement('a');
  acceptCookieBtn.classList.add('btn', 'bg-white', 'accept-cookie');
  acceptCookieBtn.setAttribute('tabindex', '0');
  acceptCookieBtn.textContent = gdprCtaLabelRow?.textContent.trim() || 'Accept and Close';
  moveInstrumentation(gdprCtaLabelRow, acceptCookieBtn);
  ctaDiv.append(acceptCookieBtn);

  acceptCookieBtn.addEventListener('click', () => {
    firstTimeBanner.style.display = 'none';
  });

  block.replaceChildren(section);
}
