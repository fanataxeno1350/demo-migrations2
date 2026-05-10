import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [closeIconRow, closeIconLinkRow, searchPlaceholderRow, submitLabelRow] = [...block.children];

  const searchBox = document.createElement('div');
  searchBox.classList.add('search-box');

  // Close Icon Link
  const closeLink = document.createElement('a');
  closeLink.classList.add('search-close');
  closeLink.href = closeIconLinkRow?.querySelector('a')?.href || 'javascript:void(0);';
  moveInstrumentation(closeIconLinkRow, closeLink);

  // Close Icon Picture
  const closePicture = closeIconRow?.querySelector('picture');
  if (closePicture) {
    const img = closePicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      closeLink.append(optimizedPic);
    }
  }
  moveInstrumentation(closeIconRow, closeLink);
  searchBox.append(closeLink);

  const searchBoxMain = document.createElement('div');
  searchBoxMain.classList.add('search-box-main');

  // Search Input
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = searchPlaceholderRow?.textContent.trim() || '';
  moveInstrumentation(searchPlaceholderRow, searchInput);
  searchBoxMain.append(searchInput);

  // Submit Button
  const submitButton = document.createElement('input');
  submitButton.type = 'submit';
  submitButton.classList.add('search-btn');
  submitButton.value = submitLabelRow?.textContent.trim() || '';
  moveInstrumentation(submitLabelRow, submitButton);
  searchBoxMain.append(submitButton);

  searchBox.append(searchBoxMain);

  block.replaceChildren(searchBox);

  // Swiper.js initialization (if applicable, based on original HTML classes)
  // The provided ORIGINAL HTML does not contain Swiper classes, so this part is commented out.
  // If the original HTML *did* contain Swiper classes like 'swiper-container',
  // the following would be needed:

  // await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  // await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // const swiperEl = block.querySelector('.swiper-container'); // Or whatever the main swiper element is
  // if (swiperEl) {
  //   const prevBtn = block.querySelector('.swiper-button-prev');
  //   const nextBtn = block.querySelector('.swiper-button-next');
  //   const paginationEl = block.querySelector('.swiper-pagination');

  //   // eslint-disable-next-line no-undef
  //   new Swiper(swiperEl, {
  //     slidesPerView: 'auto',
  //     loop: false, // Or swiperEl.dataset.loop === 'true' if data-loop attribute is present
  //     navigation: { prevEl: prevBtn, nextEl: nextBtn },
  //     pagination: { el: paginationEl, clickable: true },
  //   });
  // }
}
