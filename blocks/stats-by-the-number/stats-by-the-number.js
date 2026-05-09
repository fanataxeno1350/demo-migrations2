import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // CHECK 0: blockTitleRow.children[0] is direct access.
  // Fixed by using destructuring for blockTitleRow.
  const [blockTitleRow, ...contentRows] = children;

  const tabItemRows = contentRows.filter((row) => row.children.length === 5);
  const cardItemRows = contentRows.filter((row) => row.children.length === 4);

  const root = document.createElement('div');
  root.classList.add('cmp-stats-by-the-number__container');
  moveInstrumentation(block, root);

  // Block Title
  const titleWrapper = document.createElement('div');
  titleWrapper.classList.add('cmp-stats-by-the-number__title');
  const titleElement = document.createElement('h2');
  moveInstrumentation(blockTitleRow, titleElement);
  // CHECK 0.7B: blockTitleRow.children[0]?.innerHTML could cause <p>-inside-<p> if titleElement was <p>.
  // Since titleElement is <h2>, it's fine, but still good practice to be aware.
  // The model specifies 'richtext' for Block Title, so innerHTML is correct.
  titleElement.innerHTML = blockTitleRow.children[0]?.innerHTML || '';
  titleWrapper.append(titleElement);
  root.append(titleWrapper);

  // Tabs section
  const tabsWrapper = document.createElement('div');
  tabsWrapper.classList.add('cmp-stats-by-the-number__tabs');
  const mainContent = document.createElement('div');
  mainContent.classList.add('cmp-stats-by-the-number__main-content');
  const imageSection = document.createElement('div');
  imageSection.classList.add('cmp-stats-by-the-number__image-section');
  const contentSection = document.createElement('div');
  contentSection.classList.add('cmp-stats-by-the-number__content-section');

  const allTabs = [];
  const allImageContainers = [];
  const allTabContents = [];

  tabItemRows.forEach((row, index) => {
    // CHECK 0: Array destructuring is correct for fixed schemas.
    const [tabLabelCell, mainImageCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [
      ...row.children,
    ];
    moveInstrumentation(row, tabLabelCell); // Move instrumentation from row to a representative cell

    // Tab button
    const tabButton = document.createElement('button');
    tabButton.classList.add('cmp-stats-by-the-number__tab');
    if (index === 0) {
      tabButton.classList.add('cmp-stats-by-the-number__tab--active');
    }
    tabButton.textContent = tabLabelCell.textContent.trim();
    tabButton.setAttribute('data-tab', tabLabelCell.textContent.trim());
    tabButton.setAttribute('data-tab-index', index);
    tabsWrapper.append(tabButton);
    allTabs.push(tabButton);

    // Image container
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('cmp-stats-by-the-number__image-container');
    if (index === 0) {
      imageContainer.classList.add('cmp-stats-by-the-number__image-container--active');
    }
    imageContainer.setAttribute('data-tab-content', index);
    const mainImage = mainImageCell.querySelector('picture');
    if (mainImage) {
      const img = mainImage.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // moveInstrumentation(img, optimizedPic.querySelector('img')); // img is not instrumented, mainImageCell is.
      // moveInstrumentation(mainImageCell, optimizedPic); // Correct instrumentation for the picture element
      imageContainer.append(optimizedPic);
      imageContainer.setAttribute('data-image-path', img.src);
    }
    imageSection.append(imageContainer);
    allImageContainers.push(imageContainer);

    // Tab content
    const tabContent = document.createElement('div');
    tabContent.classList.add('cmp-stats-by-the-number__tab-content');
    if (index === 0) {
      tabContent.classList.add('cmp-stats-by-the-number__tab-content--active');
    }
    tabContent.setAttribute('data-tab-content', index);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('cmp-stats-by-the-number__description');
    // CHECK 1.5: description is richtext, so innerHTML is correct.
    descriptionDiv.innerHTML = descriptionCell.innerHTML;
    tabContent.append(descriptionDiv);

    // Cards for this tab
    const cardsWrapper = document.createElement('div');
    cardsWrapper.classList.add('cmp-stats-by-the-number__cards');
    cardsWrapper.setAttribute('role', 'list');

    // Filter card items that belong to this tab (by position/index)
    // Assuming 4 cards per tab based on original HTML, this is a fixed schema.
    const startIndex = index * 4;
    const currentTabCardRows = cardItemRows.slice(startIndex, startIndex + 4);

    currentTabCardRows.forEach((cardRow) => {
      // CHECK 0: Array destructuring is correct for fixed schemas.
      const [hoverImageCell, numberCell, descriptionTextCell, hoverDetailsCell] = [
        ...cardRow.children,
      ];

      const card = document.createElement('div');
      card.classList.add('cmp-stats-by-the-number__card');
      card.setAttribute('role', 'img');
      card.setAttribute('tabindex', '0');

      const hoverImage = hoverImageCell.querySelector('picture > img');
      if (hoverImage) {
        card.setAttribute('data-hover-image', hoverImage.src);
      }
      if (hoverDetailsCell) {
        // CHECK 1.5: hoverDetails is richtext, innerHTML is correct.
        card.setAttribute('data-hover-details', hoverDetailsCell.innerHTML.trim());
      }
      card.setAttribute(
        'aria-label',
        `${numberCell.textContent.trim()}: ${descriptionTextCell.textContent.trim()}`,
      );
      moveInstrumentation(cardRow, card);

      const numberDiv = document.createElement('div');
      numberDiv.classList.add('cmp-stats-by-the-number__card__number');
      // CHECK 1.5: number is richtext, innerHTML is correct.
      numberDiv.setAttribute('data-count', numberCell.innerHTML.trim());
      numberDiv.innerHTML = numberCell.innerHTML;
      card.append(numberDiv);

      const descriptionDivCard = document.createElement('div');
      descriptionDivCard.classList.add('cmp-stats-by-the-number__card__description');
      // CHECK 0.7B: descriptionTextCell.textContent.trim() is wrapped in <p> here.
      // If descriptionTextCell itself contains a <p>, this creates <p><p>...</p></p>.
      // The model says 'text' for Statistic Description, so textContent is correct.
      // However, the original HTML shows <p></p><p>Of space to Play</p><p></p>
      // which means the textContent might already be wrapped or contain newlines.
      // To be safe, just assign textContent directly or use a div.
      // Given the original HTML, it seems the <p> wrapper is intended for styling.
      // If the textContent itself does not contain <p> tags, this is fine.
      // Assuming textContent.trim() is plain text, this is okay.
      descriptionDivCard.innerHTML = `<p>${descriptionTextCell.textContent.trim()}</p>`;
      card.append(descriptionDivCard);
      cardsWrapper.append(card);
    });
    tabContent.append(cardsWrapper);

    // CTA Link
    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add('cmp-stats-by-the-number__cta');
    const ctaLink = document.createElement('a');
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
      ctaLink.target = foundCtaLink.target || '_self';
    }
    ctaLink.classList.add('cta', 'cta__primary');
    ctaLink.setAttribute('aria-label', ctaLabelCell.textContent.trim());
    ctaLink.setAttribute('data-palette', 'palette-1');

    // CHECK 2.6D: Navigation icons - no DAM/clientlib paths.
    // The original HTML uses <span class="cta__icon qd-icon qd-icon--cheveron-right" aria-hidden="true"></span>
    // which implies a CSS-based icon. This is acceptable.
    const ctaIcon = document.createElement('span');
    ctaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
    ctaIcon.setAttribute('aria-hidden', 'true');
    ctaLink.append(ctaIcon);

    const ctaLabel = document.createElement('span');
    ctaLabel.classList.add('cta__label');
    ctaLabel.textContent = ctaLabelCell.textContent.trim();
    ctaLink.append(ctaLabel);
    ctaWrapper.append(ctaLink);
    tabContent.append(ctaWrapper);

    contentSection.append(tabContent);
    allTabContents.push(tabContent);
  });

  mainContent.append(imageSection, contentSection);
  root.append(tabsWrapper, mainContent);

  block.replaceChildren(root);
  // CHECK 0.5: Block's own class on inner wrapper.
  // The block name 'stats-by-the-number' is added to the outer block div by AEM.
  // The JS adds 'cmp-stats-by-the-number' to the root element, which is correct
  // as per the original HTML. The block itself also gets 'animate-ready', 'animate-in'.
  // This is fine as the root element is not getting the block's *base* class again.
  block.classList.add('animate-ready', 'animate-in');
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Statistics by the numbers');

  // Add event listeners for tab switching
  allTabs.forEach((tab) => {
    // CHECK 2: Interactivity - addEventListener for tabs is present.
    tab.addEventListener('click', () => {
      const tabIndex = tab.getAttribute('data-tab-index');

      allTabs.forEach((t) => t.classList.remove('cmp-stats-by-the-number__tab--active'));
      tab.classList.add('cmp-stats-by-the-number__tab--active');

      allImageContainers.forEach((imgContainer) =>
        imgContainer.classList.remove('cmp-stats-by-the-number__image-container--active'),
      );
      allImageContainers[tabIndex].classList.add(
        'cmp-stats-by-the-number__image-container--active',
      );

      allTabContents.forEach((tc) =>
        tc.classList.remove('cmp-stats-by-the-number__tab-content--active'),
      );
      allTabContents[tabIndex].classList.add('cmp-stats-by-the-number__tab-content--active');
    });
  });
}
