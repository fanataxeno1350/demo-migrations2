import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure block.children to read root-level rows by their semantic names
  // Based on BlockJson model: backgroundDesktop, backgroundMobile, titles (container), bodyText
  const [
    backgroundDesktopRow,
    backgroundMobileRow,
    titlesContainerPlaceholderRow, // This row is just a placeholder for the container field
    bodyTextRow,
    ...titleItemRows // Remaining rows are title-item sub-components
  ] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container', 'responsivegrid', 'cmp-container--multiTitle');

  const multiTitleContainer = document.createElement('div');
  multiTitleContainer.classList.add('cmp-container');
  // Move instrumentation from the placeholder row for the 'titles' container field
  moveInstrumentation(titlesContainerPlaceholderRow, multiTitleContainer);

  const aemGrid = document.createElement('div');
  aemGrid.classList.add('aem-Grid', 'aem-Grid--12', 'aem-Grid--default--12');

  const responsiveGridColumn = document.createElement('div');
  responsiveGridColumn.classList.add('container', 'responsivegrid', 'aem-GridColumn', 'aem-GridColumn--default--12');

  const innerCmpContainer = document.createElement('div');
  innerCmpContainer.classList.add('cmp-container');

  // Background Images
  // Read the picture element directly from the cell (row.children[0])
  const desktopPicture = backgroundDesktopRow.children[0]?.querySelector('picture');
  const mobilePicture = backgroundMobileRow.children[0]?.querySelector('picture');

  if (desktopPicture) {
    const img = desktopPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // Instrumentation should be moved from the original img element to the new optimized img
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      desktopPicture.replaceWith(optimizedPic);
      multiTitleContainer.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
      multiTitleContainer.style.backgroundSize = 'cover';
      multiTitleContainer.style.backgroundRepeat = 'no-repeat';
    }
  }
  // Mobile picture handling (if needed, based on original HTML)
  // The original HTML only showed desktop background applied to multiTitleContainer.
  // If mobile background is needed, it would typically be handled via CSS media queries
  // or a separate element, not directly setting background-image on the same container.
  // For now, mirroring the desktop logic if it were to be applied.
  if (mobilePicture) {
    const img = mobilePicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      mobilePicture.replaceWith(optimizedPic);
      // If mobile background needs to be applied, it would likely be conditional or on a different element.
      // For now, leaving it as a placeholder if a separate mobile background is intended.
      // multiTitleContainer.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
    }
  }

  // Titles
  titleItemRows.forEach((row, index) => {
    // For 'title-item' model, there's only one cell: 'title' (type=text)
    const [titleCell] = [...row.children]; // Use destructuring for fixed-schema item rows
    if (titleCell) {
      const titleDiv = document.createElement('div');
      titleDiv.classList.add('title');

      // Apply specific color classes based on index from original HTML
      if (index === 1) {
        titleDiv.classList.add('color-text-primary-2');
      } else if (index === 2) {
        titleDiv.classList.add('color-text-primary-3');
      } else if (index === 3) {
        titleDiv.classList.add('color-text-primary-5');
      }

      const cmpTitle = document.createElement('div');
      cmpTitle.classList.add('cmp-title');

      const h1 = document.createElement('h1');
      h1.classList.add('cmp-title__text');
      h1.textContent = titleCell.textContent.trim(); // Read text content directly from the cell

      moveInstrumentation(row, h1); // Move instrumentation from the row to the h1
      cmpTitle.append(h1);
      titleDiv.append(cmpTitle);
      innerCmpContainer.append(titleDiv);
    }
  });

  responsiveGridColumn.append(innerCmpContainer);
  aemGrid.append(responsiveGridColumn);

  // Body Text
  // The bodyText field is type=richtext, so its content is the innerHTML of the cell.
  const bodyTextCell = bodyTextRow.children[0]; // Access the cell directly
  if (bodyTextCell) {
    const textColumn = document.createElement('div');
    textColumn.classList.add('text', 'aem-GridColumn', 'aem-GridColumn--default--12');

    const cmpText = document.createElement('div');
    cmpText.classList.add('cmp-text');
    cmpText.innerHTML = bodyTextCell.innerHTML; // Use innerHTML for richtext

    // Move instrumentation from the bodyTextRow to cmpText
    moveInstrumentation(bodyTextRow, cmpText);
    textColumn.append(cmpText);
    aemGrid.append(textColumn);
  }

  multiTitleContainer.append(aemGrid);
  container.append(multiTitleContainer);

  block.replaceChildren(container);
}
