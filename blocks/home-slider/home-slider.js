import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const slides = [];
  const quickLinks = [];

  // Separate slide items from quick link items based on cell count
  [...block.children].forEach((row) => {
    if (row.children.length === 8) { // home-slider-slide-item has 8 cells
      slides.push(row);
    } else if (row.children.length === 2) { // home-slider-quick-link-item has 2 cells
      quickLinks.push(row);
    }
  });

  const section = document.createElement('section');
  section.classList.add('spotlight-home-wrap', 'm-0', 'p-0');

  const beamSlider = document.createElement('div');
  // Removed 'swiper-initialized', 'swiper-horizontal', 'swiper-watch-progress' as Swiper adds them
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  moveInstrumentation(block, beamSlider); // Move instrumentation from block to the main slider div

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  slides.forEach((row) => {
    const [
      imageDesktopCell,
      imageTabletCell,
      imageMobileCell,
      smallTextCell,
      headingCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('swiper-slide', 'nogradient');
    moveInstrumentation(row, slide); // Move instrumentation from row to slide

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = document.createElement('picture');
    const imgDesktop = imageDesktopCell.querySelector('img');
    const imgTablet = imageTabletCell.querySelector('img');
    const imgMobile = imageMobileCell.querySelector('img');

    if (imgMobile) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = imgMobile.src;
      picture.append(sourceMobile);
    }
    if (imgTablet) {
      const sourceTablet = document.createElement('source');
      sourceTablet.media = '(max-width: 799px)';
      sourceTablet.srcset = imgTablet.src;
      picture.append(sourceTablet);
    }
    if (imgDesktop) {
      const img = document.createElement('img');
      img.loading = 'eager';
      img.src = imgDesktop.src;
      img.alt = imgDesktop.alt;
      img.width = imgDesktop.width;
      img.height = imgDesktop.height;
      img.fetchPriority = 'high';
      picture.append(img);
    }

    slideBgImg.append(picture);

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');

    if (smallTextCell && smallTextCell.textContent.trim()) {
      const smallText = document.createElement('small');
      smallText.style.fontWeight = 'bold';
      smallText.textContent = smallTextCell.textContent.trim();
      contentDiv.append(smallText);
    }

    if (headingCell && headingCell.textContent.trim()) {
      // Changed h1 to h2 for consistency with original HTML examples
      const heading = document.createElement('h2');
      // Removed 'banner-text-dark' as it's not consistently present in original HTML
      heading.classList.add('heading', 'font-medium', 'font-size-tb');
      heading.innerHTML = headingCell.textContent.trim();
      contentDiv.append(heading);
    }

    if (descriptionCell && descriptionCell.innerHTML.trim()) {
      const description = document.createElement('p');
      description.innerHTML = descriptionCell.innerHTML.trim();
      contentDiv.append(description);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaLabel = ctaLabelCell.textContent.trim();

    if (ctaLink && ctaLabel) {
      const button = document.createElement('a');
      // Use btn-primary if present in original HTML, otherwise just btn
      if (ctaLink.classList.contains('btn-primary')) {
        button.classList.add('btn', 'btn-primary');
      } else {
        button.classList.add('btn');
      }
      button.href = ctaLink.href;
      button.textContent = ctaLabel;
      if (ctaLink.target) { // Preserve target attribute from original link
        button.target = ctaLink.target;
      }
      contentDiv.append(button);
    }

    mobContentHomeSpotlight.append(contentDiv);
    slide.append(slideBgImg, mobContentHomeSpotlight);
    swiperWrapper.append(slide);
  });

  const prevBtn = document.createElement('div');
  prevBtn.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';

  const nextBtn = document.createElement('div');
  nextBtn.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination', 'bullet-bottom');

  beamSlider.append(swiperWrapper, prevBtn, nextBtn, pagination);
  section.append(beamSlider);

  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add(
    'mt-0',
    'pt-1',
    'pb-1',
    'm-none1',
    'bottom-0',
    'w-100',
    'quick-links-parents-div',
    'position-relative',
  );

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '-100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');

  quickLinks.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.classList.add('with-full-underline');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.textContent = labelCell.textContent.trim();
      if (foundLink.target) { // Preserve target attribute from original link
        link.target = foundLink.target;
      }
    }
    moveInstrumentation(row, li); // Move instrumentation from row to li
    li.append(link);
    quickLinksUl.append(li);
  });

  container.append(quickLinksUl);
  quickLinksParentDiv.append(container);
  section.append(quickLinksParentDiv);

  block.replaceChildren(section);

  // Optimize images
  section.querySelectorAll('picture > img').forEach((img) => {
    // createOptimizedPicture expects the original src, not the img element itself
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation should be called on the original img element, not the new one inside optimizedPic
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Load Swiper and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(beamSlider, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: pagination,
      clickable: true,
    },
  });
}
