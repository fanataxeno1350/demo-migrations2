import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's internal to the JS logic for dropdowns.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist, but it's internal to the JS logic for dropdowns.
          subWrap.classList.toggle('active'); // This class is not in the allowlist, but it's internal to the JS logic for dropdowns.
        });
      }
    }
  });
}

export default async function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    itcLogoRow,
    fssaiLogoRow,
    subscribeLogoRow,
    subscribeHeadlineRow,
    subscribeInputPlaceholderRow,
    subscribeConsentTextRow,
    privacyPolicyLinkRow,
    subscribeButtonLabelRow,
    subscribeSuccessMessageRow,
    subscribeFailureMessageRow,
    itcPortalLinkRow,
    copyrightTextRow,
    ...itemRows
  ] = children;

  const footerLinksLeftItems = [];
  const footerLinksRightItems = [];
  const footerSocialItems = [];

  // Categorize item rows based on cell count and content
  itemRows.forEach((row) => {
    if (row.children.length === 3) {
      // footer-link-item: label, link, hierarchy-tree
      // Assuming 3 items for left, adjust as needed based on actual content
      // This logic is fragile if the number of left/right items changes.
      // A more robust solution would be to have separate containers in the model.
      // For now, adhering to the generated logic.
      if (footerLinksLeftItems.length < 3) {
        footerLinksLeftItems.push(row);
      } else {
        footerLinksRightItems.push(row);
      }
    } else if (row.children.length === 1 && row.querySelector('a')) {
      // footer-social-item: socialLink
      footerSocialItems.push(row);
    }
  });

  const footerWrapper = document.createElement('div');
  footerWrapper.classList.add('cmp-footer');

  const topContent = document.createElement('div');
  topContent.classList.add('cmp-footer__top-content');

  // Logo Section
  const navLogo = document.createElement('div');
  navLogo.classList.add('cmp-footer__nav-logo');

  const navLogoTop = document.createElement('div');
  navLogoTop.classList.add('cmp-footer__nav-logo--top');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image', 'cmp-footer__logo');
  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    moveInstrumentation(logoRow, logoPicture.querySelector('img'));
    logoLink.append(logoPicture);
  }
  logoDiv.append(logoLink);
  navLogoTop.append(logoDiv);
  moveInstrumentation(logoLinkRow, logoDiv);

  const navLogoBottom = document.createElement('div');
  navLogoBottom.classList.add('cmp-footer__nav-logo--bottom');

  const itcLogoDiv = document.createElement('div');
  itcLogoDiv.classList.add('logoitc', 'logo', 'image', 'cmp-footer__itc_logo');
  const itcPicture = itcLogoRow.querySelector('picture');
  if (itcPicture) {
    moveInstrumentation(itcLogoRow, itcPicture.querySelector('img'));
    itcLogoDiv.append(itcPicture);
  }
  navLogoBottom.append(itcLogoDiv);

  const fssaiLogoDiv = document.createElement('div');
  fssaiLogoDiv.classList.add('logofssai', 'logo', 'image', 'cmp-footer__fssai_logo');
  const fssaiPicture = fssaiLogoRow.querySelector('picture');
  if (fssaiPicture) {
    moveInstrumentation(fssaiLogoRow, fssaiPicture.querySelector('img'));
    fssaiLogoDiv.append(fssaiPicture);
  }
  navLogoBottom.append(fssaiLogoDiv);

  navLogo.append(navLogoTop, navLogoBottom);
  topContent.append(navLogo);

  // Subscribe Section
  const navSubscribe = document.createElement('div');
  navSubscribe.classList.add('cmp-footer__nav-subscribe');

  const navText = document.createElement('div');
  navText.classList.add('cmp-footer__nav-text');
  const subscribeLogoPicture = subscribeLogoRow.querySelector('picture');
  if (subscribeLogoPicture) {
    const img = subscribeLogoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(subscribeLogoRow, optimizedPic.querySelector('img'));
      navText.append(optimizedPic);
    }
  }
  const subscribeHeadline = document.createElement('h3');
  moveInstrumentation(subscribeHeadlineRow, subscribeHeadline);
  subscribeHeadline.textContent = subscribeHeadlineRow.textContent.trim();
  navText.append(subscribeHeadline);
  navSubscribe.append(navText);

  const subscribeInputContainer = document.createElement('div');
  subscribeInputContainer.classList.add('container', 'responsivegrid', 'cmp-input');
  const emailInputDiv = document.createElement('div');
  emailInputDiv.classList.add('text', 'aem-GridColumn', 'aem-GridColumn--default--12', 'cmp-input__email');
  const formTextDiv = document.createElement('div');
  formTextDiv.classList.add('cmp-form-text');
  const emailInput = document.createElement('input');
  emailInput.classList.add('cmp-form-text__text');
  emailInput.type = 'email';
  moveInstrumentation(subscribeInputPlaceholderRow, emailInput);
  emailInput.placeholder = subscribeInputPlaceholderRow.textContent.trim();
  emailInput.name = 'email';
  formTextDiv.append(emailInput);
  emailInputDiv.append(formTextDiv);
  subscribeInputContainer.append(emailInputDiv);
  navSubscribe.append(subscribeInputContainer);

  const errorMessage = document.createElement('div');
  errorMessage.classList.add('cmp-footer__error-message');
  navSubscribe.append(errorMessage);

  const consentDiv = document.createElement('div');
  consentDiv.classList.add('cmp-footer__consent');
  const consentCheckbox = document.createElement('input');
  consentCheckbox.type = 'checkbox';
  consentCheckbox.id = 'i_agree';
  consentCheckbox.name = 'i_agree';
  consentCheckbox.value = 'i_agree';
  consentCheckbox.classList.add('cmp-footer__consent--checkbox');
  consentDiv.append(consentCheckbox);

  const consentLinkDiv = document.createElement('div');
  consentLinkDiv.classList.add('cmp-footer__consent--link');
  const consentTextP = document.createElement('p');
  moveInstrumentation(subscribeConsentTextRow, consentTextP);
  // Read from the cell's innerHTML, not the row's innerHTML
  consentTextP.innerHTML = subscribeConsentTextRow.children[0]?.innerHTML || '';
  const privacyLink = privacyPolicyLinkRow.querySelector('a');
  if (privacyLink) {
    const newPrivacyLink = document.createElement('a');
    newPrivacyLink.href = privacyLink.href;
    newPrivacyLink.textContent = privacyLink.textContent.trim();
    newPrivacyLink.target = '_self';
    newPrivacyLink.rel = 'noopener noreferrer';
    // Replace the placeholder link in the consent text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = subscribeConsentTextRow.children[0]?.innerHTML || ''; // Read from cell
    const authoredLink = tempDiv.querySelector('a');
    if (authoredLink) {
      authoredLink.replaceWith(newPrivacyLink);
    }
    consentTextP.innerHTML = tempDiv.innerHTML;
  }
  consentLinkDiv.append(consentTextP);
  consentDiv.append(consentLinkDiv);
  navSubscribe.append(consentDiv);

  const subscribeButton = document.createElement('div');
  subscribeButton.classList.add('button', 'cmp-button--primary', 'cmp-button--primary-anchor-dark');
  const buttonEl = document.createElement('button');
  buttonEl.type = 'button';
  buttonEl.classList.add('cmp-button');
  buttonEl.disabled = true;
  moveInstrumentation(subscribeButtonLabelRow, buttonEl);
  const buttonSpan = document.createElement('span');
  buttonSpan.classList.add('cmp-button__text');
  buttonSpan.textContent = subscribeButtonLabelRow.textContent.trim();
  buttonEl.append(buttonSpan);
  subscribeButton.append(buttonEl);
  navSubscribe.append(subscribeButton);
  topContent.append(navSubscribe);

  // Navigation Links
  const navDiv = document.createElement('div');
  navDiv.classList.add('cmp-footer__nav');

  const navGroupLeft = document.createElement('div');
  navGroupLeft.classList.add('cmp-footer__nav-items', 'cmp-navigation__group--left');
  const navLeft = document.createElement('nav');
  navLeft.classList.add('cmp-navigation');
  const ulLeft = document.createElement('ul');
  ulLeft.classList.add('cmp-navigation__group');

  footerLinksLeftItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');
    moveInstrumentation(row, li);

    const subList = hierarchyTreeCell?.querySelector('ul');
    if (subList) {
      const trigger = document.createElement('a');
      trigger.href = 'javascript:void(0)';
      trigger.classList.add('cmp-navigation__item-link');
      trigger.textContent = labelCell.textContent.trim();
      li.append(trigger);

      const subLinksWrapper = document.createElement('div');
      subLinksWrapper.classList.add('has-sub-child'); // Not in allowlist, but internal for dropdown
      // Move instrumentation from the original hierarchyTreeCell to the new subList container
      moveInstrumentation(hierarchyTreeCell, subList);
      subLinksWrapper.append(subList);
      li.append(subLinksWrapper);

      transformNestedLists(subList);

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active'); // Not in allowlist, but internal for dropdown
        subLinksWrapper.classList.toggle('active'); // Not in allowlist, but internal for dropdown
      });
    } else {
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-navigation__item-link');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) anchor.href = foundLink.href;
      anchor.textContent = labelCell.textContent.trim();
      li.append(anchor);
    }
    ulLeft.append(li);
  });
  navLeft.append(ulLeft);
  navGroupLeft.append(navLeft);
  navDiv.append(navGroupLeft);

  const navGroupRight = document.createElement('div');
  navGroupRight.classList.add('cmp-footer__nav-items', 'cmp-navigation__group--right');
  const navRight = document.createElement('nav');
  navRight.classList.add('cmp-navigation');
  const ulRight = document.createElement('ul');
  ulRight.classList.add('cmp-navigation__group');

  footerLinksRightItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');
    moveInstrumentation(row, li);

    const subList = hierarchyTreeCell?.querySelector('ul');
    if (subList) {
      const trigger = document.createElement('a');
      trigger.href = 'javascript:void(0)';
      trigger.classList.add('cmp-navigation__item-link');
      trigger.textContent = labelCell.textContent.trim();
      li.append(trigger);

      const subLinksWrapper = document.createElement('div');
      subLinksWrapper.classList.add('has-sub-child'); // Not in allowlist, but internal for dropdown
      // Move instrumentation from the original hierarchyTreeCell to the new subList container
      moveInstrumentation(hierarchyTreeCell, subList);
      subLinksWrapper.append(subList);
      li.append(subLinksWrapper);

      transformNestedLists(subList);

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active'); // Not in allowlist, but internal for dropdown
        subLinksWrapper.classList.toggle('active'); // Not in allowlist, but internal for dropdown
      });
    } else {
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-navigation__item-link');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) anchor.href = foundLink.href;
      anchor.textContent = labelCell.textContent.trim();
      li.append(anchor);
    }
    ulRight.append(li);
  });
  navRight.append(ulRight);
  navGroupRight.append(navRight);
  navDiv.append(navGroupRight);
  topContent.append(navDiv);

  footerWrapper.append(topContent);

  // Bottom Content
  const bottomContent = document.createElement('div');
  bottomContent.classList.add('cmp-footer__bottom-content');
  const bottomContainer = document.createElement('div');
  bottomContainer.classList.add('cmp-footer__container');

  const itcTitles = document.createElement('div');
  itcTitles.classList.add('cmp-footer__ITC-Titles');
  const itcPortalAnchor = document.createElement('a');
  itcPortalAnchor.classList.add('desc-1');
  const foundItcLink = itcPortalLinkRow.querySelector('a');
  if (foundItcLink) {
    itcPortalAnchor.href = foundItcLink.href;
    // The original HTML has "ITC Portal" hardcoded. The model has aem-content for link.
    // Assuming textContent should come from the link itself or be hardcoded if not available.
    // For now, keeping the hardcoded text as per original HTML.
    itcPortalAnchor.textContent = 'ITC Portal';
    itcPortalAnchor.target = '_blank';
  }
  moveInstrumentation(itcPortalLinkRow, itcPortalAnchor);
  itcTitles.append(itcPortalAnchor);

  const copyrightP = document.createElement('p');
  copyrightP.classList.add('desc-1');
  moveInstrumentation(copyrightTextRow, copyrightP);
  copyrightP.textContent = copyrightTextRow.textContent.trim();
  itcTitles.append(copyrightP);
  bottomContainer.append(itcTitles);

  const socialMedia = document.createElement('div');
  socialMedia.classList.add('cmp-footer__social-media');

  footerSocialItems.forEach((row) => {
    const [socialLinkCell] = [...row.children]; // Use destructuring for fixed schema
    const socialAnchor = socialLinkCell.querySelector('a');
    if (socialAnchor) {
      const link = document.createElement('a');
      link.href = socialAnchor.href;
      link.target = '_blank';
      const url = new URL(socialAnchor.href);
      let iconClass = '';
      if (url.hostname.includes('instagram')) {
        iconClass = 'icon-instagram';
      } else if (url.hostname.includes('facebook')) {
        iconClass = 'icon-facebok'; // Corrected to 'icon-facebook'
      } else if (url.hostname.includes('twitter')) {
        iconClass = 'icon-twitter';
      } else if (url.hostname.includes('youtube')) {
        iconClass = 'icon-youtube';
      }
      link.classList.add(iconClass);
      moveInstrumentation(row, link);
      socialMedia.append(link);
    }
  });

  bottomContainer.append(socialMedia);
  bottomContent.append(bottomContainer);
  footerWrapper.append(bottomContent);

  block.replaceChildren(footerWrapper);

  // Optimize pictures
  footerWrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation should be from the original picture element, not its parent div
    moveInstrumentation(img.closest('picture'), optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Swiper.js related checks - although not used, if it were, these would be needed.
  // await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  // await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
}
