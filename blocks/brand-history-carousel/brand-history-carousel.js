import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Apply classes to <a> elements within the hierarchy
    if (anchor) {
      anchor.classList.add('nav-link'); // Assuming 'nav-link' is a desired class for navigation links
    }

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
      subWrap.classList.add('has-sub-child'); // Using a generic class, adjust if original HTML provides specific class
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

  const discoverSec = document.createElement('section');
  discoverSec.classList.add('discover-sec');

  const discoverOuter = document.createElement('div');
  discoverOuter.classList.add('discover-outer');
  discoverSec.append(discoverOuter);

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

  const navHierarchyContainer = document.createElement('div');
  navHierarchyContainer.classList.add('brand-history-carousel-nav'); // Added class from original HTML
  container.append(navHierarchyContainer);

  carouselItems.forEach((row) => {
    const [image1Cell, image2Cell, image3Cell, hierarchyTreeCell] = [...row.children];

    // Create carousel item slide
    const owlItem = document.createElement('div');
    owlItem.classList.add('owl-item');
    moveInstrumentation(row, owlItem); // Move instrumentation from the row to the owlItem

    const itemContent = document.createElement('div');
    itemContent.classList.add('item');
    owlItem.append(itemContent);

    const ul = document.createElement('ul');
    itemContent.append(ul);

    [image1Cell, image2Cell, image3Cell].forEach((cell) => {
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
    });
    owlStage.append(owlItem);

    // Create navigation hierarchy
    const navItem = document.createElement('div');
    navItem.classList.add('nav-item');
    moveInstrumentation(hierarchyTreeCell, navItem); // Move instrumentation from hierarchy cell to navItem

    // Use a temporary div to parse and process the richtext HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
    moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation to tempDiv

    const navUl = tempDiv.querySelector('ul');
    if (navUl) {
      // Apply classes to the hierarchy elements
      navUl.classList.add('nav-menu'); // Assuming 'nav-menu' is a desired class for the root ul
      navUl.querySelectorAll('li').forEach((li) => li.classList.add('nav-menu-item'));
      navUl.querySelectorAll('ul').forEach((subUl) => subUl.classList.add('sub-menu'));

      transformNestedLists(navUl);
      navItem.append(navUl);
      navHierarchyContainer.append(navItem);
    }
  });

  const owlNav = document.createElement('div');
  owlNav.classList.add('owl-nav');
  tvCommercial.append(owlNav);

  const owlPrev = document.createElement('div');
  owlPrev.classList.add('owl-prev');
  owlPrev.textContent = 'prev'; // Changed to 'prev' as per original HTML
  owlNav.append(owlPrev);

  const owlNext = document.createElement('div');
  owlNext.classList.add('owl-next');
  owlNext.textContent = 'next'; // Changed to 'next' as per original HTML
  owlNav.append(owlNext);

  const owlDots = document.createElement('div');
  owlDots.classList.add('owl-dots', 'disabled');
  tvCommercial.append(owlDots);

  block.replaceChildren(discoverSec);

  // Load Owl Carousel and initialize
  await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css');
  await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css');
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js');

  // eslint-disable-next-line no-undef
  $(tvCommercial).owlCarousel({
    loop: true,
    margin: 30,
    nav: true,
    dots: false,
    navText: [owlPrev.outerHTML, owlNext.outerHTML], // Use outerHTML to pass the full element structure
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
    onInitialized: function (event) {
      // Re-attach event listeners for prev/next buttons after Owl Carousel replaces them
      const newPrev = event.target.querySelector('.owl-prev');
      const newNext = event.target.querySelector('.owl-next');
      if (newPrev) {
        newPrev.addEventListener('click', () => $(tvCommercial).trigger('prev.owl.carousel'));
      }
      if (newNext) {
        newNext.addEventListener('click', () => $(tvCommercial).trigger('next.owl.carousel'));
      }
    },
  });
}
