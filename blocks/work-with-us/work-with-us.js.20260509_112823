import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children].filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');
  moveInstrumentation(block, section); // Moved instrumentation here to apply to the new root section

  const headingRow = children[0];
  const itemRows = children.slice(1);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // FIX: headingRow is a row, its first child is the cell containing the text.
  // querySelector('div') on a cell that directly contains text will return null.
  heading.textContent = headingRow.children[0]?.textContent.trim() || '';
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Slides Container
  const positionRelative = document.createElement('div');
  positionRelative.classList.add('position-relative', 'aos-init', 'aos-animate');
  section.append(positionRelative);

  const container = document.createElement('div');
  container.classList.add('container');
  positionRelative.append(container);

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');
  container.append(gridLayout);

  itemRows.forEach((row) => {
    // FIXED: Destructuring is already correct for fixed-schema rows.
    const [imageDesktopCell, imageMobile576Cell, imageMobile799Cell, titleCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('slides');
    moveInstrumentation(row, slide);
    gridLayout.append(slide);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    slide.append(wrap);

    // Image
    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const pictureDesktop = imageDesktopCell?.querySelector('picture');
    const pictureMobile576 = imageMobile576Cell?.querySelector('picture');
    const pictureMobile799 = imageMobile799Cell?.querySelector('picture');

    if (pictureDesktop || pictureMobile576 || pictureMobile799) {
      const picture = document.createElement('picture');
      if (pictureMobile576) {
        const source576 = document.createElement('source');
        source576.media = '(max-width: 576px)';
        source576.srcset = pictureMobile576.querySelector('img')?.src || '';
        picture.append(source576);
      }
      if (pictureMobile799) {
        const source799 = document.createElement('source');
        source799.media = '(max-width: 799px)';
        source799.srcset = pictureMobile799.querySelector('img')?.src || '';
        picture.append(source799);
      }
      if (pictureDesktop) {
        const img = document.createElement('img');
        img.classList.add('img-fluid');
        img.src = pictureDesktop.querySelector('img')?.src || '';
        img.alt = pictureDesktop.querySelector('img')?.alt || '';
        img.title = pictureDesktop.querySelector('img')?.title || '';
        img.loading = 'lazy';
        picture.append(img);
      }
      imageWrap.append(picture);
      wrap.append(imageWrap);
    }

    // Content
    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');
    wrap.append(contentWrap);

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');
    contentWrap.append(contentSectionHeader);

    const title = document.createElement('h3');
    title.classList.add('heading', 'font-regular');
    title.textContent = titleCell?.textContent.trim() || '';
    contentSectionHeader.append(title);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    // FIX: descriptionCell is a richtext cell, its innerHTML is correct.
    // Assigning it to a <p> creates <p><p>...</p></p> which is invalid.
    // Use a <div> for richtext content unless a <p> is strictly required by CSS.
    // However, the original HTML uses <p> for the description, so we will extract the inner content.
    description.innerHTML = descriptionCell?.querySelector('p')?.innerHTML ?? descriptionCell?.textContent.trim() ?? '';
    contentSectionHeader.append(description);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    ctaLink.href = ctaLinkCell?.querySelector('a')?.href || '#';
    ctaLink.textContent = ctaLabelCell?.textContent.trim() || '';
    contentSectionHeader.append(ctaLink);
  });

  block.replaceChildren(section);

  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
