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
      subWrap.classList.add('has-sub-child'); // This class is not in ORIGINAL HTML, but seems to be for JS functionality
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
  const [titleRow, ...slideRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('parle-campaign');
  moveInstrumentation(block, section);

  const campaignGallery = document.createElement('div');
  campaignGallery.classList.add('campaign-gallery');
  section.append(campaignGallery);

  const container = document.createElement('div');
  container.classList.add('container');
  campaignGallery.append(container);

  const title = document.createElement('h2');
  moveInstrumentation(titleRow, title);
  title.textContent = titleRow.textContent.trim();
  container.append(title);

  const campaignSlider = document.createElement('div');
  // Removed 'owl-loaded', 'owl-drag' as Owl Carousel adds them
  campaignSlider.classList.add('campaign-slider', 'owl-carousel', 'owl-theme');
  campaignGallery.append(campaignSlider);

  const owlStageOuter = document.createElement('div');
  owlStageOuter.classList.add('owl-stage-outer');
  campaignSlider.append(owlStageOuter);

  const owlStage = document.createElement('div');
  owlStage.classList.add('owl-stage');
  owlStageOuter.append(owlStage);

  const mobCampaignSlider = document.createElement('div');
  mobCampaignSlider.classList.add('mob-campaign-slider');
  campaignGallery.append(mobCampaignSlider);

  // Mobile slider should also be a ul directly for owl-carousel
  const mobOwlCarousel = document.createElement('ul');
  // Removed 'owl-loaded', 'owl-drag' as Owl Carousel adds them
  mobOwlCarousel.classList.add('owl-carousel', 'owl-theme');
  mobCampaignSlider.append(mobOwlCarousel);

  const mobOwlStageOuter = document.createElement('div');
  mobOwlStageOuter.classList.add('owl-stage-outer');
  mobOwlCarousel.append(mobOwlStageOuter);

  const mobOwlStage = document.createElement('div');
  mobOwlStage.classList.add('owl-stage');
  mobOwlStageOuter.append(mobOwlStage);

  slideRows.forEach((row) => {
    const [videoLinkCell, imageCell, slideTitleCell, hierarchyTreeCell] = [...row.children];

    // Desktop slider item
    const owlItem = document.createElement('div');
    owlItem.classList.add('owl-item');
    moveInstrumentation(row, owlItem);

    const ul = document.createElement('ul');
    const li = document.createElement('li');
    ul.append(li);

    const videoLink = videoLinkCell?.querySelector('a');
    if (videoLink) {
      const anchor = document.createElement('a');
      anchor.href = videoLink.href;
      anchor.classList.add('youtube', 'cboxElement');

      const campaignImg = document.createElement('div');
      campaignImg.classList.add('campaign-img');

      const picture = imageCell?.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // moveInstrumentation for img inside picture
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        campaignImg.append(optimizedPic);
      }

      const campTitle = document.createElement('div');
      campTitle.classList.add('camp-title');
      const p = document.createElement('p');
      p.textContent = slideTitleCell.textContent.trim();
      campTitle.append(p);

      campaignImg.append(campTitle);
      anchor.append(campaignImg);
      li.append(anchor);
    }

    const hierarchyTree = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyTree) {
      // Create a temporary div to hold and instrument the hierarchy tree content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation for the richtext cell
      const processedHierarchyTree = tempDiv.querySelector('ul');
      if (processedHierarchyTree) {
        transformNestedLists(processedHierarchyTree);
        li.append(processedHierarchyTree);
      }
    }
    owlItem.append(ul);
    owlStage.append(owlItem);

    // Mobile slider item
    const mobOwlItem = document.createElement('div');
    mobOwlItem.classList.add('owl-item');
    // Instrumentation for mobile item should be moved from the original row as well
    // If the original row is already instrumented to owlItem, we need to clone the instrumentation
    // or decide which element is the primary representation for AUE.
    // For now, assuming the row is the source and we want to instrument both desktop and mobile items.
    // This might lead to duplicate AUE overlays if not handled carefully in AEM.
    // A more robust solution might involve creating a single item and cloning it for mobile,
    // then moving instrumentation to the *cloned* item.
    // For now, keeping as is, but noting the potential for AUE issues.
    moveInstrumentation(row, mobOwlItem);

    const mobLi = document.createElement('li');

    if (videoLink) {
      const mobAnchor = document.createElement('a');
      mobAnchor.href = videoLink.href;
      mobAnchor.classList.add('youtube', 'cboxElement');

      const mobCampaignImg = document.createElement('div');
      mobCampaignImg.classList.add('campaign-img');

      const picture = imageCell?.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // moveInstrumentation for img inside picture
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        mobCampaignImg.append(optimizedPic);
      }

      const mobCampTitle = document.createElement('div');
      mobCampTitle.classList.add('camp-title');
      const mobP = document.createElement('p');
      mobP.textContent = slideTitleCell.textContent.trim();
      mobCampTitle.append(mobP);

      mobCampaignImg.append(mobCampTitle);
      mobAnchor.append(mobCampaignImg);
      mobLi.append(mobAnchor);
    }

    const mobHierarchyTree = hierarchyTreeCell?.querySelector('ul');
    if (mobHierarchyTree) {
      // Clone the original cell's content for mobile, then instrument and transform
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      // Instrumentation for cloned content is tricky. If the original cell is already
      // instrumented to the desktop item, we cannot re-instrument the same source.
      // For now, we'll skip moveInstrumentation for the cloned mobile hierarchy tree
      // to avoid AUE conflicts, assuming desktop is primary.
      // moveInstrumentation(hierarchyTreeCell, tempDiv); // This would cause AUE issues
      const clonedHierarchyTree = tempDiv.querySelector('ul');
      if (clonedHierarchyTree) {
        transformNestedLists(clonedHierarchyTree);
        mobLi.append(clonedHierarchyTree);
      }
    }
    mobOwlItem.append(mobLi);
    mobOwlStage.append(mobOwlItem);
  });

  // Append desktop navigation and dots
  const owlNav = document.createElement('div');
  owlNav.classList.add('owl-nav', 'disabled');
  const owlPrev = document.createElement('div');
  owlPrev.classList.add('owl-prev');
  owlPrev.textContent = 'prev';
  const owlNext = document.createElement('div');
  owlNext.classList.add('owl-next');
  owlNext.textContent = 'next';
  owlNav.append(owlPrev, owlNext);
  campaignSlider.append(owlNav);

  const owlDots = document.createElement('div');
  owlDots.classList.add('owl-dots');
  campaignSlider.append(owlDots);

  // Append mobile navigation and dots
  const mobOwlNav = document.createElement('div');
  mobOwlNav.classList.add('owl-nav', 'disabled');
  const mobOwlPrev = document.createElement('div');
  mobOwlPrev.classList.add('owl-prev');
  mobOwlPrev.textContent = 'prev';
  const mobOwlNext = document.createElement('div');
  mobOwlNext.classList.add('owl-next');
  mobOwlNext.textContent = 'next';
  mobOwlNav.append(mobOwlPrev, mobOwlNext);
  mobOwlCarousel.append(mobOwlNav);

  const mobOwlDots = document.createElement('div');
  mobOwlDots.classList.add('owl-dots');
  mobOwlCarousel.append(mobOwlDots);

  block.replaceChildren(section);

  // Load Owl Carousel and initialize
  await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css');
  await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css');
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js');

  // eslint-disable-next-line no-undef
  $(campaignSlider).owlCarousel({
    loop: true,
    margin: 0,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
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
  });

  // eslint-disable-next-line no-undef
  $(mobOwlCarousel).owlCarousel({
    loop: true,
    margin: 0,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
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
  });
}
