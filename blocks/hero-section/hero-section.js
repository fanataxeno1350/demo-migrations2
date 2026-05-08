import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    decorStar1Row,
    decorStar2Row,
    headlineRow,
    subheadlineRow,
    ctaLabelRow,
    ctaLinkRow,
    heroImageRow,
  ] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container');

  const row = document.createElement('div');
  row.classList.add('row', 'align-items-center');

  const heroDescription = document.createElement('div');
  heroDescription.classList.add('hero-description', 'col-lg-6', 'col-12');

  const star1Picture = decorStar1Row?.querySelector('picture');
  if (star1Picture) {
    const star1Img = star1Picture.querySelector('img');
    const optimizedStar1Pic = createOptimizedPicture(star1Img.src, star1Img.alt, false, [{ width: '750' }]);
    const newStar1Img = optimizedStar1Pic.querySelector('img');
    newStar1Img.classList.add('star-1');
    moveInstrumentation(decorStar1Row, optimizedStar1Pic);
    heroDescription.append(optimizedStar1Pic);
  }

  const star2Picture = decorStar2Row?.querySelector('picture');
  if (star2Picture) {
    const star2Img = star2Picture.querySelector('img');
    const optimizedStar2Pic = createOptimizedPicture(star2Img.src, star2Img.alt, false, [{ width: '750' }]);
    const newStar2Img = optimizedStar2Pic.querySelector('img');
    newStar2Img.classList.add('star-2');
    moveInstrumentation(decorStar2Row, optimizedStar2Pic);
    heroDescription.append(optimizedStar2Pic);
  }

  const headline = document.createElement('h1');
  moveInstrumentation(headlineRow, headline);
  headline.innerHTML = headlineRow?.textContent.trim() || '';
  heroDescription.append(headline);

  const subheadline = document.createElement('p');
  moveInstrumentation(subheadlineRow, subheadline);
  subheadline.textContent = subheadlineRow?.textContent.trim() || '';
  heroDescription.append(subheadline);

  const ctaLink = document.createElement('a');
  const foundCtaLink = ctaLinkRow?.querySelector('a');
  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href; // Correctly read href from the anchor tag
  }
  ctaLink.classList.add('btn', 'btn-primary', 'shadow');
  ctaLink.textContent = ctaLabelRow?.textContent.trim() || '';
  moveInstrumentation(ctaLinkRow, ctaLink);
  heroDescription.append(ctaLink);

  const heroImageDiv = document.createElement('div');
  heroImageDiv.classList.add('hero-image', 'col-lg-6', 'col-12');

  const heroPicture = heroImageRow?.querySelector('picture');
  if (heroPicture) {
    const heroImg = heroPicture.querySelector('img');
    const optimizedHeroPic = createOptimizedPicture(heroImg.src, heroImg.alt, false, [{ width: '750' }]);
    const newHeroImg = optimizedHeroPic.querySelector('img');
    newHeroImg.classList.add('img-fluid');
    moveInstrumentation(heroImageRow, optimizedHeroPic);
    heroImageDiv.append(optimizedHeroPic);
  }

  row.append(heroDescription, heroImageDiv);
  container.append(row);
  block.replaceChildren(container);
}
