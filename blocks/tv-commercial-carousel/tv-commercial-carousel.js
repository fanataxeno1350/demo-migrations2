import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// The transformNestedLists function is not needed as the hierarchy-tree
// is not rendered as part of the carousel structure in the original HTML.
// If it were to be rendered, it would need a separate container outside the image UL.

export default async function decorate(block) {
  const carouselItems = [...block.children];

  const section = document.createElement('section');
  section.classList.add('discover-sec');

  const discoverOuter = document.createElement('div');
  discoverOuter.classList.add('discover-outer');

  const container = document.createElement('div');
  container.classList.add('container');

  const tvCommercial = document.createElement('div');
  // owl-loaded, owl-drag are added by Owl Carousel JS, not manually
  tvCommercial.classList.add('tv-commercial', 'owl-carousel', 'owl-theme');

  const owlStageOuter = document.createElement('div');
  owlStageOuter.classList.add('owl-stage-outer');

  const owlStage = document.createElement('div');
  owlStage.classList.add('owl-stage');

  carouselItems.forEach((row) => {
    // Destructuring is correct for fixed-schema item rows
    const [image1Cell, image2Cell, image3Cell, hierarchyTreeCell] = [...row.children];

    const owlItem = document.createElement('div');
    // cloned and active are added by Owl Carousel JS, not manually
    owlItem.classList.add('owl-item');

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    const ul = document.createElement('ul');

    const images = [image1Cell, image2Cell, image3Cell];
    images.forEach((cell) => {
      const picture = cell.querySelector('picture');
      if (picture) {
        const li = document.createElement('li');
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          li.append(optimizedPic);
          optimizedPic.querySelector('img').classList.add('img-fluid', 'lozad');
        }
        ul.append(li);
      }
    });

    // The hierarchy-tree field is present in the model but not rendered in the
    // original HTML structure for this carousel. It's ignored as per original HTML.
    // If it were to be rendered, it would need a different wrapper and styling
    // outside the image <ul>.
    if (hierarchyTreeCell?.querySelector('ul')) {
      // console.warn('Hierarchy tree content found but not rendered as per original HTML structure for this block.');
    }

    itemDiv.append(ul);
    owlItem.append(itemDiv);
    moveInstrumentation(row, owlItem); // Move instrumentation from original row to new owlItem
    owlStage.append(owlItem);
  });

  owlStageOuter.append(owlStage);
  tvCommercial.append(owlStageOuter);

  const owlNav = document.createElement('div');
  owlNav.classList.add('owl-nav');

  const prevBtnHtml = '<div class="owl-prev">‹</div>'; // Use HTML string for navText
  const nextBtnHtml = '<div class="owl-next">›</div>'; // Use HTML string for navText

  // Append temporary buttons for initial structure, Owl Carousel will replace them
  // with its own generated buttons based on navText.
  const tempPrevBtn = document.createElement('div');
  tempPrevBtn.classList.add('owl-prev');
  tempPrevBtn.textContent = '‹';
  owlNav.append(tempPrevBtn);

  const tempNextBtn = document.createElement('div');
  tempNextBtn.classList.add('owl-next');
  tempNextBtn.textContent = '›';
  owlNav.append(tempNextBtn);

  tvCommercial.append(owlNav);

  const owlDots = document.createElement('div');
  // 'disabled' class is managed by Owl Carousel JS, not manually added
  owlDots.classList.add('owl-dots');
  tvCommercial.append(owlDots);

  container.append(tvCommercial);
  discoverOuter.append(container);
  section.append(discoverOuter);

  block.replaceChildren(section);

  // Load Owl Carousel and initialize
  // Using CDN for Owl Carousel as local paths are not standard for EDS blocks
  await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css');
  await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css');
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js');

  // eslint-disable-next-line no-undef
  $(tvCommercial).owlCarousel({
    loop: true,
    margin: 30,
    nav: true,
    dots: false,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
      1200: {
        items: 3,
      },
    },
    // Use the HTML strings for navText, Owl Carousel will generate these buttons
    navText: [prevBtnHtml, nextBtnHtml],
  });

  // Owl Carousel replaces the nav buttons, so event listeners on `tempPrevBtn`/`tempNextBtn`
  // would be lost. The `navText` option handles the content of the generated buttons.
  // No need to re-attach event listeners or set textContent on the original elements.
}
