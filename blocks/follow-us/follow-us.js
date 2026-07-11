import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow, descriptionRow, ctaLinkRow, ctaLabelRow] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('container', 'responsivegrid', 'top-lg-margin', 'bottom-lg-margin');

  const cmpContainer = document.createElement('div');
  cmpContainer.classList.add('cmp-container');
  root.append(cmpContainer);

  const textDiv = document.createElement('div');
  textDiv.classList.add('text');
  cmpContainer.append(textDiv);

  const cmpText = document.createElement('div');
  cmpText.classList.add('cmp-text');
  textDiv.append(cmpText);

  if (headlineRow) {
    const headline = document.createElement('h2');
    moveInstrumentation(headlineRow, headline);
    headline.textContent = headlineRow.textContent.trim();
    headline.style.textAlign = 'center'; // Preserve inline style from original HTML
    cmpText.append(headline);
  }

  if (descriptionRow) {
    const description = document.createElement('p');
    moveInstrumentation(descriptionRow, description);
    // FIX: description is a richtext field, so read innerHTML directly from the row's cell
    // The cell itself contains the <p> tag, so assigning row.children[0].innerHTML
    // would result in <p><p>...</p></p>, which is invalid.
    // Assigning descriptionRow.innerHTML would include the cell wrapper <div>.
    // The correct way for a richtext field that is expected to be a <p> is to extract the innerHTML of the <p> inside the cell.
    description.innerHTML = descriptionRow.querySelector('p')?.innerHTML ?? descriptionRow.textContent.trim();
    description.style.textAlign = 'center'; // Preserve inline style from original HTML
    cmpText.append(description);
  }

  // Add an empty paragraph for spacing, matching the original HTML
  const emptyP = document.createElement('p');
  emptyP.style.textAlign = 'center';
  cmpText.append(emptyP);

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--primary-anchor', 'cmp-container--center-align');
  cmpContainer.append(buttonDiv);

  const anchor = document.createElement('a');
  anchor.classList.add('cmp-button');

  if (ctaLinkRow) {
    const foundLink = ctaLinkRow.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    moveInstrumentation(ctaLinkRow, anchor);
  }

  const span = document.createElement('span');
  span.classList.add('cmp-button__text');
  if (ctaLabelRow) {
    span.textContent = ctaLabelRow.textContent.trim();
    moveInstrumentation(ctaLabelRow, span);
  }
  anchor.append(span);
  buttonDiv.append(anchor);

  block.replaceChildren(root);
}
