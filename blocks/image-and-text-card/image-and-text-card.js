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

  const root = document.createElement('div');
  root.classList.add(
    'grid',
    'md:grid-cols-12',
    'md:gap-x-grid-gutter',
    'justify-center',
    'items-center',
  );

  // Image section
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

  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('aspect-4/3', 'max-w-[640px]', 'w-full', 'mx-auto');

  const picture = imageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '640' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.querySelector('img').classList.add(
        'rounded-t-sm',
        'md:rounded-sm',
        'overflow-hidden',
        'w-full',
        'h-auto',
      );
      imageWrapper.append(optimizedPic);
    }
  }
  moveInstrumentation(imageRow, imageWrapper);
  imageSection.append(imageWrapper);
  root.append(imageSection);

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

  const imageCreditInnerDiv = document.createElement('div');
  imageCreditInnerDiv.classList.add('mt-2xs', 'mt-0!');

  const imageCreditP = document.createElement('p');
  imageCreditP.classList.add(
    'text-caption-size',
    'z-1',
    'relative',
    'text-caption-size',
    'theme-dark:text-foreground-colored-muted',
    'text-foreground-muted',
  );
  imageCreditP.textContent = imageCreditRow.textContent.trim();
  moveInstrumentation(imageCreditRow, imageCreditP);
  imageCreditInnerDiv.append(imageCreditP);
  imageCreditDiv.append(imageCreditInnerDiv);
  root.append(imageCreditDiv);

  // Text content section
  const textContentSection = document.createElement('div');
  textContentSection.classList.add(
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
    'md:rounded-sm',
    'order-2',
    'md:order-1',
    'md:col-span-6',
    'md:col-start-1',
    'md:row-start-1',
    'md:row-end-1',
  );

  const textContentWrapper = document.createElement('div');

  // Headline
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
    'theme-dark:text-foreground', // Corrected from theme-dark:text-foreground-tm
    'theme-medium:text-foreground', // Corrected from theme-medium:text-foreground-td
  );
  headline.textContent = headlineRow.textContent.trim();
  moveInstrumentation(headlineRow, headline);
  textContentWrapper.append(headline);

  // Body
  const body = document.createElement('div');
  body.classList.add(
    'prose',
    'theme-dark:prose-tm',
    'theme-medium:prose-td',
    'text-p1',
    'max-sm:prose-p:text-16!',
    'mb-md',
    '*:mt-0',
  );
  body.innerHTML = bodyRow.children[0]?.innerHTML || '';
  moveInstrumentation(bodyRow, body);
  textContentWrapper.append(body);

  textContentSection.append(textContentWrapper);

  // CTA Link
  const ctaLink = document.createElement('a');
  const foundLink = ctaLinkRow.querySelector('a');
  if (foundLink) {
    ctaLink.href = foundLink.href;
  }
  ctaLink.textContent = ctaLabelRow.textContent.trim();
  ctaLink.classList.add(
    'w-full',
    'md:w-fit',
    'button',
    'button--dark',
    'theme-medium:button--light',
  );
  moveInstrumentation(ctaLinkRow, ctaLink);
  moveInstrumentation(ctaLabelRow, ctaLink);
  textContentSection.append(ctaLink);

  root.append(textContentSection);

  block.replaceChildren(root);
}
