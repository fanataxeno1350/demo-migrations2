import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  // The first row is the container placeholder, consume it.
  const containerPlaceholder = allRows.shift();

  const section = document.createElement('section');
  section.classList.add('theme-dark', 'text-foreground', 'theme-bg', 'theme-section-spacing');
  section.setAttribute('data-testid', 'featured-grid-section');
  moveInstrumentation(containerPlaceholder, section); // Move instrumentation from the placeholder

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  section.append(containerDiv);

  const gridFull = document.createElement('div');
  gridFull.classList.add('grid-full', 'gap-8', 'lg:gap-grid-gutter');
  containerDiv.append(gridFull);

  const gridCentered = document.createElement('div');
  gridCentered.classList.add('grid-centered-12');
  gridFull.append(gridCentered);

  const featuredGrid = document.createElement('div');
  featuredGrid.classList.add('grid', 'gap-8', 'lg:gap-grid-gutter', 'featured-grid', 'sm:featured-grid-sm', 'md:featured-grid-md', 'lg:featured-grid-lg');
  featuredGrid.style.setProperty('--sm', '2');
  featuredGrid.style.setProperty('--md', '3');
  featuredGrid.style.setProperty('--lg', '3');
  gridCentered.append(featuredGrid);

  allRows
    .filter((row) => row.children.length === 6) // Filter for actual item rows
    .forEach((row) => {
      const [imageCell, captionCell, eyebrowCell, titleCell, subheadingCell, linkCell] = [...row.children];

      const cardLink = document.createElement('a');
      cardLink.classList.add('grid', 'grid-rows-subgrid', 'row-span-3', 'gap-0', 'group/card', 'no-underline', 'cursor-pointer', 'theme-focus-outline', 'max-w-[650px]');
      moveInstrumentation(row, cardLink);

      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        cardLink.href = foundLink.href;
        cardLink.setAttribute('aria-label', titleCell.textContent.trim());
        cardLink.setAttribute('aria-description', subheadingCell.textContent.trim());
      }

      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add('row-start-1', 'w-full');
      cardLink.append(imageWrapper);

      const imageContainer = document.createElement('div');
      imageContainer.classList.add('rounded-sm', 'relative', 'overflow-hidden', 'bg-surface-muted', 'aspect-[4/3]');
      imageContainer.setAttribute('data-testid', 'card');
      imageWrapper.append(imageContainer);

      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
          optimizedPic.querySelector('img').classList.add('rounded-sm', 'w-full', 'object-cover', 'motion-safe:group-hover/card:scale-105', 'transition-transform', 'duration-400', 'aspect-[4/3]');
          optimizedPic.querySelector('img').setAttribute('height', '300');
          optimizedPic.querySelector('img').setAttribute('width', '400');
          imageContainer.append(optimizedPic);
        }
      }

      const captionWrapper = document.createElement('div');
      captionWrapper.classList.add('row-start-2', 'w-full');
      cardLink.append(captionWrapper);

      const captionDiv = document.createElement('div');
      captionDiv.classList.add('mt-2xs', 'mt-1!');
      captionWrapper.append(captionDiv);

      const captionP = document.createElement('p');
      captionP.classList.add('z-1', 'relative', 'text-caption-size', 'theme-dark:text-foreground-colored-muted', 'text-foreground-muted');
      captionP.textContent = captionCell.textContent.trim();
      captionDiv.append(captionP);

      const contentWrapper = document.createElement('div');
      contentWrapper.classList.add('w-full', 'mt-2.5', 'row-start-3');
      cardLink.append(contentWrapper);

      const eyebrowP = document.createElement('p');
      eyebrowP.classList.add('text-p2', 'font-bold', 'pb-3xs', 'theme-dark:text-foreground-td', 'theme-medium:text-foreground-tm');
      eyebrowP.setAttribute('data-testid', 'featured-item-eyebrow');
      eyebrowP.textContent = eyebrowCell.textContent.trim();
      contentWrapper.append(eyebrowP);

      const titleH3 = document.createElement('h3');
      titleH3.classList.add('text-card-title-size', 'font-stretch-normal', 'font-semibold', 'inline');
      titleH3.setAttribute('data-testid', 'card-link-title');
      contentWrapper.append(titleH3);

      const titleSpan = document.createElement('span');
      titleSpan.classList.add('link-arrow', 'group-hover/card:after:motion-safe:ml-link-arrow-hover-offset', 'inline', 'link', 'text-foreground', 'theme-dark:text-foreground-td', 'theme-medium:text-foreground-tm', 'no-underline', 'hover:text-foreground', 'focus-visible:outline-focus-color', 'group-hover/card:text-foreground', 'group-hover/card:underline', 'group-hover/card:underline-offset-4', 'group-hover/card:decoration-inherit', 'group-hover/card:decoration-[3px]', 'transition-[text-decoration]');
      titleSpan.textContent = titleCell.textContent.trim();
      titleH3.append(titleSpan);

      const subheadingP = document.createElement('p');
      subheadingP.classList.add('text-p1', 'pt-1', 'text-foreground', 'theme-dark:text-foreground-td', 'theme-medium:text-foreground-tm');
      subheadingP.setAttribute('data-testid', 'featured-item-subheading');
      subheadingP.textContent = subheadingCell.textContent.trim();
      contentWrapper.append(subheadingP);

      featuredGrid.append(cardLink);
    });

  block.replaceChildren(section);
}
