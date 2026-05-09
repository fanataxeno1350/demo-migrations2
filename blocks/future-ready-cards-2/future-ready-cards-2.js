import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  // The block already has 'future-ready-cards-2' from AEM.
  // Original HTML shows 'section grey-bg spirit-of-rise' as the outer wrapper.
  // The generated JS creates an inner <section> with 'section grey-bg spirit-of-rise'.
  // This is a double application of 'section' class. Removing the redundant 'section' class.
  section.classList.add('grey-bg', 'spirit-of-rise'); // Removed 'section' class

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // Add data-aos attributes from original HTML
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  // Add data-aos attributes from original HTML
  subheading.setAttribute('data-aos', 'fade-up');
  subheading.setAttribute('data-aos-offset', '100');
  subheading.setAttribute('data-aos-duration', '650');
  subheading.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(subheadingRow, subheading);
  subheading.textContent = subheadingRow.textContent.trim();
  sectionHeader.append(subheading);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows
    .filter(row =>
      row.children.length > 0 &&
      [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== '')
    )
    .forEach((row) => {
      const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

      const linkEl = document.createElement('a');
      linkEl.classList.add('performace-driven-cards-link');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        linkEl.href = foundLink.href;
        linkEl.target = '_blank'; // From original HTML
      }
      moveInstrumentation(row, linkEl);

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('performace-driven-card-wrapper');

      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');

      const pictureMobile = imageMobileCell?.querySelector('picture');
      const pictureDesktop = imageDesktopCell?.querySelector('picture');

      if (pictureDesktop || pictureMobile) {
        const sourceMobile = pictureMobile ? pictureMobile.querySelector('source') : null;
        const imgDesktop = pictureDesktop ? pictureDesktop.querySelector('img') : null;

        const picture = document.createElement('picture');
        if (sourceMobile) {
          const newSource = document.createElement('source');
          newSource.media = '(max-width: 576px)';
          newSource.srcset = sourceMobile.srcset;
          picture.append(newSource);
        }

        if (imgDesktop) {
          // createOptimizedPicture handles creating the img element and setting srcset/sizes.
          // We need to pass the original img's alt text.
          const optimizedPicture = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
          // The createOptimizedPicture returns a <picture> element.
          // We need to append its children (source and img) to our new picture element.
          while (optimizedPicture.firstChild) {
            picture.append(optimizedPicture.firstChild);
          }
          // moveInstrumentation should be called on the original imgDesktop element and the new img element
          // that is now inside 'picture'. Since createOptimizedPicture creates a new img,
          // we need to find that new img to apply instrumentation.
          const newImg = picture.querySelector('img');
          if (newImg) {
            moveInstrumentation(imgDesktop, newImg);
          }
        }
        cardImage.append(picture);
      }
      cardWrapper.append(cardImage);

      const homeBoxCard = document.createElement('div');
      homeBoxCard.classList.add('performace-driven-home-box-card');

      const description = document.createElement('p');
      description.classList.add('desc');
      description.innerHTML = descriptionCell?.innerHTML || ''; // Use innerHTML for rich text content if any
      homeBoxCard.append(description);

      cardWrapper.append(homeBoxCard);
      linkEl.append(cardWrapper);
      cardsWrapper.append(linkEl);
    });

  container.append(cardsWrapper);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);
}
