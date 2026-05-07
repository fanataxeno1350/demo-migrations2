import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    desktopImageRow,
    mobileImageRow,
    headlineRow,
    videoLinkRow,
    playIconRow,
  ] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('hero-steel', 'op1');

  const figure = document.createElement('figure');

  const desktopPicture = desktopImageRow.querySelector('picture');
  if (desktopPicture) {
    const desktopImg = desktopPicture.querySelector('img');
    const optimizedDesktopPic = createOptimizedPicture(
      desktopImg.src,
      desktopImg.alt,
      false,
      [{ width: '1440' }],
    );
    optimizedDesktopPic.querySelector('img').classList.add('hidden-xs', 'lazyloaded');
    moveInstrumentation(desktopImageRow, optimizedDesktopPic.querySelector('img'));
    figure.appendChild(optimizedDesktopPic);
  }

  const mobilePicture = mobileImageRow.querySelector('picture');
  if (mobilePicture) {
    const mobileImg = mobilePicture.querySelector('img');
    const optimizedMobilePic = createOptimizedPicture(
      mobileImg.src,
      mobileImg.alt,
      false,
      [{ width: '373' }],
    );
    optimizedMobilePic.querySelector('img').classList.add('visible-xs', 'lazyload');
    moveInstrumentation(mobileImageRow, optimizedMobilePic.querySelector('img'));
    figure.appendChild(optimizedMobilePic);
  }
  root.appendChild(figure);

  const bannerInfo = document.createElement('div');
  bannerInfo.classList.add('banner-info');

  const container = document.createElement('div');
  container.classList.add('container');

  const bannerCard = document.createElement('div');
  bannerCard.classList.add('banner-card', 'os-animation', 'animated', 'fadeIn');
  bannerCard.setAttribute('data-os-animation', 'fadeIn');

  const headline = document.createElement('h1');
  headline.classList.add('os-animation', 'hd1', 'animated', 'fadeIn');
  headline.setAttribute('data-os-animation', 'fadeIn');
  headline.setAttribute('data-os-animation-delay', '.5s');
  headline.style.animationDelay = '0.5s';
  headline.textContent = headlineRow.textContent.trim();
  moveInstrumentation(headlineRow, headline);
  bannerCard.appendChild(headline);

  const emptyParagraph = document.createElement('p');
  emptyParagraph.classList.add('os-animation', 'animated', 'fadeIn');
  emptyParagraph.setAttribute('data-os-animation', 'fadeIn');
  emptyParagraph.setAttribute('data-os-animation-delay', '.7s');
  emptyParagraph.style.animationDelay = '0.7s';
  bannerCard.appendChild(emptyParagraph);

  const videoParagraph = document.createElement('p');
  videoParagraph.classList.add('MT30', 'os-animation', 'animated', 'fadeIn');
  videoParagraph.setAttribute('data-os-animation', 'fadeIn');
  videoParagraph.setAttribute('data-os-animation-delay', '.9s');
  videoParagraph.style.animationDelay = '0.9s';

  const videoLink = document.createElement('a');
  videoLink.classList.add('video-btn', 'fancybox-video');
  const foundVideoLink = videoLinkRow.querySelector('a');
  if (foundVideoLink) {
    videoLink.href = foundVideoLink.href;
  }
  moveInstrumentation(videoLinkRow, videoLink);

  const playIconPicture = playIconRow.querySelector('picture');
  if (playIconPicture) {
    const playIconImg = playIconPicture.querySelector('img');
    const optimizedPlayIconPic = createOptimizedPicture(
      playIconImg.src,
      playIconImg.alt,
      false,
      [{ width: '32' }], // Assuming a reasonable size for an icon
    );
    // Swiper adds lazyloaded automatically, no need to add manually
    moveInstrumentation(playIconRow, optimizedPlayIconPic.querySelector('img'));
    videoLink.appendChild(optimizedPlayIconPic);
  }
  videoParagraph.appendChild(videoLink);
  bannerCard.appendChild(videoParagraph);

  container.appendChild(bannerCard);
  bannerInfo.appendChild(container);
  root.appendChild(bannerInfo);

  block.replaceChildren(root);

  // Interactivity: Fancybox video
  // Load Fancybox assets
  await loadCSS('https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css');
  await loadScript('https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js');

  // Initialize Fancybox for the video link
  if (videoLink && window.Fancybox) {
    videoLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.Fancybox.show([{
        src: videoLink.href,
        type: 'iframe',
      }]);
    });
  }
}
