import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root rows based on BlockJson model and content detection
  // block.children[0]: field="followUsTitle" label="Follow Us Title" type=text
  // block.children[1]: field="logo" label="Footer Logo" type=reference
  // block.children[2]: field="logoLink" label="Footer Logo Link" type=aem-content
  // Remaining rows are item rows for footer-link-item and footer-social-item
  const allRows = [...block.children];

  const followUsTitleRow = allRows.find((row) => row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a'));
  const logoRow = allRows.find((row) => row.querySelector('picture'));
  const logoLinkRow = allRows.find((row) => row.children.length === 1 && row.querySelector('a') && !logoRow?.contains(row));

  const itemRows = allRows.filter(
    (row) => row.children.length === 2,
  );

  const footerLinkRows = itemRows.filter(
    (row) => row.children[0].textContent.trim() !== 'Facebook'
      && row.children[0].textContent.trim() !== 'Instagram'
      && row.children[0].textContent.trim() !== 'Youtube'
      && row.children[0].textContent.trim() !== 'X-twitter',
  );

  const footerSocialLinkRows = itemRows.filter(
    (row) => row.children[0].textContent.trim() === 'Facebook'
      || row.children[0].textContent.trim() === 'Instagram'
      || row.children[0].textContent.trim() === 'Youtube'
      || row.children[0].textContent.trim() === 'X-twitter',
  );

  const root = document.createElement('div');
  root.classList.add('elementor', 'elementor-40', 'elementor-location-footer');

  const mainContainer = document.createElement('div');
  mainContainer.classList.add('elementor-element', 'elementor-element-fa8725a', 'e-flex', 'e-con-boxed', 'e-con', 'e-parent', 'e-lazyloaded');
  mainContainer.setAttribute('data-id', 'fa8725a');
  mainContainer.setAttribute('data-element_type', 'container');
  mainContainer.setAttribute('data-settings', '{"background_background":"classic"}');

  const innerContainer = document.createElement('div');
  innerContainer.classList.add('e-con-inner');

  const legalLinksContainer = document.createElement('div');
  legalLinksContainer.classList.add('elementor-element', 'elementor-element-dbd8f1f', 'e-con-full', 'e-flex', 'e-con', 'e-child');
  legalLinksContainer.setAttribute('data-id', 'dbd8f1f');
  legalLinksContainer.setAttribute('data-element_type', 'container');

  footerLinkRows.forEach((row, index) => {
    // Fixed schema for footer-link-item: [label, link]
    const [labelCell, linkCell] = [...row.children];

    const legalLinkElement = document.createElement('div');
    legalLinkElement.classList.add('elementor-element', `elementor-element-${(index + 7).toString(16)}`, 'elementor-widget', 'elementor-widget-heading');
    legalLinkElement.setAttribute('data-id', (index + 7).toString(16));
    legalLinkElement.setAttribute('data-element_type', 'widget');
    legalLinkElement.setAttribute('data-widget_type', 'heading.default');

    const widgetContainer = document.createElement('div');
    widgetContainer.classList.add('elementor-widget-container');

    const heading = document.createElement('h2');
    heading.classList.add('elementor-heading-title', 'elementor-size-default');

    const anchor = document.createElement('a');
    if (linkCell) {
      anchor.href = linkCell.querySelector('a')?.href || '';
    }
    anchor.textContent = labelCell ? labelCell.textContent.trim() : '';
    moveInstrumentation(row, anchor); // Move instrumentation from the item row to the anchor

    heading.append(anchor);
    widgetContainer.append(heading);
    legalLinkElement.append(widgetContainer);
    legalLinksContainer.append(legalLinkElement);
  });

  const socialLinksContainer = document.createElement('div');
  socialLinksContainer.classList.add('elementor-element', 'elementor-element-e403dbb', 'e-con-full', 'e-flex', 'e-con', 'e-child');
  socialLinksContainer.setAttribute('data-id', 'e403dbb');
  socialLinksContainer.setAttribute('data-element_type', 'container');

  const followUsTitleElement = document.createElement('div');
  followUsTitleElement.classList.add('elementor-element', 'elementor-element-3c76dc7', 'elementor-widget', 'elementor-widget-heading');
  followUsTitleElement.setAttribute('data-id', '3c76dc7');
  followUsTitleElement.setAttribute('data-element_type', 'widget');
  followUsTitleElement.setAttribute('data-widget_type', 'heading.default');

  const followUsWidgetContainer = document.createElement('div');
  followUsWidgetContainer.classList.add('elementor-widget-container');

  const followUsHeading = document.createElement('h2');
  followUsHeading.classList.add('elementor-heading-title', 'elementor-size-default');
  if (followUsTitleRow) {
    // followUsTitle is a text cell, read textContent
    followUsHeading.textContent = followUsTitleRow.children[0]?.textContent.trim() || '';
    moveInstrumentation(followUsTitleRow, followUsHeading);
  }
  followUsWidgetContainer.append(followUsHeading);
  followUsTitleElement.append(followUsWidgetContainer);
  socialLinksContainer.append(followUsTitleElement);

  const socialIconsElement = document.createElement('div');
  socialIconsElement.classList.add('elementor-element', 'elementor-element-0744dfb', 'e-grid-align-left', 'elementor-shape-rounded', 'elementor-grid-0', 'elementor-widget', 'elementor-widget-social-icons');
  socialIconsElement.setAttribute('data-id', '0744dfb');
  socialIconsElement.setAttribute('data-element_type', 'widget');
  socialIconsElement.setAttribute('data-widget_type', 'social-icons.default');

  const socialWidgetContainer = document.createElement('div');
  socialWidgetContainer.classList.add('elementor-widget-container');

  const socialIconsWrapper = document.createElement('div');
  socialIconsWrapper.classList.add('elementor-social-icons-wrapper', 'elementor-grid');
  socialIconsWrapper.setAttribute('role', 'list');

  footerSocialLinkRows.forEach((row, index) => {
    // Fixed schema for footer-social-item: [label, link]
    const [labelCell, linkCell] = [...row.children];

    const socialGridItem = document.createElement('span');
    socialGridItem.classList.add('elementor-grid-item');
    socialGridItem.setAttribute('role', 'listitem');

    const socialIconAnchor = document.createElement('a');
    socialIconAnchor.classList.add('elementor-icon', 'elementor-social-icon', `elementor-social-icon-${labelCell.textContent.trim().toLowerCase()}`, `elementor-repeater-item-${(index + 8).toString(16)}`);
    if (linkCell) {
      socialIconAnchor.href = linkCell.querySelector('a')?.href || '';
    }
    socialIconAnchor.target = '_blank';

    const screenOnlySpan = document.createElement('span');
    screenOnlySpan.classList.add('elementor-screen-only');
    screenOnlySpan.textContent = labelCell ? labelCell.textContent.trim() : '';

    socialIconAnchor.append(screenOnlySpan);

    // Add SVG icon based on label
    let svgPath = '';
    let svgClass = '';
    switch (labelCell.textContent.trim().toLowerCase()) {
      case 'facebook':
        svgPath = '<path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path>';
        svgClass = 'e-fab-facebook';
        break;
      case 'instagram':
        svgPath = '<path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>';
        svgClass = 'e-fab-instagram';
        break;
      case 'youtube':
        svgPath = '<path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path>';
        svgClass = 'e-fab-youtube';
        break;
      case 'x-twitter':
        svgPath = '<path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>';
        svgClass = 'e-fab-x-twitter';
        break;
      default:
        break;
    }

    if (svgPath) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('e-font-icon-svg', svgClass);
      svg.setAttribute('viewBox', '0 0 512 512');
      svg.innerHTML = svgPath;
      socialIconAnchor.append(svg);
    }
    moveInstrumentation(row, socialIconAnchor); // Move instrumentation from the item row to the anchor
    socialGridItem.append(socialIconAnchor);
    socialIconsWrapper.append(socialGridItem);
  });

  socialWidgetContainer.append(socialIconsWrapper);
  socialIconsElement.append(socialWidgetContainer);
  socialLinksContainer.append(socialIconsElement);

  const logoContainer = document.createElement('div');
  logoContainer.classList.add('elementor-element', 'elementor-element-2779fc3', 'e-con-full', 'e-flex', 'e-con', 'e-child');
  logoContainer.setAttribute('data-id', '2779fc3');
  logoContainer.setAttribute('data-element_type', 'container');

  const logoElement = document.createElement('div');
  logoElement.classList.add('elementor-element', 'elementor-element-0a043e5', 'elementor-widget', 'elementor-widget-theme-site-logo', 'elementor-widget-image');
  logoElement.setAttribute('data-id', '0a043e5');
  logoElement.setAttribute('data-element_type', 'widget');
  logoElement.setAttribute('data-widget_type', 'theme-site-logo.default');

  const logoWidgetContainer = document.createElement('div');
  logoWidgetContainer.classList.add('elementor-widget-container');

  const logoAnchor = document.createElement('a');
  if (logoLinkRow) {
    // logoLink is an aem-content cell, read href
    logoAnchor.href = logoLinkRow.children[0]?.querySelector('a')?.href || '#';
    moveInstrumentation(logoLinkRow, logoAnchor);
  } else {
    logoAnchor.href = '#';
  }

  if (logoRow) {
    // logo is a reference cell, read picture
    const picture = logoRow.children[0]?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '503' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        logoAnchor.append(optimizedPic);
      }
    }
    // moveInstrumentation for logoRow is already handled by the logoAnchor above
  }

  logoWidgetContainer.append(logoAnchor);
  logoElement.append(logoWidgetContainer);
  logoContainer.append(logoElement);

  innerContainer.append(legalLinksContainer, socialLinksContainer, logoContainer);
  mainContainer.append(innerContainer);
  root.append(mainContainer);

  block.replaceChildren(root);
}
