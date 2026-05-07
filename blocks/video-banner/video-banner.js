import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    desktopBannerImageRow,
    mobileBannerImageRow,
    headlineRow,
    videoLinkRow,
    playIconRow,
  ] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('hero-steel', 'op1');

  const figure = document.createElement('figure');

  const desktopPicture = desktopBannerImageRow.querySelector('picture');
  if (desktopPicture) {
    const desktopImg = desktopPicture.querySelector('img');
    const optimizedDesktopPic = createOptimizedPicture(
      desktopImg.src,
      desktopImg.alt,
      false,
      [{ width: '1440' }],
    );
    optimizedDesktopPic.querySelector('img').classList.add('hidden-xs', 'lazyloaded');
    moveInstrumentation(desktopBannerImageRow, optimizedDesktopPic.querySelector('img'));
    figure.append(optimizedDesktopPic);
  }

  const mobilePicture = mobileBannerImageRow.querySelector('picture');
  if (mobilePicture) {
    const mobileImg = mobilePicture.querySelector('img');
    const optimizedMobilePic = createOptimizedPicture(
      mobileImg.src,
      mobileImg.alt,
      false,
      [{ width: '373' }],
    );
    optimizedMobilePic.querySelector('img').classList.add('visible-xs', 'lazyload');
    moveInstrumentation(mobileBannerImageRow, optimizedMobilePic.querySelector('img'));
    figure.append(optimizedMobilePic);
  }

  root.append(figure);

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
  bannerCard.append(headline);

  // Original HTML has an empty <p> here, replicating for structural fidelity
  const emptyP = document.createElement('p');
  emptyP.classList.add('os-animation', 'animated', 'fadeIn');
  emptyP.setAttribute('data-os-animation', 'fadeIn');
  emptyP.setAttribute('data-os-animation-delay', '.7s');
  emptyP.style.animationDelay = '0.7s';
  bannerCard.append(emptyP);

  const videoWrapperP = document.createElement('p');
  videoWrapperP.classList.add('MT30', 'os-animation', 'animated', 'fadeIn');
  videoWrapperP.setAttribute('data-os-animation', 'fadeIn');
  videoWrapperP.setAttribute('data-os-animation-delay', '.9s');
  videoWrapperP.style.animationDelay = '0.9s';

  const videoLinkAnchor = document.createElement('a');
  videoLinkAnchor.classList.add('video-btn', 'fancybox-video');
  const foundVideoLink = videoLinkRow.querySelector('a');
  if (foundVideoLink) {
    videoLinkAnchor.href = foundVideoLink.href;
  }
  moveInstrumentation(videoLinkRow, videoLinkAnchor);

  const playIconPicture = playIconRow.querySelector('picture');
  if (playIconPicture) {
    const playIconImg = playIconPicture.querySelector('img');
    const optimizedPlayIconPic = createOptimizedPicture(
      playIconImg.src,
      playIconImg.alt,
      false,
      [{ width: '50' }], // Assuming a reasonable width for an icon
    );
    optimizedPlayIconPic.querySelector('img').classList.add('lazyloaded');
    moveInstrumentation(playIconRow, optimizedPlayIconPic.querySelector('img'));
    videoLinkAnchor.append(optimizedPlayIconPic);
  }

  videoWrapperP.append(videoLinkAnchor);
  bannerCard.append(videoWrapperP);

  container.append(bannerCard);
  bannerInfo.append(container);
  root.append(bannerInfo);

  block.replaceChildren(root);
}
