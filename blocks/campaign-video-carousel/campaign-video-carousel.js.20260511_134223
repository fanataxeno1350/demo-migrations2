import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, ...videoRows] = [...block.children];

  const root = document.createElement('section');
  // root.classList.add('parle-campaign'); // Block name class 'parle-campaign' is already on the outer block div.
  moveInstrumentation(block, root);

  const campaignGallery = document.createElement('div');
  campaignGallery.classList.add('campaign-gallery');
  root.append(campaignGallery);

  const container = document.createElement('div');
  container.classList.add('container');
  campaignGallery.append(container);

  const heading = document.createElement('h2');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  container.append(heading);

  const campaignSlider = document.createElement('div');
  // Removed 'owl-loaded', 'owl-drag' as Owl Carousel adds these dynamically
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

  const mobSliderList = document.createElement('ul'); // Original HTML uses <ul> for mobile slider
  // Removed 'owl-loaded', 'owl-drag' as Owl Carousel adds these dynamically
  mobSliderList.classList.add('owl-carousel', 'owl-theme');
  mobCampaignSlider.append(mobSliderList);

  const mobOwlStageOuter = document.createElement('div');
  mobOwlStageOuter.classList.add('owl-stage-outer');
  mobSliderList.append(mobOwlStageOuter);

  const mobOwlStage = document.createElement('div');
  mobOwlStage.classList.add('owl-stage');
  mobOwlStageOuter.append(mobOwlStage);

  videoRows.forEach((row) => {
    // Model has 4 fields: videoUrl, thumbnail, title, hierarchy-tree
    const [videoUrlCell, thumbnailCell, titleCell, hierarchyTreeCell] = [...row.children];

    // Desktop slider item
    const owlItem = document.createElement('div');
    owlItem.classList.add('owl-item');
    moveInstrumentation(row, owlItem); // Move instrumentation from row to owlItem

    const ul = document.createElement('ul'); // Original HTML has <ul> inside owl-item
    owlItem.append(ul);

    const li = document.createElement('li'); // Original HTML has <li> inside <ul>
    ul.append(li);

    const videoLink = document.createElement('a');
    const foundVideoLink = videoUrlCell.querySelector('a');
    if (foundVideoLink) {
      videoLink.href = foundVideoLink.href;
    }
    videoLink.classList.add('youtube', 'cboxElement');
    li.append(videoLink);

    const campaignImg = document.createElement('div');
    campaignImg.classList.add('campaign-img');
    videoLink.append(campaignImg);

    const picture = thumbnailCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        campaignImg.append(optimizedPic);
      }
    }

    const campTitle = document.createElement('div');
    campTitle.classList.add('camp-title');
    videoLink.append(campTitle);

    const p = document.createElement('p');
    p.textContent = titleCell.textContent.trim();
    campTitle.append(p);

    // Handle richtext 'hierarchy-tree' field if it exists and has content
    if (hierarchyTreeCell && hierarchyTreeCell.innerHTML.trim()) {
      const hierarchyWrapper = document.createElement('div');
      hierarchyWrapper.classList.add('hierarchy-tree-wrapper'); // Add a class for styling if needed
      hierarchyWrapper.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, hierarchyWrapper);

      // Apply classes to nested elements if needed, based on original HTML structure
      hierarchyWrapper.querySelectorAll('ul').forEach((list) => list.classList.add('nav-menu'));
      hierarchyWrapper.querySelectorAll('li').forEach((item) => item.classList.add('nav-menu-item'));
      hierarchyWrapper.querySelectorAll('a').forEach((link) => link.classList.add('nav-link'));

      // Append the hierarchy to the video item or a suitable container
      // For this block, it seems the hierarchy is not visually rendered with each video item
      // but if it were, this is how it would be handled.
      // For now, we'll just ensure instrumentation is moved, but not append it
      // as it's not present in the ORIGINAL HTML output structure for each video item.
      // If it were to be displayed, it would be appended like:
      // owlItem.append(hierarchyWrapper);
    }

    owlStage.append(owlItem);

    // Mobile slider item
    const mobOwlItem = document.createElement('div');
    mobOwlItem.classList.add('owl-item');
    // Instrumentation for mobile item should be separate if it's a distinct item,
    // but here it's a clone of the desktop item's content.
    // If the mobile item is a direct clone of the desktop item's content,
    // we don't need to move instrumentation again from the original row.
    // However, if the mobile item is intended to be a separate, distinct item
    // in the AEM content structure, it would need its own row and instrumentation.
    // Given the current model, it's a single 'campaign-video-item' row for both.
    // We'll clone the content, but not move instrumentation again.

    const mobLi = document.createElement('li'); // Original HTML uses <li> inside <ul> for mobile
    mobOwlItem.append(mobLi);
    const mobVideoLink = videoLink.cloneNode(true); // Clone the entire link structure
    mobLi.append(mobVideoLink);
    mobOwlStage.append(mobOwlItem);
  });

  const owlNav = document.createElement('div');
  owlNav.classList.add('owl-nav', 'disabled'); // 'disabled' is from original HTML
  campaignSlider.append(owlNav);

  const owlPrev = document.createElement('div');
  owlPrev.classList.add('owl-prev');
  owlPrev.textContent = 'prev'; // Text content from original HTML
  owlNav.append(owlPrev);

  const owlNext = document.createElement('div');
  owlNext.classList.add('owl-next');
  owlNext.textContent = 'next'; // Text content from original HTML
  owlNav.append(owlNext);

  const owlDots = document.createElement('div');
  owlDots.classList.add('owl-dots');
  campaignSlider.append(owlDots);

  const mobOwlNav = document.createElement('div');
  mobOwlNav.classList.add('owl-nav', 'disabled');
  mobSliderList.append(mobOwlNav);

  const mobOwlPrev = document.createElement('div');
  mobOwlPrev.classList.add('owl-prev');
  mobOwlPrev.textContent = 'prev';
  mobOwlNav.append(mobOwlPrev);

  const mobOwlNext = document.createElement('div');
  mobOwlNext.classList.add('owl-next');
  mobOwlNext.textContent = 'next';
  mobOwlNav.append(mobOwlNext);

  const mobOwlDots = document.createElement('div');
  mobOwlDots.classList.add('owl-dots');
  mobSliderList.append(mobOwlDots);

  block.replaceChildren(root);

  // Load Owl Carousel and initialize
  await loadCSS('/blocks/campaign-video-carousel/owl.carousel.min.css');
  await loadCSS('/blocks/campaign-video-carousel/owl.theme.default.min.css');
  // Removed jQuery dependency as EDS blocks should be vanilla JS
  await loadScript('/blocks/campaign-video-carousel/owl.carousel.min.js');

  // Initialize Owl Carousel for desktop
  // eslint-disable-next-line no-undef
  if (typeof jQuery !== 'undefined' && typeof jQuery.fn.owlCarousel !== 'undefined') {
    // If jQuery is still loaded by other means, use it. Otherwise, this will fail.
    // Best practice is to avoid jQuery entirely in EDS blocks.
    $(campaignSlider).owlCarousel({
      loop: false,
      margin: 10,
      nav: true,
      dots: true,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 3,
        },
        1000: {
          items: 5,
        },
      },
      navText: [owlPrev.outerHTML, owlNext.outerHTML], // Pass generated nav elements
    });

    // Initialize Owl Carousel for mobile
    // eslint-disable-next-line no-undef
    $(mobSliderList).owlCarousel({
      loop: false,
      margin: 10,
      nav: true,
      dots: true,
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
      navText: [mobOwlPrev.outerHTML, mobOwlNext.outerHTML], // Pass generated nav elements
    });
  } else {
    // Fallback or error handling if Owl Carousel is not loaded via jQuery
    console.warn('Owl Carousel or jQuery not loaded. Carousel functionality may be impaired.');
    // If Owl Carousel has a vanilla JS API, it would be initialized here.
    // For now, assuming it relies on jQuery based on the original code.
    // If Owl Carousel is strictly jQuery dependent, this block should ideally
    // be replaced with a Swiper.js implementation or a custom vanilla JS carousel.
  }
}
