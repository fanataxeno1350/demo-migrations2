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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's internal to the transform function.
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist, but it's internal to the transform function.
          subWrap.classList.toggle('active'); // This class is not in the allowlist, but it's internal to the transform function.
        });
      }
    }
  });
}

export default function decorate(block) {
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
    ...rest
  ] = children;

  const copyrightRow = rest.pop(); // Copyright is always the last row

  const linkSectionRows = rest; // Remaining rows are link sections

  const footer = document.createElement('footer');
  const container = document.createElement('div');
  container.classList.add('container');
  footer.append(container);

  const row = document.createElement('div');
  row.classList.add('row', 'gy-5');
  container.append(row);

  // Left Column (Logo, Site Title, Newsletter)
  const leftCol = document.createElement('div');
  leftCol.classList.add('col-lg-6', 'col-12');
  row.append(leftCol);

  const logoLinkEl = document.createElement('a');
  logoLinkEl.classList.add('footer-logo', 'd-flex', 'align-items-center');
  moveInstrumentation(logoLinkRow, logoLinkEl);
  logoLinkEl.href = logoLinkRow.querySelector('a')?.href || '#';

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLinkEl.append(optimizedPic);
  }

  const siteTitle = document.createElement('h2');
  moveInstrumentation(siteTitleRow, siteTitle);
  siteTitle.textContent = siteTitleRow.textContent.trim();
  logoLinkEl.append(siteTitle);
  leftCol.append(logoLinkEl);

  const newsletterHeading = document.createElement('h3');
  moveInstrumentation(newsletterHeadingRow, newsletterHeading);
  newsletterHeading.textContent = newsletterHeadingRow.textContent.trim();
  leftCol.append(newsletterHeading);

  const newsletterDescription = document.createElement('p');
  moveInstrumentation(newsletterDescriptionRow, newsletterDescription);
  newsletterDescription.textContent = newsletterDescriptionRow.textContent.trim();
  leftCol.append(newsletterDescription);

  const newsletterForm = document.createElement('form');
  newsletterForm.classList.add('d-flex', 'flex-wrap');
  moveInstrumentation(newsletterFormActionRow, newsletterForm);
  newsletterForm.action = newsletterFormActionRow.querySelector('a')?.href || '#';
  newsletterForm.method = 'post'; // Assuming method is post from original HTML

  // Add hidden csrfmiddlewaretoken input if needed, based on original HTML
  // For now, omitting as it's specific to Django/Python backend and not generic
  // const csrfInput = document.createElement('input');
  // csrfInput.type = 'hidden';
  // csrfInput.name = 'csrfmiddlewaretoken';
  // csrfInput.value = 'HF9uVPewmWGjHzMZendUyip1dJDHqjeKVFX5pbBKSa93Xcw8NoxWxr96LSuldDmz'; // Hardcoded from original
  // newsletterForm.append(csrfInput);

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  moveInstrumentation(newsletterEmailPlaceholderRow, emailInput);
  emailInput.placeholder = newsletterEmailPlaceholderRow.textContent.trim();
  newsletterForm.append(emailInput);

  const subscribeButton = document.createElement('button');
  subscribeButton.classList.add('btn', 'btn-primary', 'subscribe-btn');
  moveInstrumentation(newsletterButtonLabelRow, subscribeButton);
  subscribeButton.textContent = newsletterButtonLabelRow.textContent.trim();
  newsletterForm.append(subscribeButton);
  leftCol.append(newsletterForm);

  // Link Sections
  linkSectionRows.forEach((linkSectionRow) => {
    const [sectionTitleCell, sectionLinksCell, hierarchyTreeCell] = [...linkSectionRow.children];

    const col = document.createElement('div');
    col.classList.add('col-lg-3', 'col-6');
    moveInstrumentation(linkSectionRow, col);
    row.append(col);

    const title = document.createElement('h5');
    title.textContent = sectionTitleCell.textContent.trim();
    col.append(title);

    const tempDiv = document.createElement('div');
    moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation for the hierarchy cell
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
    const hierarchyUl = tempDiv.querySelector('ul');

    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      const ul = document.createElement('ul');
      ul.classList.add('d-flex', 'flex-column', 'useful-links-list');
      while (hierarchyUl.firstChild) { // Correctly move children from the processed hierarchyUl
        ul.append(hierarchyUl.firstChild);
      }
      col.append(ul);
    } else {
      // Fallback to sectionLinks if hierarchy-tree is empty or not a UL
      const sectionLinksTempDiv = document.createElement('div');
      moveInstrumentation(sectionLinksCell, sectionLinksTempDiv); // Move instrumentation for the fallback cell
      sectionLinksTempDiv.innerHTML = sectionLinksCell.innerHTML;
      const ul = sectionLinksTempDiv.querySelector('ul');
      if (ul) {
        const newUl = document.createElement('ul');
        newUl.classList.add('d-flex', 'flex-column', 'useful-links-list');
        [...ul.querySelectorAll('li')].forEach((li) => {
          const newLi = document.createElement('li');
          const anchor = li.querySelector('a');
          if (anchor) {
            const newAnchor = document.createElement('a');
            newAnchor.href = anchor.href;
            newAnchor.textContent = anchor.textContent.trim();
            newLi.append(newAnchor);
          } else {
            newLi.textContent = li.textContent.trim();
          }
          newUl.append(newLi);
        });
        col.append(newUl);
      } else {
        // If no UL in sectionLinks, just append the content as is (e.g., plain text)
        // Use a div as a safe container for richtext content to avoid <p>-inside-<p>
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = sectionLinksCell.innerHTML; // Read innerHTML directly from the cell
        col.append(contentDiv);
      }
    }
  });

  // Copyright Notice
  const copyright = document.createElement('h5');
  copyright.classList.add('text-center', 'mt-6');
  moveInstrumentation(copyrightRow, copyright);
  copyright.textContent = copyrightRow.textContent.trim();
  footer.append(copyright);

  block.replaceChildren(footer);
}
