import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const carouselItems = [...block.children];

  const discoverSection = document.createElement('section');
  discoverSection.classList.add('discover-sec'); // From ORIGINAL HTML

  const discoverOuter = document.createElement('div');
  discoverOuter.classList.add('discover-outer'); // From ORIGINAL HTML
  discoverSection.append(discoverOuter);

  const container = document.createElement('div');
  container.classList.add('container'); // From ORIGINAL HTML
  discoverOuter.append(container);

  // The original HTML uses Owl Carousel classes, but EDS does not ship Owl Carousel JS.
  // We will use Swiper.js as the standard carousel library.
  // The classes 'owl-carousel', 'owl-theme', 'owl-loaded', 'owl-drag' are added by Owl Carousel JS,
  // not manually. We will replace them with Swiper's base class 'swiper'.
  const tvCommercial = document.createElement('div');
  tvCommercial.classList.add('tv-commercial', 'swiper'); // 'tv-commercial' from ORIGINAL HTML, 'swiper' for Swiper.js
  container.append(tvCommercial);

  const owlStageOuter = document.createElement('div');
  owlStageOuter.classList.add('owl-stage-outer', 'swiper-wrapper'); // 'owl-stage-outer' from ORIGINAL HTML, 'swiper-wrapper' for Swiper.js
  tvCommercial.append(owlStageOuter);

  // The 'owl-stage' div is equivalent to the swiper-wrapper, so we'll append items directly to swiper-wrapper.
  // No separate 'owl-stage' div is needed for Swiper.

  carouselItems.forEach((row, index) => {
    const [image1Cell, image2Cell, image3Cell, hierarchyTreeCell] = [...row.children];

    const owlItem = document.createElement('div');
    owlItem.classList.add('owl-item', 'swiper-slide'); // 'owl-item' from ORIGINAL HTML, 'swiper-slide' for Swiper.js
    // Swiper.js handles 'active' class automatically.
    moveInstrumentation(row, owlItem); // Move instrumentation from original row to new owlItem

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item'); // From ORIGINAL HTML
    owlItem.append(itemDiv);

    const ul = document.createElement('ul');
    itemDiv.append(ul);

    const images = [image1Cell, image2Cell, image3Cell].filter(Boolean);

    images.forEach((cell) => {
      const li = document.createElement('li');
      const picture = cell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          // The actual img element is inside the optimized picture, so move instrumentation to it
          // moveInstrumentation(img, optimizedPic.querySelector('img')); // img is not instrumented, the cell is.
          li.append(optimizedPic);
        }
      }
      ul.append(li);
    });

    // Handle hierarchy-tree (richtext) if present
    // The original HTML structure for the carousel items only shows images within a <ul>.
    // The hierarchy-tree field is present in the model but not rendered in the carousel item in the original HTML.
    // If it were to be rendered, it would need a distinct structure in the original HTML.
    // For now, we will not render it within the carousel item to maintain fidelity with the original HTML structure.
    // If there's a requirement to display this, a separate section outside the carousel or a different item structure would be needed.
    // For completeness, if it were to be rendered, it would look like this:
    /*
    const hierarchyContent = hierarchyTreeCell?.innerHTML;
    if (hierarchyContent) {
      const hierarchyWrapper = document.createElement('div');
      hierarchyWrapper.classList.add('hierarchy-tree-wrapper'); // Example class, not from original HTML
      hierarchyWrapper.innerHTML = hierarchyContent;
      // Apply classes to nested elements if needed, based on original HTML for the hierarchy tree
      hierarchyWrapper.querySelectorAll('a').forEach(a => a.classList.add('nav-link')); // Example
      hierarchyWrapper.querySelectorAll('ul').forEach(ulEl => ulEl.classList.add('nav-menu')); // Example
      hierarchyWrapper.querySelectorAll('li').forEach(liEl => liEl.classList.add('nav-item')); // Example
      moveInstrumentation(hierarchyTreeCell, hierarchyWrapper);
      itemDiv.append(hierarchyWrapper);
    }
    */

    owlStageOuter.append(owlItem); // Append to swiper-wrapper
  });

  const owlNav = document.createElement('div');
  owlNav.classList.add('owl-nav'); // From ORIGINAL HTML
  tvCommercial.append(owlNav);

  const prevBtn = document.createElement('div');
  prevBtn.classList.add('owl-prev', 'swiper-button-prev'); // 'owl-prev' from ORIGINAL HTML, 'swiper-button-prev' for Swiper.js
  prevBtn.textContent = '‹'; // Using unicode arrow for prev button
  owlNav.append(prevBtn);

  const nextBtn = document.createElement('div');
  nextBtn.classList.add('owl-next', 'swiper-button-next'); // 'owl-next' from ORIGINAL HTML, 'swiper-button-next' for Swiper.js
  nextBtn.textContent = '›'; // Using unicode arrow for next button
  owlNav.append(nextBtn);

  const owlDots = document.createElement('div');
  owlDots.classList.add('owl-dots', 'disabled', 'swiper-pagination'); // 'owl-dots', 'disabled' from ORIGINAL HTML, 'swiper-pagination' for Swiper.js
  tvCommercial.append(owlDots);

  block.replaceChildren(discoverSection);

  // Initialize Swiper Carousel
  // The decorate function needs to be async to await loadScript/loadCSS
  // It is already async.
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(tvCommercial, {
    slidesPerView: 'auto',
    loop: false, // Original HTML doesn't explicitly state loop, assuming false based on typical EDS behavior
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: owlDots,
      clickable: true,
    },
  });
}
