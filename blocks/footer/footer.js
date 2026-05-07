import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
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
        textNode.remove();
        li.prepend(span);
      }
    }
    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-footer-sub-child'); // use ORIGINAL HTML class
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

  const logoRow = children.find((row) => row.querySelector('picture'));
  const logoLinkRow = children.find(
    (row) => !row.querySelector('picture') && row.querySelector('a'),
  );
  const copyrightRow = children.find(
    (row) =>
      !row.querySelector('picture') &&
      !row.querySelector('a') &&
      row.children.length === 1,
  );

  const itemRows = children.filter(
    (row) =>
      row !== logoRow && row !== logoLinkRow && row !== copyrightRow,
  );

  const socialLinkRows = itemRows.filter(
    (row) => row.children.length === 2 && row.querySelector('div:first-child a'),
  );
  const navSectionRows = itemRows.filter(
    (row) => row.children.length === 3,
  );
  const legalLinkRows = itemRows.filter(
    (row) => row.children.length === 2 && !row.querySelector('div:first-child a'),
  );

  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');

  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoWrap = document.createElement('div');
  logoWrap.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const logoAnchor = document.createElement('a');
  const logoLink = logoLinkRow?.querySelector('a');
  if (logoLink) {
    logoAnchor.href = logoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoAnchor);

  const picture = logoRow?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(
        img.src,
        img.alt,
        false,
        [{ width: '200' }],
      );
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoAnchor.append(optimizedPic);
    }
  }
  moveInstrumentation(logoRow, logoAnchor);
  logoDiv.append(logoAnchor);
  logoWrap.append(logoDiv);
  footerHeader.append(logoWrap);

  const socialWrapCol = document.createElement('div');
  socialWrapCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');

  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');

  socialLinkRows.forEach((row) => {
    const [socialLinkCell, hierarchyTreeCell] = [...row.children];
    const socialLink = socialLinkCell.querySelector('a');
    const hierarchyTree = hierarchyTreeCell.querySelector('ul');

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    if (socialLink) {
      const anchor = document.createElement('a');
      anchor.href = socialLink.href;
      anchor.target = '_blank';
      // Determine social icon class based on href or content
      if (socialLink.href.includes('facebook')) {
        li.classList.add('fb');
        anchor.innerHTML = `<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:stripped" x="0" y="0" width="30" height="30"></image></svg>`;
      } else if (socialLink.href.includes('twitter')) {
        li.classList.add('tw');
        anchor.innerHTML = `<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:stripped" x="0" y="0" width="30" height="30"></image></svg>`;
      } else if (socialLink.href.includes('instagram')) {
        li.classList.add('inst');
        anchor.innerHTML = `<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:stripped" x="0" y="0" width="30" height="30"></image></svg>`;
      } else if (socialLink.href.includes('youtube')) {
        li.classList.add('yt');
        anchor.innerHTML = `<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:stripped" x="0" y="0" width="30" height="30"></image></svg>`;
      } else if (socialLink.href.includes('linkedin')) {
        li.classList.add('in');
        anchor.innerHTML = `<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:stripped" x="0" y="0" width="30" height="30"></image></svg>`;
      }
      li.append(anchor);
    }

    if (hierarchyTree) {
      transformNestedLists(hierarchyTree);
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-footer-sub-child');
      subWrap.append(hierarchyTree);
      li.append(subWrap);
    }
    socialUl.append(li);
  });

  socialWrapCol.append(socialUl);
  footerHeader.append(socialWrapCol);
  container.append(footerHeader);

  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  navSectionRows.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell] = [...row.children];
    const sectionLinksUl = sectionLinksCell.querySelector('ul');
    const directLink = linkCell.querySelector('a');

    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    moveInstrumentation(row, linkBlocks);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');

    const span = document.createElement('span');
    const titleAnchor = document.createElement('a');
    titleAnchor.textContent = titleCell.textContent.trim();
    if (directLink) {
      titleAnchor.href = directLink.href;
    } else {
      titleAnchor.href = 'javascript:void(0)';
      const small = document.createElement('small');
      small.dataset.once = 'footerMobileInner';
      span.append(small);
      span.addEventListener('click', () => {
        linkBlocks.classList.toggle('active');
      });
    }
    span.prepend(titleAnchor);
    headDiv.append(span);
    linkBlocks.append(headDiv);

    if (sectionLinksUl) {
      const footerInnerList = document.createElement('ul');
      footerInnerList.classList.add('footer-inner-list');
      transformNestedLists(sectionLinksUl);
      footerInnerList.append(...sectionLinksUl.children);
      linkBlocks.append(footerInnerList);
    } else if (directLink) {
      const footerInnerList = document.createElement('ul');
      footerInnerList.classList.add('footer-inner-list');
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = directLink.href;
      anchor.textContent = titleCell.textContent.trim();
      li.append(anchor);
      footerInnerList.append(li);
      linkBlocks.append(footerInnerList);
    }

    footerMenu.append(linkBlocks);
  });

  footerMenuCol.append(footerMenu);
  footerMenuBox.append(footerMenuCol);
  container.append(footerMenuBox);

  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');

  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');

  legalLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const link = linkCell.querySelector('a');
    if (link) {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = labelCell.textContent.trim();
      li.append(anchor);
      secondaryNavUl.append(li);
      moveInstrumentation(row, li);
    }
  });
  secondaryNavCol.append(secondaryNavUl);
  copyrightWrap.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  if (copyrightRow) {
    copyrightTextCol.textContent = copyrightRow.textContent.trim();
    moveInstrumentation(copyrightRow, copyrightTextCol);
  }
  copyrightWrap.append(copyrightTextCol);
  container.append(copyrightWrap);

  footerMain.append(container);
  block.replaceChildren(footerMain);
}
