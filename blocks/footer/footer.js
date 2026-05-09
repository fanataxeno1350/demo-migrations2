import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
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
      subWrap.classList.add('has-sub-child'); // Class from original HTML for nested menu
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // Class from original HTML for active state
          subWrap.classList.toggle('active'); // Class from original HTML for active state
        });
      }
    }
  });
}

export default async function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    siteTitleRow,
    newsletterHeadingRow,
    newsletterDescriptionRow,
    newsletterFormActionRow,
    newsletterEmailPlaceholderRow,
    newsletterButtonLabelRow,
    // footerSectionsContainerRow, // This is a container placeholder, not a real row
    copyrightRow,
    ...itemRows
  ] = children;

  const footer = document.createElement('footer');
  const container = document.createElement('div');
  container.classList.add('container');
  footer.append(container);

  const row = document.createElement('div');
  row.classList.add('row', 'gy-5');
  container.append(row);

  // Left column for logo and newsletter
  const leftCol = document.createElement('div');
  leftCol.classList.add('col-lg-6', 'col-12');
  row.append(leftCol);

  // Logo and Site Title
  const logoLinkEl = document.createElement('a');
  logoLinkEl.classList.add('footer-logo', 'd-flex', 'align-items-center');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLinkEl.href = foundLogoLink.href;
    moveInstrumentation(logoLinkRow, logoLinkEl);
  }

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoLinkEl.append(optimizedPic);
  }

  const siteTitle = document.createElement('h2');
  siteTitle.textContent = siteTitleRow.textContent.trim();
  moveInstrumentation(siteTitleRow, siteTitle);
  logoLinkEl.append(siteTitle);
  leftCol.append(logoLinkEl);

  // Newsletter Section
  const newsletterHeading = document.createElement('h3');
  newsletterHeading.textContent = newsletterHeadingRow.textContent.trim();
  moveInstrumentation(newsletterHeadingRow, newsletterHeading);
  leftCol.append(newsletterHeading);

  const newsletterDescription = document.createElement('p');
  newsletterDescription.textContent = newsletterDescriptionRow.textContent.trim();
  moveInstrumentation(newsletterDescriptionRow, newsletterDescription);
  leftCol.append(newsletterDescription);

  const newsletterForm = document.createElement('form');
  newsletterForm.classList.add('d-flex', 'flex-wrap');
  newsletterForm.action = newsletterFormActionRow.textContent.trim();
  newsletterForm.method = 'post';
  moveInstrumentation(newsletterFormActionRow, newsletterForm);

  const csrfInput = document.createElement('input');
  csrfInput.type = 'hidden';
  csrfInput.name = 'csrfmiddlewaretoken';
  // Placeholder value as per original HTML - this is a hardcoded value from the original HTML
  // In a real scenario, this should ideally come from a hidden field in the block or a global config.
  // For now, keeping it as is, as it's a direct copy from the original HTML.
  csrfInput.value = 'zRmFAYwTPO46H1dyaTNlUbIRdB9iUyOTTgQeShrgqv9p0aqc3yptn2uJv5gHjJFV';
  newsletterForm.append(csrfInput);

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = newsletterEmailPlaceholderRow.textContent.trim();
  moveInstrumentation(newsletterEmailPlaceholderRow, emailInput);
  newsletterForm.append(emailInput);

  const subscribeButton = document.createElement('button');
  subscribeButton.classList.add('btn', 'btn-primary', 'subscribe-btn');
  subscribeButton.textContent = newsletterButtonLabelRow.textContent.trim();
  moveInstrumentation(newsletterButtonLabelRow, subscribeButton);
  newsletterForm.append(subscribeButton);
  leftCol.append(newsletterForm);

  // Right columns for footer sections
  // The footerSectionsContainerRow was a placeholder, actual item rows start after copyrightRow
  // Filter for footer-section-item rows (2 cells: title, hierarchy-tree)
  const footerSectionItems = itemRows.filter((item) => item.children.length === 2);

  footerSectionItems.forEach((item) => {
    const [titleCell, hierarchyTreeCell] = [...item.children];

    const col = document.createElement('div');
    col.classList.add('col-lg-3', 'col-6');
    row.append(col);

    const title = document.createElement('h5');
    title.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, title);
    col.append(title);

    const navList = document.createElement('ul');
    navList.classList.add('d-flex', 'flex-column', 'useful-links-list');
    moveInstrumentation(item, navList); // Move instrumentation from the item row to the navList

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
    moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from the cell

    const subList = tempDiv.querySelector('ul');
    if (subList) {
      transformNestedLists(subList);
      while (subList.firstChild) {
        navList.append(subList.firstChild);
      }
    }
    col.append(navList);
  });

  // Copyright
  const copyright = document.createElement('h5');
  copyright.classList.add('text-center', 'mt-6');
  copyright.textContent = copyrightRow.textContent.trim();
  moveInstrumentation(copyrightRow, copyright);
  footer.append(copyright);

  block.replaceChildren(footer);
}
