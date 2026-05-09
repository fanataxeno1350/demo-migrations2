import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    starImage1Row,
    starImage2Row,
    headlineRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
    heroImageRow,
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('hero-section');
  // moveInstrumentation(block, section); // Instrumentation should be moved from individual rows to their new elements, not the block itself to the section.

  const container = document.createElement('div');
  container.classList.add('container');

  const row = document.createElement('div');
  row.classList.add('row', 'align-items-center');

  const heroDescription = document.createElement('div');
  heroDescription.classList.add('hero-description', 'col-lg-6', 'col-12');

  // Star Decor Image 1
  const star1 = document.createElement('img');
  const star1Picture = starImage1Row.querySelector('picture');
  if (star1Picture) {
    const star1Img = star1Picture.querySelector('img');
    star1.src = star1Img.src;
    star1.alt = star1Img.alt;
    star1.classList.add('star-1');
    moveInstrumentation(starImage1Row, star1); // Move instrumentation from the row to the new img element
    heroDescription.append(star1);
  }

  // Star Decor Image 2
  const star2 = document.createElement('img');
  const star2Picture = starImage2Row.querySelector('picture');
  if (star2Picture) {
    const star2Img = star2Picture.querySelector('img');
    star2.src = star2Img.src;
    star2.alt = star2Img.alt;
    star2.classList.add('star-2');
    moveInstrumentation(starImage2Row, star2); // Move instrumentation from the row to the new img element
    heroDescription.append(star2);
  }

  // Headline
  const h1 = document.createElement('h1');
  if (headlineRow) {
    moveInstrumentation(headlineRow, h1);
    // Headline is type=text, but original HTML shows <span> inside <h1>.
    // To preserve potential HTML (like <span>), use innerHTML from the cell's content.
    h1.innerHTML = headlineRow.children[0]?.innerHTML || '';
  }
  heroDescription.append(h1);

  // Description
  const p = document.createElement('p');
  if (descriptionRow) {
    moveInstrumentation(descriptionRow, p);
    // Description is type=richtext, so use innerHTML from the cell's content.
    p.innerHTML = descriptionRow.children[0]?.innerHTML || '';
  }
  heroDescription.append(p);

  // CTA Link and Label
  const ctaLink = document.createElement('a');
  const ctaAnchor = ctaLinkRow.querySelector('a');
  if (ctaAnchor) {
    ctaLink.href = ctaAnchor.href;
  }
  if (ctaLabelRow) {
    // ctaLabel is type=text, so textContent is appropriate for the label.
    ctaLink.textContent = ctaLabelRow.textContent.trim();
  }
  ctaLink.classList.add('btn', 'btn-primary', 'shadow');
  moveInstrumentation(ctaLinkRow, ctaLink); // Move instrumentation from the CTA link row to the new anchor
  heroDescription.append(ctaLink);

  row.append(heroDescription);

  const heroImageDiv = document.createElement('div');
  heroImageDiv.classList.add('hero-image', 'col-lg-6', 'col-12');

  // Hero Main Image
  const heroPicture = heroImageRow.querySelector('picture');
  if (heroPicture) {
    const heroImg = heroPicture.querySelector('img');
    const optimizedHeroPic = createOptimizedPicture(heroImg.src, heroImg.alt, false, [{ width: '750' }]);
    // moveInstrumentation should be called on the *original* row and the *new* element that replaces it.
    // The optimizedHeroPic is a <picture> element, so instrumentation should be moved to it.
    moveInstrumentation(heroImageRow, optimizedHeroPic);
    optimizedHeroPic.querySelector('img').classList.add('img-fluid'); // Apply img-fluid to the img inside picture
    heroImageDiv.append(optimizedHeroPic);
  }
  row.append(heroImageDiv);

  container.append(row);
  section.append(container);

  block.replaceChildren(section);
}
