import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    // Add class from ORIGINAL HTML
    li.classList.add('footer-menu-track');

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
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const [
    footerLogoRow,
    footerLogoLinkRow,
    footerAddressRow,
    footerMapLinkRow,
    footerPhoneLinkRow,
    footerLegalRow,
    footerSectionsPlaceholder, // This is actually firstTimeBannerHeadlineRow
    footerSocialMobilePlaceholder, // This is actually firstTimeBannerBodyRow
    footerSocialDesktopPlaceholder, // This is actually firstTimeBannerCtaLinkRow
    footerRelatedLinksPlaceholder, // This is actually firstTimeBannerCtaLabelRow
    firstTimeBannerHeadlineRow, // This is actually gdprMessageBodyRow
    firstTimeBannerBodyRow, // This is actually gdprPrivacyPolicyLinkRow
    firstTimeBannerCtaLinkRow, // This is actually gdprAcceptLabelRow
    firstTimeBannerCtaLabelRow, // This is actually the start of itemRows
    gdprMessageBodyRow, // This is actually the start of itemRows
    gdprPrivacyPolicyLinkRow, // This is actually the start of itemRows
    gdprAcceptLabelRow, // This is actually the start of itemRows
    ...itemRows
  ] = children;

  // Correcting the destructuring based on the EDS BLOCK STRUCTURE and BlockJson model
  // The original destructuring was off by 7 rows.
  const [
    actualFooterLogoRow,
    actualFooterLogoLinkRow,
    actualFooterAddressRow,
    actualFooterMapLinkRow,
    actualFooterPhoneLinkRow,
    actualFooterLegalRow,
    actualFirstTimeBannerHeadlineRow,
    actualFirstTimeBannerBodyRow,
    actualFirstTimeBannerCtaLinkRow,
    actualFirstTimeBannerCtaLabelRow,
    actualGdprMessageBodyRow,
    actualGdprPrivacyPolicyLinkRow,
    actualGdprAcceptLabelRow,
    ...allItemRows
  ] = children;

  const footerSectionItems = allItemRows.filter((row) => row.children.length === 4);
  const footerSocialItems = allItemRows.filter((row) => row.children.length === 1);
  const footerRelatedLinkItems = allItemRows.filter((row) => row.children.length === 2);

  const root = document.createElement('section');
  root.classList.add('component-global-footer', 'notranslate');

  const container = document.createElement('div');
  container.classList.add('container');
  root.append(container);

  const mainRow = document.createElement('div');
  mainRow.classList.add('row');
  container.append(mainRow);

  // Footer Social Mobile
  const col12SocialMobile = document.createElement('div');
  col12SocialMobile.classList.add('col-12');
  mainRow.append(col12SocialMobile);

  const footerSocialMobile = document.createElement('div');
  footerSocialMobile.classList.add('footer-social', 'mobile');
  // There is no explicit placeholder row for footerSocialMobile in the EDS structure,
  // so moveInstrumentation should be called on the individual social item rows.
  // moveInstrumentation(footerSocialMobilePlaceholder, footerSocialMobile); // Removed as it's not a direct row

  col12SocialMobile.append(footerSocialMobile);

  footerSocialItems.forEach((row) => {
    const [socialLinkCell] = [...row.children];
    const socialLink = socialLinkCell?.querySelector('a');
    if (socialLink) {
      const anchor = document.createElement('a');
      anchor.href = socialLink.href;
      anchor.target = '_blank';
      anchor.setAttribute('aria-label', `${socialLink.href.split('.com/')[1] || 'social link'} - open in a new tab`);

      const icon = document.createElement('i');
      if (socialLink.href.includes('facebook')) {
        anchor.classList.add('facebook');
        icon.classList.add('fa', 'fa-facebook');
      } else if (socialLink.href.includes('instagram')) {
        anchor.classList.add('instagram');
        icon.classList.add('fa', 'fa-instagram');
      } else if (socialLink.href.includes('linkedin')) {
        anchor.classList.add('linkedin');
        icon.classList.add('fa', 'fa-linkedin');
      } else if (socialLink.href.includes('twitter')) {
        anchor.classList.add('twitter');
        icon.classList.add('fa', 'fa-twitter');
      } else if (socialLink.href.includes('youtube')) {
        anchor.classList.add('youtube');
        icon.classList.add('fa', 'fa-youtube');
      } else if (socialLink.href.includes('whatsapp')) {
        anchor.classList.add('whatsapp');
        icon.classList.add('fa', 'fa-whatsapp');
      }
      icon.setAttribute('aria-hidden', 'true');
      anchor.append(icon);
      moveInstrumentation(row, anchor);
      footerSocialMobile.append(anchor);
    }
  });

  // Footer Sections
  const footerSectionsWrapper = document.createElement('div');
  // No explicit placeholder row for footerSections, moveInstrumentation on individual items
  // moveInstrumentation(footerSectionsPlaceholder, footerSectionsWrapper); // Removed

  footerSectionItems.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell, hierarchyTreeCell] = [...row.children];
    const colLg2 = document.createElement('div');
    colLg2.classList.add('col-lg-2');
    footerSectionsWrapper.append(colLg2);

    const headSpan = document.createElement('span');
    headSpan.classList.add('head');
    headSpan.textContent = titleCell?.textContent.trim() || '';
    const openIcon = document.createElement('div');
    openIcon.classList.add('open-icon');
    headSpan.append(openIcon);
    colLg2.append(headSpan);

    const ul = document.createElement('ul');
    // For hierarchy-tree, read innerHTML directly
    const hierarchyTreeContent = hierarchyTreeCell?.innerHTML;
    const subList = hierarchyTreeCell?.querySelector('ul'); // Check for direct UL in hierarchy-tree

    const directLink = linkCell?.querySelector('a');

    if (subList) { // If hierarchy-tree has a direct UL
      // moveInstrumentation for the hierarchyTreeCell content
      const tempDiv = document.createElement('div');
      moveInstrumentation(hierarchyTreeCell, tempDiv);
      tempDiv.innerHTML = hierarchyTreeContent;
      const transformedList = tempDiv.querySelector('ul');
      if (transformedList) {
        transformNestedLists(transformedList);
        ul.append(transformedList);
      }
    } else if (directLink) { // If there's a direct link
      const li = document.createElement('li');
      li.classList.add('footer-menu-track'); // Add class from ORIGINAL HTML
      const anchor = document.createElement('a');
      anchor.href = directLink.href;
      anchor.textContent = titleCell?.textContent.trim() || '';
      moveInstrumentation(row, anchor); // Instrumentation for the whole row
      li.append(anchor);
      ul.append(li);
    } else { // Fallback for sectionLinks richtext
      const sectionLinksContent = sectionLinksCell?.innerHTML.trim();
      if (sectionLinksContent) {
        const tempDiv = document.createElement('div');
        moveInstrumentation(sectionLinksCell, tempDiv); // Instrumentation for the sectionLinksCell
        tempDiv.innerHTML = sectionLinksContent;
        const sectionUl = tempDiv.querySelector('ul');
        if (sectionUl) {
          transformNestedLists(sectionUl);
          ul.append(sectionUl);
        } else {
          // Fallback for plain text or <p> tags in sectionLinks
          // Use a div to avoid <p> inside <p>
          const li = document.createElement('li');
          li.classList.add('footer-menu-track'); // Add class from ORIGINAL HTML
          const contentDiv = document.createElement('div'); // Use div to hold richtext
          contentDiv.innerHTML = sectionLinksContent;
          li.append(contentDiv);
          ul.append(li);
        }
      }
    }
    colLg2.append(ul);

    headSpan.addEventListener('click', () => {
      headSpan.classList.toggle('active');
      ul.classList.toggle('active');
    });
    moveInstrumentation(row, colLg2); // Instrumentation for the whole row
  });

  // Append footer sections to mainRow, handling offset for the first one
  const firstSectionCol = footerSectionsWrapper.querySelector('.col-lg-2');
  if (firstSectionCol) {
    firstSectionCol.classList.add('offset-lg-1');
  }
  mainRow.append(...footerSectionsWrapper.children);

  // Footer Social Desktop & Footer Info
  const colLg3OffsetLg1 = document.createElement('div');
  colLg3OffsetLg1.classList.add('col-lg-3', 'offset-lg-1');
  mainRow.append(colLg3OffsetLg1);

  const footerSocialDesktop = document.createElement('div');
  footerSocialDesktop.classList.add('footer-social', 'desktop');
  // No explicit placeholder row for footerSocialDesktop, moveInstrumentation on individual items
  // moveInstrumentation(footerSocialDesktopPlaceholder, footerSocialDesktop); // Removed
  colLg3OffsetLg1.append(footerSocialDesktop);

  footerSocialItems.forEach((row) => {
    const [socialLinkCell] = [...row.children];
    const socialLink = socialLinkCell?.querySelector('a');
    if (socialLink) {
      const anchor = document.createElement('a');
      anchor.href = socialLink.href;
      anchor.target = '_blank';
      anchor.setAttribute('aria-label', `${socialLink.href.split('.com/')[1] || 'social link'} - open in a new tab`);

      const icon = document.createElement('i');
      if (socialLink.href.includes('facebook')) {
        anchor.classList.add('facebook');
        icon.classList.add('fa', 'fa-facebook');
      } else if (socialLink.href.includes('instagram')) {
        anchor.classList.add('instagram');
        icon.classList.add('fa', 'fa-instagram');
      } else if (socialLink.href.includes('linkedin')) {
        anchor.classList.add('linkedin');
        icon.classList.add('fa', 'fa-linkedin');
      } else if (socialLink.href.includes('twitter')) {
        anchor.classList.add('twitter');
        icon.classList.add('fa', 'fa-twitter');
      } else if (socialLink.href.includes('youtube')) {
        anchor.classList.add('youtube');
        icon.classList.add('fa', 'fa-youtube');
      } else if (socialLink.href.includes('whatsapp')) {
        anchor.classList.add('whatsapp');
        icon.classList.add('fa', 'fa-whatsapp');
      }
      icon.setAttribute('aria-hidden', 'true');
      anchor.append(icon);
      moveInstrumentation(row, anchor); // Instrumentation for the whole row
      footerSocialDesktop.append(anchor);
    }
  });

  const footerInfo = document.createElement('div');
  footerInfo.classList.add('footer-info');
  colLg3OffsetLg1.append(footerInfo);

  const headlineDiv = document.createElement('div');
  headlineDiv.classList.add('headline');
  const footerLogoPicture = actualFooterLogoRow?.querySelector('picture');
  if (footerLogoPicture) {
    const optimizedPic = createOptimizedPicture(
      footerLogoPicture.querySelector('img').src,
      footerLogoPicture.querySelector('img').alt,
      false,
      [{ width: '750' }],
    );
    moveInstrumentation(actualFooterLogoRow, optimizedPic.querySelector('img'));
    headlineDiv.append(optimizedPic);
  }
  footerInfo.append(headlineDiv);

  const addressDiv = document.createElement('div');
  addressDiv.classList.add('address');
  const footerMapLink = actualFooterMapLinkRow?.querySelector('a');
  // Corrected: Use actualFooterAddressRow.children[0]?.innerHTML for richtext
  const footerAddressContent = actualFooterAddressRow?.children[0]?.innerHTML.trim();
  if (footerMapLink && footerAddressContent) {
    const mapAnchor = document.createElement('a');
    mapAnchor.href = footerMapLink.href;
    mapAnchor.target = '_blank';
    mapAnchor.innerHTML = footerAddressContent; // This is fine as it's richtext inside an anchor
    moveInstrumentation(actualFooterMapLinkRow, mapAnchor);
    moveInstrumentation(actualFooterAddressRow, mapAnchor);
    addressDiv.append(mapAnchor);
  } else if (footerAddressContent) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = footerAddressContent;
    moveInstrumentation(actualFooterAddressRow, tempDiv);
    addressDiv.append(tempDiv);
  }

  const footerPhoneLink = actualFooterPhoneLinkRow?.querySelector('a');
  if (footerPhoneLink) {
    const phoneAnchor = document.createElement('a');
    phoneAnchor.href = footerPhoneLink.href;
    // Original HTML shows <p>+1 (630) 571-5466</p> inside the anchor, so we need to replicate that
    const phoneP = document.createElement('p');
    phoneP.textContent = footerPhoneLink.textContent.trim();
    phoneAnchor.append(phoneP);
    moveInstrumentation(actualFooterPhoneLinkRow, phoneAnchor);
    addressDiv.append(phoneAnchor);
  }
  footerInfo.append(addressDiv);

  // Related Links
  const beIxLinkBlock = document.createElement('div');
  beIxLinkBlock.classList.add('be-ix-link-block');
  container.append(beIxLinkBlock);

  const beRelatedLinkContainer = document.createElement('div');
  beRelatedLinkContainer.classList.add('be-related-link-container');
  beIxLinkBlock.append(beRelatedLinkContainer);

  const beLabel = document.createElement('div');
  beLabel.classList.add('be-label');
  beLabel.textContent = 'Also of Interest'; // Hardcoded, but matches ORIGINAL HTML
  beRelatedLinkContainer.append(beLabel);

  const beList = document.createElement('ul');
  beList.classList.add('be-list');
  beRelatedLinkContainer.append(beList);

  footerRelatedLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const link = linkCell?.querySelector('a');
    const label = labelCell?.textContent.trim();

    if (link && label) {
      const li = document.createElement('li');
      li.classList.add('be-list-item');
      const anchor = document.createElement('a');
      anchor.classList.add('be-related-link');
      anchor.href = link.href;
      anchor.textContent = label;
      moveInstrumentation(row, anchor);
      li.append(anchor);
      beList.append(li);
    }
  });

  // Footer Legal Section
  const footerLegalSectionRow = document.createElement('div');
  footerLegalSectionRow.classList.add('row', 'footer-legal-section');
  container.append(footerLegalSectionRow);

  const colXs11OffsetLg1 = document.createElement('div');
  colXs11OffsetLg1.classList.add('col-xs-11', 'offset-lg-1');
  footerLegalSectionRow.append(colXs11OffsetLg1);

  const legalP = document.createElement('p');
  legalP.classList.add('legal');
  // Corrected: Use actualFooterLegalRow.children[0]?.innerHTML for richtext
  legalP.innerHTML = actualFooterLegalRow?.children[0]?.innerHTML.trim() || '';
  moveInstrumentation(actualFooterLegalRow, legalP);
  colXs11OffsetLg1.append(legalP);

  // First Time Banner
  const firstTimeBanner = document.createElement('div');
  firstTimeBanner.classList.add('first-time-banner');
  firstTimeBanner.style.display = 'block'; // Default to block as per original HTML
  root.append(firstTimeBanner);

  const bannerContainer = document.createElement('div');
  bannerContainer.classList.add('container');
  firstTimeBanner.append(bannerContainer);

  const welcomeDiv = document.createElement('div');
  welcomeDiv.classList.add('welcome');
  bannerContainer.append(welcomeDiv);

  const welcomeH4 = document.createElement('h4');
  // Corrected: Use actualFirstTimeBannerHeadlineRow.children[0]?.textContent
  welcomeH4.textContent = actualFirstTimeBannerHeadlineRow?.children[0]?.textContent.trim() || '';
  moveInstrumentation(actualFirstTimeBannerHeadlineRow, welcomeH4);
  welcomeDiv.append(welcomeH4);

  const promoBody = document.createElement('div');
  promoBody.classList.add('promo-body');
  const ctaLink = actualFirstTimeBannerCtaLinkRow?.querySelector('a');
  // Corrected: Use actualFirstTimeBannerCtaLabelRow.children[0]?.textContent
  const ctaLabel = actualFirstTimeBannerCtaLabelRow?.children[0]?.textContent.trim();
  // Corrected: Use actualFirstTimeBannerBodyRow.children[0]?.innerHTML for richtext
  const bannerBodyContent = actualFirstTimeBannerBodyRow?.children[0]?.innerHTML.trim();

  if (ctaLink && ctaLabel) {
    const anchor = document.createElement('a');
    anchor.href = ctaLink.href;
    anchor.textContent = ctaLabel;
    moveInstrumentation(actualFirstTimeBannerCtaLinkRow, anchor);
    moveInstrumentation(actualFirstTimeBannerCtaLabelRow, anchor);
    promoBody.append(anchor);
    if (bannerBodyContent) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = bannerBodyContent;
      // Append children directly to promoBody to avoid <p> inside <p>
      while (tempDiv.firstChild) {
        promoBody.append(tempDiv.firstChild);
      }
    }
  } else if (bannerBodyContent) {
    // Corrected: Append children directly to promoBody to avoid <p> inside <p>
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = bannerBodyContent;
    while (tempDiv.firstChild) {
      promoBody.append(tempDiv.firstChild);
    }
  }
  moveInstrumentation(actualFirstTimeBannerBodyRow, promoBody);
  welcomeDiv.append(promoBody);

  // GDPR Message
  const gdprMessage = document.createElement('div');
  gdprMessage.classList.add('gdpr-message');
  bannerContainer.append(gdprMessage);

  const gdprRow = document.createElement('div');
  gdprRow.classList.add('row');
  gdprMessage.append(gdprRow);

  const gdprColMd6Body = document.createElement('div');
  gdprColMd6Body.classList.add('col-md-6');
  gdprRow.append(gdprColMd6Body);

  const cookieBody = document.createElement('div');
  cookieBody.classList.add('cookie-body');
  const gdprPrivacyPolicyLink = actualGdprPrivacyPolicyLinkRow?.querySelector('a');
  // Corrected: Use actualGdprMessageBodyRow.children[0]?.innerHTML for richtext
  const gdprMessageBodyContent = actualGdprMessageBodyRow?.children[0]?.innerHTML.trim();

  if (gdprMessageBodyContent) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = gdprMessageBodyContent;
    // Corrected: Append children directly to cookieBody to avoid <p> inside <p>
    while (tempDiv.firstChild) {
      cookieBody.append(tempDiv.firstChild);
    }
  }
  if (gdprPrivacyPolicyLink) {
    const privacyAnchor = document.createElement('a');
    privacyAnchor.href = gdprPrivacyPolicyLink.href;
    privacyAnchor.textContent = 'View our Privacy Policy'; // Hardcoded, but matches ORIGINAL HTML
    moveInstrumentation(actualGdprPrivacyPolicyLinkRow, privacyAnchor);
    cookieBody.append(privacyAnchor);
  }
  moveInstrumentation(actualGdprMessageBodyRow, cookieBody);
  gdprColMd6Body.append(cookieBody);

  const gdprColMd6Cta = document.createElement('div');
  gdprColMd6Cta.classList.add('col-md-6');
  gdprRow.append(gdprColMd6Cta);

  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('cta');
  gdprColMd6Cta.append(ctaDiv);

  const acceptButton = document.createElement('a');
  acceptButton.classList.add('btn', 'bg-white', 'accept-cookie');
  acceptButton.setAttribute('tabindex', '0');
  // Corrected: Use actualGdprAcceptLabelRow.children[0]?.textContent
  acceptButton.textContent = actualGdprAcceptLabelRow?.children[0]?.textContent.trim() || '';
  moveInstrumentation(actualGdprAcceptLabelRow, acceptButton);
  ctaDiv.append(acceptButton);

  acceptButton.addEventListener('click', () => {
    firstTimeBanner.style.display = 'none';
  });

  block.replaceChildren(root);
}
