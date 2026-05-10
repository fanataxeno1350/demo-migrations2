import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [titleRow, ...videoRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('parle-campaign'); // From ORIGINAL HTML

  const campaignGallery = document.createElement('div');
  campaignGallery.classList.add('campaign-gallery'); // From ORIGINAL HTML
  moveInstrumentation(block, campaignGallery); // Move instrumentation from block to gallery

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container'); // From ORIGINAL HTML

  const h2 = document.createElement('h2');
  moveInstrumentation(titleRow, h2);
  h2.textContent = titleRow.textContent.trim();
  containerDiv.append(h2);

  campaignGallery.append(containerDiv);

  const campaignSlider = document.createElement('div');
  // Removed 'owl-loaded', 'owl-drag' as Swiper adds them automatically
  campaignSlider.classList.add('campaign-slider', 'owl-carousel', 'owl-theme'); // From ORIGINAL HTML

  const owlStageOuter = document.createElement('div');
  owlStageOuter.classList.add('owl-stage-outer'); // From ORIGINAL HTML

  const owlStage = document.createElement('div');
  owlStage.classList.add('owl-stage'); // From ORIGINAL HTML
  owlStageOuter.append(owlStage);

  const mobCampaignSlider = document.createElement('div');
  mobCampaignSlider.classList.add('mob-campaign-slider'); // From ORIGINAL HTML

  const mobOwlList = document.createElement('ul');
  // Removed 'owl-loaded', 'owl-drag' as Swiper adds them automatically
  mobOwlList.classList.add('owl-carousel', 'owl-theme'); // From ORIGINAL HTML
  mobCampaignSlider.append(mobOwlList);

  const mobOwlStageOuter = document.createElement('div');
  mobOwlStageOuter.classList.add('owl-stage-outer'); // From ORIGINAL HTML

  const mobOwlStage = document.createElement('div');
  mobOwlStage.classList.add('owl-stage'); // From ORIGINAL HTML
  mobOwlStageOuter.append(mobOwlStage);
  mobOwlList.append(mobOwlStageOuter);

  videoRows.forEach((row) => {
    const [videoUrlCell, thumbnailCell, videoTitleCell, hierarchyTreeCell] = [...row.children];

    const videoLink = videoUrlCell.querySelector('a');
    const thumbnailUrl = thumbnailCell.querySelector('picture');
    const videoTitle = videoTitleCell.textContent.trim();

    // Desktop Slider Item
    const owlItem = document.createElement('div');
    owlItem.classList.add('owl-item'); // From ORIGINAL HTML
    moveInstrumentation(row, owlItem); // Move instrumentation to the owl item

    const ul = document.createElement('ul');
    const li = document.createElement('li');

    const a = document.createElement('a');
    if (videoLink) {
      a.href = videoLink.href;
    }
    a.classList.add('youtube', 'cboxElement'); // From ORIGINAL HTML

    const campaignImg = document.createElement('div');
    campaignImg.classList.add('campaign-img'); // From ORIGINAL HTML

    if (thumbnailUrl) {
      const img = thumbnailUrl.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // moveInstrumentation(img, optimizedPic.querySelector('img')); // Instrumentation moved from row to owlItem
      campaignImg.append(optimizedPic);
    }

    const campTitle = document.createElement('div');
    campTitle.classList.add('camp-title'); // From ORIGINAL HTML
    const p = document.createElement('p');
    p.textContent = videoTitle;
    campTitle.append(p);

    campaignImg.append(campTitle);
    a.append(campaignImg);
    li.append(a);

    // Handle hierarchy-tree richtext field
    if (hierarchyTreeCell) {
      const hierarchyDiv = document.createElement('div');
      hierarchyDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, hierarchyDiv); // Move instrumentation for richtext cell

      // Apply classes from ORIGINAL HTML to nested elements if needed
      hierarchyDiv.querySelectorAll('ul').forEach((nestedUl) => nestedUl.classList.add('nested-list'));
      hierarchyDiv.querySelectorAll('li').forEach((nestedLi) => nestedLi.classList.add('nested-item'));
      hierarchyDiv.querySelectorAll('a').forEach((nestedA) => nestedA.classList.add('nested-link'));

      li.append(hierarchyDiv); // Append the hierarchy structure
    }

    ul.append(li);
    owlItem.append(ul);
    owlStage.append(owlItem);

    // Mobile Slider Item
    const mobOwlItem = document.createElement('div');
    mobOwlItem.classList.add('owl-item'); // From ORIGINAL HTML
    // Instrumentation already moved for desktop item, no need to move again for mobile

    const mobLi = document.createElement('li');
    const mobA = document.createElement('a');
    if (videoLink) {
      mobA.href = videoLink.href;
    }
    mobA.classList.add('youtube', 'cboxElement'); // From ORIGINAL HTML

    const mobCampaignImg = document.createElement('div');
    mobCampaignImg.classList.add('campaign-img'); // From ORIGINAL HTML

    if (thumbnailUrl) {
      const img = thumbnailUrl.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      mobCampaignImg.append(optimizedPic);
    }

    const mobCampTitle = document.createElement('div');
    mobCampTitle.classList.add('camp-title'); // From ORIGINAL HTML
    const mobP = document.createElement('p');
    mobP.textContent = videoTitle;
    mobCampTitle.append(mobP);

    mobCampaignImg.append(mobCampTitle);
    mobA.append(mobCampaignImg);
    mobLi.append(mobA);

    // Handle hierarchy-tree richtext field for mobile
    if (hierarchyTreeCell) {
      const mobHierarchyDiv = document.createElement('div');
      mobHierarchyDiv.innerHTML = hierarchyTreeCell.innerHTML;
      // No need to move instrumentation again, it's already on the desktop item's hierarchyDiv
      mobHierarchyDiv.querySelectorAll('ul').forEach((nestedUl) => nestedUl.classList.add('nested-list'));
      mobHierarchyDiv.querySelectorAll('li').forEach((nestedLi) => nestedLi.classList.add('nested-item'));
      mobHierarchyDiv.querySelectorAll('a').forEach((nestedA) => nestedA.classList.add('nested-link'));
      mobLi.append(mobHierarchyDiv);
    }

    mobOwlItem.append(mobLi);
    mobOwlStage.append(mobOwlItem);
  });

  campaignSlider.append(owlStageOuter);
  campaignGallery.append(campaignSlider);
  campaignGallery.append(mobCampaignSlider);
  section.append(campaignGallery);
  block.replaceChildren(section);

  // Image optimization - this block should be before Swiper init if images are part of slides
  // and need to be optimized before Swiper calculates dimensions.
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation(img, optimizedPic.querySelector('img')); // Instrumentation already moved from row
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Create navigation and pagination elements for desktop slider
  const owlNav = document.createElement('div');
  owlNav.classList.add('owl-nav', 'disabled'); // From ORIGINAL HTML
  const prevBtn = document.createElement('div');
  prevBtn.classList.add('owl-prev'); // From ORIGINAL HTML
  prevBtn.textContent = 'prev';
  const nextBtn = document.createElement('div');
  nextBtn.classList.add('owl-next'); // From ORIGINAL HTML
  nextBtn.textContent = 'next';
  owlNav.append(prevBtn, nextBtn);

  const owlDots = document.createElement('div');
  owlDots.classList.add('owl-dots'); // From ORIGINAL HTML

  campaignSlider.append(owlNav, owlDots);

  // Create navigation and pagination elements for mobile slider
  const mobOwlNav = document.createElement('div');
  mobOwlNav.classList.add('owl-nav', 'disabled'); // From ORIGINAL HTML
  const mobPrevBtn = document.createElement('div');
  mobPrevBtn.classList.add('owl-prev'); // From ORIGINAL HTML
  mobPrevBtn.textContent = 'prev';
  const mobNextBtn = document.createElement('div');
  mobNextBtn.classList.add('owl-next'); // From ORIGINAL HTML
  mobNextBtn.textContent = 'next';
  mobOwlNav.append(mobPrevBtn, mobNextBtn);

  const mobOwlDots = document.createElement('div');
  mobOwlDots.classList.add('owl-dots'); // From ORIGINAL HTML

  mobOwlList.append(mobOwlNav, mobOwlDots);

  // Load Swiper and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  const desktopSwiper = new Swiper(campaignSlider, {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: true,
    navigation: {
      prevEl: prevBtn, // Use the created DOM element
      nextEl: nextBtn, // Use the created DOM element
    },
    pagination: {
      el: owlDots, // Use the created DOM element
      clickable: true,
    },
    breakpoints: {
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 },
    },
  });

  // eslint-disable-next-line no-undef
  const mobileSwiper = new Swiper(mobOwlList, {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: true,
    navigation: {
      prevEl: mobPrevBtn, // Use the created DOM element
      nextEl: mobNextBtn, // Use the created DOM element
    },
    pagination: {
      el: mobOwlDots, // Use the created DOM element
      clickable: true,
    },
  });

  // Swiper instances are already initialized with the correct elements, no need to re-init
  // desktopSwiper.init(); // Not needed, init happens on new Swiper()
  // mobileSwiper.init(); // Not needed, init happens on new Swiper()
}
