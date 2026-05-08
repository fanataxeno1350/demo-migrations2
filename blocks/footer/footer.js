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
      subWrap.classList.add('has-footer-sub-child');
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
  const allRows = [...block.children];

  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');
  footerMain.append(container);

  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  container.append(footerHeader);

  const logoWrap = document.createElement('div');
  logoWrap.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeader.append(logoWrap);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoWrap.append(logoDiv);

  // Logo and Logo Link
  const [logoRow, logoLinkRow, ...remainingRows] = allRows;

  const logoPicture = logoRow.querySelector('picture');
  const logoAnchor = logoLinkRow.querySelector('a');

  if (logoPicture && logoAnchor) {
    const brandLink = document.createElement('a');
    brandLink.href = logoAnchor.href;
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      brandLink.append(optimizedPic);
    }
    moveInstrumentation(logoRow, brandLink);
    moveInstrumentation(logoLinkRow, brandLink);
    logoDiv.append(brandLink);
  } else if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoDiv.append(optimizedPic);
    }
    moveInstrumentation(logoRow, logoDiv);
  }

  const socialWrapCol = document.createElement('div');
  socialWrapCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialWrapCol);

  const socialWrapUl = document.createElement('ul');
  socialWrapUl.classList.add('social-wrap');
  socialWrapCol.append(socialWrapUl);

  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBox.append(footerMenuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);

  const copyrightRow = allRows[allRows.length - 1];
  const copyrightText = copyrightRow.children[0]?.textContent.trim() || '';

  const navSectionRows = [];
  const legalLinkRows = [];
  const socialLinkRows = [];

  // Start processing from the 3rd row (index 2) up to the second to last row (copyrightRow)
  for (let i = 2; i < allRows.length - 1; i += 1) {
    const row = allRows[i];
    if (row.children.length === 3) { // footer-section-item: title, link, sectionLinks (richtext)
      navSectionRows.push(row);
    } else if (row.children.length === 2) {
      // Differentiate between footer-link-item and footer-social-item
      // footer-social-item has an aem-content link and a richtext hierarchy-tree (ul)
      // footer-link-item has a text label and an aem-content link
      const [cell0, cell1] = [...row.children];
      if (cell0.querySelector('a') && cell1.querySelector('ul')) { // socialLink (aem-content), hierarchy-tree (richtext)
        socialLinkRows.push(row);
      } else { // label (text), link (aem-content)
        legalLinkRows.push(row);
      }
    }
  }

  // Social Links
  socialLinkRows.forEach((row) => {
    const [socialLinkCell, hierarchyTreeCell] = [...row.children];

    const socialAnchor = socialLinkCell?.querySelector('a');
    const socialUl = hierarchyTreeCell?.querySelector('ul'); // This is the hierarchy-tree content

    if (socialAnchor) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = socialAnchor.href;
      link.target = '_blank';

      // Determine social icon based on href
      if (link.href.includes('facebook.com')) {
        li.classList.add('fb');
        link.innerHTML = '<svg width="30" height="30" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.0003,10.675C14.0323,10.675,9.06636,15.641,9.06636,21.709C9.06636,26.284,12.0543,30.225,15.9473,31.997V23.411H12.9083V19.437H15.9473V16.584C15.9473,13.559,17.7173,12.075,20.3283,12.075C21.6293,12.075,22.5583,12.167,22.8783,12.213V15.539H21.1893C19.7283,15.539,19.4503,16.229,19.4503,17.269V19.437H22.8793L22.3643,23.411H19.4503V31.997C24.2753,30.073,28.4343,26.246,28.4343,21.709C28.4343,15.641,23.4683,10.675,20.0003,10.675Z" fill="white"/></svg>';
      } else if (link.href.includes('twitter.com')) {
        li.classList.add('tw');
        link.innerHTML = '<svg width="30" height="30" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35.4179,12.666C34.1769,13.224,32.8719,13.596,31.5589,13.778C32.9659,12.944,33.9929,11.614,34.4759,10.074C33.1899,10.858,31.7999,11.438,30.3299,11.746C29.1449,10.476,27.4929,9.743,25.7449,9.743C22.4399,9.743,19.7549,12.428,19.7549,15.732C19.7549,16.207,19.7079,16.664,19.4519,17.096C14.6279,16.857,10.3029,14.398,7.44893,10.447C6.94593,11.297,6.65593,12.248,6.65593,13.266C6.65593,15.298,7.69993,17.174,9.26093,18.265C8.06093,18.228,6.96693,17.889,6.00693,17.349C6.00693,17.383,6.00693,17.427,6.00693,17.471C6.00693,20.336,7.98593,22.748,10.6199,23.296C10.1449,23.427,9.64593,23.494,9.14693,23.494C8.78593,23.494,8.43493,23.474,8.09393,23.411C8.82893,25.781,10.9159,27.461,13.3299,27.501C11.7019,28.526,9.93893,29.143,8.04893,29.143C7.41393,29.143,6.79493,29.112,6.18893,29.042C8.48493,30.486,11.2259,31.357,14.0659,31.357C25.7329,31.357,32.0619,21.787,32.0619,16.237C32.0619,16.068,32.0579,15.899,32.0499,15.731C33.3859,14.771,34.5269,13.841,35.4179,12.666Z" fill="white"/></svg>';
      } else if (link.href.includes('instagram.com')) {
        li.classList.add('inst');
        link.innerHTML = '<svg width="30" height="30" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28.4343,17.343C28.4343,14.704,26.2903,12.561,23.6513,12.561H15.6893C13.0503,12.561,10.9063,14.704,10.9063,17.343V25.383C10.9063,27.922,13.0503,30.066,15.6893,30.066H23.6513C26.2903,30.066,28.4343,27.922,28.4343,25.383V17.343Z" fill="white"/><path d="M23.6513,33.066C11.4603,33.066,9.06633,27.253,9.06633,21.7095C9.06633,16.166,11.4603,10.353,23.6513,10.353C35.8423,10.353,38.2463,16.166,38.2463,21.7095C38.2463,27.253,35.8423,33.066,23.6513,33.066ZM23.6513,14.561C25.1743,14.561,26.4193,15.806,26.4193,17.33V25.421C26.4193,26.945,25.1743,28.19,23.6513,28.19H15.6463C14.1233,28.19,12.8783,26.945,12.8783,25.421V17.33C12.8783,15.806,14.1233,14.561,15.6463,14.561H23.6513ZM28.4343,14.561C27.6173,14.561,26.9583,13.902,26.9583,13.083C26.9583,12.266,27.6173,11.607,28.4343,11.607C29.2513,11.607,29.9103,12.266,29.9103,13.083C29.9103,13.902,29.2513,14.561,28.4343,14.561ZM19.6623,17.33C16.9523,17.33,14.7463,19.536,14.7463,22.248C14.7463,24.958,16.9523,27.164,19.6623,27.164C22.3723,27.164,24.5783,24.958,24.5783,22.248C24.5783,19.536,22.3723,17.33,19.6623,17.33Z" fill="white"/></svg>';
      } else if (link.href.includes('youtube.com')) {
        li.classList.add('yt');
        link.innerHTML = '<svg width="30" height="30" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35.4179,12.666C34.1769,13.224,32.8249,13.596,31.5589,13.778C32.9659,12.944,33.9929,11.614,34.4759,10.074C33.1899,10.858,31.7999,11.438,30.3299,11.746C29.1449,10.476,27.4929,9.743,25.7449,9.743C22.4399,9.743,19.7549,12.428,19.7549,15.732C19.7549,16.207,19.7079,16.664,19.4519,17.096C14.6279,16.857,10.3029,14.398,7.44893,10.447C6.94593,11.297,6.65593,12.248,6.65593,13.266C6.65593,15.298,7.69993,17.174,9.26093,18.265C8.06093,18.228,6.96693,17.889,6.00693,17.349C6.00693,17.383,6.00693,17.427,6.00693,17.471C6.00693,20.336,7.98593,22.748,10.6199,23.296C10.1449,23.427,9.64593,23.494,9.14693,23.494C8.78593,23.494,8.43493,23.474,8.09393,23.411C8.82893,25.781,10.9159,27.461,13.3299,27.501C11.7019,28.526,9.93893,29.143,8.04893,29.143C7.41393,29.143,6.79493,29.112,6.18893,29.042C8.48493,30.486,11.2259,31.357,14.0659,31.357C25.7329,31.357,32.0619,21.787,32.0619,16.237C32.0619,16.068,32.0579,15.899,32.0499,15.731C33.3859,14.771,34.5269,13.841,35.4179,12.666Z" fill="white"/></svg>';
      } else if (link.href.includes('linkedin.com')) {
        li.classList.add('in');
        link.innerHTML = '<svg width="30" height="30" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.06636,10.353V33.066H15.7573V21.709C15.7573,17.821,17.7573,16.415,20.0673,16.415C22.3573,16.415,23.4783,17.821,23.4783,21.709V33.066H30.1683V20.513C30.1683,13.596,26.5523,10.353,21.5243,10.353C19.4263,10.353,17.4873,11.264,15.7573,12.492V12.676H9.06636V10.353ZM5.55732,26.432C7.25432,26.432,8.60632,25.079,8.60632,23.383C8.60632,21.687,7.25432,20.334,5.55732,20.334C3.86132,20.334,2.50832,21.687,2.50832,23.383C2.50832,25.079,3.86132,26.432,5.55732,26.432Z" fill="white"/></svg>';
      }
      li.append(link);
      socialWrapUl.append(li);
      moveInstrumentation(row, li);
    }
  });

  // Footer Sections
  navSectionRows.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell] = [...row.children];
    const subList = sectionLinksCell?.querySelector('ul');
    const directHref = linkCell?.querySelector('a')?.href;

    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    footerMenu.append(linkBlocks);

    const head = document.createElement('div');
    head.classList.add('head');
    linkBlocks.append(head);

    const span = document.createElement('span');
    head.append(span);

    if (subList) {
      const titleLink = document.createElement('a');
      titleLink.href = directHref || 'javascript:void(0)';
      titleLink.textContent = titleCell.textContent.trim();
      span.append(titleLink);

      const small = document.createElement('small');
      small.dataset.once = 'footerMobileInner';
      span.append(small);

      const footerInnerList = document.createElement('ul');
      footerInnerList.classList.add('footer-inner-list');
      // Move children from the authored UL directly to the new UL
      while (subList.firstChild) {
        footerInnerList.append(subList.firstChild);
      }
      moveInstrumentation(sectionLinksCell, footerInnerList); // Move instrumentation from the cell containing the UL

      // Transform nested lists
      transformNestedLists(footerInnerList);

      linkBlocks.append(footerInnerList);

      titleLink.addEventListener('click', (e) => {
        e.preventDefault();
        footerInnerList.classList.toggle('active');
        small.classList.toggle('active');
      });
    } else {
      const anchor = document.createElement('a');
      if (directHref) anchor.href = directHref;
      anchor.textContent = titleCell.textContent.trim();
      span.append(anchor);
    }
    moveInstrumentation(row, linkBlocks);
  });

  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNavUl);

  // Legal Links
  legalLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const link = linkCell.querySelector('a');
    const label = labelCell.textContent.trim();

    if (link) {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = label;
      li.append(anchor);
      secondaryNavUl.append(li);
      moveInstrumentation(row, li);
    }
  });

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = copyrightText;
  copyrightWrap.append(copyrightTextCol);
  moveInstrumentation(copyrightRow, copyrightTextCol);

  block.replaceChildren(footerMain);

  // Optimize images
  footerMain.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
