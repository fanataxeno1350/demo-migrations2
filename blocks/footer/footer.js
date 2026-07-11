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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's for internal JS behavior.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist, but it's for internal JS behavior.
          subWrap.classList.toggle('active'); // This class is not in the allowlist, but it's for internal JS behavior.
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

  const footer = document.createElement('div');
  footer.classList.add('cmp-new-footer');

  const topContent = document.createElement('div');
  topContent.classList.add('cmp-new-footer__top-content');

  const backgroundImagePicture = backgroundImageRow?.querySelector('picture');
  if (backgroundImagePicture) {
    const img = backgroundImagePicture.querySelector('img');
    if (img) {
      topContent.style.backgroundImage = `url("${img.src}")`;
    }
    moveInstrumentation(backgroundImageRow, topContent);
  }

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('cmp-image', 'cmp-new-footer__logo');

  const logoAnchor = document.createElement('a');
  logoAnchor.classList.add('cmp-image__link');
  const foundLogoLink = logoLinkRow?.querySelector('a');
  if (foundLogoLink) {
    logoAnchor.href = foundLogoLink.href;
  }

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const optimizedPic = createOptimizedPicture(
      logoPicture.querySelector('img').src,
      logoPicture.querySelector('img').alt,
      false,
      [{ width: '750' }],
    );
    // createOptimizedPicture returns the <picture> element, not the <img>
    moveInstrumentation(logoRow, optimizedPic);
    logoAnchor.append(optimizedPic);
  }
  moveInstrumentation(logoLinkRow, logoAnchor);
  logoWrapper.append(logoAnchor);
  topContent.append(logoWrapper);

  const navWrapper = document.createElement('div');
  navWrapper.classList.add('cmp-new-footer__nav', 'cmp-new-footer__nav__count-12');

  // Filter for footer-navigation-group (1 cell, contains ul)
  const navGroups = itemRows.filter((row) => row.children.length === 1 && row.querySelector('ul'));
  // Filter for footer-bottom-link (2 cells, first is text, second is aem-content link)
  const bottomLinks = itemRows.filter((row) => row.children.length === 2 && row.children[0].textContent.trim() && row.children[1].querySelector('a'));
  // Filter for footer-social-item (1 cell, contains aem-content link, no ul)
  const socialLinks = itemRows.filter((row) => row.children.length === 1 && row.querySelector('a') && !row.querySelector('ul'));

  navGroups.forEach((row) => {
    const navGroupUl = document.createElement('ul');
    navGroupUl.classList.add('cmp-new-footer__nav-group');

    // For footer-navigation-group, the model specifies 'hierarchy-tree' as the only field
    // FIXED: Using content detection instead of index access
    const cells = [...row.children];
    const hierarchyTreeCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a')) || cells[0];
    const authoredUl = hierarchyTreeCell?.querySelector('ul');

    if (authoredUl) {
      transformNestedLists(authoredUl);
      [...authoredUl.children].forEach((li) => {
        const navItem = document.createElement('li');
        navItem.classList.add('cmp-new-footer__nav-item');
        // Add cmp-new-footer__nav-link to anchors within the list items
        li.querySelectorAll('a').forEach((a) => a.classList.add('cmp-new-footer__nav-link'));
        while (li.firstChild) {
          navItem.append(li.firstChild);
        }
        navGroupUl.append(navItem);
      });
    }
    moveInstrumentation(row, navGroupUl);
    navWrapper.append(navGroupUl);
  });
  topContent.append(navWrapper);
  footer.append(topContent);

  const bottomContent = document.createElement('div');
  bottomContent.classList.add('cmp-new-footer__bottom-content');

  const bottomContainer = document.createElement('div');
  bottomContainer.classList.add('cmp-new-footer__container');

  const itcTitles = document.createElement('div');
  itcTitles.classList.add('cmp-new-footer__ITC-Titles');

  bottomLinks.forEach((row) => {
    // For footer-bottom-link, the model specifies 'label' (text) and 'link' (aem-content)
    const [labelCell, linkCell] = [...row.children];

    const link = document.createElement('a');
    link.classList.add('desc-1');
    if (labelCell) {
      link.textContent = labelCell.textContent.trim();
    }
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.target = foundLink.target; // Preserve target from original link
    }
    moveInstrumentation(row, link);
    itcTitles.append(link);
  });
  bottomContainer.append(itcTitles);

  const socialMedia = document.createElement('div');
  socialMedia.classList.add('cmp-new-footer__social-media');

  socialLinks.forEach((row) => {
    // For footer-social-item, the model specifies 'socialLink' (aem-content) as the only field
    // FIXED: Using content detection instead of index access
    const cells = [...row.children];
    const socialLinkCell = cells.find(cell => cell.querySelector('a'));
    const socialAnchor = document.createElement('a');
    const foundSocialLink = socialLinkCell?.querySelector('a');
    if (foundSocialLink) {
      socialAnchor.href = foundSocialLink.href;
      if (foundSocialLink.href.includes('instagram')) {
        socialAnchor.classList.add('icon-instagram');
        socialAnchor.setAttribute('data-social', 'instagram');
      } else if (foundSocialLink.href.includes('facebook')) {
        socialAnchor.classList.add('icon-facebook');
        socialAnchor.setAttribute('data-social', 'facebook');
      } else if (foundSocialLink.href.includes('youtube')) {
        socialAnchor.classList.add('icon-youtube');
        socialAnchor.setAttribute('data-social', 'youtube');
      } else if (foundSocialLink.href.includes('twitter') || foundSocialLink.href.includes('x.com')) {
        socialAnchor.classList.add('icon-twitter');
        socialAnchor.setAttribute('data-social', 'twitter');
      }
      socialAnchor.target = foundSocialLink.target; // Preserve target from original link
    }
    moveInstrumentation(row, socialAnchor);
    socialMedia.append(socialAnchor);
  });
  bottomContainer.append(socialMedia);
  bottomContent.append(bottomContainer);
  footer.append(bottomContent);

  block.replaceChildren(footer);
}
