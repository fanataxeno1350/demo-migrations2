import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Parse root fields first, matching BlockJson order
  // [0]: footerLinks (container, handled by filter below)
  // [1]: followUsLabel (text)
  // [2]: footerSocialLinks (container, handled by filter below)
  // [3]: logo (reference)
  // [4]: logoLink (aem-content)

  // Identify root rows based on content and position
  const followUsLabelRow = children.find(
    (row) => row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a'),
  );
  const logoRow = children.find((row) => row.children.length === 1 && row.querySelector('picture'));
  const logoLinkRow = children.find(
    (row) => row.children.length === 1 && row.querySelector('a') && !row.querySelector('picture'),
  );

  // Filter for item rows (footer-link-item and footer-social-item)
  // Both have 2 cells, so we need to distinguish them by position or content.
  // Assuming footer-link-item rows appear before footer-social-item rows based on BlockJson order.
  const allItemRows = children.filter((row) => row.children.length === 2);

  // Distinguish footer-link-item and footer-social-item based on the order in BlockJson
  // footerLinks container is before footerSocialLinks container.
  // We'll assume the first set of 2-cell rows are footer links, and the subsequent ones are social links.
  const footerLinkRows = [];
  const socialLinkRows = [];

  let foundSocialLinks = false;
  allItemRows.forEach((row) => {
    // A heuristic to distinguish: social links have specific text content (facebook, instagram etc.)
    // This is a bit fragile, but better than arbitrary split if no other structural difference.
    // A more robust solution would involve a distinct cell type or a different number of cells.
    const firstCellText = row.children[0]?.textContent.trim().toLowerCase();
    if (
      !foundSocialLinks &&
      (firstCellText === 'facebook' ||
        firstCellText === 'instagram' ||
        firstCellText === 'youtube' ||
        firstCellText === 'x-twitter')
    ) {
      foundSocialLinks = true;
    }

    if (foundSocialLinks) {
      socialLinkRows.push(row);
    } else {
      footerLinkRows.push(row);
    }
  });

  const root = document.createElement('div');
  root.classList.add('elementor', 'elementor-40', 'elementor-location-footer');

  const mainContainer = document.createElement('div');
  mainContainer.classList.add(
    'elementor-element',
    'elementor-element-fa8725a',
    'e-flex',
    'e-con-boxed',
    'e-con',
    'e-parent',
    'e-lazyloaded',
  );

  const innerContainer = document.createElement('div');
  innerContainer.classList.add('e-con-inner');

  const linksContainer = document.createElement('div');
  linksContainer.classList.add(
    'elementor-element',
    'elementor-element-dbd8f1f',
    'e-con-full',
    'e-flex',
    'e-con',
    'e-child',
  );

  footerLinkRows.forEach((row, index) => {
    // FIXED: Use array destructuring for fixed-schema item rows
    const [labelCell, linkCell] = [...row.children];

    const linkWrapper = document.createElement('div');
    linkWrapper.classList.add(
      'elementor-element',
      `elementor-element-${(1000 + index).toString(16)}`, // Unique ID
      'elementor-widget',
      'elementor-widget-heading',
    );

    const widgetContainer = document.createElement('div');
    widgetContainer.classList.add('elementor-widget-container');

    const heading = document.createElement('h2');
    heading.classList.add('elementor-heading-title', 'elementor-size-default');

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell?.textContent.trim() || '';

    moveInstrumentation(row, anchor);
    heading.append(anchor);
    widgetContainer.append(heading);
    linkWrapper.append(widgetContainer);
    linksContainer.append(linkWrapper);
  });

  const socialContainer = document.createElement('div');
  socialContainer.classList.add(
    'elementor-element',
    'elementor-element-e403dbb',
    'e-con-full',
    'e-flex',
    'e-con',
    'e-child',
  );

  const followUsHeadingWrapper = document.createElement('div');
  followUsHeadingWrapper.classList.add(
    'elementor-element',
    'elementor-element-3c76dc7',
    'elementor-widget',
    'elementor-widget-heading',
  );
  const followUsWidgetContainer = document.createElement('div');
  followUsWidgetContainer.classList.add('elementor-widget-container');
  const followUsHeading = document.createElement('h2');
  followUsHeading.classList.add('elementor-heading-title', 'elementor-size-default');
  followUsHeading.textContent = followUsLabelRow?.textContent.trim() || '';
  if (followUsLabelRow) {
    moveInstrumentation(followUsLabelRow, followUsHeading);
  }
  followUsWidgetContainer.append(followUsHeading);
  followUsHeadingWrapper.append(followUsWidgetContainer);
  socialContainer.append(followUsHeadingWrapper);

  const socialIconsWrapper = document.createElement('div');
  socialIconsWrapper.classList.add(
    'elementor-element',
    'elementor-element-0744dfb',
    'e-grid-align-left',
    'elementor-shape-rounded',
    'elementor-grid-0',
    'elementor-widget',
    'elementor-widget-social-icons',
  );
  const socialWidgetContainer = document.createElement('div');
  socialWidgetContainer.classList.add('elementor-widget-container');
  const socialGrid = document.createElement('div');
  socialGrid.classList.add('elementor-social-icons-wrapper', 'elementor-grid');
  socialGrid.setAttribute('role', 'list');

  socialLinkRows.forEach((row, index) => {
    // FIXED: Use array destructuring for fixed-schema item rows
    const [labelCell, linkCell] = [...row.children];

    const gridItem = document.createElement('span');
    gridItem.classList.add('elementor-grid-item');
    gridItem.setAttribute('role', 'listitem');

    const socialLink = document.createElement('a');
    socialLink.classList.add(
      'elementor-icon',
      'elementor-social-icon',
      `elementor-social-icon-${labelCell.textContent.trim().toLowerCase()}`,
      `elementor-repeater-item-${(2000 + index).toString(16)}`, // Unique ID
    );
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      socialLink.href = foundLink.href;
    }
    socialLink.target = '_blank';

    const screenOnlySpan = document.createElement('span');
    screenOnlySpan.classList.add('elementor-screen-only');
    screenOnlySpan.textContent = labelCell.textContent.trim();
    socialLink.append(screenOnlySpan);

    // Add SVG icons based on label text
    const platform = labelCell.textContent.trim().toLowerCase();
    let svgPath = '';
    let svgClass = '';
    if (platform === 'facebook') {
      svgPath =
        'M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z';
      svgClass = 'e-fab-facebook';
    } else if (platform === 'instagram') {
      svgPath =
        'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z';
      svgClass = 'e-fab-instagram';
    } else if (platform === 'youtube') {
      svgPath =
        'M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z';
      svgClass = 'e-fab-youtube';
    } else if (platform === 'x-twitter') {
      svgPath =
        'M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z';
      svgClass = 'e-fab-x-twitter';
    }

    if (svgPath) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('e-font-icon-svg', svgClass);
      svg.setAttribute('viewBox', '0 0 512 512');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', svgPath);
      svg.append(path);
      socialLink.append(svg);
    }

    moveInstrumentation(row, socialLink);
    gridItem.append(socialLink);
    socialGrid.append(gridItem);
  });

  socialWidgetContainer.append(socialGrid);
  socialIconsWrapper.append(socialWidgetContainer);
  socialContainer.append(socialIconsWrapper);

  const logoContainer = document.createElement('div');
  logoContainer.classList.add(
    'elementor-element',
    'elementor-element-2779fc3',
    'e-con-full',
    'e-flex',
    'e-con',
    'e-child',
  );

  const logoWidget = document.createElement('div');
  logoWidget.classList.add(
    'elementor-element',
    'elementor-element-0a043e5',
    'elementor-widget',
    'elementor-widget-theme-site-logo',
    'elementor-widget-image',
  );
  const logoWidgetContainer = document.createElement('div');
  logoWidgetContainer.classList.add('elementor-widget-container');

  const logoLink = document.createElement('a');
  if (logoLinkRow) {
    const foundLogoLink = logoLinkRow.querySelector('a');
    if (foundLogoLink) {
      logoLink.href = foundLogoLink.href;
    }
    moveInstrumentation(logoLinkRow, logoLink);
  }

  if (logoRow) {
    const logoPicture = logoRow.querySelector('picture');
    if (logoPicture) {
      const img = logoPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '503' }]);
        // FIXED: moveInstrumentation should target the img element within the optimized picture
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        logoLink.append(optimizedPic);
      }
    }
    moveInstrumentation(logoRow, logoLink);
  }

  logoWidgetContainer.append(logoLink);
  logoWidget.append(logoWidgetContainer);
  logoContainer.append(logoWidget);

  innerContainer.append(linksContainer, socialContainer, logoContainer);
  mainContainer.append(innerContainer);
  root.append(mainContainer);

  block.replaceChildren(root);
}
