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
  const children = [...block.children];

  const logoRow = children.find((row) => row.querySelector('picture'));
  const logoLinkRow = children.find(
    (row) => row.querySelector('a') && !row.querySelector('picture'),
  );
  const copyrightRow = children.find(
    (row) => row.textContent.includes('Copyright') && !row.querySelector('a'),
  );

  // Prioritize cell count for type detection
  // footer-social-item: 2 cells, first is a link, second is a richtext ul
  const socialLinkRows = children.filter(
    (row) => row.children.length === 2 && row.querySelector('a') && row.querySelector('ul'),
  );
  // footer-section-item: 3 cells
  const navSectionRows = children.filter(
    (row) => row.children.length === 3 && !row.querySelector('picture'),
  );
  // footer-link-item: 2 cells, no ul, no picture
  const secondaryLinkRows = children.filter(
    (row) => row.children.length === 2 && !row.querySelector('ul') && !row.querySelector('picture') && !row.querySelector('a ul'),
  );

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

  if (logoRow && logoLinkRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const logoLink = document.createElement('a');
    const foundLink = logoLinkRow.querySelector('a');
    if (foundLink) {
      logoLink.href = foundLink.href;
    }
    const picture = logoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        logoLink.append(optimizedPic);
      }
    }
    moveInstrumentation(logoRow, logoLink);
    moveInstrumentation(logoLinkRow, logoLink);
    logoDiv.append(logoLink);
    logoWrap.append(logoDiv);
  }

  const socialWrapCenter = document.createElement('div');
  socialWrapCenter.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialWrapCenter);

  if (socialLinkRows.length > 0) {
    const socialUl = document.createElement('ul');
    socialUl.classList.add('social-wrap');
    socialLinkRows.forEach((row) => {
      // Use destructuring for fixed-schema rows
      const [socialLinkCell, socialHierarchyCell] = [...row.children];

      if (socialLinkCell && socialHierarchyCell) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        const foundLink = socialLinkCell.querySelector('a');
        if (foundLink) {
          link.href = foundLink.href;
          link.target = '_blank';
          // Original HTML has SVG icons, not text content for social links
          // The textContent is the JCR path, not the label.
          // The SVG is hardcoded here as per original HTML.
          if (link.href.includes('facebook')) {
            li.classList.add('fb');
            link.innerHTML = '<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:stripped" x="0" y="0" width="30" height="30"></image></svg>';
          } else if (link.href.includes('twitter')) {
            li.classList.add('tw');
            link.innerHTML = '<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:stripped" x="0" y="0" width="30" height="30"></image></svg>';
          } else if (link.href.includes('instagram')) {
            li.classList.add('inst');
            link.innerHTML = '<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:stripped" x="0" y="0" width="30" height="30"></image></svg>';
          } else if (link.href.includes('youtube')) {
            li.classList.add('yt');
            link.innerHTML = '<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:stripped" x="0" y="0" width="30" height="30"></image></svg>';
          } else if (link.href.includes('linkedin')) {
            li.classList.add('in');
            link.innerHTML = '<svg width="30" height="30" viewBox="0 0 40 41" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="data:stripped" x="0" y="0" width="30" height="30"></image></svg>';
          }
        }

        moveInstrumentation(row, li);
        li.append(link);
        socialUl.append(li);
      }
    });
    socialWrapCenter.append(socialUl);
  }

  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const col = document.createElement('div');
  col.classList.add('col');
  footerMenuBox.append(col);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  col.append(footerMenu);

  if (navSectionRows.length > 0) {
    navSectionRows.forEach((row) => {
      const [titleCell, linkCell, sectionLinksCell] = [...row.children];
      const linkBlocks = document.createElement('div');
      linkBlocks.classList.add('link-blocks');

      const head = document.createElement('div');
      head.classList.add('head');
      linkBlocks.append(head);

      const span = document.createElement('span');
      const titleLink = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        titleLink.href = foundLink.href;
      }
      titleLink.textContent = titleCell.textContent.trim();
      span.append(titleLink);

      const subList = sectionLinksCell?.querySelector('ul');
      if (subList) {
        const small = document.createElement('small');
        small.dataset.once = 'footerMobileInner';
        span.append(small);
        head.append(span);

        const ul = document.createElement('ul');
        ul.classList.add('footer-inner-list');
        // Create a temporary div to hold the richtext content for instrumentation and processing
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sectionLinksCell.innerHTML;
        moveInstrumentation(sectionLinksCell, tempDiv); // Move instrumentation from original cell to tempDiv

        transformNestedLists(tempDiv); // Process the nested lists within the tempDiv

        // Append children from the processed tempDiv to the new ul
        while (tempDiv.firstChild) {
          ul.append(tempDiv.firstChild);
        }
        linkBlocks.append(ul);
      } else {
        head.append(span);
      }
      moveInstrumentation(row, linkBlocks);
      footerMenu.append(linkBlocks);
    });
  }

  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  if (secondaryLinkRows.length > 0) {
    const secondaryNavUl = document.createElement('ul');
    secondaryNavUl.classList.add('secondary-nav');
    secondaryLinkRows.forEach((row) => {
      const [labelCell, linkCell] = [...row.children];
      const li = document.createElement('li');
      const link = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      link.textContent = labelCell.textContent.trim();
      moveInstrumentation(row, li);
      li.append(link);
      secondaryNavUl.append(li);
    });
    secondaryNavCol.append(secondaryNavUl);
  }

  const copyrightCol = document.createElement('div');
  copyrightCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  if (copyrightRow) {
    moveInstrumentation(copyrightRow, copyrightCol);
    copyrightCol.textContent = copyrightRow.textContent.trim();
  }
  copyrightWrap.append(copyrightCol);

  block.replaceChildren(footerMain);
}
