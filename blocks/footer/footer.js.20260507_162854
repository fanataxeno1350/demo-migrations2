import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Reorder row detection to match BlockJson model order:
  // 1. followUsHeading (text, single cell, no picture/link)
  // 2. logo (reference, single cell, has picture)
  // 3. logoLink (aem-content, single cell, has link)
  // 4. footerLinkRows (container, two cells, no picture/link)
  // 5. footerSocialLinkRows (container, two cells, has link)

  const followUsHeadingRow = children.find((row) => row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a'));
  const logoRow = children.find((row) => row.children.length === 1 && row.querySelector('picture'));
  const logoLinkRow = children.find((row) => row.children.length === 1 && row.querySelector('a'));

  // Filter out the single-cell rows already identified
  const remainingRows = children.filter((row) =>
    row !== followUsHeadingRow && row !== logoRow && row !== logoLinkRow
  );

  const footerLinkRows = remainingRows.filter((row) => row.children.length === 2 && !row.querySelector('a'));
  const footerSocialLinkRows = remainingRows.filter((row) => row.children.length === 2 && row.querySelector('a'));

  const footerContainer = document.createElement('div');
  footerContainer.classList.add('elementor-element', 'elementor-element-fa8725a', 'e-flex', 'e-con-boxed', 'e-con', 'e-parent', 'e-lazyloaded');

  const innerCon = document.createElement('div');
  innerCon.classList.add('e-con-inner');
  footerContainer.append(innerCon);

  const legalLinksCon = document.createElement('div');
  legalLinksCon.classList.add('elementor-element', 'elementor-element-dbd8f1f', 'e-con-full', 'e-flex', 'e-con', 'e-child');
  innerCon.append(legalLinksCon);

  footerLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];

    const elementorWidgetHeading = document.createElement('div');
    elementorWidgetHeading.classList.add('elementor-element', 'elementor-widget', 'elementor-widget-heading');
    moveInstrumentation(row, elementorWidgetHeading);

    const widgetContainer = document.createElement('div');
    widgetContainer.classList.add('elementor-widget-container');
    elementorWidgetHeading.append(widgetContainer);

    const headingTitle = document.createElement('h2');
    headingTitle.classList.add('elementor-heading-title', 'elementor-size-default');

    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.textContent = labelCell.textContent.trim();
    headingTitle.append(link);
    widgetContainer.append(headingTitle);
    legalLinksCon.append(elementorWidgetHeading);
  });

  const followUsCon = document.createElement('div');
  followUsCon.classList.add('elementor-element', 'elementor-element-e403dbb', 'e-con-full', 'e-flex', 'e-con', 'e-child');
  innerCon.append(followUsCon);

  if (followUsHeadingRow) {
    const headingWidget = document.createElement('div');
    headingWidget.classList.add('elementor-element', 'elementor-element-3c76dc7', 'elementor-widget', 'elementor-widget-heading');
    moveInstrumentation(followUsHeadingRow, headingWidget);

    const headingContainer = document.createElement('div');
    headingContainer.classList.add('elementor-widget-container');
    headingWidget.append(headingContainer);

    const headingTitle = document.createElement('h2');
    headingTitle.classList.add('elementor-heading-title', 'elementor-size-default');
    headingTitle.textContent = followUsHeadingRow.textContent.trim();
    headingContainer.append(headingTitle);
    followUsCon.append(headingWidget);
  }

  const socialIconsWidget = document.createElement('div');
  socialIconsWidget.classList.add('elementor-element', 'elementor-element-0744dfb', 'e-grid-align-left', 'elementor-shape-rounded', 'elementor-grid-0', 'elementor-widget', 'elementor-widget-social-icons');
  followUsCon.append(socialIconsWidget);

  const socialWidgetContainer = document.createElement('div');
  socialWidgetContainer.classList.add('elementor-widget-container');
  socialIconsWidget.append(socialWidgetContainer);

  const socialIconsWrapper = document.createElement('div');
  socialIconsWrapper.classList.add('elementor-social-icons-wrapper', 'elementor-grid');
  socialIconsWrapper.setAttribute('role', 'list');
  socialWidgetContainer.append(socialIconsWrapper);

  footerSocialLinkRows.forEach((row) => {
    const [labelCell, socialLinkCell] = [...row.children];

    const gridItem = document.createElement('span');
    gridItem.classList.add('elementor-grid-item');
    gridItem.setAttribute('role', 'listitem');
    moveInstrumentation(row, gridItem);

    const socialLink = document.createElement('a');
    socialLink.classList.add('elementor-icon', 'elementor-social-icon');
    const foundSocialLink = socialLinkCell.querySelector('a');
    if (foundSocialLink) {
      socialLink.href = foundSocialLink.href;
    }
    socialLink.setAttribute('target', '_blank');

    const screenOnly = document.createElement('span');
    screenOnly.classList.add('elementor-screen-only');
    screenOnly.textContent = labelCell.textContent.trim();
    socialLink.append(screenOnly);

    // Add SVG icon based on label or link content
    const labelText = labelCell.textContent.trim().toLowerCase();
    if (labelText.includes('facebook')) {
      socialLink.classList.add('elementor-social-icon-facebook', 'elementor-repeater-item-894622b');
      socialLink.innerHTML += '<svg class="e-font-icon-svg e-fab-facebook" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path></svg>';
    } else if (labelText.includes('instagram')) {
      socialLink.classList.add('elementor-social-icon-instagram', 'elementor-repeater-item-4aedf71');
      socialLink.innerHTML += '<svg class="e-font-icon-svg e-fab-instagram" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5 11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>';
    } else if (labelText.includes('youtube')) {
      socialLink.classList.add('elementor-social-icon-youtube', 'elementor-repeater-item-6d2e1de');
      socialLink.innerHTML += '<svg class="e-font-icon-svg e-fab-youtube" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path></svg>';
    } else if (labelText.includes('twitter') || labelText.includes('x')) {
      socialLink.classList.add('elementor-social-icon-x-twitter', 'elementor-repeater-item-1079e6e');
      socialLink.innerHTML += '<svg class="e-font-icon-svg e-fab-x-twitter" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>';
    }
    gridItem.append(socialLink);
    socialIconsWrapper.append(gridItem);
  });

  const logoWrapperCon = document.createElement('div');
  logoWrapperCon.classList.add('elementor-element', 'elementor-element-2779fc3', 'e-con-full', 'e-flex', 'e-con', 'e-child');
  innerCon.append(logoWrapperCon);

  if (logoRow && logoLinkRow) {
    const logoWidget = document.createElement('div');
    logoWidget.classList.add('elementor-element', 'elementor-element-0a043e5', 'elementor-widget', 'elementor-widget-theme-site-logo', 'elementor-widget-image');
    moveInstrumentation(logoRow, logoWidget); // Move instrumentation for the logo row
    // No need to moveInstrumentation for logoLinkRow separately if its content is just a link for the logo.

    const logoWidgetContainer = document.createElement('div');
    logoWidgetContainer.classList.add('elementor-widget-container');
    logoWidget.append(logoWidgetContainer);

    const logoLink = document.createElement('a');
    const foundLogoLink = logoLinkRow.querySelector('a');
    if (foundLogoLink) {
      logoLink.href = foundLogoLink.href;
    }

    const picture = logoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '503' }]);
        logoLink.append(optimizedPic);
      }
    }
    logoWidgetContainer.append(logoLink);
    logoWrapperCon.append(logoWidget);
  }

  block.replaceChildren(footerContainer);
}
