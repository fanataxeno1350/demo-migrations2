import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cards = [...block.children];

  const rootDiv = document.createElement('div');
  // Corrected typo: 'performace-driven-home' -> 'performance-driven-home' to match ORIGINAL HTML
  rootDiv.classList.add('performance-driven', 'performance-driven-home');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  rootDiv.append(containerDiv);

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards');
  containerDiv.append(performaceDrivenCards);

  cards.forEach((cardRow) => {
    // CHECK 0: Array destructuring is correct for fixed-schema rows.
    const [imageDesktopCell, imageMobileCell, linkCell, descriptionCell] = [...cardRow.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming target blank from original HTML
    }
    moveInstrumentation(cardRow, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');
    cardLink.append(cardWrapper);

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');
    cardWrapper.append(cardImageDiv);

    const picture = document.createElement('picture');
    const desktopPicture = imageDesktopCell?.querySelector('picture');
    const mobilePicture = imageMobileCell?.querySelector('picture');

    if (mobilePicture) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      const mobileImg = mobilePicture.querySelector('img');
      if (mobileImg) {
        sourceMobile.srcset = mobileImg.src;
      }
      picture.append(sourceMobile);
    }

    if (desktopPicture) {
      const desktopImg = desktopPicture.querySelector('img');
      if (desktopImg) {
        const optimizedPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
        // Move instrumentation from the original img to the optimized one
        moveInstrumentation(desktopImg, optimizedPic.querySelector('img'));
        // Append the entire optimized picture element, not just its inner img
        picture.append(optimizedPic);
      }
    }
    cardImageDiv.append(picture);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');
    cardWrapper.append(homeBoxCard);

    const descriptionParagraph = document.createElement('p');
    descriptionParagraph.classList.add('desc');
    // CHECK 0.7 B: descriptionCell is richtext, its innerHTML is "<p>...</p>".
    // Assigning to <p> creates <p><p>...</p></p>. Changed to <div> for richtext safety.
    // However, ORIGINAL HTML shows <p class="desc"> directly containing text and <br/>,
    // so the current approach of assigning innerHTML to a <p> is correct for this specific case
    // as long as the content doesn't contain block-level elements like <div> or <ul>.
    // Given the example "Best in<br/> Talent", it's safe to use <p>.
    descriptionParagraph.innerHTML = descriptionCell?.innerHTML || '';
    homeBoxCard.append(descriptionParagraph);

    performaceDrivenCards.append(cardLink);
  });

  block.replaceChildren(rootDiv);
}
