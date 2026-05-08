import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    decorStar1Row,
    decorStar2Row,
    headlineRow,
    headlineSpanRow,
    descriptionRow,
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

  // Decor Star 1
  const decorStar1Picture = decorStar1Row?.querySelector('picture');
  if (decorStar1Picture) {
    const decorStar1Img = decorStar1Picture.querySelector('img');
    const star1 = createOptimizedPicture(decorStar1Img.src, decorStar1Img.alt, false, [{ width: '750' }]);
    moveInstrumentation(decorStar1Picture, star1.querySelector('img'));
    star1.querySelector('img').classList.add('star-1');
    heroDescription.append(star1);
  }

  // Decor Star 2
  const decorStar2Picture = decorStar2Row?.querySelector('picture');
  if (decorStar2Picture) {
    const decorStar2Img = decorStar2Picture.querySelector('img');
    const star2 = createOptimizedPicture(decorStar2Img.src, decorStar2Img.alt, false, [{ width: '750' }]);
    moveInstrumentation(decorStar2Picture, star2.querySelector('img'));
    star2.querySelector('img').classList.add('star-2');
    heroDescription.append(star2);
  }

  // Headline
  const h1 = document.createElement('h1');
  h1.textContent = headlineRow?.textContent.trim() || '';

  // Headline Span
  const span = document.createElement('span');
  span.textContent = headlineSpanRow?.textContent.trim() || '';
  h1.append(span);
  heroDescription.append(h1);

  // Description
  const p = document.createElement('p');
  p.textContent = descriptionRow?.textContent.trim() || '';
  heroDescription.append(p);

  // CTA Link
  const ctaLink = document.createElement('a');
  const foundCtaLink = ctaLinkRow?.querySelector('a');
  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href;
  }
  ctaLink.textContent = ctaLabelRow?.textContent.trim() || '';
  ctaLink.classList.add('btn', 'btn-primary', 'shadow');
  moveInstrumentation(ctaLinkRow, ctaLink);
  heroDescription.append(ctaLink);

  row.append(heroDescription);

  // Hero Main Image
  const heroImageDiv = document.createElement('div');
  heroImageDiv.classList.add('hero-image', 'col-lg-6', 'col-12');
  const heroPicture = heroImageRow?.querySelector('picture');
  if (heroPicture) {
    const heroImg = heroPicture.querySelector('img');
    const optimizedHeroPic = createOptimizedPicture(heroImg.src, heroImg.alt, true, [{ width: '750' }]);
    moveInstrumentation(heroPicture, optimizedHeroPic.querySelector('img'));
    optimizedHeroPic.querySelector('img').classList.add('img-fluid');
    heroImageDiv.append(optimizedHeroPic);
  }
  row.append(heroImageDiv);

  container.append(row);
  block.replaceChildren(container);
}
