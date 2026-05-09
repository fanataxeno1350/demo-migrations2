import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    imageRow,
    imageCreditRow,
    headlineRow,
    bodyRow,
    ctaLinkRow,
    ctaLabelRow,
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('theme-dark', 'theme-bg', 'theme-section-spacing'); // Block name 'section-support' is not added here

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const gridFull = document.createElement('div');
  gridFull.classList.add('grid-full', 'gap-8', 'lg:gap-grid-gutter');
  container.append(gridFull);

  const gridCentered = document.createElement('div');
  gridCentered.classList.add('grid-centered-12');
  gridFull.append(gridCentered);

  const contentWrapper = document.createElement('div');
  gridCentered.append(contentWrapper);

  const grid = document.createElement('div');
  grid.classList.add(
    'grid',
    'md:grid-cols-12',
    'md:gap-x-grid-gutter',
    'justify-center',
    'items-center',
  );
  contentWrapper.append(grid);

  // Image Section
  const imageSection = document.createElement('div');
  imageSection.classList.add(
    'relative',
    'lg:z-10',
    'order-2',
    'w-full',
    'md:col-start-6',
    'md:col-span-7',
    'min-w-0',
    'md:row-start-1',
    'md:row-end-1',
  );
  grid.append(imageSection);

  const aspectDiv = document.createElement('div');
  aspectDiv.classList.add('aspect-4/3', 'max-w-[640px]', 'w-full', 'mx-auto');
  imageSection.append(aspectDiv);

  const picture = imageRow?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(
        img.src,
        img.alt,
        false,
        [{ width: '640' }],
      );
      optimizedPic.querySelector('img').classList.add(
        'rounded-t-sm',
        'md:rounded-sm',
        'overflow-hidden',
        'w-full',
        'h-auto',
      );
      moveInstrumentation(imageRow, optimizedPic.querySelector('img'));
      aspectDiv.append(optimizedPic);
    }
  }

  // Image Credit
  const imageCreditDiv = document.createElement('div');
  imageCreditDiv.classList.add(
    'mb-2xs',
    'text-end',
    'md:col-start-6',
    'md:col-span-7',
    'md:mb-0',
    'md:mt-2xs',
  );
  grid.append(imageCreditDiv);

  const creditTextWrapper = document.createElement('div');
  creditTextWrapper.classList.add('mt-2xs', 'mt-0!');
  imageCreditDiv.append(creditTextWrapper);

  const creditParagraph = document.createElement('p');
  creditParagraph.classList.add(
    'text-caption-size',
    'z-1',
    'relative',
    'theme-dark:text-foreground-colored-muted',
    'text-foreground-muted',
  );
  if (imageCreditRow) {
    moveInstrumentation(imageCreditRow, creditParagraph);
    creditParagraph.textContent = imageCreditRow.textContent.trim();
  }
  creditTextWrapper.append(creditParagraph);

  // Content Card
  const contentCard = document.createElement('div');
  contentCard.classList.add(
    'order-3',
    'bg-card-surface',
    'theme-dark:bg-card-surface-td',
    'theme-medium:bg-card-surface-tm',
    'rounded-b-sm',
    'relative',
    'md:z-20',
    'flex',
    'flex-col',
    'justify-between',
    'p-6',
    'xl:p-lg',
    'order-2',
    'md:order-1',
    'md:col-span-6',
    'md:col-start-1',
    'md:row-start-1',
    'md:row-end-1',
  );
  grid.append(contentCard);

  const contentDiv = document.createElement('div');
  contentCard.append(contentDiv);

  const headline = document.createElement('h3');
  headline.classList.add(
    'text-h4',
    'text-24',
    'lg:text-32',
    'font-stretch-normal',
    'font-heading',
    'font-bold',
    'mb-2xs',
    'text-foreground',
    'theme-dark:text-foreground-tm',
    'theme-medium:text-foreground-td',
  );
  if (headlineRow) {
    moveInstrumentation(headlineRow, headline);
    headline.textContent = headlineRow.textContent.trim();
  }
  contentDiv.append(headline);

  const bodyDiv = document.createElement('div');
  bodyDiv.classList.add(
    'prose',
    'theme-dark:prose-tm',
    'theme-medium:prose-td',
    'text-p1',
    'max-sm:prose-p:text-16!',
    'mb-md',
    '*:mt-0',
  );
  if (bodyRow) {
    moveInstrumentation(bodyRow, bodyDiv);
    // bodyRow is a row, its innerHTML is "<div><p>content</p></div>".
    // We need the content of the cell (bodyRow.children[0]), not the row itself.
    // Also, since it's richtext, we should use innerHTML directly from the cell.
    bodyDiv.innerHTML = bodyRow.children[0]?.innerHTML || '';
  }
  contentDiv.append(bodyDiv);

  // CTA Link
  const ctaLink = document.createElement('a');
  ctaLink.classList.add(
    'w-full',
    'md:w-fit',
    'button',
    'button--dark',
    'theme-medium:button--light',
  );
  const foundLink = ctaLinkRow?.querySelector('a');
  if (foundLink) {
    ctaLink.href = foundLink.href;
  }
  if (ctaLabelRow) {
    moveInstrumentation(ctaLabelRow, ctaLink);
    ctaLink.textContent = ctaLabelRow.textContent.trim();
  }
  // moveInstrumentation for ctaLinkRow should be here, after the link is fully constructed
  moveInstrumentation(ctaLinkRow, ctaLink);
  contentCard.append(ctaLink);

  block.replaceChildren(section);
}
