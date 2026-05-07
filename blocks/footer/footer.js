import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const logoRow = children[0];
  const logoLinkRow = children[1];
  const followUsLabelRow = children[2];

  const footerLinkRows = [];
  const footerSocialLinkRows = [];

  // Item rows start after the followUsLabelRow (index 3)
  const allItemRows = children.slice(3);

  // The BlockJson and original HTML imply a fixed order:
  // first all footer-link-item rows, then all footer-social-item rows.
  // We need to find the split point.
  // A simple way is to count how many footer-link-item rows are expected based on original HTML,
  // or use a more robust content check if the order isn't strictly fixed.
  // For this block, let's assume the first set of 2-cell rows are footer links,
  // and the subsequent 2-cell rows are social links.
  // The original HTML shows 3 footer-link-items, then 4 footer-social-items.
  // We'll use the presence of social media keywords in the link href to distinguish,
  // as the cell structure is identical for both item types.

  allItemRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    if (labelCell && linkCell && linkCell.querySelector('a')) {
      const linkHref = linkCell.querySelector('a').href.toLowerCase();
      if (linkHref.includes('facebook') || linkHref.includes('instagram') || linkHref.includes('youtube') || linkHref.includes('x.com')) {
        footerSocialLinkRows.push(row);
      } else {
        footerLinkRows.push(row);
      }
    }
  });

  const root = document.createElement('div');
  root.classList.add('elementor-element', 'elementor-element-fa8725a', 'e-flex', 'e-con-boxed', 'e-con', 'e-parent', 'e-lazyloaded');

  const innerCon = document.createElement('div');
  innerCon.classList.add('e-con-inner');
  root.append(innerCon);

  // Left column for links
  const leftCol = document.createElement('div');
  leftCol.classList.add('elementor-element', 'elementor-element-dbd8f1f', 'e-con-full', 'e-flex', 'e-con', 'e-child');
  innerCon.append(leftCol);

  footerLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const linkWrapper = document.createElement('div');
    linkWrapper.classList.add('elementor-element', 'elementor-widget', 'elementor-widget-heading'); // Use generic classes as specific ones are dynamic
    const widgetContainer = document.createElement('div');
    widgetContainer.classList.add('elementor-widget-container');
    const heading = document.createElement('h2');
    heading.classList.add('elementor-heading-title', 'elementor-size-default');

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();

    moveInstrumentation(row, linkWrapper);
    heading.append(anchor);
    widgetContainer.append(heading);
    linkWrapper.append(widgetContainer);
    leftCol.append(linkWrapper);
  });

  // Right column for social links
  const rightCol = document.createElement('div');
  rightCol.classList.add('elementor-element', 'elementor-element-e403dbb', 'e-con-full', 'e-flex', 'e-con', 'e-child');
  innerCon.append(rightCol);

  if (followUsLabelRow) {
    const followUsWrapper = document.createElement('div');
    followUsWrapper.classList.add('elementor-element', 'elementor-element-3c76dc7', 'elementor-widget', 'elementor-widget-heading');
    const widgetContainer = document.createElement('div');
    widgetContainer.classList.add('elementor-widget-container');
    const heading = document.createElement('h2');
    heading.classList.add('elementor-heading-title', 'elementor-size-default');
    heading.textContent = followUsLabelRow.children[0].textContent.trim();
    moveInstrumentation(followUsLabelRow, followUsWrapper);
    widgetContainer.append(heading);
    followUsWrapper.append(widgetContainer);
    rightCol.append(followUsWrapper);
  }

  if (footerSocialLinkRows.length > 0) {
    const socialIconsWrapper = document.createElement('div');
    socialIconsWrapper.classList.add('elementor-element', 'elementor-element-0744dfb', 'e-grid-align-left', 'elementor-shape-rounded', 'elementor-grid-0', 'elementor-widget', 'elementor-widget-social-icons');
    const widgetContainer = document.createElement('div');
    widgetContainer.classList.add('elementor-widget-container');
    const socialGrid = document.createElement('div');
    socialGrid.classList.add('elementor-social-icons-wrapper', 'elementor-grid');
    socialGrid.setAttribute('role', 'list');

    footerSocialLinkRows.forEach((row) => {
      const [socialLabelCell, socialLinkCell] = [...row.children];
      const gridItem = document.createElement('span');
      gridItem.classList.add('elementor-grid-item');
      gridItem.setAttribute('role', 'listitem');

      const anchor = document.createElement('a');
      const foundLink = socialLinkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
        anchor.target = '_blank'; // Assuming social links open in new tab
      }

      const screenOnlySpan = document.createElement('span');
      screenOnlySpan.classList.add('elementor-screen-only');
      screenOnlySpan.textContent = socialLabelCell.textContent.trim();
      anchor.append(screenOnlySpan);

      // Add appropriate social icon SVG based on the label or link href
      let iconClass = '';
      let fabClass = '';
      let svgPath = '';
      const socialLinkHref = foundLink ? foundLink.href.toLowerCase() : '';

      if (socialLinkHref.includes('facebook')) {
        iconClass = 'elementor-social-icon-facebook';
        fabClass = 'e-fab-facebook';
        svgPath = '<path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path>';
      } else if (socialLinkHref.includes('instagram')) {
        iconClass = 'elementor-social-icon-instagram';
        fabClass = 'e-fab-instagram';
        svgPath = '<path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>';
      } else if (socialLinkHref.includes('youtube')) {
        iconClass = 'elementor-social-icon-youtube';
        fabClass = 'e-fab-youtube';
        svgPath = '<path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path>';
      } else if (socialLinkHref.includes('x.com')) {
        iconClass = 'elementor-social-icon-x-twitter';
        fabClass = 'e-fab-x-twitter';
        svgPath = '<path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>';
      } else {
        // Default or generic icon if no match
        iconClass = 'elementor-social-icon-default';
        fabClass = 'e-fab-default'; // Use a default fab class if needed
        svgPath = '<path d="M0 0h24v24H0z" fill="none"></path>'; // Empty or generic path
      }

      anchor.classList.add('elementor-icon', 'elementor-social-icon', iconClass);
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('e-font-icon-svg', fabClass);
      svg.setAttribute('viewBox', '0 0 512 512'); // Adjust viewBox as needed
      svg.innerHTML = svgPath;
      anchor.append(svg);

      moveInstrumentation(row, gridItem);
      gridItem.append(anchor);
      socialGrid.append(gridItem);
    });

    widgetContainer.append(socialGrid);
    socialIconsWrapper.append(widgetContainer);
    rightCol.append(socialIconsWrapper);
  }

  // Logo at the bottom
  const logoBottomCol = document.createElement('div');
  logoBottomCol.classList.add('elementor-element', 'elementor-element-2779fc3', 'e-con-full', 'e-flex', 'e-con', 'e-child');
  innerCon.append(logoBottomCol);

  if (logoRow && logoLinkRow) {
    const logoWidget = document.createElement('div');
    logoWidget.classList.add('elementor-element', 'elementor-element-0a043e5', 'elementor-widget', 'elementor-widget-theme-site-logo', 'elementor-widget-image');
    const widgetContainer = document.createElement('div');
    widgetContainer.classList.add('elementor-widget-container');

    const anchor = document.createElement('a');
    const foundLink = logoLinkRow.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }

    const picture = logoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '503' }]); // Use original width
        moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
      }
    }

    moveInstrumentation(logoLinkRow, logoWidget);
    widgetContainer.append(anchor);
    logoWidget.append(widgetContainer);
    logoBottomCol.append(logoWidget);
  }

  block.replaceChildren(root);
}
