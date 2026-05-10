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
      // Removed 'has-sub-child' - no corresponding class in ORIGINAL HTML
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
  moveInstrumentation(block, section);

  const discoverOuter = document.createElement('div');
  discoverOuter.classList.add('discover-outer');
  section.append(discoverOuter);

  const container = document.createElement('div');
  container.classList.add('container');
  discoverOuter.append(container);

  const tvCommercial = document.createElement('div');
  // Removed 'owl-loaded', 'owl-drag' as Owl Carousel adds them automatically
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

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    owlItem.append(itemDiv);

    const ul = document.createElement('ul');
    itemDiv.append(ul);

    // Image 1
    if (image1Cell) {
      const li = document.createElement('li');
      const picture = image1Cell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').classList.add('img-fluid', 'lozad'); // Add classes from ORIGINAL HTML
        li.append(optimizedPic);
        ul.append(li);
      }
    }

    // Image 2
    if (image2Cell) {
      const li = document.createElement('li');
      const picture = image2Cell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').classList.add('img-fluid', 'lozad'); // Add classes from ORIGINAL HTML
        li.append(optimizedPic);
        ul.append(li);
      }
    }

    // Image 3
    if (image3Cell) {
      const li = document.createElement('li');
      const picture = image3Cell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').classList.add('img-fluid', 'lozad'); // Add classes from ORIGINAL HTML
        li.append(optimizedPic);
        ul.append(li);
      }
    }

    // Navigation Hierarchy (Richtext)
    if (hierarchyTreeCell) {
      const hierarchyWrapper = document.createElement('div');
      moveInstrumentation(hierarchyTreeCell, hierarchyWrapper); // Move instrumentation from cell to new wrapper
      hierarchyWrapper.innerHTML = hierarchyTreeCell.innerHTML; // Preserve full HTML structure
      const hierarchyUl = hierarchyWrapper.querySelector('ul');
      if (hierarchyUl) {
        transformNestedLists(hierarchyUl);
        // Append the transformed hierarchy to the itemDiv or a specific location if needed
        // Based on ORIGINAL HTML, this hierarchy is not part of the 'item' div's <ul>
        // It seems to be a separate structure, so we'll append it to the owlItem directly
        // or a dedicated wrapper within the owlItem if needed.
        // For now, assuming it should be a sibling to the image <ul> within the itemDiv.
        itemDiv.append(hierarchyUl); // Append the transformed UL
      }
    }

    owlStage.append(owlItem);
  });

  // Add navigation buttons (owl-nav)
  const owlNav = document.createElement('div');
  owlNav.classList.add('owl-nav');
  tvCommercial.append(owlNav);

  const prevBtn = document.createElement('div');
  prevBtn.classList.add('owl-prev');
  // Use innerHTML to allow for custom content if needed, but for 'prev'/'next' textContent is fine
  prevBtn.innerHTML = 'prev'; // Use innerHTML to match original structure
  owlNav.append(prevBtn);

  const nextBtn = document.createElement('div');
  nextBtn.classList.add('owl-next');
  // Use innerHTML to allow for custom content if needed, but for 'prev'/'next' textContent is fine
  nextBtn.innerHTML = 'next'; // Use innerHTML to match original structure
  owlNav.append(nextBtn);

  // Add dots (owl-dots)
  const owlDots = document.createElement('div');
  owlDots.classList.add('owl-dots', 'disabled');
  tvCommercial.append(owlDots);

  block.replaceChildren(section);

  // Load Owl Carousel and initialize
  await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css');
  await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css');
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js');
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js');

  // eslint-disable-next-line no-undef
  $(tvCommercial).owlCarousel({
    loop: false, // Adjust as needed
    margin: 30, // As per original HTML
    nav: true,
    dots: false,
    items: 1, // Default for mobile
    // OwlCarousel replaces the nav elements, so we need to pass the actual HTML content
    navText: [prevBtn.outerHTML, nextBtn.outerHTML],
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1000: {
        items: 3,
      },
    },
  });

  // Re-attach event listeners to the new nav buttons created by Owl Carousel
  // Owl Carousel replaces the nav elements, so we need to re-query them after init
  const newPrevBtn = tvCommercial.querySelector('.owl-prev');
  const newNextBtn = tvCommercial.querySelector('.owl-next');

  if (newPrevBtn) {
    newPrevBtn.addEventListener('click', () => {
      // eslint-disable-next-line no-undef
      $(tvCommercial).trigger('prev.owl.carousel');
    });
  }

  if (newNextBtn) {
    newNextBtn.addEventListener('click', () => {
      // eslint-disable-next-line no-undef
      $(tvCommercial).trigger('next.owl.carousel');
    });
  }
}
