import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
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
      subWrap.classList.add('has-sub-child'); // Placeholder class, adjust if original has specific class for nested lists
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
}

export default async function decorate(block) {
  const carouselItems = [...block.children];

  const section = document.createElement('section');
  section.classList.add('discover-sec');

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
    owlItem.classList.add('item', 'owl-item'); // owl-item, cloned, active are added by owlCarousel init
    moveInstrumentation(row, owlItem); // Move instrumentation from the authored row to the new item div

    const ul = document.createElement('ul');

    [image1Cell, image2Cell, image3Cell].forEach((cell) => {
      if (cell) {
        const li = document.createElement('li');
        const picture = cell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          li.append(optimizedPic);
          optimizedPic.querySelector('img').classList.add('img-fluid', 'lozad');
        }
        ul.append(li);
      }
    });

    // Handle hierarchy-tree
    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      const li = document.createElement('li');
      li.append(hierarchyUl);
      ul.append(li);
    }

    owlItem.append(ul);
    owlStage.append(owlItem);
  });

  const owlNav = document.createElement('div');
  owlNav.classList.add('owl-nav');
  tvCommercial.append(owlNav);

  const owlPrev = document.createElement('div');
  owlPrev.classList.add('owl-prev');
  owlPrev.textContent = '‹'; // Unicode arrow for previous
  owlNav.append(owlPrev);

  const owlNext = document.createElement('div');
  owlNext.classList.add('owl-next');
  owlNext.textContent = '›'; // Unicode arrow for next
  owlNav.append(owlNext);

  const owlDots = document.createElement('div');
  owlDots.classList.add('owl-dots', 'disabled');
  tvCommercial.append(owlDots);

  block.replaceChildren(section);

  // Load jQuery and Owl Carousel
  await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
  await loadCSS('/blocks/discover-carousel/owl.carousel.min.css'); // Add Owl Carousel CSS
  await loadScript('/blocks/discover-carousel/owl.carousel.min.js'); // Assuming owl.carousel.min.js is in the block folder

  // Initialize Owl Carousel
  const carouselEl = block.querySelector('.owl-carousel');
  if (carouselEl) {
    // eslint-disable-next-line no-undef
    $(carouselEl).owlCarousel({
      loop: true,
      margin: 30, // From original HTML style="width: 1110px; margin-right: 30px;"
      nav: true,
      dots: false, // Original HTML shows disabled dots
      items: 1, // Adjust as needed based on desired visible items
      navText: [owlPrev.outerHTML, owlNext.outerHTML], // Pass actual DOM elements
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 1, // Adjust for tablet
        },
        1200: {
          items: 1, // Adjust for desktop
        },
      },
    });
  }
}
