import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [sectionTitleRow, ...campaignRows] = [...block.children];

  const campaignGallery = document.createElement('div');
  campaignGallery.classList.add('campaign-gallery');

  const container = document.createElement('div');
  container.classList.add('container');
  const h2 = document.createElement('h2');
  moveInstrumentation(sectionTitleRow, h2);
  h2.textContent = sectionTitleRow.textContent.trim();
  container.append(h2);
  campaignGallery.append(container);

  const campaignSlider = document.createElement('div');
  campaignSlider.classList.add('campaign-slider', 'owl-carousel', 'owl-theme');

  const owlStageOuter = document.createElement('div');
  owlStageOuter.classList.add('owl-stage-outer');
  const owlStage = document.createElement('div');
  owlStage.classList.add('owl-stage');
  owlStageOuter.append(owlStage);
  campaignSlider.append(owlStageOuter);

  const mobCampaignSlider = document.createElement('div');
  mobCampaignSlider.classList.add('mob-campaign-slider');
  const mobOwlCarousel = document.createElement('ul'); // Changed to ul as per ORIGINAL HTML
  mobOwlCarousel.classList.add('owl-carousel', 'owl-theme');
  mobCampaignSlider.append(mobOwlCarousel);

  // The mobile slider's owl-stage-outer and owl-stage should be inside the ul, not directly appended to mobOwlCarousel
  const mobOwlStageOuter = document.createElement('div');
  mobOwlStageOuter.classList.add('owl-stage-outer');
  const mobOwlStage = document.createElement('div');
  mobOwlStage.classList.add('owl-stage');
  mobOwlStageOuter.append(mobOwlStage);
  mobOwlCarousel.append(mobOwlStageOuter); // Append to mobOwlCarousel (the ul)

  campaignRows.forEach((row) => {
    // Corrected destructuring to include the 'hierarchy-tree' richtext field
    const [videoLinkCell, thumbnailCell, titleCell, hierarchyTreeCell] = [...row.children];

    const videoLink = videoLinkCell.querySelector('a')?.href || '#';
    const thumbnailPicture = thumbnailCell.querySelector('picture');
    const titleText = titleCell.textContent.trim();

    // Desktop slider item
    const owlItem = document.createElement('div');
    owlItem.classList.add('owl-item');
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = videoLink;
    anchor.classList.add('youtube', 'cboxElement');

    const campaignImg = document.createElement('div');
    campaignImg.classList.add('campaign-img');
    if (thumbnailPicture) {
      const img = thumbnailPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      campaignImg.append(optimizedPic);
    }
    const campTitle = document.createElement('div');
    campTitle.classList.add('camp-title');
    const p = document.createElement('p');
    p.textContent = titleText;
    campTitle.append(p);

    anchor.append(campaignImg, campTitle);
    li.append(anchor);

    // Handle hierarchy-tree richtext field
    if (hierarchyTreeCell && hierarchyTreeCell.innerHTML.trim()) {
      const hierarchyWrapper = document.createElement('div'); // Use a div to hold the richtext content
      moveInstrumentation(hierarchyTreeCell, hierarchyWrapper);
      hierarchyWrapper.innerHTML = hierarchyTreeCell.innerHTML;

      // Apply classes to nested elements as per ORIGINAL HTML (if any specific classes are needed)
      hierarchyWrapper.querySelectorAll('ul').forEach((list) => list.classList.add('nav-menu')); // Example class
      hierarchyWrapper.querySelectorAll('li').forEach((item) => item.classList.add('nav-item')); // Example class
      hierarchyWrapper.querySelectorAll('a').forEach((link) => link.classList.add('nav-link')); // Example class

      // Append the hierarchy content to the li or a new wrapper within li
      li.append(hierarchyWrapper);
    }

    ul.append(li);
    owlItem.append(ul);
    moveInstrumentation(row, owlItem); // Move instrumentation from row to owlItem
    owlStage.append(owlItem);

    // Mobile slider item (similar structure, but directly in ul)
    const mobOwlItem = document.createElement('div');
    mobOwlItem.classList.add('owl-item');
    const mobLi = document.createElement('li');
    const mobAnchor = document.createElement('a');
    mobAnchor.href = videoLink;
    mobAnchor.classList.add('youtube', 'cboxElement');

    const mobCampaignImg = document.createElement('div');
    mobCampaignImg.classList.add('campaign-img');
    if (thumbnailPicture) {
      const img = thumbnailPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // No need to move instrumentation again for mobile, it's already on the desktop item
      mobCampaignImg.append(optimizedPic);
    }
    const mobCampTitle = document.createElement('div');
    mobCampTitle.classList.add('camp-title');
    const mobP = document.createElement('p');
    mobP.textContent = titleText;
    mobCampTitle.append(mobP);

    mobAnchor.append(mobCampaignImg, mobCampTitle);
    mobLi.append(mobAnchor);

    // Handle hierarchy-tree richtext field for mobile
    if (hierarchyTreeCell && hierarchyTreeCell.innerHTML.trim()) {
      const mobHierarchyWrapper = document.createElement('div');
      // No need to move instrumentation again for mobile, it's already on the desktop item
      mobHierarchyWrapper.innerHTML = hierarchyTreeCell.innerHTML;

      mobHierarchyWrapper.querySelectorAll('ul').forEach((list) => list.classList.add('nav-menu'));
      mobHierarchyWrapper.querySelectorAll('li').forEach((item) => item.classList.add('nav-item'));
      mobHierarchyWrapper.querySelectorAll('a').forEach((link) => link.classList.add('nav-link'));

      mobLi.append(mobHierarchyWrapper);
    }

    mobOwlItem.append(mobLi);
    mobOwlStage.append(mobOwlItem);
  });

  campaignGallery.append(campaignSlider, mobCampaignSlider);
  block.replaceChildren(campaignGallery);

  // Load jQuery and Owl Carousel CSS and JS
  await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css');
  await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css');
  await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js');

  // eslint-disable-next-line no-undef
  $(campaignSlider).owlCarousel({
    loop: true,
    margin: 0,
    nav: false,
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
  });

  // eslint-disable-next-line no-undef
  $(mobOwlCarousel).owlCarousel({
    loop: true,
    margin: 0,
    nav: false,
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
  });
}
