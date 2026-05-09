import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Remove the block's own class from the block element as it's already on the outer div
  block.classList.remove('hero-header');

  const [
    backgroundImageDesktopRow,
    backgroundImageLargeRow,
    backgroundImageTabletRow,
    backgroundImageMobileRow,
    creditRow,
    headlineRow,
    headlineLinkRow,
    summaryRow,
  ] = [...block.children];

  const header = document.createElement('header');
  header.classList.add(
    'theme-dark',
    'theme-bg',
    'theme-section-spacing',
    'first:pt-0!',
  );
  header.setAttribute('aria-labelledby', 'hero-headline');

  const figure = document.createElement('figure');
  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add(
    'w-full',
    'h-[clamp(300px,65svh,500px)]',
    'md:h-[clamp(420px,68svh,660px)]',
    'lg:h-[clamp(420px,70svh,768px)]',
    'xl:h-[clamp(420px,70svh,1020px)]',
  );

  const picture = document.createElement('picture');
  const imgDesktop = backgroundImageDesktopRow.querySelector('picture img');
  const imgLarge = backgroundImageLargeRow.querySelector('picture img');
  const imgTablet = backgroundImageTabletRow.querySelector('picture img');
  const imgMobile = backgroundImageMobileRow.querySelector('picture img');

  if (imgLarge) {
    const sourceLarge = document.createElement('source');
    sourceLarge.srcset = createOptimizedPicture(imgLarge.src, imgLarge.alt, false, [{ width: '2560' }]).querySelector('img').src;
    sourceLarge.media = '(min-width:1921px)';
    sourceLarge.type = 'image/webp';
    picture.append(sourceLarge);
  }

  if (imgDesktop) {
    const sourceDesktop = document.createElement('source');
    sourceDesktop.srcset = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '1920' }]).querySelector('img').src;
    sourceDesktop.media = '(min-width:1440px)';
    sourceDesktop.type = 'image/webp';
    picture.append(sourceDesktop);
  }

  if (imgTablet) {
    const sourceTablet = document.createElement('source');
    sourceTablet.srcset = createOptimizedPicture(imgTablet.src, imgTablet.alt, false, [{ width: '1440' }]).querySelector('img').src;
    sourceTablet.media = '(min-width:1024px)';
    sourceTablet.type = 'image/webp';
    picture.append(sourceTablet);
  }

  if (imgMobile) {
    const sourceMobile = document.createElement('source');
    sourceMobile.srcset = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '768' }]).querySelector('img').src;
    sourceMobile.media = '(min-width:768px)';
    sourceMobile.type = 'image/webp';
    picture.append(sourceMobile);

    const img = document.createElement('img');
    img.src = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '375' }]).querySelector('img').src;
    img.srcset = `${createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '375' }]).querySelector('img').src} 1x, ${createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '768' }]).querySelector('img').src} 2x`;
    img.alt = imgMobile.alt;
    img.setAttribute('fetchpriority', 'high');
    img.setAttribute('loading', 'eager');
    img.classList.add('z-1', 'w-full', 'h-full', 'object-cover');
    picture.append(img);
  }

  imageWrapper.append(picture);
  figure.append(imageWrapper);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'z-3');

  const gridDiv = document.createElement('div');
  gridDiv.classList.add(
    'grid',
    'grid-cols-4',
    'sm:grid-cols-2',
    'sm:gap-grid-gutter',
  );

  const creditWrapper = document.createElement('div');
  creditWrapper.classList.add(
    'mt-2xs',
    'flex',
    'flex-col',
    'justify-start',
    'max-lg:mb-lg',
    'lg:pb-5',
    'lg:items-end',
    'col-span-3',
    'sm:col-span-1',
    'lg:col-start-2',
  );

  const creditParagraph = document.createElement('p');
  moveInstrumentation(creditRow, creditParagraph);
  creditParagraph.classList.add(
    'z-1',
    'relative',
    'text-caption-size',
    'theme-dark:text-foreground-colored-muted',
    'text-foreground-muted',
  );
  creditParagraph.setAttribute('data-testid', 'hero-credit');
  creditParagraph.textContent = creditRow.children[0]?.textContent.trim() || ''; // Access content from the cell
  creditWrapper.append(creditParagraph);
  gridDiv.append(creditWrapper);
  containerDiv.append(gridDiv);
  figure.append(containerDiv);
  header.append(figure);

  const contentContainer = document.createElement('div');
  contentContainer.classList.add('container');

  const contentGrid = document.createElement('div');
  contentGrid.classList.add('grid-cols-4', 'md:grid-cols-14', 'grid-full');

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add(
    'col-span-4',
    'md:col-span-12',
    'xl:col-span-11',
    'space-y-xs',
  );

  const headlineAnchor = document.createElement('a');
  moveInstrumentation(headlineLinkRow, headlineAnchor);
  // headlineLink is type=aem-content, so its cell contains the <a> tag directly.
  // We need to get the href from the cell's child <a>, not the row's textContent.
  headlineAnchor.href = headlineLinkRow.children[0]?.querySelector('a')?.href || '#';
  headlineAnchor.id = 'hero-headline';
  headlineAnchor.setAttribute('data-testid', 'hero-headline');
  headlineAnchor.classList.add(
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
    'transition-underline',
  );
  headlineAnchor.textContent = headlineRow.children[0]?.textContent.trim() || ''; // Headline is type=text
  contentWrapper.append(headlineAnchor);

  const summaryDiv = document.createElement('div');
  moveInstrumentation(summaryRow, summaryDiv);
  summaryDiv.setAttribute('data-testid', 'hero-link-summary');
  summaryDiv.classList.add(
    'text-p1',
    'md:col-span-12',
    'xl:col-span-11',
    'text-pretty',
    'prose',
    'theme-dark:prose-td',
    'theme-medium:prose-tm',
  );
  // Summary is type=richtext, so we need the innerHTML of the cell.
  // The row itself contains a div wrapper around the richtext content.
  summaryDiv.innerHTML = summaryRow.children[0]?.innerHTML || '';
  contentWrapper.append(summaryDiv);

  contentGrid.append(contentWrapper);
  contentContainer.append(contentGrid);
  header.append(contentContainer);

  block.replaceChildren(header);
}
