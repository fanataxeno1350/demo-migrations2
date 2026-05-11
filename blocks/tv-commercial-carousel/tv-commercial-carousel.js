import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, destinationElement) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
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
      subWrap.classList.add('has-sub-child'); // This class is not in original HTML, consider if it's needed or if there's an equivalent.
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    }
  });
  // Append the transformed hierarchy to the specified destination element
  while (rootUl.firstChild) {
    destinationElement.append(rootUl.firstChild);
  }
}

export default async function decorate(block) {
  const carouselItems = [...block.children];

  const section = document.createElement('section');
  section.classList.add('discover-sec');
  moveInstrumentation(block, section); // Move instrumentation from block to section

  const discoverOuter = document.createElement('div');
  discoverOuter.classList.add('discover-outer');
  section.append(discoverOuter);

  const container = document.createElement('div');
  container.classList.add('container');
  discoverOuter.append(container);

  const tvCommercial = document.createElement('div');
  tvCommercial.classList.add('tv-commercial', 'owl-carousel', 'owl-theme');
  container.append(tvCommercial);

  const owlStageOuter = document.createElement('div');
  owlStageOuter.classList.add('owl-stage-outer');
  tvCommercial.append(owlStageOuter);

  const owlStage = document.createElement('div');
  owlStage.classList.add('owl-stage');
  owlStageOuter.append(owlStage);

  carouselItems.forEach((row) => {
    const [image1Cell, image2Cell, image3Cell, hierarchyTreeCell] = [...row.children];

    const owlItem = document.createElement('div');
    owlItem.classList.add('owl-item');
    moveInstrumentation(row, owlItem); // Move instrumentation from row to owlItem
    owlStage.append(owlItem);

    const item = document.createElement('div');
    item.classList.add('item');
    owlItem.append(item);

    const ul = document.createElement('ul');
    item.append(ul);

    [image1Cell, image2Cell, image3Cell].forEach((cell) => {
      if (cell) {
        const li = document.createElement('li');
        const picture = cell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            li.append(optimizedPic);
            optimizedPic.querySelector('img').classList.add('img-fluid', 'lozad');
          }
        }
        ul.append(li);
      }
    });

    // Handle hierarchy-tree richtext field
    const hierarchyTempDiv = document.createElement('div');
    moveInstrumentation(hierarchyTreeCell, hierarchyTempDiv); // Move instrumentation for the hierarchy cell
    hierarchyTempDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';

    const hierarchyUl = hierarchyTempDiv.querySelector('ul');
    if (hierarchyUl) {
      // Create a container for the hierarchy list within the item
      const hierarchyContainer = document.createElement('div');
      hierarchyContainer.classList.add('hierarchy-list-container'); // Add a class for styling if needed
      item.append(hierarchyContainer); // Append to the item

      transformNestedLists(hierarchyUl, hierarchyContainer); // Pass the container as destination
    }
  });

  const owlNav = document.createElement('div');
  owlNav.classList.add('owl-nav');
  tvCommercial.append(owlNav);

  const owlPrev = document.createElement('div');
  owlPrev.classList.add('owl-prev');
  owlPrev.textContent = 'prev';
  owlNav.append(owlPrev);

  const owlNext = document.createElement('div');
  owlNext.classList.add('owl-next');
  owlNext.textContent = 'next';
  owlNav.append(owlNext);

  const owlDots = document.createElement('div');
  owlDots.classList.add('owl-dots', 'disabled');
  tvCommercial.append(owlDots);

  block.replaceChildren(section);

  // Load jQuery and Owl Carousel
  await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
  await loadCSS('/blocks/tv-commercial-carousel/owl.carousel.min.css'); // Assuming local path for owl.carousel.min.css
  await loadCSS('/blocks/tv-commercial-carousel/owl.theme.default.min.css'); // Assuming local path for owl.theme.default.min.css
  await loadScript('/blocks/tv-commercial-carousel/owl.carousel.min.js'); // Assuming local path for owl.carousel.min.js

  const carouselEl = block.querySelector('.tv-commercial.owl-carousel');
  if (carouselEl) {
    // eslint-disable-next-line no-undef
    $(carouselEl).owlCarousel({
      loop: true,
      margin: 30,
      nav: true,
      dots: false,
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 1,
        },
        992: {
          items: 1,
        },
        1200: {
          items: 1,
        },
      },
      navText: [owlPrev, owlNext], // Pass the actual DOM elements
    });

    // Owl Carousel replaces the nav elements, so re-select and update text
    const newOwlNav = carouselEl.querySelector('.owl-nav');
    if (newOwlNav) {
      const newOwlPrev = newOwlNav.querySelector('.owl-prev');
      const newOwlNext = newOwlNav.querySelector('.owl-next');

      if (newOwlPrev) newOwlPrev.textContent = 'prev';
      if (newOwlNext) newOwlNext.textContent = 'next';
    }
  }
}
