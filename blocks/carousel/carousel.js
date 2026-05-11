import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [carouselTitleRow, ...itemRows] = [...block.children];

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('u-container', 'u-width-10', 'carousel-title-parent');
  moveInstrumentation(carouselTitleRow, carouselWrapper);

  const carouselTitle = document.createElement('h2');
  carouselTitle.classList.add('carousel-title', 'fade-in', 'appear');
  carouselTitle.textContent = carouselTitleRow.textContent.trim();
  carouselWrapper.append(carouselTitle);

  const carouselList = document.createElement('ul');
  carouselList.classList.add('carousel-list', 'swiper-wrapper'); // Add swiper-wrapper class
  carouselList.setAttribute('data-carousel', 'list');

  itemRows
    .filter((row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''))
    .forEach((row) => {
      const [imageCell, headingCell, subheadingCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [
        ...row.children,
      ];

      const listItem = document.createElement('li');
      listItem.classList.add('carousel-item', 'swiper-slide'); // Add swiper-slide class
      listItem.setAttribute('data-carousel', 'item');
      moveInstrumentation(row, listItem);

      const itemInner = document.createElement('div');
      itemInner.classList.add('carousel-item-inner');

      const itemImage = document.createElement('div');
      itemImage.classList.add('carousel-item-image');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '700' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          itemImage.append(optimizedPic);
        }
      }
      itemInner.append(itemImage);

      const itemHeading = document.createElement('h3');
      itemHeading.classList.add('carousel-item-heading');
      itemHeading.textContent = headingCell.textContent.trim();
      itemInner.append(itemHeading);

      const itemText = document.createElement('div');
      itemText.classList.add('carousel-item-text');
      itemText.setAttribute('data-carousel', 'text');

      const subheading = document.createElement('h3');
      subheading.classList.add('heading-h3', '-alternate');
      subheading.textContent = subheadingCell.textContent.trim();
      itemText.append(subheading);

      const descriptionContent = document.createElement('div');
      descriptionContent.innerHTML = descriptionCell.innerHTML;
      itemText.append(descriptionContent);

      const ctaLink = document.createElement('a');
      const foundCtaLink = ctaLinkCell.querySelector('a');
      if (foundCtaLink) {
        ctaLink.href = foundCtaLink.href;
      }
      ctaLink.textContent = ctaLabelCell.textContent.trim(); // Corrected to use ctaLabelCell
      itemText.append(ctaLink);

      itemInner.append(itemText);
      listItem.append(itemInner);
      carouselList.append(listItem);
    });

  const prevButton = document.createElement('button');
  prevButton.classList.add('carousel-button-prev');
  prevButton.textContent = 'Previous';

  const nextButton = document.createElement('button');
  nextButton.classList.add('carousel-button-next');
  nextButton.textContent = 'Next';

  const swiperContainer = document.createElement('div'); // Swiper container
  swiperContainer.classList.add('swiper'); // Swiper class
  swiperContainer.append(carouselList); // carouselList (now swiper-wrapper) goes inside swiperContainer

  const root = document.createElement('div');
  root.classList.add('carousel');
  root.setAttribute('data-module', 'carousel');

  root.append(carouselWrapper, prevButton, swiperContainer, nextButton); // Append swiperContainer

  block.replaceChildren(root);

  // Load Swiper CSS and JS
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Initialize Swiper
  // eslint-disable-next-line no-undef
  new Swiper(swiperContainer, {
    slidesPerView: 'auto',
    loop: false, // Based on ORIGINAL HTML data-loop="false"
    navigation: {
      prevEl: prevButton,
      nextEl: nextButton,
    },
    // Pagination is not present in the ORIGINAL HTML, so it's omitted.
  });
}
