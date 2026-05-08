import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    li.classList.add('footer-list__item'); // Add class to li elements
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');
    if (anchor) {
      anchor.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block'); // Add classes to anchor
      anchor.setAttribute('data-link-region', 'Footer List');
    } else {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
        span.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block'); // Add classes to span
        span.setAttribute('data-link-region', 'Footer List');
      }
    }
    if (nested) {
      nested.classList.add('footer-list', 'd-flex', 'align-items-center', 'justify-content-center', 'align-items-md-start', 'flex-column'); // Add classes to nested ul
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child');
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
  // Destructure root rows based on BlockJson model
  const [
    primaryLogoRow,
    primaryLogoLinkRow,
    secondaryLogoRow,
    socialTitleRow,
    copyrightTextRow,
    ...itemRows
  ] = [...block.children];

  const footerLinkItems = itemRows.filter((row) => row.children.length === 3);
  const socialLinkItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));
  const bottomLinkItems = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture'));

  const root = document.createElement('section');
  root.classList.add('container-hd', 'p-0');

  const footerBrand = document.createElement('div');
  footerBrand.classList.add('footer-brand', 'w-100', 'bg-boing-neutral-gray-600');
  footerBrand.setAttribute('data-isdoodlevariation', 'false');
  root.append(footerBrand);

  // Primary Section
  const primarySection = document.createElement('section');
  primarySection.classList.add('footer-brand__primary');
  primarySection.style.backgroundColor = '';
  footerBrand.append(primarySection);

  const primaryContainer = document.createElement('div');
  primaryContainer.classList.add('container');
  primarySection.append(primaryContainer);

  const primaryContent = document.createElement('div');
  primaryContent.classList.add('footer-brand__primary--content', 'd-flex', 'flex-column', 'flex-md-row', 'justify-content-md-between', 'align-items-center');
  primaryContainer.append(primaryContent);

  const footerBrandLeft = document.createElement('section');
  footerBrandLeft.classList.add('footer-brand__left', 'd-flex', 'gap-16', 'px-10', 'align-items-center', 'justify-content-center');
  primaryContent.append(footerBrandLeft);

  // Primary Logo
  if (primaryLogoRow) {
    const primaryLogoLink = document.createElement('a');
    primaryLogoLink.classList.add('footer-brand__logo', 'd-inline-block', 'analytics_cta_click');
    primaryLogoLink.setAttribute('data-cta-region', 'Footer');
    primaryLogoLink.setAttribute('aria-label', 'ITC Logo');

    const primaryLogoAnchor = primaryLogoLinkRow.querySelector('a');
    if (primaryLogoAnchor) {
      primaryLogoLink.href = primaryLogoAnchor.href;
      primaryLogoLink.target = '_blank';
    } else {
      primaryLogoLink.href = '#';
    }

    const primaryLogoPicture = primaryLogoRow.querySelector('picture');
    if (primaryLogoPicture) {
      const img = primaryLogoPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('object-fit-contain', 'w-100', 'h-100', 'no-rendition');
        primaryLogoLink.append(optimizedPic);
        moveInstrumentation(primaryLogoRow, optimizedPic.querySelector('img'));
        moveInstrumentation(primaryLogoLinkRow, primaryLogoLink);
      }
    }
    footerBrandLeft.append(primaryLogoLink);
  }

  // Secondary Logo
  if (secondaryLogoRow) {
    const secondaryLogoDiv = document.createElement('div');
    secondaryLogoDiv.classList.add('footer-brand__secondary--logo', 'd-inline-block');
    const secondaryLogoPicture = secondaryLogoRow.querySelector('picture');
    if (secondaryLogoPicture) {
      const img = secondaryLogoPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('object-fit-contain', 'w-100', 'no-rendition');
        secondaryLogoDiv.append(optimizedPic);
        moveInstrumentation(secondaryLogoRow, optimizedPic.querySelector('img'));
      }
    }
    footerBrandLeft.append(secondaryLogoDiv);
  }

  const footerBrandRight = document.createElement('section');
  footerBrandRight.classList.add('footer-brand__right');
  primaryContent.append(footerBrandRight);

  const footerNavbar = document.createElement('nav');
  footerNavbar.classList.add('footer-brand__navbar', 'd-grid', 'd-md-flex');
  footerNavbar.setAttribute('aria-label', 'footer navbar');
  footerBrandRight.append(footerNavbar);

  const footerNavbarLeft = document.createElement('div');
  footerNavbarLeft.classList.add('footer-brand__navbar--left', 'd-flex', 'flex-column', 'flex-md-row');
  footerNavbar.append(footerNavbarLeft);

  const footerNavbarRight = document.createElement('div');
  footerNavbarRight.classList.add('footer-brand__navbar--right', 'd-flex', 'flex-column', 'flex-md-row');
  footerNavbar.append(footerNavbarRight);

  // Group footer links into columns (assuming 4 columns based on model)
  const columns = [[], [], [], []];
  footerLinkItems.forEach((item, index) => {
    columns[index % 4].push(item);
  });

  columns.forEach((colItems, colIndex) => {
    if (colItems.length > 0) {
      const footerListDiv = document.createElement('div');
      footerListDiv.classList.add('footerList');
      const footerListUl = document.createElement('ul');
      footerListUl.classList.add('footer-list', 'd-flex', 'align-items-center', 'justify-content-center', 'align-items-md-start', 'flex-column');
      footerListDiv.append(footerListUl);

      colItems.forEach((row) => {
        const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
        const li = document.createElement('li');
        li.classList.add('footer-list__item');
        moveInstrumentation(row, li);

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
        const subList = tempDiv.querySelector('ul');

        if (subList) {
          const titleLink = document.createElement('a');
          titleLink.href = 'javascript:void(0)';
          titleLink.textContent = labelCell.textContent.trim();
          titleLink.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block');
          titleLink.setAttribute('data-link-region', 'Footer List');
          li.append(titleLink);

          const subLinksCvr = document.createElement('div');
          subLinksCvr.classList.add('footer-sub-links-wrapper');
          moveInstrumentation(hierarchyTreeCell, subLinksCvr); // Move instrumentation from original cell
          subLinksCvr.append(subList);
          transformNestedLists(subList);
          li.append(subLinksCvr);

          titleLink.addEventListener('click', (e) => {
            e.preventDefault();
            li.classList.toggle('active');
            subLinksCvr.classList.toggle('active');
          });
        } else {
          const anchor = document.createElement('a');
          const foundLink = linkCell?.querySelector('a');
          if (foundLink) {
            anchor.href = foundLink.href;
            if (foundLink.target) anchor.target = foundLink.target;
          } else {
            anchor.href = '#';
          }
          anchor.textContent = labelCell.textContent.trim();
          anchor.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block');
          anchor.setAttribute('data-link-region', 'Footer List');
          li.append(anchor);
        }
        footerListUl.append(li);
      });

      if (colIndex < 2) {
        footerNavbarLeft.append(footerListDiv);
      } else {
        footerNavbarRight.append(footerListDiv);
      }
    }
  });

  // Secondary Section
  const secondarySection = document.createElement('section');
  secondarySection.classList.add('footer-brand__secondary');
  secondarySection.style.backgroundColor = '';
  footerBrand.append(secondarySection);

  const secondaryContainer = document.createElement('div');
  secondaryContainer.classList.add('container');
  secondarySection.append(secondaryContainer);

  const secondaryContent = document.createElement('div');
  secondaryContent.classList.add('footer-brand__secondary--content', 'd-flex', 'flex-column', 'justify-content-md-between', 'align-items-center');
  secondaryContainer.append(secondaryContent);

  const socialMediaRight = document.createElement('section');
  socialMediaRight.classList.add('footer-brand__right', 'd-flex', 'flex-column', 'pb-5');
  secondaryContent.append(socialMediaRight);

  // Social Media Title
  if (socialTitleRow) {
    const socialTitle = document.createElement('h2');
    socialTitle.classList.add('social_media--title');
    socialTitle.textContent = socialTitleRow.textContent.trim();
    moveInstrumentation(socialTitleRow, socialTitle);
    socialMediaRight.append(socialTitle);
  }

  // Social Links
  const socialListUl = document.createElement('ul');
  socialListUl.classList.add('footer-brand__right--list', 'd-flex', 'align-items-center', 'justify-content-center', 'px-10', 'flex-wrap');
  socialMediaRight.append(socialListUl);

  socialLinkItems.forEach((row) => {
    const [iconCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('footer-brand__right--item', 'd-flex', 'justify-content-center', 'align-items-center');

    const socialLink = document.createElement('a');
    socialLink.classList.add('footer-brand__right--link', 'd-flex', 'justify-content-center', 'align-items-center', 'analytics_cta_click');
    socialLink.setAttribute('data-cta-region', 'Footer');
    socialLink.target = '_blank';

    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      socialLink.href = foundLink.href;
      socialLink.setAttribute('data-cta-label', `footer-${foundLink.href.split('.')[1]}`);
      socialLink.setAttribute('data-platform-name', foundLink.href.split('.')[1]);
      socialLink.setAttribute('data-social-linktype', 'follow');
    } else {
      socialLink.href = '#';
    }

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('object-fit-contain', 'w-100', 'h-100', 'no-rendition');
        optimizedPic.querySelector('img').setAttribute('aria-label', foundLink ? foundLink.href.split('.')[1] : 'social icon');
        socialLink.append(optimizedPic);
        moveInstrumentation(iconCell, optimizedPic.querySelector('img'));
      }
    }
    moveInstrumentation(row, socialLink);
    li.append(socialLink);
    socialListUl.append(li);
  });

  const bottomLinksLeft = document.createElement('section');
  bottomLinksLeft.classList.add('footer-brand__left', 'py-5', 'd-flex', 'flex-column', 'gap-3');
  secondaryContent.append(bottomLinksLeft);

  // Bottom Links
  const bottomLinksUl = document.createElement('ul');
  bottomLinksUl.classList.add('footer-brand__left--list', 'd-flex', 'align-items-center', 'justify-content-center', 'flex-wrap');
  bottomLinksLeft.append(bottomLinksUl);

  bottomLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('footer-brand__left--item', 'foot_link');

    const anchor = document.createElement('a');
    anchor.classList.add('footer-brand__left--link', 'analytics_cta_click');
    anchor.setAttribute('data-cta-region', 'Footer');

    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      if (foundLink.target) anchor.target = foundLink.target;
    } else {
      anchor.href = '#';
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor);
    li.append(anchor);
    bottomLinksUl.append(li);
  });

  // Copyright Text
  if (copyrightTextRow) {
    const copyrightDiv = document.createElement('div');
    copyrightDiv.classList.add('footer-brand__left--copyright', 'text-center');
    const copyrightSpan = document.createElement('span');
    copyrightSpan.classList.add('footer-brand__left--text', 'text-white');
    copyrightSpan.textContent = copyrightTextRow.textContent.trim();
    moveInstrumentation(copyrightTextRow, copyrightSpan);
    copyrightDiv.append(copyrightSpan);
    bottomLinksLeft.append(copyrightDiv);
  }

  block.replaceChildren(root);
}
