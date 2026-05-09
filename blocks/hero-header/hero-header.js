import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageDesktopRow,
    backgroundImageLargeRow,
    backgroundImageMediumRow,
    backgroundImageSmallRow,
    imageCreditRow,
    headlineRow,
    headlineLinkRow,
    summaryRow,
  ] = [...block.children];

  const header = document.createElement('header');
  header.classList.add(
    'theme-dark',
    'theme-bg',
    'theme-section-spacing',
    'first:pt-0!'
  );
  header.setAttribute('aria-labelledby', 'hero-headline');

  // Figure element for background images and credit
  const figure = document.createElement('figure');

  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add(
    'w-full',
    'h-[clamp(300px,65svh,500px)]',
    'md:h-[clamp(420px,68svh,660px)]',
    'lg:h-[clamp(420px,70svh,768px)]',
    'xl:h-[clamp(420px,70svh,1020px)]'
  );

  const picture = document.createElement('picture');
  const desktopImg = backgroundImageDesktopRow?.querySelector('picture img');
  const largeImg = backgroundImageLargeRow?.querySelector('picture img');
  const mediumImg = backgroundImageMediumRow?.querySelector('picture img');
  const smallImg = backgroundImageSmallRow?.querySelector('picture img');

  if (desktopImg) {
    const source = document.createElement('source');
    source.setAttribute('srcset', desktopImg.src);
    source.setAttribute('media', '(min-width:1921px)');
    source.setAttribute('type', 'image/webp');
    picture.append(source);
  }
  if (largeImg) {
    const source = document.createElement('source');
    source.setAttribute('srcset', largeImg.src);
    source.setAttribute('media', '(min-width:1440px)');
    source.setAttribute('type', 'image/webp');
    picture.append(source);
  }
  if (mediumImg) {
    const source = document.createElement('source');
    source.setAttribute('srcset', mediumImg.src);
    source.setAttribute('media', '(min-width:1024px)');
    source.setAttribute('type', 'image/webp');
    picture.append(source);
  }
  if (smallImg) {
    const source = document.createElement('source');
    source.setAttribute('srcset', smallImg.src);
    source.setAttribute('media', '(min-width:768px)');
    source.setAttribute('type', 'image/webp');
    picture.append(source);

    const img = document.createElement('img');
    img.src = smallImg.src;
    img.setAttribute('srcset', `${smallImg.src} 1x, ${mediumImg?.src || smallImg.src} 2x`);
    img.alt = smallImg.alt;
    img.setAttribute('fetchpriority', 'high');
    img.setAttribute('loading', 'eager');
    img.classList.add('z-1', 'w-full', 'h-full', 'object-cover');
    picture.append(img);
  }

  imageWrapper.append(picture);
  figure.append(imageWrapper);

  // Image Credit
  const creditContainer = document.createElement('div');
  creditContainer.classList.add('container', 'z-3');
  const creditGrid = document.createElement('div');
  creditGrid.classList.add(
    'grid',
    'grid-cols-4',
    'sm:grid-cols-2',
    'sm:gap-grid-gutter'
  );
  const creditInnerDiv = document.createElement('div');
  creditInnerDiv.classList.add(
    'mt-2xs',
    'flex',
    'flex-col',
    'justify-start',
    'max-lg:mb-lg',
    'lg:pb-5',
    'lg:items-end',
    'col-span-3',
    'sm:col-span-1',
    'lg:col-start-2'
  );
  const creditParagraph = document.createElement('p');
  creditParagraph.classList.add(
    'z-1',
    'relative',
    'text-caption-size',
    'theme-dark:text-foreground-colored-muted',
    'text-foreground-muted'
  );
  creditParagraph.setAttribute('data-testid', 'hero-credit');
  moveInstrumentation(imageCreditRow, creditParagraph);
  creditParagraph.textContent = imageCreditRow?.textContent.trim() || '';
  creditInnerDiv.append(creditParagraph);
  creditGrid.append(creditInnerDiv);
  creditContainer.append(creditGrid);
  figure.append(creditContainer);
  header.append(figure);

  // Headline and Summary
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('container');
  const contentGrid = document.createElement('div');
  contentGrid.classList.add(
    'grid-cols-4',
    'md:grid-cols-14',
    'grid-full'
  );
  const contentInnerDiv = document.createElement('div');
  contentInnerDiv.classList.add(
    'col-span-4',
    'md:col-span-12',
    'xl:col-span-11',
    'space-y-xs'
  );

  const headlineLink = document.createElement('a');
  headlineLink.id = 'hero-headline';
  headlineLink.setAttribute('data-testid', 'hero-headline');
  headlineLink.classList.add(
    'text-h4',
    'link-arrow',
    'col-span-4',
    'md:col-span-12',
    'xl:col-span-11',
    'text-foreground',
    'theme-dark:text-foreground-td',
    'hover:underline',
    'hocus:underline-offset-4',
    'hocus:decoration-[3px]',
    'hover:cursor-pointer',
    'theme-focus-outline',
    'transition-underline'
  );
  const foundHeadlineLink = headlineLinkRow?.querySelector('a');
  if (foundHeadlineLink) {
    headlineLink.href = foundHeadlineLink.href;
  }
  moveInstrumentation(headlineLinkRow, headlineLink);
  headlineLink.textContent = headlineRow?.textContent.trim() || '';
  contentInnerDiv.append(headlineLink);

  const summaryDiv = document.createElement('div');
  summaryDiv.setAttribute('data-testid', 'hero-link-summary');
  summaryDiv.classList.add(
    'text-p1',
    'md:col-span-12',
    'xl:col-span-11',
    'text-pretty',
    'prose',
    'theme-dark:prose-td',
    'theme-medium:prose-tm'
  );
  moveInstrumentation(summaryRow, summaryDiv);
  // FIX: summary is richtext, so read innerHTML directly from the cell
  summaryDiv.innerHTML = summaryRow?.innerHTML || '';
  contentInnerDiv.append(summaryDiv);

  contentGrid.append(contentInnerDiv);
  contentContainer.append(contentGrid);
  header.append(contentContainer);

  block.replaceChildren(header);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
