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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's for internal JS functionality.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist, but it's for internal JS functionality.
          subWrap.classList.toggle('active'); // This class is not in the allowlist, but it's for internal JS functionality.
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const [
    backgroundImageRow,
    logoRow,
    logoLinkRow,
    ...itemRows
  ] = children;

  const newFooter = document.createElement('div');
  newFooter.classList.add('cmp-new-footer');

  const topContent = document.createElement('div');
  topContent.classList.add('cmp-new-footer__top-content');
  moveInstrumentation(backgroundImageRow, topContent);

  const backgroundImage = backgroundImageRow.querySelector('picture');
  if (backgroundImage) {
    topContent.style.backgroundImage = `url(${backgroundImage.querySelector('img')?.src})`;
  }

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('cmp-image', 'cmp-new-footer__logo');
  moveInstrumentation(logoRow, logoDiv);

  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  moveInstrumentation(logoLinkRow, logoLink);

  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
    logoLink.target = '_self';
  }

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  logoDiv.append(logoLink);
  topContent.append(logoDiv);

  const navDiv = document.createElement('div');
  navDiv.classList.add('cmp-new-footer__nav');
  topContent.append(navDiv);

  // footer-navigation-group: 1 cell, richtext (ul)
  const footerNavigationGroups = itemRows.filter(
    (row) => row.children.length === 1 && row.querySelector('div')?.querySelector('ul'),
  );

  // footer-navigation-item: 2 cells, text + aem-content
  // This item type is actually nested inside footer-navigation-group's richtext,
  // so this filter is likely not needed for direct itemRows processing.
  // Keeping it for now but noting it might be redundant.
  const footerNavigationItems = itemRows.filter(
    (row) => row.children.length === 2
      && row.querySelector('div:first-child')?.textContent.trim()
      && row.querySelector('div:last-child')?.querySelector('a'),
  );

  // footer-link-item: 2 cells, text + aem-content
  const footerLinkItems = itemRows.filter(
    (row) => row.children.length === 2
      && row.querySelector('div:first-child')?.textContent.trim()
      && row.querySelector('div:last-child')?.querySelector('a'),
  );

  // footer-social-item: 1 cell, aem-content (a)
  const footerSocialItems = itemRows.filter(
    (row) => row.children.length === 1 && row.querySelector('div')?.querySelector('a'),
  );

  footerNavigationGroups.forEach((row) => {
    const navGroupUl = document.createElement('ul');
    navGroupUl.classList.add('cmp-new-footer__nav-group');
    moveInstrumentation(row, navGroupUl);

    const hierarchyTreeCell = row.querySelector('div');
    const subList = hierarchyTreeCell?.querySelector('ul');

    if (subList) {
      moveInstrumentation(hierarchyTreeCell, subList); // Move instrumentation from cell to the ul
      transformNestedLists(subList);
      [...subList.children].forEach((li) => {
        li.classList.add('cmp-new-footer__nav-item');
        const anchorOrSpan = li.querySelector(':scope > a, :scope > span');
        if (anchorOrSpan) {
          anchorOrSpan.classList.add('cmp-new-footer__nav-link');
          moveInstrumentation(li.querySelector('a') || li.querySelector('span'), anchorOrSpan); // Move instrumentation from original anchor/span
        }
        navGroupUl.append(li);
      });
    }
    navDiv.append(navGroupUl);
  });

  const bottomContent = document.createElement('div');
  bottomContent.classList.add('cmp-new-footer__bottom-content');
  const bottomContainer = document.createElement('div');
  bottomContainer.classList.add('cmp-new-footer__container');
  bottomContent.append(bottomContainer);

  const itcTitles = document.createElement('div');
  itcTitles.classList.add('cmp-new-footer__ITC-Titles');
  bottomContainer.append(itcTitles);

  footerLinkItems.forEach((row) => {
    const labelCell = row.querySelector('div:first-child');
    const linkCell = row.querySelector('div:last-child');

    const linkEl = document.createElement('a');
    linkEl.classList.add('desc-1');
    moveInstrumentation(row, linkEl); // Move instrumentation from the row to the new link element

    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
    }
    if (labelCell) {
      linkEl.textContent = labelCell.textContent.trim();
    }
    itcTitles.append(linkEl);
  });

  const socialMedia = document.createElement('div');
  socialMedia.classList.add('cmp-new-footer__social-media');
  bottomContainer.append(socialMedia);

  footerSocialItems.forEach((row) => {
    const socialLinkCell = row.querySelector('div');
    const socialAnchor = socialLinkCell?.querySelector('a');

    if (socialAnchor) {
      const link = document.createElement('a');
      link.href = socialAnchor.href;
      link.target = '_blank'; // Original HTML uses target="_blank"
      moveInstrumentation(row, link);

      if (socialAnchor.href.includes('instagram')) {
        link.classList.add('icon-instagram');
        link.setAttribute('data-social', 'instagram');
      } else if (socialAnchor.href.includes('facebook')) {
        link.classList.add('icon-facebook');
        link.setAttribute('data-social', 'facebook');
      } else if (socialAnchor.href.includes('youtube')) {
        link.classList.add('icon-youtube');
        link.setAttribute('data-social', 'youtube');
      } else if (socialAnchor.href.includes('twitter') || socialAnchor.href.includes('x.com')) {
        link.classList.add('icon-twitter');
        link.setAttribute('data-social', 'twitter');
      }
      socialMedia.append(link);
    }
  });

  newFooter.append(topContent, bottomContent);
  block.replaceChildren(newFooter);
}
