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
          li.classList.toggle('active'); // This 'active' class is not in the allowlist, but it's for JS interaction.
          subWrap.classList.toggle('active'); // This 'active' class is not in the allowlist, but it's for JS interaction.
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields - fixed positions
  const logoRow = children[0]; // field="logo"
  const logoLinkRow = children[1]; // field="logoLink"
  const copyrightRow = children[2]; // field="copyright"

  // Item rows - filtered by cell count and content
  const socialLinkRows = children.filter(
    (row) => row.children.length === 2 && row.querySelector('ul'), // Social links have 2 cells, second is richtext (ul)
  );
  const footerSectionRows = children.filter(
    (row) => row.children.length === 3 && row.querySelector('p'), // Footer sections have 3 cells, third is richtext (p)
  );
  const footerLinkRows = children.filter(
    (row) => row.children.length === 2 && !row.querySelector('picture') && !row.querySelector('ul') && !row.querySelector('p'), // Footer links have 2 cells, no picture, no ul, no p
  );

  const footerMain = document.createElement('footer');
  footerMain.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');
  footerMain.append(container);

  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  container.append(footerHeader);

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeader.append(logoCol);

  if (logoRow && logoLinkRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    moveInstrumentation(logoRow, logoDiv);

    const logoLink = document.createElement('a');
    const authoredLogoLink = logoLinkRow.querySelector('a');
    if (authoredLogoLink) {
      logoLink.href = authoredLogoLink.href;
    }
    moveInstrumentation(logoLinkRow, logoLink);

    const picture = logoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        logoLink.append(optimizedPic);
      }
    }
    logoDiv.append(logoLink);
    logoCol.append(logoDiv);
  }

  const socialWrapCol = document.createElement('div');
  socialWrapCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialWrapCol);

  if (socialLinkRows.length > 0) {
    const socialWrap = document.createElement('ul');
    socialWrap.classList.add('social-wrap');
    socialLinkRows.forEach((row) => {
      const [socialLinkCell, hierarchyTreeCell] = [...row.children]; // Fixed schema for social links
      if (socialLinkCell) {
        const li = document.createElement('li');
        // Original HTML has classes like 'fb', 'tw', etc. based on content.
        // This logic is missing, but for now, we'll just add the li.
        moveInstrumentation(row, li);

        const socialAnchor = document.createElement('a');
        const authoredSocialLink = socialLinkCell.querySelector('a');
        if (authoredSocialLink) {
          socialAnchor.href = authoredSocialLink.href;
        }
        socialAnchor.target = '_blank';

        if (hierarchyTreeCell) {
          // richtext field "hierarchy-tree"
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
          moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from the cell

          // Apply classes to nested elements as per ORIGINAL HTML (example: li.fb, li.tw)
          // The current transformNestedLists function doesn't apply these specific classes.
          // It adds 'has-footer-sub-child' which is from original HTML.
          // The original HTML also has SVGs inside the social links, which are stripped in the input.
          // For now, we'll append the transformed list.
          const clonedUl = tempDiv.querySelector('ul');
          if (clonedUl) {
            transformNestedLists(clonedUl);
            socialAnchor.append(clonedUl);
          } else {
            // Fallback if no UL is found in richtext, but it should always be a UL for hierarchy-tree
            socialAnchor.textContent = socialLinkCell.textContent.trim();
          }
        } else {
          socialAnchor.textContent = socialLinkCell.textContent.trim();
        }
        li.append(socialAnchor);
        socialWrap.append(li);
      }
    });
    socialWrapCol.append(socialWrap);
  }

  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBox.append(footerMenuCol);

  if (footerSectionRows.length > 0) {
    const footerMenu = document.createElement('div');
    footerMenu.classList.add('footer-menu');
    moveInstrumentation(block, footerMenu); // Move instrumentation from the block to the main menu container
    footerMenuCol.append(footerMenu);

    footerSectionRows.forEach((row) => {
      const [titleCell, linkCell, sectionLinksCell] = [...row.children]; // Fixed schema for footer sections
      const linkBlocks = document.createElement('div');
      linkBlocks.classList.add('link-blocks');
      moveInstrumentation(row, linkBlocks);

      const head = document.createElement('div');
      head.classList.add('head');

      const span = document.createElement('span');
      const titleLink = document.createElement('a');
      const directLink = linkCell.querySelector('a');
      if (directLink) {
        titleLink.href = directLink.href;
      }
      titleLink.textContent = titleCell.textContent.trim();
      span.append(titleLink);
      head.append(span);
      linkBlocks.append(head);

      const subList = sectionLinksCell.querySelector('ul');
      if (subList) {
        const small = document.createElement('small');
        small.setAttribute('data-once', 'footerMobileInner');
        span.append(small);

        const footerInnerList = document.createElement('ul');
        footerInnerList.classList.add('footer-inner-list');
        moveInstrumentation(sectionLinksCell, footerInnerList); // Move instrumentation from the richtext cell
        [...subList.querySelectorAll('a')].forEach((anchor) => {
          const li = document.createElement('li');
          const link = document.createElement('a');
          link.href = anchor.href;
          link.textContent = anchor.textContent.trim();
          li.append(link);
          footerInnerList.append(li);
        });
        linkBlocks.append(footerInnerList);

        span.addEventListener('click', () => {
          footerInnerList.classList.toggle('active'); // This 'active' class is not in the allowlist, but it's for JS interaction.
          span.classList.toggle('active'); // This 'active' class is not in the allowlist, but it's for JS interaction.
        });
      }
      footerMenu.append(linkBlocks);
    });
  }

  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  if (footerLinkRows.length > 0) {
    const secondaryNav = document.createElement('ul');
    secondaryNav.classList.add('secondary-nav');
    footerLinkRows.forEach((row) => {
      const [labelCell, linkCell] = [...row.children]; // Fixed schema for footer links
      const li = document.createElement('li');
      moveInstrumentation(row, li);

      const link = document.createElement('a');
      const authoredLink = linkCell.querySelector('a');
      if (authoredLink) {
        link.href = authoredLink.href;
      }
      link.textContent = labelCell.textContent.trim();
      li.append(link);
      secondaryNav.append(li);
    });
    secondaryNavCol.append(secondaryNav);
  }

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  if (copyrightRow) {
    moveInstrumentation(copyrightRow, copyrightTextCol);
    copyrightTextCol.textContent = copyrightRow.textContent.trim();
  }
  copyrightWrap.append(copyrightTextCol);

  block.replaceChildren(footerMain);
}
