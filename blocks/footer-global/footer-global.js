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
      subWrap.classList.add('has-sub-child');
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

  // Fixed fields and container placeholders - reordered to match BlockJson and EDS Block Structure
  const [
    footerSocialMobileContainer, // container field "footerSocialMobile"
    footerSectionsContainer,     // container field "footerSections"
    footerSocialDesktopContainer,// container field "footerSocialDesktop"
    footerLogo,                  // field="footerLogo"
    footerAddressItemsContainer, // container field "footerAddressItems"
    footerRelatedLinksContainer, // container field "footerRelatedLinks"
    footerLegalRow,              // field="footerLegal"
    firstTimeBannerHeadlineRow,  // field="firstTimeBannerHeadline"
    firstTimeBannerBodyRow,      // field="firstTimeBannerBody"
    firstTimeBannerCtaLinkRow,   // field="firstTimeBannerCtaLink"
    firstTimeBannerCtaLabelRow,  // field="firstTimeBannerCtaLabel"
    gdprMessageRow,              // field="gdprMessage"
    acceptCookieLabelRow,        // field="acceptCookieLabel"
    privacyPolicyLinkRow,        // field="privacyPolicyLink"
    ...itemRows
  ] = children;

  const root = document.createElement('section');
  root.classList.add('component-global-footer', 'notranslate');

  const container = document.createElement('div');
  container.classList.add('container');
  root.append(container);

  const mainRow = document.createElement('div');
  mainRow.classList.add('row');
  container.append(mainRow);

  // --- Mobile Social Links ---
  const mobileSocialCol = document.createElement('div');
  mobileSocialCol.classList.add('col-12');
  mainRow.append(mobileSocialCol);

  const footerSocialMobile = document.createElement('div');
  footerSocialMobile.classList.add('footer-social', 'mobile');
  moveInstrumentation(footerSocialMobileContainer, footerSocialMobile);
  mobileSocialCol.append(footerSocialMobile);

  // Filter for footer-social-item: 2 cells, first has <a>, second has <ul> (hierarchy-tree)
  const socialMobileItems = itemRows.filter((row) => row.children.length === 2 && row.children[0].querySelector('a') && row.children[1].querySelector('ul'));
  socialMobileItems.forEach((row) => {
    const [socialLinkCell, hierarchyTreeCell] = [...row.children]; // Destructuring for fixed schema
    const link = socialLinkCell.querySelector('a');
    if (link) {
      const socialAnchor = document.createElement('a');
      socialAnchor.href = link.href;
      socialAnchor.target = '_blank';
      socialAnchor.setAttribute('aria-label', `${link.href.split('/').pop()} - open in a new tab`);
      const icon = document.createElement('i');
      // Original HTML uses class="facebook", "instagram" etc. directly on <a>, not on <i>
      // The `fa` prefix is for FontAwesome icons, which is correct.
      socialAnchor.classList.add(link.href.split('/').pop()); // Add specific social class to anchor
      icon.classList.add('fa', `fa-${link.href.split('/').pop()}`);
      socialAnchor.append(icon);
      moveInstrumentation(row, socialAnchor);
      footerSocialMobile.append(socialAnchor);
    }
  });

  // --- Footer Sections (Accordion) ---
  const footerSectionsWrapper = document.createElement('div');
  moveInstrumentation(footerSectionsContainer, footerSectionsWrapper);
  mainRow.append(footerSectionsWrapper);

  // Filter for footer-section-item: 3 cells, first is text, second is aem-content, third is richtext (ul)
  const footerSectionItems = itemRows.filter((row) => row.children.length === 3 && !row.children[0].querySelector('picture') && row.children[2].querySelector('ul'));
  footerSectionItems.forEach((row, index) => {
    const [titleCell, linkCell, sectionLinksCell] = [...row.children]; // Destructuring for fixed schema
    const sectionCol = document.createElement('div');
    sectionCol.classList.add('col-lg-2');
    if (index === 0) sectionCol.classList.add('offset-lg-1'); // Only first section has offset
    moveInstrumentation(row, sectionCol);

    const headSpan = document.createElement('span');
    headSpan.classList.add('head');
    headSpan.textContent = titleCell.textContent.trim();
    const openIcon = document.createElement('div');
    openIcon.classList.add('open-icon');
    headSpan.append(openIcon);
    sectionCol.append(headSpan);

    const ul = document.createElement('ul');
    const subList = sectionLinksCell?.querySelector('ul');
    const directLink = linkCell?.querySelector('a'); // Get the anchor element

    if (subList) {
      transformNestedLists(subList);
      ul.append(subList);
    } else if (directLink) { // If there's a direct link, create a single li
      const li = document.createElement('li');
      li.classList.add('footer-menu-track');
      const anchor = document.createElement('a');
      anchor.href = directLink.href;
      anchor.textContent = titleCell.textContent.trim(); // Use titleCell for text content
      li.append(anchor);
      ul.append(li);
    }
    sectionCol.append(ul);
    footerSectionsWrapper.append(sectionCol);

    headSpan.addEventListener('click', () => {
      sectionCol.classList.toggle('active');
    });
  });

  // --- Desktop Social Links ---
  const desktopSocialCol = document.createElement('div');
  desktopSocialCol.classList.add('col-lg-3', 'offset-lg-1');
  mainRow.append(desktopSocialCol);

  const footerSocialDesktop = document.createElement('div');
  footerSocialDesktop.classList.add('footer-social', 'desktop');
  moveInstrumentation(footerSocialDesktopContainer, footerSocialDesktop); // Instrumentation for container
  desktopSocialCol.append(footerSocialDesktop);

  socialMobileItems.forEach((row) => { // Reuse social items
    const [socialLinkCell] = [...row.children]; // Destructuring for fixed schema
    const link = socialLinkCell.querySelector('a');
    if (link) {
      const socialAnchor = document.createElement('a');
      socialAnchor.href = link.href;
      socialAnchor.target = '_blank';
      socialAnchor.setAttribute('aria-label', `${link.href.split('/').pop()} - open in a new tab`);
      socialAnchor.classList.add(link.href.split('/').pop()); // Add specific social class to anchor
      const icon = document.createElement('i');
      icon.classList.add('fa', `fa-${link.href.split('/').pop()}`);
      socialAnchor.append(icon);
      moveInstrumentation(row, socialAnchor); // Instrumentation for each item row
      footerSocialDesktop.append(socialAnchor);
    }
  });

  // --- Footer Info (Logo & Address) ---
  const footerInfo = document.createElement('div');
  footerInfo.classList.add('footer-info');
  desktopSocialCol.append(footerInfo);

  const headlineDiv = document.createElement('div');
  headlineDiv.classList.add('headline');
  const footerLogoPicture = footerLogo?.querySelector('picture'); // Use footerLogo variable
  if (footerLogoPicture) {
    const optimizedPic = createOptimizedPicture(footerLogoPicture.querySelector('img').src, footerLogoPicture.querySelector('img').alt, false, [{ width: '750' }]);
    moveInstrumentation(footerLogo, optimizedPic.querySelector('img')); // Use footerLogo variable
    headlineDiv.append(optimizedPic);
  }
  footerInfo.append(headlineDiv);

  const addressDiv = document.createElement('div');
  addressDiv.classList.add('address');
  moveInstrumentation(footerAddressItemsContainer, addressDiv);
  footerInfo.append(addressDiv);

  // Filter for footer-address-item: 2 cells, first has <a>, second is richtext (p)
  const footerAddressItems = itemRows.filter((row) => row.children.length === 2 && row.children[0].querySelector('a') && row.children[1].querySelector('p'));
  footerAddressItems.forEach((row) => {
    const [addressLinkCell, addressTextCell] = [...row.children]; // Destructuring for fixed schema
    const addressLink = addressLinkCell.querySelector('a');
    if (addressLink) {
      const anchor = document.createElement('a');
      anchor.href = addressLink.href;
      anchor.target = '_blank';
      anchor.setAttribute('aria-label', `${addressTextCell.textContent.trim()} - open in a new tab`);
      anchor.innerHTML = addressTextCell.innerHTML; // richtext content
      moveInstrumentation(row, anchor);
      addressDiv.append(anchor);
    }
  });

  // --- Related Links ---
  const relatedLinksWrapper = document.createElement('div');
  moveInstrumentation(footerRelatedLinksContainer, relatedLinksWrapper);
  // Assuming related links are part of a general "Also of Interest" section
  const beIxLinkBlock = document.createElement('div');
  beIxLinkBlock.classList.add('be-ix-link-block');
  const beRelatedLinkContainer = document.createElement('div');
  beRelatedLinkContainer.classList.add('be-related-link-container');
  const beLabel = document.createElement('div');
  beLabel.classList.add('be-label');
  beLabel.textContent = 'Also of Interest'; // Hardcoded text from ORIGINAL HTML
  const beList = document.createElement('ul');
  beList.classList.add('be-list');

  // Filter for footer-link-item: 2 cells, first is text, second has <a>
  const footerRelatedLinks = itemRows.filter((row) => row.children.length === 2 && !row.children[0].querySelector('picture') && row.children[0].textContent.trim() && row.children[1].querySelector('a'));
  footerRelatedLinks.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const link = linkCell.querySelector('a');
    if (link) {
      const li = document.createElement('li');
      li.classList.add('be-list-item');
      const anchor = document.createElement('a');
      anchor.classList.add('be-related-link');
      anchor.href = link.href;
      anchor.textContent = labelCell.textContent.trim();
      moveInstrumentation(row, anchor);
      li.append(anchor);
      beList.append(li);
    }
  });
  beRelatedLinkContainer.append(beLabel, beList);
  beIxLinkBlock.append(beRelatedLinkContainer);
  container.append(beIxLinkBlock);

  // --- Footer Legal Section ---
  const footerLegalSectionRow = document.createElement('div');
  footerLegalSectionRow.classList.add('row', 'footer-legal-section');
  container.append(footerLegalSectionRow);

  const legalCol = document.createElement('div');
  legalCol.classList.add('col-xs-11', 'offset-lg-1');
  footerLegalSectionRow.append(legalCol);

  const legalP = document.createElement('p');
  legalP.classList.add('legal');
  legalP.innerHTML = footerLegalRow?.children[0]?.innerHTML || '';
  moveInstrumentation(footerLegalRow, legalP);
  legalCol.append(legalP);

  // --- First-Time Banner ---
  const firstTimeBanner = document.createElement('div');
  firstTimeBanner.classList.add('first-time-banner');
  firstTimeBanner.style.display = 'block'; // Ensure it's visible by default
  root.append(firstTimeBanner);

  const bannerContainer = document.createElement('div');
  bannerContainer.classList.add('container');
  firstTimeBanner.append(bannerContainer);

  const welcomeDiv = document.createElement('div');
  welcomeDiv.classList.add('welcome');
  bannerContainer.append(welcomeDiv);

  const welcomeHeadline = document.createElement('h4');
  welcomeHeadline.textContent = firstTimeBannerHeadlineRow?.children[0]?.textContent.trim() || ''; // Access cell content
  moveInstrumentation(firstTimeBannerHeadlineRow, welcomeHeadline);
  welcomeDiv.append(welcomeHeadline);

  const promoBody = document.createElement('div');
  promoBody.classList.add('promo-body');
  const ctaLink = firstTimeBannerCtaLinkRow?.querySelector('a');
  const ctaLabel = firstTimeBannerCtaLabelRow?.children[0]?.textContent.trim(); // Access cell content
  if (ctaLink && ctaLabel) {
    const anchor = document.createElement('a');
    anchor.href = ctaLink.href;
    anchor.textContent = ctaLabel;
    promoBody.append(anchor);
    moveInstrumentation(firstTimeBannerCtaLinkRow, anchor);
    moveInstrumentation(firstTimeBannerCtaLabelRow, anchor);
  }
  // Append richtext content from firstTimeBannerBodyRow
  const bannerBodyContent = document.createElement('div');
  bannerBodyContent.innerHTML = firstTimeBannerBodyRow?.children[0]?.innerHTML || '';
  moveInstrumentation(firstTimeBannerBodyRow, bannerBodyContent);
  while (bannerBodyContent.firstChild) {
    promoBody.append(bannerBodyContent.firstChild);
  }
  welcomeDiv.append(promoBody);

  // --- GDPR Message ---
  const gdprMessageDiv = document.createElement('div');
  gdprMessageDiv.classList.add('gdpr-message');
  bannerContainer.append(gdprMessageDiv);

  const gdprRow = document.createElement('div');
  gdprRow.classList.add('row');
  gdprMessageDiv.append(gdprRow);

  const cookieBodyCol = document.createElement('div');
  cookieBodyCol.classList.add('col-md-6');
  gdprRow.append(cookieBodyCol);

  const cookieBody = document.createElement('div');
  cookieBody.classList.add('cookie-body');
  cookieBody.innerHTML = gdprMessageRow?.children[0]?.innerHTML || '';
  moveInstrumentation(gdprMessageRow, cookieBody);

  const privacyLink = privacyPolicyLinkRow?.querySelector('a');
  if (privacyLink) {
    const privacyAnchor = document.createElement('a');
    privacyAnchor.href = privacyLink.href;
    privacyAnchor.textContent = 'View our Privacy Policy'; // Hardcoded text from ORIGINAL HTML
    cookieBody.append(privacyAnchor);
    moveInstrumentation(privacyPolicyLinkRow, privacyAnchor);
  }
  cookieBodyCol.append(cookieBody);

  const ctaCol = document.createElement('div');
  ctaCol.classList.add('col-md-6');
  gdprRow.append(ctaCol);

  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('cta');
  ctaCol.append(ctaDiv);

  const acceptCookieBtn = document.createElement('a');
  acceptCookieBtn.classList.add('btn', 'bg-white', 'accept-cookie');
  acceptCookieBtn.textContent = acceptCookieLabelRow?.children[0]?.textContent.trim() || ''; // Access cell content
  moveInstrumentation(acceptCookieLabelRow, acceptCookieBtn);
  ctaDiv.append(acceptCookieBtn);

  acceptCookieBtn.addEventListener('click', () => {
    firstTimeBanner.style.display = 'none';
  });

  block.replaceChildren(root);
}
