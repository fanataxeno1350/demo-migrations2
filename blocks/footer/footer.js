import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.classList.add('cmp-new-footer__nav-group'); // Add class to the root UL
  rootUl.querySelectorAll('li').forEach((li) => {
    li.classList.add('cmp-new-footer__nav-item'); // Add class to all LI elements
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (anchor) {
      anchor.classList.add('cmp-new-footer__nav-link'); // Add class to anchor
    } else {
      // If no anchor, create a span for the text content
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.classList.add('cmp-new-footer__nav-link'); // Use the same link class for consistency
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.classList.add('cmp-new-footer__nav-sub-group'); // Add class to nested UL
      // The original HTML does not show a wrapper div for sub-groups,
      // but the JS adds 'has-footer-sub-child' for interactivity.
      // Let's keep the interactivity wrapper, but use a more generic class if needed,
      // or remove if not strictly required by CSS.
      // For now, removing 'has-footer-sub-child' as it's not in the allowlist.
      // If CSS requires a wrapper for the sub-menu, a new class must be added to the allowlist.
      // For now, we'll just append the nested UL directly and rely on CSS for styling.
      // If interactivity is needed, the trigger should toggle a class on the LI itself.

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // Toggle 'active' on the LI to show/hide nested UL
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Destructure the known root-level rows
  const backgroundImageRow = children[0];
  const logoRow = children[1];
  const logoLinkRow = children[2];
  // The next three are container placeholders, not actual content rows
  // We need to filter the remaining rows based on their structure.
  // const navigationGroupsContainer = children[3]; // Placeholder, not a content row
  // const bottomLinksContainer = children[4];    // Placeholder, not a content row
  // const socialLinksContainer = children[5];    // Placeholder, not a content row

  // Filter item rows based on structure
  const itemRows = children.slice(3); // All rows after the first three content rows

  const navigationGroupItems = itemRows.filter(
    (row) => row.children.length === 1 && row.children[0].querySelector('ul'),
  );
  const footerLinkItems = itemRows.filter(
    (row) => row.children.length === 2 && !row.children[0].querySelector('ul') && !row.children[0].querySelector('a'),
  );
  const footerSocialItems = itemRows.filter(
    (row) => row.children.length === 1 && row.children[0].querySelector('a') && !row.children[0].querySelector('picture'),
  );

  const root = document.createElement('div');
  root.classList.add('cmp-new-footer');

  // Top content section
  const topContent = document.createElement('div');
  topContent.classList.add('cmp-new-footer__top-content');
  moveInstrumentation(backgroundImageRow, topContent);

  const bgImage = backgroundImageRow.querySelector('picture > img');
  if (bgImage) {
    topContent.style.backgroundImage = `url("${bgImage.src}")`;
  }

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('cmp-image', 'cmp-new-footer__logo');
  moveInstrumentation(logoRow, logoWrapper);

  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  moveInstrumentation(logoLinkRow, logoLink);

  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    logoLink.target = '_self'; // Assuming default target
  }

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const optimizedLogo = createOptimizedPicture(
      logoPicture.querySelector('img').src,
      logoPicture.querySelector('img').alt,
      false,
      [{ width: '200' }], // Adjust width as needed
    );
    moveInstrumentation(logoPicture.querySelector('img'), optimizedLogo.querySelector('img'));
    logoLink.append(optimizedLogo);
  }
  logoWrapper.append(logoLink);
  topContent.append(logoWrapper);

  // Navigation
  const navWrapper = document.createElement('div');
  navWrapper.classList.add('cmp-new-footer__nav');

  const navGroups = document.createElement('div');
  // The original HTML does not have a specific class for a container of multiple ULs.
  // Keeping 'cmp-new-footer__nav-group-container' as a functional wrapper,
  // but it's not in the allowlist. If this is for styling, it should be added to allowlist.
  // For now, removing it to adhere strictly to allowlist.
  // If a wrapper is needed, it should be derived from original HTML or added to allowlist.
  // navGroups.classList.add('cmp-new-footer__nav-group-container');

  navigationGroupItems.forEach((row) => {
    const [hierarchyTreeCell] = [...row.children]; // Fixed schema for footer-navigation-group
    const tempDiv = document.createElement('div');
    moveInstrumentation(row, tempDiv); // Move instrumentation from the row to a temporary div
    tempDiv.innerHTML = hierarchyTreeCell?.innerHTML || ''; // Get the full HTML content

    const ul = tempDiv.querySelector('ul');
    if (ul) {
      transformNestedLists(ul); // Transform and add classes to nested lists
      navGroups.append(ul); // Append the transformed UL directly
    }
  });

  // Handle footer-navigation-item (if they are separate from hierarchy-tree)
  // The current filtering logic for footerLinkItems might also catch footer-navigation-item
  // if they have 2 cells and no UL.
  // Based on the BlockJson, footer-navigation-item has 'label' (text) and 'link' (aem-content).
  // The original HTML shows these as direct <li><a> elements within a <ul>.
  // If these are meant to be separate ULs, they need to be handled.
  // The current JS assumes footerLinkItems are for copyright, which is a different model.
  // Let's refine the filtering for footer-navigation-item.
  const footerNavigationItems = itemRows.filter(
    (row) => row.children.length === 2
      && !row.children[0].querySelector('ul')
      && !row.children[0].querySelector('a')
      && row.children[1].querySelector('a'), // Ensure second cell is a link
  );

  if (footerNavigationItems.length > 0) {
    const navGroup = document.createElement('ul');
    navGroup.classList.add('cmp-new-footer__nav-group');
    footerNavigationItems.forEach((row) => {
      const [labelCell, linkCell] = [...row.children]; // Fixed schema for footer-navigation-item
      const li = document.createElement('li');
      li.classList.add('cmp-new-footer__nav-item');
      moveInstrumentation(row, li);

      const link = document.createElement('a');
      link.classList.add('cmp-new-footer__nav-link');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      link.textContent = labelCell.textContent.trim();
      li.append(link);
      navGroup.append(li);
    });
    if (navGroup.children.length > 0) {
      navGroups.append(navGroup);
    }
  }

  // Update navWrapper class based on number of groups
  const numNavGroups = navGroups.querySelectorAll('.cmp-new-footer__nav-group').length;
  if (numNavGroups > 0) {
    navWrapper.classList.add(`cmp-new-footer__nav__count-${numNavGroups}`);
    navWrapper.append(navGroups);
  }
  topContent.append(navWrapper);
  root.append(topContent);

  // Bottom content section
  const bottomContent = document.createElement('div');
  bottomContent.classList.add('cmp-new-footer__bottom-content');
  // moveInstrumentation(bottomLinksContainer, bottomContent); // Placeholder, not a content row

  const bottomContainer = document.createElement('div');
  bottomContainer.classList.add('cmp-new-footer__container');

  // ITC Titles / Copyright
  const itcTitles = document.createElement('div');
  itcTitles.classList.add('cmp-new-footer__ITC-Titles');

  // Assuming footerLinkItems are for copyright and other direct links
  footerLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Fixed schema for footer-link-item
    const link = document.createElement('a');
    link.classList.add('desc-1');
    moveInstrumentation(row, link);

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.textContent = labelCell.textContent.trim();
    itcTitles.append(link);
  });
  bottomContainer.append(itcTitles);

  // Social Media
  const socialMedia = document.createElement('div');
  socialMedia.classList.add('cmp-new-footer__social-media');
  // moveInstrumentation(socialLinksContainer, socialMedia); // Placeholder, not a content row

  footerSocialItems.forEach((row) => {
    const [socialLinkCell] = [...row.children]; // Fixed schema for footer-social-item
    const link = document.createElement('a');
    moveInstrumentation(row, link);

    const foundLink = socialLinkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.target = '_blank'; // Assuming social links open in new tab
      // Determine icon class based on href or some other data
      if (link.href.includes('instagram')) {
        link.classList.add('icon-instagram');
        link.dataset.social = 'instagram';
      } else if (link.href.includes('facebook')) {
        link.classList.add('icon-facebook');
        link.dataset.social = 'facebook';
      } else if (link.href.includes('youtube')) {
        link.classList.add('icon-youtube');
        link.dataset.social = 'youtube';
      } else if (link.href.includes('twitter') || link.href.includes('x.com')) {
        link.classList.add('icon-twitter');
        link.dataset.social = 'twitter';
      }
    }
    socialMedia.append(link);
  });
  bottomContainer.append(socialMedia);

  bottomContent.append(bottomContainer);
  root.append(bottomContent);

  block.replaceChildren(root);

  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
