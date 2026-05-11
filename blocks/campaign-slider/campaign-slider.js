import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const slides = [...block.children];

  const owlStageOuter = document.createElement('div');
  owlStageOuter.classList.add('owl-stage-outer');

  const owlStage = document.createElement('div');
  owlStage.classList.add('owl-stage');
  owlStageOuter.append(owlStage);

  slides.forEach((row) => {
    // Model: videoLink, thumbnailImage, title, hierarchy-tree
    const [videoLinkCell, thumbnailImageCell, titleCell, hierarchyTreeCell] = [...row.children];

    const owlItem = document.createElement('div');
    owlItem.classList.add('owl-item');
    moveInstrumentation(row, owlItem);

    const ul = document.createElement('ul');
    const li = document.createElement('li');

    const videoLink = videoLinkCell.querySelector('a');
    const anchor = document.createElement('a');
    if (videoLink) {
      anchor.href = videoLink.href;
      anchor.classList.add('youtube', 'cboxElement');
    }

    const campaignImgDiv = document.createElement('div');
    campaignImgDiv.classList.add('campaign-img');

    const picture = thumbnailImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        campaignImgDiv.append(optimizedPic);
        optimizedPic.querySelector('img').classList.add('img-fluid', 'lozad');
      }
    }

    const campTitleDiv = document.createElement('div');
    campTitleDiv.classList.add('camp-title');
    const p = document.createElement('p');
    p.textContent = titleCell.textContent.trim();
    campTitleDiv.append(p);

    anchor.append(campaignImgDiv, campTitleDiv);
    li.append(anchor);

    // Handle hierarchy-tree richtext field
    if (hierarchyTreeCell) {
      const hierarchyTempDiv = document.createElement('div');
      hierarchyTempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, hierarchyTempDiv);

      // Apply classes to nested elements if needed, based on original HTML structure
      // The original HTML shows <ul><li><a> structure directly inside owl-item,
      // but the block structure shows it as a separate cell.
      // Assuming the hierarchy-tree content should be appended to the li or ul.
      // For this block, the original HTML shows the <ul><li> structure directly inside owl-item,
      // but the block structure shows it as a separate cell.
      // The generated code puts the anchor inside an <li>, which is inside a <ul>.
      // The hierarchy-tree field also contains a <ul>. This creates nested <ul>s.
      // Based on the original HTML, the <ul> containing the video link is the primary one,
      // and the hierarchy-tree content is not directly rendered as part of the slide item.
      // If it were to be rendered, it would need a specific wrapper and placement.
      // For now, we will just ensure it's instrumented, but not append it to the current slide item structure
      // as it would create invalid nesting (<ul> inside <li> inside <ul>).
      // If the intention was to render it, a separate container would be needed.
      // For this block, it seems the hierarchy-tree field is present in the model but not
      // explicitly rendered in the original HTML for each slide item.
      // We'll keep it instrumented but not append it to avoid structural issues.
      // If a future requirement emerges to display it, a new container and placement would be needed.
    }

    ul.append(li);
    owlItem.append(ul);
    owlStage.append(owlItem);
  });

  const owlNav = document.createElement('div');
  owlNav.classList.add('owl-nav', 'disabled');
  const prevBtn = document.createElement('div');
  prevBtn.classList.add('owl-prev');
  prevBtn.textContent = 'prev';
  const nextBtn = document.createElement('div');
  nextBtn.classList.add('owl-next');
  nextBtn.textContent = 'next';
  owlNav.append(prevBtn, nextBtn);

  const owlDots = document.createElement('div');
  owlDots.classList.add('owl-dots');

  block.replaceChildren(owlStageOuter, owlNav, owlDots);
  block.classList.add('owl-carousel', 'owl-theme'); // 'owl-loaded', 'owl-drag' are added by Owl Carousel JS

  // Load jQuery and Owl Carousel
  await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
  await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css'); // Added CSS load
  await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css'); // Often needed for default theme
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js');

  // eslint-disable-next-line no-undef
  $(block).owlCarousel({
    loop: false,
    margin: 10,
    nav: true,
    dots: true,
    navText: [prevBtn, nextBtn], // Use the created buttons directly, not outerHTML
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
