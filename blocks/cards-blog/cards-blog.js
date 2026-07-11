import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // The block structure is:
  // block.children[0]: exploreAllLabelRow
  // block.children[1]: exploreAllLinkRow
  // block.children[2...N]: cardItemRows
  // The 'cards' container is implicit and not a separate row.
  const [exploreAllLabelRow, exploreAllLinkRow, ...cardItemRows] = children;

  const root = document.createElement('div');
  // The block itself already has the 'cards-blog' class from AEM.
  // The original HTML shows the inner root div having class 'cards'.
  root.classList.add('cards');

  const blogDetails = document.createElement('div');
  blogDetails.classList.add('cmp-card--blog-details', 'cmp-card--default');

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('cmp-card__container');

  // No specific row for cardContainer, so move instrumentation from the block itself if needed,
  // or from the first card item row if it's meant to represent the container.
  // For now, no moveInstrumentation for cardContainer as it's a structural wrapper.

  cardItemRows
    .filter((row) => row.children.length === 5) // Ensure it's a blog-card-item row
    .forEach((row) => {
      // Fixed schema for blog-card-item, use destructuring
      const [imageDesktopCell, imageMobileCell, dateAndTypeCell, headlineCell, linkCell] = [
        ...row.children,
      ];

      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      }
      anchor.setAttribute('target', '_blank'); // From original HTML

      const cardContent = document.createElement('div');
      cardContent.classList.add('cmp-card__content');
      cardContent.setAttribute('tabindex', '0');

      const cardMedia = document.createElement('div');
      cardMedia.classList.add('cmp-card__media', 'youtube-url-wrapper');

      const pictureDesktop = imageDesktopCell.querySelector('picture');
      const pictureMobile = imageMobileCell.querySelector('picture');

      if (pictureDesktop) {
        const imgDesktop = pictureDesktop.querySelector('img');
        const imgMobile = pictureMobile?.querySelector('img'); // Ensure imgMobile exists

        if (imgDesktop) {
          if (imgMobile) {
            const sourceMobile = document.createElement('source');
            sourceMobile.media = '(max-width:767px)';
            // createOptimizedPicture returns a <picture> element, we need its source's srcset
            sourceMobile.srcset = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '360' }]).querySelector('img').src;
            cardMedia.append(sourceMobile);
          }

          const optimizedPic = createOptimizedPicture(
            imgDesktop.src,
            imgDesktop.alt,
            false,
            [{ width: '750' }],
          );
          moveInstrumentation(imgDesktop, optimizedPic.querySelector('img'));
          cardMedia.append(optimizedPic);
        }
      }

      const cardInfo = document.createElement('div');
      cardInfo.classList.add('cmp-card__info');

      const cardTitle = document.createElement('div');
      cardTitle.classList.add('cmp-card__title');
      const dateAndType = document.createElement('p');
      dateAndType.classList.add('body-2');
      dateAndType.textContent = dateAndTypeCell.textContent.trim();
      cardTitle.append(dateAndType);

      const cardDescription = document.createElement('div');
      cardDescription.classList.add('cmp-card__description');
      const headline = document.createElement('h4');
      headline.textContent = headlineCell.textContent.trim();
      cardDescription.append(headline);

      cardInfo.append(cardTitle, cardDescription);
      cardContent.append(cardMedia, cardInfo);
      anchor.append(cardContent);

      moveInstrumentation(row, anchor);
      cardContainer.append(anchor);
    });

  blogDetails.append(cardContainer);
  root.append(blogDetails);

  const exploreMoreDiv = document.createElement('div');
  exploreMoreDiv.classList.add('exploremore', 'button', 'cmp-button--secondary');

  const exploreAllLink = document.createElement('a');
  exploreAllLink.classList.add('cmp-button');
  const foundExploreLink = exploreAllLinkRow.querySelector('a');
  if (foundExploreLink) {
    exploreAllLink.href = foundExploreLink.href;
  }

  const exploreAllSpan = document.createElement('span');
  exploreAllSpan.classList.add('cmp-button__text');
  exploreAllSpan.textContent = exploreAllLabelRow.textContent.trim();
  exploreAllLink.append(exploreAllSpan);

  moveInstrumentation(exploreAllLabelRow, exploreAllSpan); // Instrumentation for the label
  moveInstrumentation(exploreAllLinkRow, exploreAllLink); // Instrumentation for the link row

  exploreMoreDiv.append(exploreAllLink);
  root.append(exploreMoreDiv);

  block.replaceChildren(root);
}
