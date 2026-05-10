import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, hierarchyCell) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Handle label-only nodes (no anchor)
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
      subWrap.classList.add('has-sub-child'); // Use class from ORIGINAL HTML if available
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
  // Apply instrumentation to the transformed hierarchy
  moveInstrumentation(hierarchyCell, rootUl);
}

export default async function decorate(block) {
  const [headlineRow, ...campaignSlideRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('parle-campaign');
  moveInstrumentation(block, section);

  const campaignGallery = document.createElement('div');
  campaignGallery.classList.add('campaign-gallery');
  section.append(campaignGallery);

  const container = document.createElement('div');
  container.classList.add('container');
  campaignGallery.append(container);

  const headline = document.createElement('h2');
  moveInstrumentation(headlineRow, headline);
  headline.textContent = headlineRow.textContent.trim();
  container.append(headline);

  const campaignSlider = document.createElement('div');
  campaignSlider.classList.add('campaign-slider', 'owl-carousel', 'owl-theme'); // Removed owl-loaded, owl-drag
  campaignGallery.append(campaignSlider);

  const owlStageOuter = document.createElement('div');
  owlStageOuter.classList.add('owl-stage-outer');
  campaignSlider.append(owlStageOuter);

  const owlStage = document.createElement('div');
  owlStage.classList.add('owl-stage', 'swiper-wrapper'); // Added swiper-wrapper for Swiper compatibility
  owlStageOuter.append(owlStage);

  const owlNav = document.createElement('div');
  owlNav.classList.add('owl-nav', 'disabled');
  const prevBtn = document.createElement('div');
  prevBtn.classList.add('owl-prev');
  prevBtn.textContent = 'prev';
  const nextBtn = document.createElement('div');
  nextBtn.classList.add('owl-next');
  nextBtn.textContent = 'next';
  owlNav.append(prevBtn, nextBtn);
  campaignSlider.append(owlNav);

  const owlDots = document.createElement('div');
  owlDots.classList.add('owl-dots');
  campaignSlider.append(owlDots);

  campaignSlideRows.forEach((row, index) => {
    const [thumbnailImageCell, videoLinkCell, titleCell, hierarchyTreeCell] = [...row.children];

    const owlItem = document.createElement('div');
    owlItem.classList.add('owl-item', 'swiper-slide'); // Added swiper-slide
    if (index === 0) {
      owlItem.classList.add('active');
    }
    owlStage.append(owlItem);

    const ul = document.createElement('ul');
    owlItem.append(ul);

    const li = document.createElement('li');
    moveInstrumentation(row, li);
    ul.append(li);

    const anchor = document.createElement('a');
    anchor.classList.add('youtube', 'cboxElement');
    const videoLink = videoLinkCell.querySelector('a');
    if (videoLink) {
      anchor.href = videoLink.href;
    }
    li.append(anchor);

    const campaignImg = document.createElement('div');
    campaignImg.classList.add('campaign-img');
    anchor.append(campaignImg);

    const picture = thumbnailImageCell.querySelector('picture');
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
    anchor.append(campTitle);

    const p = document.createElement('p');
    p.textContent = titleCell.textContent.trim();
    campTitle.append(p);

    // Handle hierarchy-tree richtext field
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
    const hierarchyUl = tempDiv.querySelector('ul');
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl, hierarchyTreeCell); // Pass hierarchyCell for instrumentation
      li.append(hierarchyUl); // Append the transformed hierarchy to the slide item
    }
  });

  // Mobile Slider
  const mobCampaignSlider = document.createElement('div');
  mobCampaignSlider.classList.add('mob-campaign-slider');
  campaignGallery.append(mobCampaignSlider);

  const mobUl = document.createElement('ul');
  mobUl.classList.add('owl-carousel', 'owl-theme'); // Removed owl-loaded, owl-drag
  mobCampaignSlider.append(mobUl);

  const mobOwlStageOuter = document.createElement('div');
  mobOwlStageOuter.classList.add('owl-stage-outer');
  mobUl.append(mobOwlStageOuter);

  const mobOwlStage = document.createElement('div');
  mobOwlStage.classList.add('owl-stage', 'swiper-wrapper'); // Added swiper-wrapper
  mobOwlStageOuter.append(mobOwlStage);

  const mobOwlNav = document.createElement('div');
  mobOwlNav.classList.add('owl-nav', 'disabled');
  const mobPrevBtn = document.createElement('div');
  mobPrevBtn.classList.add('owl-prev');
  mobPrevBtn.textContent = 'prev';
  const mobNextBtn = document.createElement('div');
  mobNextBtn.classList.add('owl-next');
  mobNextBtn.textContent = 'next';
  mobOwlNav.append(mobPrevBtn, mobNextBtn);
  mobUl.append(mobOwlNav);

  const mobOwlDots = document.createElement('div');
  mobOwlDots.classList.add('owl-dots');
  mobUl.append(mobOwlDots);

  campaignSlideRows.forEach((row, index) => {
    const [thumbnailImageCell, videoLinkCell, titleCell] = [...row.children]; // hierarchyTreeCell is not used for mobile in original HTML

    const mobOwlItem = document.createElement('div');
    mobOwlItem.classList.add('owl-item', 'swiper-slide'); // Added swiper-slide
    if (index === 0) {
      mobOwlItem.classList.add('active');
    }
    mobOwlStage.append(mobOwlItem);

    const mobLi = document.createElement('li');
    // Instrumentation is already moved for the desktop version, no need to move again for mobile
    mobOwlItem.append(mobLi);

    const mobAnchor = document.createElement('a');
    mobAnchor.classList.add('youtube', 'cboxElement');
    const videoLink = videoLinkCell.querySelector('a');
    if (videoLink) {
      mobAnchor.href = videoLink.href;
    }
    mobLi.append(mobAnchor);

    const mobCampaignImg = document.createElement('div');
    mobCampaignImg.classList.add('campaign-img');
    mobAnchor.append(mobCampaignImg);

    const picture = thumbnailImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // No instrumentation move here as the original img is not directly replaced
        mobCampaignImg.append(optimizedPic);
      }
    }

    const mobCampTitle = document.createElement('div');
    mobCampTitle.classList.add('camp-title');
    mobAnchor.append(mobCampTitle);

    const mobP = document.createElement('p');
    mobP.textContent = titleCell.textContent.trim();
    mobCampTitle.append(mobP);
  });

  block.replaceChildren(section);

  // Load Swiper and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Initialize Swiper for desktop carousel
  // eslint-disable-next-line no-undef
  new Swiper(campaignSlider, {
    slidesPerView: 'auto',
    loop: false, // Based on original HTML not having explicit loop, default to false
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: owlDots,
      clickable: true,
      renderBullet: (index, className) => `<div class="${className}"><span></span></div>`,
    },
  });

  // Initialize Swiper for mobile carousel
  // eslint-disable-next-line no-undef
  new Swiper(mobUl, {
    slidesPerView: 'auto',
    loop: false, // Based on original HTML not having explicit loop, default to false
    navigation: {
      prevEl: mobPrevBtn,
      nextEl: mobNextBtn,
    },
    pagination: {
      el: mobOwlDots,
      clickable: true,
      renderBullet: (index, className) => `<div class="${className}"><span></span></div>`,
    },
  });
}
