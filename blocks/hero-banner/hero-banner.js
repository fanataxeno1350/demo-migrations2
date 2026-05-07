import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure block.children to get specific rows by name, matching the BlockJson model
  const [
    desktopImageRow,
    mobileImageRow,
    breadcrumbsRow,
    headlineRow,
    descriptionRow,
  ] = [...block.children];

  const heroSteel = document.createElement('div');
  heroSteel.classList.add('hero-steel', 'op1');

  const figure = document.createElement('figure');

  // Desktop Image
  const desktopImageCell = desktopImageRow.children[0];
  const desktopPicture = desktopImageCell.querySelector('picture');
  if (desktopPicture) {
    const desktopImg = desktopPicture.querySelector('img');
    const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '1440' }]);
    const newDesktopImg = optimizedDesktopPic.querySelector('img');
    moveInstrumentation(desktopImg, newDesktopImg);
    newDesktopImg.classList.add('hidden-xs', 'lazyloaded');
    figure.append(optimizedDesktopPic);
  }

  // Mobile Image
  const mobileImageCell = mobileImageRow.children[0];
  const mobilePicture = mobileImageCell.querySelector('picture');
  if (mobilePicture) {
    const mobileImg = mobilePicture.querySelector('img');
    const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '373' }]);
    const newMobileImg = optimizedMobilePic.querySelector('img');
    moveInstrumentation(mobileImg, newMobileImg);
    newMobileImg.classList.add('visible-xs', 'lazyload');
    figure.append(optimizedMobilePic);
  }

  heroSteel.append(figure);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const breadcrumbsDiv = document.createElement('div');
  breadcrumbsDiv.classList.add('breadcrumbs', 'hidden-sm', 'hidden-xs');

  const blockJswDiv = document.createElement('div');
  blockJswDiv.classList.add('block', 'block-jsw');

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content');

  // Breadcrumbs (richtext)
  const breadcrumbsCell = breadcrumbsRow.children[0];
  if (breadcrumbsCell) {
    moveInstrumentation(breadcrumbsRow, contentDiv); // Instrument the original row
    contentDiv.innerHTML = breadcrumbsCell.innerHTML; // Use innerHTML for richtext
  }

  blockJswDiv.append(contentDiv);
  breadcrumbsDiv.append(blockJswDiv);
  containerDiv.append(breadcrumbsDiv);
  heroSteel.append(containerDiv);

  const bannerInfo = document.createElement('div');
  bannerInfo.classList.add('banner-info');

  const bannerInfoContainer = document.createElement('div');
  bannerInfoContainer.classList.add('container');

  const bannerCard = document.createElement('div');
  bannerCard.classList.add('banner-card', 'os-animation', 'animated', 'fadeIn');
  bannerCard.setAttribute('data-os-animation', 'fadeIn');

  const headline = document.createElement('h1');
  headline.classList.add('os-animation', 'hd1', 'animated', 'fadeIn');
  headline.setAttribute('data-os-animation', 'fadeIn');
  headline.setAttribute('data-os-animation-delay', '.5s');
  headline.style.animationDelay = '0.5s';
  // Headline (text)
  const headlineCell = headlineRow.children[0];
  if (headlineCell) {
    moveInstrumentation(headlineRow, headline); // Instrument the original row
    headline.textContent = headlineCell.textContent.trim();
  }

  const description = document.createElement('p');
  description.classList.add('os-animation', 'animated', 'fadeIn');
  description.setAttribute('data-os-animation', 'fadeIn');
  description.setAttribute('data-os-animation-delay', '.7s');
  description.style.animationDelay = '0.7s';
  // Description (text)
  const descriptionCell = descriptionRow.children[0];
  if (descriptionCell) {
    moveInstrumentation(descriptionRow, description); // Instrument the original row
    description.textContent = descriptionCell.textContent.trim();
  }

  bannerCard.append(headline, description);
  bannerInfoContainer.append(bannerCard);
  bannerInfo.append(bannerInfoContainer);
  heroSteel.append(bannerInfo);

  block.replaceChildren(heroSteel);

  // The original JS had a redundant image optimization loop here.
  // Images are already optimized when they are created from desktopImageCell and mobileImageCell.
  // This loop would re-optimize images that are already optimized and replace them,
  // potentially breaking instrumentation or adding unnecessary processing.
  // Removed as it's not needed and could cause issues.
}
