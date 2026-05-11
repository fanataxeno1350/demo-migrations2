import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const layoutContainerDesktop = document.createElement('div');
  layoutContainerDesktop.classList.add('layout-container', '-dark', 'desktop-view');

  const uContainerDesktop = document.createElement('div');
  uContainerDesktop.classList.add('u-container', 'u-width-10');
  layoutContainerDesktop.append(uContainerDesktop);

  const heroDiv = document.createElement('div');
  heroDiv.classList.add('hero-text');
  uContainerDesktop.append(heroDiv);

  const [headlineRow, descriptionRow, causesContainerPlaceholder, ...causeItems] = children;

  const headlineEl = document.createElement('h2');
  headlineEl.classList.add('causes-text');
  moveInstrumentation(headlineRow, headlineEl);
  headlineEl.textContent = headlineRow.textContent.trim();
  heroDiv.append(headlineEl);

  const descriptionEl = document.createElement('span');
  descriptionEl.classList.add('causes-description');
  moveInstrumentation(descriptionRow, descriptionEl);
  // Description is richtext, so use innerHTML from the cell directly
  descriptionEl.innerHTML = descriptionRow.children[0]?.innerHTML || '';
  heroDiv.append(descriptionEl);

  const homeCausesLists = document.createElement('div');
  homeCausesLists.classList.add('home-causes-lists');
  uContainerDesktop.append(homeCausesLists);

  const aofList1 = document.createElement('div');
  aofList1.classList.add('aof', 'aof-list');
  homeCausesLists.append(aofList1);

  const aofMiddle = document.createElement('div');
  aofMiddle.classList.add('aof', 'aof-middle');
  homeCausesLists.append(aofMiddle);

  const aofList2 = document.createElement('div');
  aofList2.classList.add('aof', 'aof-list');
  homeCausesLists.append(aofList2);

  // No need to moveInstrumentation for a placeholder row that isn't rendered
  // moveInstrumentation(causesContainerPlaceholder, document.createElement('div')); // Consume container placeholder

  causeItems.forEach((row, index) => {
    // Cause Item has a fixed schema: [link, label]
    const [linkCell, labelCell] = [...row.children];

    const homeCausesItemLists = document.createElement('div');
    homeCausesItemLists.classList.add('home-causes-item-lists');
    homeCausesItemLists.id = `cause${index > 0 ? `--${index}` : ''}`;

    const linkEl = document.createElement('a');
    linkEl.classList.add('causes-link');
    // Link cell is aem-content, so extract href from the <a> tag
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
    }

    const homeCausesImage = document.createElement('span');
    homeCausesImage.classList.add('home-causes-image');
    linkEl.append(homeCausesImage);

    const labelDiv = document.createElement('div');
    const labelP = document.createElement('p');
    labelP.textContent = labelCell?.textContent.trim() || '';
    labelDiv.append(labelP);
    linkEl.append(labelDiv);

    moveInstrumentation(row, homeCausesItemLists);
    homeCausesItemLists.append(linkEl);

    if (index === 0 || index === 1) {
      aofList1.append(homeCausesItemLists);
    } else if (index === 2 || index === 3 || index === 4) {
      aofMiddle.append(homeCausesItemLists);
    } else {
      aofList2.append(homeCausesItemLists);
    }
  });

  // Mobile View
  const layoutContainerMobile = document.createElement('div');
  layoutContainerMobile.classList.add('layout-container', '-dark', 'mobile-view');

  const uContainerMobile = document.createElement('div');
  uContainerMobile.classList.add('u-container', 'u-width-10');
  layoutContainerMobile.append(uContainerMobile);

  const AOFMobileHeading = document.createElement('div');
  AOFMobileHeading.classList.add('AOF-mobile-heading');
  uContainerMobile.append(AOFMobileHeading);

  const headlineElMobile = document.createElement('h2');
  headlineElMobile.classList.add('causes-text');
  headlineElMobile.textContent = headlineRow.textContent.trim();
  AOFMobileHeading.append(headlineElMobile);

  const descriptionElMobile = document.createElement('span');
  descriptionElMobile.classList.add('causes-description');
  // Description is richtext, so use innerHTML from the cell directly
  descriptionElMobile.innerHTML = descriptionRow.children[0]?.innerHTML || '';
  AOFMobileHeading.append(descriptionElMobile);

  const homeCausesListMobile = document.createElement('ul');
  homeCausesListMobile.classList.add('home-causes-list');
  uContainerMobile.append(homeCausesListMobile);

  causeItems.forEach((row, index) => {
    // Cause Item has a fixed schema: [link, label]
    const [linkCell, labelCell] = [...row.children];

    const homeCausesItemListMobile = document.createElement('li');
    homeCausesItemListMobile.classList.add('home-causes-item-list');
    homeCausesItemListMobile.id = `cause${index > 0 ? `--${index}` : ''}`;

    const linkEl = document.createElement('a');
    linkEl.classList.add('causes-link');
    // Link cell is aem-content, so extract href from the <a> tag
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
    }

    const homeCausesImage = document.createElement('span');
    homeCausesImage.classList.add('home-causes-image');
    linkEl.append(homeCausesImage);

    const labelDiv = document.createElement('div');
    const labelP = document.createElement('p');
    labelP.textContent = labelCell?.textContent.trim() || '';
    labelDiv.append(labelP);
    linkEl.append(labelDiv);

    homeCausesItemListMobile.append(linkEl);
    homeCausesListMobile.append(homeCausesItemListMobile);
  });

  block.replaceChildren(layoutContainerDesktop, layoutContainerMobile);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
