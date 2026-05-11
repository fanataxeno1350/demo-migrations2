import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [titleRow, buttonLabelRow, buttonLinkRow, ...featureItemRows] = children;

  const section = document.createElement('section');
  section.classList.add('news-features');

  const titleContainer = document.createElement('div');
  titleContainer.classList.add('u-container', 'u-width-10');
  const title = document.createElement('h2');
  title.classList.add('news-features-title', 'fade-in', 'appear');
  moveInstrumentation(titleRow, title);
  title.textContent = titleRow.textContent.trim();
  titleContainer.append(title);
  section.append(titleContainer);

  const newsFeaturesContainer = document.createElement('div');
  newsFeaturesContainer.classList.add('news-features-container');

  const heroMosaicContainer = document.createElement('div');
  heroMosaicContainer.classList.add('u-container');
  const heroMosaic = document.createElement('div');
  heroMosaic.classList.add('hero-mosaic', 'grid-3');

  featureItemRows.forEach((row, index) => {
    const [headlineCell, linkCell, ctaLabelCell, backgroundImageCell] = [...row.children];

    const article = document.createElement('article');
    article.setAttribute('data-is', 'loaded');
    article.setAttribute('data-module', 'hero');
    article.classList.add('hero-mosaic-item', 'slide-in', 'appear');

    if (index === 0) {
      article.classList.add('-feature', 'from-left');
    } else if (index === 1) {
      article.classList.add('special-feature', 'from-right');
    } else {
      article.classList.add('from-right');
    }

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    moveInstrumentation(row, anchor);

    const headline = document.createElement('h2');
    headline.textContent = headlineCell.textContent.trim();

    const ctaLabel = document.createElement('h4');
    ctaLabel.classList.add('support-link'); // Added class from original HTML
    headline.classList.add('support-link'); // Added class from original HTML (empty h5 is before h2)
    ctaLabel.textContent = ctaLabelCell.textContent.trim();

    // The original HTML has an empty h5.support-link before h2.
    // Replicate this structure for fidelity.
    const emptyH5 = document.createElement('h5');
    emptyH5.classList.add('support-link');

    anchor.append(emptyH5, headline, ctaLabel);

    const heroBackground = document.createElement('span');
    heroBackground.classList.add('hero-background');
    if (backgroundImageCell) {
      const picture = backgroundImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          heroBackground.append(optimizedPic);
        }
      }
    }

    const heroBackgroundPlaceholder = document.createElement('span');
    heroBackgroundPlaceholder.classList.add('hero-background-placeholder');

    article.append(anchor, heroBackground, heroBackgroundPlaceholder);
    heroMosaic.append(article);
  });

  heroMosaicContainer.append(heroMosaic);
  newsFeaturesContainer.append(heroMosaicContainer);

  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('field-formation-wrapper', 'u-text-centered', 'news-features-button');

  const buttonLink = document.createElement('a');
  buttonLink.classList.add('u-button', 'u-button-blue');
  const foundButtonLink = buttonLinkRow.querySelector('a');
  if (foundButtonLink) {
    buttonLink.href = foundButtonLink.href;
  }
  // Move instrumentation from buttonLinkRow to the new buttonLink element
  moveInstrumentation(buttonLinkRow, buttonLink);
  buttonLink.textContent = buttonLabelRow.textContent.trim();
  // Move instrumentation from buttonLabelRow to the new buttonLink element
  moveInstrumentation(buttonLabelRow, buttonLink);

  buttonWrapper.append(buttonLink);
  newsFeaturesContainer.append(buttonWrapper);

  section.append(newsFeaturesContainer);

  block.replaceChildren(section);
}
