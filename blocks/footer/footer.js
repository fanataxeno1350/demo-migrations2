import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0'); // Add classes to all list items

    const nested = li.querySelector(':scope > ul');
    // Handle label-only nodes
    const anchor = li.querySelector(':scope > a');
    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        span.classList.add('cmp-navigation__item-link'); // Add class for consistency
        textNode.remove();
        li.prepend(span);
      }
    }
    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child', 'cmp-navigation__sub-links'); // use ORIGINAL HTML class and add missing one
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('cmp-navigation__item-link', 'has-sub-child-trigger'); // Add class for consistency
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
    logoRow,
    logoLinkRow,
    logoItcRow,
    logoFssaiRow,
    subscribeLogoRow,
    subscribeHeadlineRow,
    subscribePlaceholderRow,
    subscribeButtonLabelRow,
    subscribeConsentTextRow,
    subscribePrivacyPolicyLinkRow,
    subscribeSuccessMessageRow,
    subscribeFailureMessageRow,
    itcPortalLinkRow,
    copyrightTextRow,
    ...itemRows
  ] = children;

  const root = document.createElement('div');
  root.classList.add('cmp-footer');

  const topContent = document.createElement('div');
  topContent.classList.add('cmp-footer__top-content');

  const navLogo = document.createElement('div');
  navLogo.classList.add('cmp-footer__nav-logo');

  const navLogoTop = document.createElement('div');
  navLogoTop.classList.add('cmp-footer__nav-logo--top');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image', 'cmp-footer__logo');
  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);
  navLogoTop.append(logoDiv);
  navLogo.append(navLogoTop);

  const navLogoBottom = document.createElement('div');
  navLogoBottom.classList.add('cmp-footer__nav-logo--bottom');

  const itcLogoDiv = document.createElement('div');
  itcLogoDiv.classList.add('logoitc', 'logo', 'image', 'cmp-footer__itc_logo');
  const itcPicture = logoItcRow.querySelector('picture');
  if (itcPicture) {
    const img = itcPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    itcLogoDiv.append(optimizedPic);
  }
  moveInstrumentation(logoItcRow, itcLogoDiv);
  navLogoBottom.append(itcLogoDiv);

  const fssaiLogoDiv = document.createElement('div');
  fssaiLogoDiv.classList.add('logofssai', 'logo', 'image', 'cmp-footer__fssai_logo');
  const fssaiPicture = logoFssaiRow.querySelector('picture');
  if (fssaiPicture) {
    const img = fssaiPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    fssaiLogoDiv.append(optimizedPic);
  }
  moveInstrumentation(logoFssaiRow, fssaiLogoDiv);
  navLogoBottom.append(fssaiLogoDiv);
  navLogo.append(navLogoBottom);
  topContent.append(navLogo);

  const navSubscribe = document.createElement('div');
  navSubscribe.classList.add('cmp-footer__nav-subscribe');
  navSubscribe.setAttribute('data-register-api-url', '/content/itc-foods-brands/servicespath/itcemail.register.json');
  navSubscribe.setAttribute('data-popup-success-message', subscribeSuccessMessageRow.textContent.trim());
  navSubscribe.setAttribute('data-popup-failure-message', subscribeFailureMessageRow.textContent.trim());

  const navText = document.createElement('div');
  navText.classList.add('cmp-footer__nav-text');
  const subscribeLogoPicture = subscribeLogoRow.querySelector('picture');
  if (subscribeLogoPicture) {
    const img = subscribeLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    navText.append(optimizedPic);
  }
  const subscribeHeadline = document.createElement('h3');
  subscribeHeadline.textContent = subscribeHeadlineRow.textContent.trim();
  navText.append(subscribeHeadline);
  moveInstrumentation(subscribeLogoRow, navText);
  moveInstrumentation(subscribeHeadlineRow, subscribeHeadline);
  navSubscribe.append(navText);

  const inputContainer = document.createElement('div');
  inputContainer.classList.add('container', 'responsivegrid', 'cmp-input');
  const emailInputDiv = document.createElement('div');
  emailInputDiv.classList.add('text', 'aem-GridColumn', 'aem-GridColumn--default--12', 'cmp-input__email');
  const formTextDiv = document.createElement('div');
  formTextDiv.classList.add('cmp-form-text');
  formTextDiv.setAttribute('data-cmp-required-message', 'This field is required');
  formTextDiv.setAttribute('data-cmp-valid-email', 'Please enter valid email id');
  const emailInput = document.createElement('input');
  emailInput.classList.add('cmp-form-text__text');
  emailInput.type = 'email';
  emailInput.placeholder = subscribePlaceholderRow.textContent.trim();
  emailInput.name = 'email';
  formTextDiv.append(emailInput);
  emailInputDiv.append(formTextDiv);
  inputContainer.append(emailInputDiv);
  moveInstrumentation(subscribePlaceholderRow, emailInput);
  navSubscribe.append(inputContainer);

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
  const consentP = document.createElement('p');
  const privacyPolicyLink = document.createElement('a');
  const foundPrivacyLink = subscribePrivacyPolicyLinkRow.querySelector('a');
  if (foundPrivacyLink) {
    privacyPolicyLink.href = foundPrivacyLink.href;
    privacyPolicyLink.textContent = 'Privacy Policy';
  }
  consentP.innerHTML = `${subscribeConsentTextRow.textContent.trim().replace('Privacy Policy', '')} `;
  consentP.append(privacyPolicyLink);
  consentLinkDiv.append(consentP);
  consentDiv.append(consentLinkDiv);
  moveInstrumentation(subscribeConsentTextRow, consentP);
  moveInstrumentation(subscribePrivacyPolicyLinkRow, privacyPolicyLink);
  navSubscribe.append(consentDiv);

  const registerButtonDiv = document.createElement('div');
  registerButtonDiv.classList.add('button', 'cmp-button--primary', 'cmp-button--primary-anchor-dark');
  const registerButton = document.createElement('button');
  registerButton.type = 'button';
  registerButton.classList.add('cmp-button');
  registerButton.setAttribute('data-request', 'true');
  registerButton.disabled = true;
  const buttonText = document.createElement('span');
  buttonText.classList.add('cmp-button__text');
  buttonText.textContent = subscribeButtonLabelRow.textContent.trim();
  registerButton.append(buttonText);
  registerButtonDiv.append(registerButton);
  moveInstrumentation(subscribeButtonLabelRow, registerButton);
  navSubscribe.append(registerButtonDiv);
  topContent.append(navSubscribe);

  const nav = document.createElement('div');
  nav.classList.add('cmp-footer__nav');

  const navItemsLeft = document.createElement('div');
  navItemsLeft.classList.add('cmp-footer__nav-items', 'cmp-navigation__group--left');
  const navLeftWrapper = document.createElement('div');
  navLeftWrapper.classList.add('navigation');
  const navLeft = document.createElement('nav');
  navLeft.classList.add('cmp-navigation');
  navLeft.setAttribute('role', 'navigation');
  const navLeftUl = document.createElement('ul');
  navLeftUl.classList.add('cmp-navigation__group');

  const navItemsRight = document.createElement('div');
  navItemsRight.classList.add('cmp-footer__nav-items', 'cmp-navigation__group--right');
  const navRightWrapper = document.createElement('div');
  navRightWrapper.classList.add('navigation');
  const navRight = document.createElement('nav');
  navRight.classList.add('cmp-navigation');
  navRight.setAttribute('role', 'navigation');
  const navRightUl = document.createElement('ul');
  navRightUl.classList.add('cmp-navigation__group');

  const footerLinkItems = itemRows.filter((row) => row.children.length === 3);
  const socialLinkItems = itemRows.filter((row) => row.children.length === 1);

  footerLinkItems.forEach((row, index) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');

    const link = document.createElement('a');
    link.classList.add('cmp-navigation__item-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.textContent = labelCell.textContent.trim();

    const subListContainer = document.createElement('div');
    subListContainer.innerHTML = hierarchyTreeCell.innerHTML; // Read richtext via innerHTML
    const subList = subListContainer.querySelector('ul');

    if (subList) {
      const trigger = document.createElement('span'); // Use span for trigger if no direct link
      trigger.textContent = labelCell.textContent.trim();
      trigger.classList.add('cmp-navigation__item-link', 'has-sub-child-trigger');
      li.append(trigger);

      const subLinksWrapper = document.createElement('div');
      subLinksWrapper.classList.add('cmp-navigation__sub-links');
      subLinksWrapper.append(subList);
      transformNestedLists(subList); // Apply recursive transformation
      li.append(subLinksWrapper);

      trigger.addEventListener('click', () => {
        li.classList.toggle('active');
        subLinksWrapper.classList.toggle('active');
      });
      moveInstrumentation(hierarchyTreeCell, subLinksWrapper); // Move instrumentation for richtext
    } else {
      li.append(link);
    }

    moveInstrumentation(row, li);

    if (index % 2 === 0) {
      navLeftUl.append(li);
    } else {
      navRightUl.append(li);
    }
  });

  navLeft.append(navLeftUl);
  navLeftWrapper.append(navLeft);
  navItemsLeft.append(navLeftWrapper);
  nav.append(navItemsLeft);

  navRight.append(navRightUl);
  navRightWrapper.append(navRight);
  navItemsRight.append(navRightWrapper);
  nav.append(navItemsRight);

  topContent.append(nav);
  root.append(topContent);

  const bottomContent = document.createElement('div');
  bottomContent.classList.add('cmp-footer__bottom-content');
  const bottomContainer = document.createElement('div');
  bottomContainer.classList.add('cmp-footer__container');

  const itcTitles = document.createElement('div');
  itcTitles.classList.add('cmp-footer__ITC-Titles');

  const itcPortalAnchor = document.createElement('a');
  itcPortalAnchor.classList.add('desc-1');
  const foundItcPortalLink = itcPortalLinkRow.querySelector('a');
  if (foundItcPortalLink) {
    itcPortalAnchor.href = foundItcPortalLink.href;
    itcPortalAnchor.textContent = 'ITC Portal';
    itcPortalAnchor.target = '_blank';
  }
  moveInstrumentation(itcPortalLinkRow, itcPortalAnchor);
  itcTitles.append(itcPortalAnchor);

  const copyrightP = document.createElement('p');
  copyrightP.classList.add('desc-1');
  copyrightP.textContent = copyrightTextRow.textContent.trim();
  moveInstrumentation(copyrightTextRow, copyrightP);
  itcTitles.append(copyrightP);
  bottomContainer.append(itcTitles);

  const socialMedia = document.createElement('div');
  socialMedia.classList.add('cmp-footer__social-media');

  socialLinkItems.forEach((row) => {
    const [socialLinkCell] = [...row.children]; // Use named destructuring
    const socialAnchor = document.createElement('a');
    const foundSocialLink = socialLinkCell.querySelector('a');
    if (foundSocialLink) {
      socialAnchor.href = foundSocialLink.href;
      socialAnchor.target = '_blank';
      // Determine icon class based on href content
      if (socialAnchor.href.includes('instagram')) {
        socialAnchor.classList.add('icon-instagram');
        socialAnchor.setAttribute('data-social', 'instagram');
      } else if (socialAnchor.href.includes('facebook')) {
        socialAnchor.classList.add('icon-facebook'); // Corrected class name
        socialAnchor.setAttribute('data-social', 'facebook');
      } else if (socialAnchor.href.includes('twitter')) {
        socialAnchor.classList.add('icon-twitter');
        socialAnchor.setAttribute('data-social', 'twitter');
      } else if (socialAnchor.href.includes('youtube')) {
        socialAnchor.classList.add('icon-youtube');
        socialAnchor.setAttribute('data-social', 'youtube');
      }
    }
    moveInstrumentation(row, socialAnchor);
    socialMedia.append(socialAnchor);
  });
  bottomContainer.append(socialMedia);
  bottomContent.append(bottomContainer);
  root.append(bottomContent);

  // Move instrumentation for container placeholders
  // The original JS had placeholders for these, but they were not actual rows in block.children.
  // The itemRows filter handles the actual content.
  // We need to ensure that the original placeholder divs are instrumented if they exist in the block.
  // Based on the provided block.children, the container placeholders (footerLinksLeftContainer, footerLinksRightContainer, footerSocialLinksContainer)
  // were declared in the destructuring but not actually present as distinct rows in the block.children array.
  // The itemRows are filtered from the remaining children.
  // If these placeholders were meant to be actual rows, the destructuring would need to be adjusted.
  // Assuming they are not actual rows but conceptual containers, we remove the unused moveInstrumentation calls.

  block.replaceChildren(root);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
