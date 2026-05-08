import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, parentCell) {
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
      subWrap.classList.add('has-sub-child'); // This class is not in ORIGINAL HTML, but is for JS behavior
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in ORIGINAL HTML, but is for JS behavior
          subWrap.classList.toggle('active'); // This class is not in ORIGINAL HTML, but is for JS behavior
        });
      }
    }
  });
  // Move instrumentation from the original cell to the transformed UL
  moveInstrumentation(parentCell, rootUl);
}

export default function decorate(block) {
  const children = [...block.children];

  const footer = document.createElement('footer');
  const container = document.createElement('div');
  container.classList.add('container');
  const row = document.createElement('div');
  row.classList.add('row', 'gy-5');

  const [
    logoRow,
    logoLinkRow,
    siteTitleRow,
    newsletterTitleRow,
    newsletterDescriptionRow,
    newsletterFormActionRow,
    newsletterInputPlaceholderRow,
    newsletterButtonLabelRow,
    ...itemAndCopyrightRows
  ] = children;

  // The last row is copyright, the rest are item rows
  const copyrightRow = itemAndCopyrightRows.pop();
  const itemRows = itemAndCopyrightRows;

  // Left column for logo and newsletter
  const leftCol = document.createElement('div');
  leftCol.classList.add('col-lg-6', 'col-12');
  moveInstrumentation(logoRow, leftCol); // Move instrumentation from the first row to the column

  // Logo and Site Title
  const logoLinkEl = document.createElement('a');
  logoLinkEl.classList.add('footer-logo', 'd-flex', 'align-items-center');
  const logoLink = logoLinkRow.querySelector('a');
  if (logoLink) {
    logoLinkEl.href = logoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLinkEl);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    // createOptimizedPicture handles instrumentation internally for its own elements
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
    logoLinkEl.append(optimizedPic);
  }

  const siteTitle = document.createElement('h2');
  siteTitle.textContent = siteTitleRow.textContent.trim();
  moveInstrumentation(siteTitleRow, siteTitle);
  logoLinkEl.append(siteTitle);

  leftCol.append(logoLinkEl);

  // Newsletter Section
  const newsletterTitle = document.createElement('h3');
  newsletterTitle.textContent = newsletterTitleRow.textContent.trim();
  moveInstrumentation(newsletterTitleRow, newsletterTitle);
  leftCol.append(newsletterTitle);

  const newsletterDescription = document.createElement('p');
  newsletterDescription.textContent = newsletterDescriptionRow.textContent.trim();
  moveInstrumentation(newsletterDescriptionRow, newsletterDescription);
  leftCol.append(newsletterDescription);

  const newsletterForm = document.createElement('form');
  newsletterForm.classList.add('d-flex', 'flex-wrap');
  const formAction = newsletterFormActionRow.querySelector('a');
  if (formAction) {
    newsletterForm.action = formAction.href;
  }
  newsletterForm.method = 'post';
  moveInstrumentation(newsletterFormActionRow, newsletterForm);

  // CSRF token is hardcoded in original HTML, but should not be hardcoded in JS.
  // If it's dynamic, it should come from a block field. For now, remove hardcoded value.
  // TODO: Add a field for CSRF token if it's dynamic, or remove if not needed.
  // const csrfInput = document.createElement('input');
  // csrfInput.type = 'hidden';
  // csrfInput.name = 'csrfmiddlewaretoken';
  // csrfInput.value = 'HF9uVPewmWGjHzMZendUyip1dJDHqjeKVFX5pbBKSa93Xcw8NoxWxr96LSuldDmz';
  // newsletterForm.append(csrfInput);

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = newsletterInputPlaceholderRow.textContent.trim();
  moveInstrumentation(newsletterInputPlaceholderRow, emailInput);
  newsletterForm.append(emailInput);

  const subscribeButton = document.createElement('button');
  subscribeButton.classList.add('btn', 'btn-primary', 'subscribe-btn');
  subscribeButton.textContent = newsletterButtonLabelRow.textContent.trim();
  moveInstrumentation(newsletterButtonLabelRow, subscribeButton);
  newsletterForm.append(subscribeButton);

  leftCol.append(newsletterForm);
  row.append(leftCol);

  // Filter item rows into footer-link-item and footer-section-item
  // Based on BlockJson, footer-link-item has 2 cells, footer-section-item has 3 cells.
  const footerLinkItems = [];
  const footerSectionItems = [];

  itemRows.forEach((itemRow) => {
    if (itemRow.children.length === 2) {
      footerLinkItems.push(itemRow);
    } else if (itemRow.children.length === 3) {
      footerSectionItems.push(itemRow);
    }
  });

  // Footer Section Items (Useful Links, Our Services)
  footerSectionItems.forEach((sectionRow) => {
    const [titleCell, sectionLinksCell, hierarchyTreeCell] = [...sectionRow.children];

    const col = document.createElement('div');
    col.classList.add('col-lg-3', 'col-6');
    moveInstrumentation(sectionRow, col);

    const title = document.createElement('h5');
    title.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, title);
    col.append(title);

    const ul = document.createElement('ul');
    ul.classList.add('d-flex', 'flex-column', 'useful-links-list');

    const hierarchyTreeTempDiv = document.createElement('div');
    hierarchyTreeTempDiv.innerHTML = hierarchyTreeCell.innerHTML;
    const hierarchyTree = hierarchyTreeTempDiv.querySelector('ul');

    if (hierarchyTree) {
      transformNestedLists(hierarchyTree, hierarchyTreeCell); // Pass hierarchyTreeCell for instrumentation
      // Append the transformed hierarchy tree directly
      while (hierarchyTree.firstChild) {
        ul.append(hierarchyTree.firstChild);
      }
    } else {
      // Fallback to sectionLinks if hierarchy-tree is empty
      const sectionLinksTempDiv = document.createElement('div');
      sectionLinksTempDiv.innerHTML = sectionLinksCell.innerHTML;
      const sectionLinksUl = sectionLinksTempDiv.querySelector('ul');

      if (sectionLinksUl) {
        moveInstrumentation(sectionLinksCell, sectionLinksUl);
        [...sectionLinksUl.querySelectorAll('li > a')].forEach((link) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = link.href;
          a.textContent = link.textContent.trim();
          li.append(a);
          ul.append(li);
        });
      } else {
        // If neither hierarchy-tree nor sectionLinks has a UL, check for direct links in sectionLinks
        const directLink = sectionLinksCell.querySelector('a');
        if (directLink) {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = directLink.href;
          a.textContent = directLink.textContent.trim();
          li.append(a);
          ul.append(li);
        }
      }
    }
    col.append(ul);
    row.append(col);
  });

  // Footer Link Items (if any, although original HTML only shows section-items)
  // For this specific original HTML, there are no separate footer-link-items rendered outside sections.
  // If they were, they'd typically be rendered in a similar column structure.
  // The current logic correctly separates them, but they are not rendered here as per original HTML.
  footerLinkItems.forEach((linkRow) => {
    const [labelCell, linkCell] = [...linkRow.children];
    // Example rendering if needed:
    // const li = document.createElement('li');
    // const a = document.createElement('a');
    // a.href = linkCell.querySelector('a')?.href || '';
    // a.textContent = labelCell.textContent.trim();
    // li.append(a);
    // someUlElement.append(li);
    // moveInstrumentation(linkRow, li);
  });

  container.append(row);
  footer.append(container);

  // Copyright
  const copyright = document.createElement('h5');
  copyright.classList.add('text-center', 'mt-6');
  copyright.textContent = copyrightRow.textContent.trim();
  moveInstrumentation(copyrightRow, copyright);
  footer.append(copyright);

  block.replaceChildren(footer);

  // The original image optimization loop is redundant because createOptimizedPicture
  // is already used for the logo and handles its own instrumentation.
  // If other images were present and needed optimization, they would need their own
  // createOptimizedPicture calls with moveInstrumentation.
}
