import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [titleRow, ...tabItemRows] = [...block.children];

  const productTabsWrapper = document.createElement('div');
  productTabsWrapper.classList.add('cmp-product-tabs', 'cmp-product-tabs--yippee-without-image');

  // Title
  const titleElement = document.createElement('h2');
  titleElement.classList.add('cmp-product-tabs__title');
  moveInstrumentation(titleRow, titleElement);
  // Title is richtext, so use innerHTML
  titleElement.innerHTML = titleRow.children[0]?.innerHTML || '';
  productTabsWrapper.append(titleElement);

  // Tabs navigation
  const tabsNav = document.createElement('div');
  tabsNav.classList.add('cmp-product-tabs__tabs');
  productTabsWrapper.append(tabsNav);

  // Tabs content
  const tabsContent = document.createElement('div');
  tabsContent.classList.add('cmp-product-tabs__content', 'slickcarousel', 'carousel', 'panelcontainer');
  productTabsWrapper.append(tabsContent);

  const swiperEl = document.createElement('div');
  swiperEl.classList.add('cmp-carousel', 'swiper'); // Add 'swiper' class for Swiper.js
  swiperEl.setAttribute('data-component', 'carousel');
  swiperEl.setAttribute('data-show-infinite-scroll', 'false');
  swiperEl.setAttribute('data-show-arrows', 'true');
  swiperEl.setAttribute('data-show-dots', 'true');
  swiperEl.setAttribute('data-item-count-per-slide', '3');
  swiperEl.setAttribute('data-auto-play-is-enabled', 'false');
  swiperEl.setAttribute('data-auto-play-speed-in-ms', '500');
  swiperEl.setAttribute('data-reveal-next-item-partially', 'false');
  swiperEl.setAttribute('data-show-center-zoom', 'false');
  swiperEl.setAttribute('data-slides-to-scroll', '3');
  // swiper-initialized, slick-initialized, slick-slider, slick-dotted are added by Swiper.js, not manually
  tabsContent.append(swiperEl);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('cmp-carousel__container', 'swiper-wrapper'); // Use swiper-wrapper
  swiperEl.append(swiperWrapper);

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('slick-prev', 'slick-arrow');
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.setAttribute('type', 'button');
  swiperEl.append(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('slick-next', 'slick-arrow');
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.setAttribute('type', 'button');
  swiperEl.append(nextBtn);

  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination');
  swiperEl.append(paginationEl);

  tabItemRows.forEach((row, index) => {
    const [tabLabelCell] = [...row.children]; // Correct destructuring for fixed schema
    const tabLabel = tabLabelCell.textContent.trim();

    // Create tab button
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('button', 'cmp-button--secondary', 'cmp-button--secondary-undefined');
    if (index === 0) {
      buttonWrapper.classList.add('active');
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('cmp-button');
    const buttonText = document.createElement('span');
    buttonText.classList.add('cmp-button__text');
    buttonText.textContent = tabLabel;
    button.append(buttonText);
    buttonWrapper.append(button);
    tabsNav.append(buttonWrapper);
    moveInstrumentation(row, buttonWrapper); // Move instrumentation for the tab button

    // Placeholder for content, actual content will be fetched dynamically
    const tabContentDiv = document.createElement('div');
    tabContentDiv.classList.add('swiper-slide'); // Use swiper-slide for carousel item
    tabContentDiv.textContent = `Content for ${tabLabel}`; // Temporary placeholder text
    swiperWrapper.append(tabContentDiv);

    // Add click listener for tab switching
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      tabsNav.querySelectorAll('.button').forEach((btn) => btn.classList.remove('active'));
      // Add active class to the clicked button
      buttonWrapper.classList.add('active');

      // In a real scenario, this would trigger content loading or display for the selected tab
      // For this EDS block, we're only structuring the tabs, content loading is external.
      // For demonstration, we can toggle visibility of placeholder content
      swiperWrapper.querySelectorAll('.swiper-slide').forEach((content, contentIndex) => {
        content.style.display = index === contentIndex ? 'block' : 'none';
      });
    });

    // Initialize first tab content to be visible
    if (index === 0) {
      tabContentDiv.style.display = 'block';
    } else {
      tabContentDiv.style.display = 'none';
    }
  });

  block.replaceChildren(productTabsWrapper);

  // Swiper.js initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 'auto',
    loop: swiperEl.dataset.loop === 'true', // Ensure correct boolean conversion
    navigation: { prevEl: prevBtn, nextEl: nextBtn },
    pagination: { el: paginationEl, clickable: true },
  });
}
