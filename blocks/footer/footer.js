import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, level = 0) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
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
      if (level === 0) {
        subWrap.classList.add('has-footer-sub-child');
      } else {
        subWrap.classList.add('has-footer-inner-sub-child');
      }
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        const small = document.createElement('small');
        small.dataset.once = 'footerMobileInner';
        trigger.parentElement.append(small);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
        svg.setAttribute('fill', '#000000');
        svg.setAttribute('stroke', '#000000');
        svg.setAttribute('stroke-width', '4.851456000000001');
        svg.innerHTML = `
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g>
          <g id="SVGRepo_iconCarrier">
            <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)">
              <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path>
            </g>
          </g>
        `;
        const spanArrow = document.createElement('span');
        spanArrow.dataset.once = 'footerClickEvent';
        if (level > 0) spanArrow.dataset.once += ' innerFooterClickEvent';
        spanArrow.append(svg);
        trigger.parentElement.append(spanArrow);

        const toggleAccordion = (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
          small.classList.toggle('active');
          spanArrow.classList.toggle('active');
        };

        trigger.addEventListener('click', toggleAccordion);
        small.addEventListener('click', toggleAccordion);
        spanArrow.addEventListener('click', toggleAccordion);
      }
      transformNestedLists(nested, level + 1);
    }
  });
}

export default function decorate(block) {
  const children = [...block.children].filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== '')
  );

  const [logoRow, logoLinkRow, copyrightRow, ...itemRows] = children;

  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');
  footerMain.append(container);

  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  container.append(footerHeader);

  // Logo Section
  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeader.append(logoCol);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoCol.append(logoDiv);

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }

  // Social Links Section
  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialCol);

  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');
  socialCol.append(socialWrap);

  // Filter for footer-social-item (2 cells, contains <a> and <ul>)
  const socialLinkRows = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a') && row.querySelector('ul'));

  socialLinkRows.forEach((row) => {
    const [socialLinkCell, hierarchyTreeCell] = [...row.children]; // Destructuring for fixed schema
    const socialLink = socialLinkCell.querySelector('a');
    const hierarchyTree = hierarchyTreeCell.querySelector('ul'); // Correctly targets the <ul> inside the richtext cell

    if (socialLink && hierarchyTree) {
      const li = document.createElement('li');
      const href = socialLink.href;
      if (href.includes('facebook')) li.classList.add('fb');
      else if (href.includes('twitter')) li.classList.add('tw');
      else if (href.includes('instagram')) li.classList.add('inst');
      else if (href.includes('youtube')) li.classList.add('yt');
      else if (href.includes('linkedin')) li.classList.add('in');

      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.target = '_blank';
      // The SVG is hardcoded, but the original HTML also has it hardcoded with data:stripped
      anchor.innerHTML = `<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:stripped" x="0" y="0" width="30" height="30"></image></svg>`;
      moveInstrumentation(row, anchor);
      li.append(anchor);
      socialWrap.append(li);
    }
  });

  // Footer Menu Box
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBox.append(footerMenuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);

  // Filter for footer-section-item (3 cells)
  const footerSectionRows = itemRows.filter((row) => row.children.length === 3);

  footerSectionRows.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell] = [...row.children]; // Destructuring for fixed schema
    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    footerMenu.append(linkBlocks);

    const head = document.createElement('div');
    head.classList.add('head');
    linkBlocks.append(head);

    const span = document.createElement('span');
    head.append(span);

    const titleAnchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      titleAnchor.href = foundLink.href;
    } else {
      titleAnchor.href = 'javascript:void(0)';
    }
    titleAnchor.textContent = titleCell.textContent.trim();
    moveInstrumentation(row, titleAnchor);
    span.append(titleAnchor);

    const subList = sectionLinksCell.querySelector('ul'); // Correctly targets the <ul> inside the richtext cell
    if (subList) {
      const small = document.createElement('small');
      small.dataset.once = 'footerMobileInner';
      span.append(small);

      const footerInnerList = document.createElement('ul');
      footerInnerList.classList.add('footer-inner-list');
      // Move children from subList to footerInnerList
      while (subList.firstChild) {
        footerInnerList.append(subList.firstChild);
      }
      moveInstrumentation(sectionLinksCell, footerInnerList); // Move instrumentation from the richtext cell
      linkBlocks.append(footerInnerList);

      transformNestedLists(footerInnerList);

      const toggleAccordion = (e) => {
        e.preventDefault();
        e.stopPropagation();
        linkBlocks.classList.toggle('active');
        footerInnerList.classList.toggle('active');
        small.classList.toggle('active');
      };

      titleAnchor.addEventListener('click', toggleAccordion);
      small.addEventListener('click', toggleAccordion);
    }
  });

  // Copyright and Legal Links
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  const secondaryNav = document.createElement('ul');
  secondaryNav.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNav);

  // Filter for footer-link-item (2 cells, no <ul>)
  const legalLinkRows = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('ul'));

  legalLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor);
    li.append(anchor);
    secondaryNav.append(li);
  });

  const copyrightCol = document.createElement('div');
  copyrightCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightCol.textContent = copyrightRow.textContent.trim();
  moveInstrumentation(copyrightRow, copyrightCol);
  copyrightWrap.append(copyrightCol);

  block.replaceChildren(footerMain);

  footerMain.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
