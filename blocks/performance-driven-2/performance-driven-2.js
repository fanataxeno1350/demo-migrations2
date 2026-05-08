import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // block.children[0]: headingRow (text)
  // block.children[1]: subheadingRow (text)
  // block.children[2...N]: cardRows (performance-driven-card-item)
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // Add data-aos attributes from ORIGINAL HTML
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  // Add data-aos attributes from ORIGINAL HTML
  subheading.setAttribute('data-aos', 'fade-up');
  subheading.setAttribute('data-aos-offset', '100');
  subheading.setAttribute('data-aos-duration', '650');
  subheading.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(subheadingRow, subheading);
  subheading.textContent = subheadingRow.textContent.trim();
  sectionHeader.append(subheading);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    // For performance-driven-card-item, the schema is fixed:
    // cell[0]: imageDesktop (reference)
    // cell[1]: imageMobile (reference)
    // cell[2]: desc (text)
    // cell[3]: link (aem-content)
    const [imageDesktopCell, imageMobileCell, descCell, linkCell] = [...row.children];

    const link = document.createElement('a');
    link.classList.add('performace-driven-cards-link');
    if (linkCell) {
      link.href = linkCell.querySelector('a')?.href || '#';
      // Original HTML shows target="_blank"
      link.target = '_blank';
    }
    moveInstrumentation(row, link);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    if (imageDesktopCell && imageMobileCell) {
      const pictureDesktop = imageDesktopCell.querySelector('picture');
      const imgDesktop = pictureDesktop ? pictureDesktop.querySelector('img') : null;

      const pictureMobile = imageMobileCell.querySelector('picture');
      const imgMobile = pictureMobile ? pictureMobile.querySelector('img') : null;

      if (imgDesktop && imgMobile) {
        // createOptimizedPicture expects the default image src and alt,
        // and then an array of sources for different media queries.
        // The mobile source needs to be explicitly added to the sources array.
        const optimizedPic = createOptimizedPicture(
          imgDesktop.src,
          imgDesktop.alt,
          false, // eager loading
          [
            { media: '(max-width: 576px)', srcset: imgMobile.src, width: '576' }, // Mobile source
            { width: '780' } // Desktop source (default)
          ]
        );
        cardImage.append(optimizedPic);
      }
    }

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const desc = document.createElement('p');
    desc.classList.add('desc');
    if (descCell) {
      desc.innerHTML = descCell.innerHTML; // Use innerHTML for text cells that might contain <br/>
    }
    homeBoxCard.append(desc);

    cardWrapper.append(cardImage, homeBoxCard);
    link.append(cardWrapper);
    cardsWrapper.append(link);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);

  block.replaceChildren(sectionHeader, performanceDriven);
}
