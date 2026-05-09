import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The block div itself already has the 'call-to-action-section' class.
  // Do not add it to an inner wrapper to avoid double padding/CSS.

  const itemRows = [...block.children];

  const containerFluid = document.createElement('div');
  containerFluid.classList.add('container-fluid', 'advanced-widget-row-no-pad', 'advanced-widget-vertical-center');
  containerFluid.id = 'call-to-act-front';

  const fieldLayout = document.createElement('div');
  fieldLayout.classList.add('field', 'field--name-field-content-layout', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__item');
  containerFluid.append(fieldLayout);

  const rowPad = document.createElement('div');
  rowPad.classList.add('row', 'row-pad');
  rowPad.id = 'call-to-action';
  fieldLayout.append(rowPad);

  itemRows.forEach((row, index) => {
    const [headlineLinkCell, headlineCell, descriptionCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-4');
    // Move instrumentation from the original row to the new column div
    moveInstrumentation(row, col);
    rowPad.append(col);

    const fieldColumnWidgets = document.createElement('div');
    // Original HTML uses field--name-field-column-1-widgets, field--name-field-column-2-widgets, etc.
    fieldColumnWidgets.classList.add('field', `field--name-field-column-${index + 1}-widgets`, 'field--type-entity-reference-revisions', 'field--label-visually_hidden');
    col.append(fieldColumnWidgets);

    const fieldLabel = document.createElement('div');
    fieldLabel.classList.add('field__label', 'visually-hidden');
    fieldLabel.textContent = `Column ${index + 1}:`;
    fieldColumnWidgets.append(fieldLabel);

    const fieldItem = document.createElement('div');
    fieldItem.classList.add('field__item');
    fieldColumnWidgets.append(fieldItem);

    const paragraphColumnContent = document.createElement('div');
    paragraphColumnContent.classList.add('paragraph', 'paragraph--type--column-content', 'paragraph--view-mode--default');
    fieldItem.append(paragraphColumnContent);

    const fieldColumnContent = document.createElement('div');
    fieldColumnContent.classList.add('field', 'field--name-field-column-content', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__items');
    paragraphColumnContent.append(fieldColumnContent);

    const fieldItemInner = document.createElement('div');
    fieldItemInner.classList.add('field__item');
    fieldColumnContent.append(fieldItemInner);

    const paragraphText = document.createElement('div');
    paragraphText.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
    fieldItemInner.append(paragraphText);

    const clearfixTextFormatted = document.createElement('div');
    clearfixTextFormatted.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
    paragraphText.append(clearfixTextFormatted);

    const headlineLinkElement = headlineLinkCell.querySelector('a');
    
    if (headlineLinkElement) {
      const anchor = document.createElement('a');
      anchor.href = headlineLinkElement.href;
      // Move instrumentation from the original headlineLinkCell to the new anchor
      moveInstrumentation(headlineLinkCell, anchor);
      // headline is richtext, copy innerHTML, which includes the SVG and text
      anchor.innerHTML = headlineCell?.innerHTML || ''; 
      clearfixTextFormatted.append(anchor);
    } else {
      const headline = document.createElement('h3'); // Original HTML uses h3 for headlines
      headline.innerHTML = headlineCell?.innerHTML || ''; // headline is richtext, copy innerHTML
      clearfixTextFormatted.append(headline);
    }

    const description = document.createElement('p'); // Original HTML uses p for descriptions
    description.innerHTML = descriptionCell?.innerHTML || ''; // description is richtext, copy innerHTML
    clearfixTextFormatted.append(description);
  });

  block.replaceChildren(containerFluid);
}
