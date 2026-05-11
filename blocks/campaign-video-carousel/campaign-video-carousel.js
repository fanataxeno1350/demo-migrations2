import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, ...videoRows] = [...block.children];

  const section = document.createElement('section');
  // section.classList.add('parle-campaign'); // Removed: block already has this class
  moveInstrumentation(block, section);

  const campaignGallery = document.createElement('div');
  campaignGallery.classList.add('campaign-gallery');
  section.append(campaignGallery);

  const container = document.createElement('div');
  container.classList.add('container');
  campaignGallery.append(container);

  const heading = document.createElement('h2');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  container.append(heading);

  const campaignSlider = document.createElement('div');
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

  const mobOwlCarousel = document.createElement('ul'); // Original HTML uses <ul> for mobile carousel
  mobOwlCarousel.classList.add('owl-carousel', 'owl-theme');
  mobCampaignSlider.append(mobOwlCarousel);

  const mobOwlStageOuter = document.createElement('div');
  mobOwlStageOuter.classList.add('owl-stage-outer');
  mobOwlCarousel.append(mobOwlStageOuter);

  const mobOwlStage = document.createElement('div');
  mobOwlStage.classList.add('owl-stage');
  mobOwlStageOuter.append(mobOwlStage);

  // Group videos into sets of 3 for desktop carousel
  const desktopVideoGroups = [];
  for (let i = 0; i < videoRows.length; i += 3) {
    desktopVideoGroups.push(videoRows.slice(i, i + 3));
  }

  desktopVideoGroups.forEach((group) => {
    const owlItem = document.createElement('div');
    owlItem.classList.add('owl-item');
    const ul = document.createElement('ul');
    owlItem.append(ul);

    group.forEach((row) => {
      // Corrected destructuring to include the richtext field
      const [videoUrlCell, thumbnailCell, titleCell, hierarchyTreeCell] = [...row.children];

      const li = document.createElement('li');
      moveInstrumentation(row, li);

      const link = document.createElement('a');
      link.classList.add('youtube', 'cboxElement');
      link.href = videoUrlCell.querySelector('a')?.href || '#';

      const campaignImg = document.createElement('div');
      campaignImg.classList.add('campaign-img');

      const picture = thumbnailCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        campaignImg.append(optimizedPic);
      }

      const campTitle = document.createElement('div');
      campTitle.classList.add('camp-title');
      const p = document.createElement('p');
      p.textContent = titleCell.textContent.trim();
      campTitle.append(p);

      campaignImg.append(campTitle);
      link.append(campaignImg);
      li.append(link);
      ul.append(li);

      // Handle hierarchy-tree richtext field
      if (hierarchyTreeCell && hierarchyTreeCell.innerHTML.trim()) {
        const hierarchyWrapper = document.createElement('div');
        moveInstrumentation(hierarchyTreeCell, hierarchyWrapper);
        hierarchyWrapper.innerHTML = hierarchyTreeCell.innerHTML;

        // Apply classes to nested elements as per ORIGINAL HTML (if applicable, assuming generic list classes)
        hierarchyWrapper.querySelectorAll('ul').forEach((list) => list.classList.add('nav-menu', 'sub-menu'));
        hierarchyWrapper.querySelectorAll('li').forEach((item) => item.classList.add('nav-menu-item', 'list-item'));
        hierarchyWrapper.querySelectorAll('a').forEach((anchor) => anchor.classList.add('nav-link'));

        li.append(hierarchyWrapper); // Append the hierarchy to the list item
      }
    });
    owlStage.append(owlItem);
  });

  // Mobile carousel - each video is its own slide
  videoRows.forEach((row) => {
    // Corrected destructuring to include the richtext field
    const [videoUrlCell, thumbnailCell, titleCell, hierarchyTreeCell] = [...row.children];

    const owlItem = document.createElement('div');
    owlItem.classList.add('owl-item');
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const link = document.createElement('a');
    link.classList.add('youtube', 'cboxElement');
    link.href = videoUrlCell.querySelector('a')?.href || '#';

    const campaignImg = document.createElement('div');
    campaignImg.classList.add('campaign-img');

    const picture = thumbnailCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      campaignImg.append(optimizedPic);
    }

    const campTitle = document.createElement('div');
    campTitle.classList.add('camp-title');
    const p = document.createElement('p');
    p.textContent = titleCell.textContent.trim();
    campTitle.append(p);

    campaignImg.append(campTitle);
    link.append(campaignImg);
    li.append(link);
    owlItem.append(li);
    mobOwlStage.append(owlItem);

    // Handle hierarchy-tree richtext field for mobile
    if (hierarchyTreeCell && hierarchyTreeCell.innerHTML.trim()) {
      const hierarchyWrapper = document.createElement('div');
      moveInstrumentation(hierarchyTreeCell, hierarchyWrapper);
      hierarchyWrapper.innerHTML = hierarchyTreeCell.innerHTML;

      // Apply classes to nested elements as per ORIGINAL HTML (if applicable, assuming generic list classes)
      hierarchyWrapper.querySelectorAll('ul').forEach((list) => list.classList.add('nav-menu', 'sub-menu'));
      hierarchyWrapper.querySelectorAll('li').forEach((item) => item.classList.add('nav-menu-item', 'list-item'));
      hierarchyWrapper.querySelectorAll('a').forEach((anchor) => anchor.classList.add('nav-link'));

      li.append(hierarchyWrapper); // Append the hierarchy to the list item
    }
  });

  block.replaceChildren(section);

  // Load jQuery and Owl Carousel
  await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
  await loadCSS('/styles/owl.carousel.min.css'); // Added loadCSS for Owl Carousel
  await loadScript('/scripts/owl.carousel.min.js');

  // Initialize Owl Carousel for desktop
  const desktopCarouselEl = block.querySelector('.campaign-slider.owl-carousel');
  if (desktopCarouselEl) {
    // eslint-disable-next-line no-undef
    $(desktopCarouselEl).owlCarousel({
      loop: false,
      margin: 10,
      nav: true,
      dots: true,
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 3,
        },
      },
    });
  }

  // Initialize Owl Carousel for mobile
  const mobileCarouselEl = block.querySelector('.mob-campaign-slider .owl-carousel');
  if (mobileCarouselEl) {
    // eslint-disable-next-line no-undef
    $(mobileCarouselEl).owlCarousel({
      loop: false,
      margin: 10,
      nav: true,
      dots: true,
      responsive: {
        0: {
          items: 1,
        },
      },
    });
  }
}
