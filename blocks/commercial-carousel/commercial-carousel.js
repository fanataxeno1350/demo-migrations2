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
      // Only add 'has-sub-child' if it was present in the original HTML for nested lists
      // Assuming it was, based on the comment, but generally this should be verified.
      subWrap.classList.add('has-sub-child'); 
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

  const container = document.createElement('div');
  container.classList.add('container');

  const tvCommercial = document.createElement('div');
  tvCommercial.classList.add('tv-commercial', 'owl-carousel', 'owl-theme');
  // owl-loaded and owl-drag are added by Owl Carousel JS, not manually, so removed from classList.add

  const owlStageOuter = document.createElement('div');
  owlStageOuter.classList.add('owl-stage-outer');

  const owlStage = document.createElement('div');
  owlStage.classList.add('owl-stage');

  carouselItems.forEach((row) => {
    const [image1Cell, image2Cell, image3Cell, hierarchyTreeCell] = [...row.children];

    const owlItem = document.createElement('div');
    owlItem.classList.add('owl-item');
    moveInstrumentation(row, owlItem); // Move instrumentation from the row to the owlItem

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    const ul = document.createElement('ul');

    [image1Cell, image2Cell, image3Cell].forEach((cell) => {
      const li = document.createElement('li');
      const picture = cell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid', 'lozad'); // Add classes from original HTML
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        li.append(optimizedPic);
      }
      ul.append(li);
    });

    const hierarchyUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      const li = document.createElement('li');
      li.append(hierarchyUl);
      ul.append(li);
    }

    itemDiv.append(ul);
    owlItem.append(itemDiv);
    owlStage.append(owlItem);
  });

  owlStageOuter.append(owlStage);
  tvCommercial.append(owlStageOuter);

  const owlNav = document.createElement('div');
  owlNav.classList.add('owl-nav');

  const owlPrev = document.createElement('div');
  owlPrev.classList.add('owl-prev');
  owlPrev.textContent = '‹'; // Unicode arrow for prev
  owlNav.append(owlPrev);

  const owlNext = document.createElement('div');
  owlNext.classList.add('owl-next');
  owlNext.textContent = '›'; // Unicode arrow for next
  owlNav.append(owlNext);

  tvCommercial.append(owlNav);

  const owlDots = document.createElement('div');
  owlDots.classList.add('owl-dots', 'disabled'); // disabled by default, Owl Carousel JS manages this
  tvCommercial.append(owlDots);

  container.append(tvCommercial);
  discoverOuter.append(container);
  section.append(discoverOuter);

  block.replaceChildren(section);

  // Load Owl Carousel and jQuery
  await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js');

  // Load Owl Carousel CSS
  await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css');
  await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css');

  // Initialize Owl Carousel
  const owlCarouselEl = block.querySelector('.owl-carousel');
  if (owlCarouselEl) {
    // eslint-disable-next-line no-undef
    $(owlCarouselEl).owlCarousel({
      loop: false, // Set to true if needed based on original behavior
      margin: 30,
      nav: true,
      dots: false, // Original HTML shows disabled, so keep it false
      navText: [owlPrev.outerHTML, owlNext.outerHTML], // Use the outerHTML of the buttons
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 1, // Adjust as per original behavior
        },
        1000: {
          items: 1, // Adjust as per original behavior
        },
      },
    });
  }
}
