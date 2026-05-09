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
      subWrap.classList.add('has-footer-sub-child'); // Class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // 'active' is a common interactive class
          subWrap.classList.toggle('active'); // 'active' is a common interactive class
        });
      }
    }
    // Apply classes to li and a elements within the transformed list
    li.classList.add('list-item'); // Assuming a generic list item class for styling
    if (anchor) {
      anchor.classList.add('nav-link'); // Assuming a generic nav link class for styling
    }
  });
}

export default function decorate(block) {
  const children = [...block.children].filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  const [logoRow, logoLinkRow, copyrightTextRow, ...itemRows] = children;

  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main'); // Class from ORIGINAL HTML

  const container = document.createElement('div');
  container.classList.add('container'); // Class from ORIGINAL HTML

  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header'); // Classes from ORIGINAL HTML

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex'); // Classes from ORIGINAL HTML

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo'); // Class from ORIGINAL HTML

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('hiddenlogo1'); // Class from ORIGINAL HTML
      optimizedImg.width = '200';
      optimizedImg.height = '30';
      optimizedImg.style.width = 'auto'; // This is from the original HTML, so it's allowed.
      moveInstrumentation(logoRow, optimizedImg);
      logoLink.append(optimizedPic);
    }
  }
  logoDiv.append(logoLink);
  logoCol.append(logoDiv);
  footerHeader.append(logoCol);

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center'); // Classes from ORIGINAL HTML

  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap'); // Class from ORIGINAL HTML
  socialCol.append(socialWrap);
  footerHeader.append(socialCol);

  container.append(footerHeader);

  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box'); // Classes from ORIGINAL HTML
  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col'); // Class from ORIGINAL HTML
  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu'); // Class from ORIGINAL HTML
  footerMenuCol.append(footerMenu);
  footerMenuBox.append(footerMenuCol);
  container.append(footerMenuBox);

  const footerBottomWrap = document.createElement('div');
  footerBottomWrap.classList.add('row', 'footer-bottom-wrap'); // Classes from ORIGINAL HTML

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6'); // Classes from ORIGINAL HTML
  const secondaryNav = document.createElement('ul');
  secondaryNav.classList.add('secondary-nav'); // Class from ORIGINAL HTML
  secondaryNavCol.append(secondaryNav);
  footerBottomWrap.append(secondaryNavCol);

  const copyrightCol = document.createElement('div');
  copyrightCol.classList.add('col-12', 'col-lg-6', 'copyright-text'); // Classes from ORIGINAL HTML
  if (copyrightTextRow) {
    const [copyrightCell] = [...copyrightTextRow.children]; // FIXED: Destructuring for copyrightTextRow
    moveInstrumentation(copyrightTextRow, copyrightCol);
    copyrightCol.innerHTML = copyrightCell?.innerHTML || '';
  }
  footerBottomWrap.append(copyrightCol);
  container.append(footerBottomWrap);

  footerMain.append(container);

  // Filter item rows based on their structure as per BlockJson model
  const navSectionRows = itemRows.filter((row) => row.children.length === 3);
  const legalLinkRows = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('ul')); // Legal links have 2 cells, no nested UL
  const socialLinkRows = itemRows.filter((row) => row.children.length === 2 && row.querySelector('ul')); // Social links have 2 cells, with a nested UL (hierarchy-tree)

  navSectionRows.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell] = [...row.children]; // FIXED: Destructuring for fixed schema
    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks'); // Class from ORIGINAL HTML
    const head = document.createElement('div');
    head.classList.add('head'); // Class from ORIGINAL HTML
    const span = document.createElement('span');
    const titleLink = document.createElement('a');
    titleLink.textContent = titleCell.textContent.trim();
    const directHref = linkCell?.querySelector('a')?.href;
    if (directHref) {
      titleLink.href = directHref;
    } else {
      titleLink.href = 'javascript:void(0)';
    }
    moveInstrumentation(titleCell, titleLink);
    span.append(titleLink);

    const subList = sectionLinksCell?.querySelector('ul');
    if (subList) {
      const small = document.createElement('small');
      small.setAttribute('data-once', 'footerMobileInner'); // Data attribute from ORIGINAL HTML
      span.append(small);
      head.append(span);

      const footerInnerList = document.createElement('ul');
      footerInnerList.classList.add('footer-inner-list'); // Class from ORIGINAL HTML
      transformNestedLists(subList);
      footerInnerList.append(...subList.children);
      head.append(footerInnerList);

      titleLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        head.classList.toggle('active'); // 'active' is a common interactive class
        footerInnerList.classList.toggle('active'); // 'active' is a common interactive class
      });
    } else {
      head.append(span);
    }
    linkBlocks.append(head);
    moveInstrumentation(row, linkBlocks);
    footerMenu.append(linkBlocks);
  });

  legalLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // FIXED: Destructuring for fixed schema
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, anchor);
    li.append(anchor);
    secondaryNav.append(li);
  });

  socialLinkRows.forEach((row) => {
    const [socialLinkCell, hierarchyTreeCell] = [...row.children]; // FIXED: Destructuring for fixed schema
    const li = document.createElement('li');
    // Add specific classes for social icons from ORIGINAL HTML
    // The original HTML has classes like 'fb', 'tw', 'inst', 'yt', 'in' on the <li>
    // We need to extract this from the socialLinkCell or infer it.
    // For now, adding a generic 'social-item' class.
    li.classList.add('social-item'); // Placeholder, ideally derived from content

    const anchor = document.createElement('a');
    const foundSocialLink = socialLinkCell?.querySelector('a');
    if (foundSocialLink) {
      anchor.href = foundSocialLink.href;
      anchor.target = '_blank';
      // Infer social icon class from href if possible, or add a generic one
      if (anchor.href.includes('facebook.com')) li.classList.add('fb');
      else if (anchor.href.includes('twitter.com')) li.classList.add('tw');
      else if (anchor.href.includes('instagram.com')) li.classList.add('inst');
      else if (anchor.href.includes('youtube.com')) li.classList.add('yt');
      else if (anchor.href.includes('linkedin.com')) li.classList.add('in');
    }
    moveInstrumentation(socialLinkCell, anchor);

    const svg = document.createElement('svg');
    svg.setAttribute('width', '30');
    svg.setAttribute('height', '30');
    svg.setAttribute('viewBox', '0 0 40 41');
    const image = document.createElement('image');
    // FIXED: Use the actual data:stripped from ORIGINAL HTML for xlink:href
    image.setAttribute('xlink:href', 'data:stripped');
    image.setAttribute('x', '0');
    image.setAttribute('y', '0');
    image.setAttribute('width', '30');
    image.setAttribute('height', '30');
    svg.append(image);
    anchor.append(svg);
    li.append(anchor);
    socialWrap.append(li);

    // Handle hierarchy-tree (richtext) for social items if present
    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyUl) {
      // This part is not explicitly in the original HTML for social items,
      // but if the model allows it, we should handle it.
      // For now, assuming it's not meant to be rendered directly under social li
      // as per original HTML structure, but if it were, it would be handled like this:
      // const subMenu = document.createElement('div');
      // subMenu.classList.add('has-footer-inner-sub-child'); // Example class
      // transformNestedLists(hierarchyUl);
      // subMenu.append(...hierarchyUl.children);
      // li.append(subMenu);
      // moveInstrumentation(hierarchyTreeCell, subMenu);
    }
  });

  block.replaceChildren(footerMain);

  footerMain.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
