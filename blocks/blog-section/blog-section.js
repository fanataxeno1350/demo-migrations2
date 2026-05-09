import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  // section.classList.add('blog-section'); // Removed: The outer block div already has this class.

  const [sectionTitleRow, containerRow, ...blogCardRows] = children;

  // Section Title
  if (sectionTitleRow) {
    const h2 = document.createElement('h2');
    moveInstrumentation(sectionTitleRow, h2);
    h2.textContent = sectionTitleRow.textContent.trim();
    section.append(h2);
  }

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'mt-6');
  moveInstrumentation(containerRow, containerDiv); // Move instrumentation from the container placeholder row

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'justify-content-around');

  blogCardRows
    .filter((row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''))
    .forEach((row) => {
      const [
        imageCell,
        imageLinkCell,
        categoryLinkCell,
        categoryLabelCell,
        titleLinkCell,
        titleCell,
        excerptCell,
        dateCell,
        readMoreLinkCell,
        readMoreLabelCell,
      ] = [...row.children];

      const blogCard = document.createElement('div');
      blogCard.classList.add('blog-card', 'col-lg-4', 'col-md-6', 'col-12');
      moveInstrumentation(row, blogCard);

      // Image with Link
      const imageLink = document.createElement('a');
      const foundImageLink = imageLinkCell?.querySelector('a');
      if (foundImageLink) {
        imageLink.href = foundImageLink.href;
      }
      const picture = imageCell?.querySelector('picture');
      if (picture) {
        // Use createOptimizedPicture directly on the picture element
        const optimizedPic = createOptimizedPicture(picture.querySelector('img').src, picture.querySelector('img').alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid');
        imageLink.append(optimizedPic);
      }
      blogCard.append(imageLink);

      // Categories
      const categoriesDiv = document.createElement('div');
      categoriesDiv.classList.add('categories', 'align-items-center', 'gap-3', 'flex-wrap');
      const categoryLink = document.createElement('a');
      const foundCategoryLink = categoryLinkCell?.querySelector('a');
      if (foundCategoryLink) {
        categoryLink.href = foundCategoryLink.href;
      }
      if (categoryLabelCell) {
        categoryLink.textContent = categoryLabelCell.textContent.trim();
      }
      categoriesDiv.append(categoryLink);
      blogCard.append(categoriesDiv);

      // Title and Excerpt with Link
      const titleAndExcerptLink = document.createElement('a');
      const foundTitleLink = titleLinkCell?.querySelector('a');
      if (foundTitleLink) {
        titleAndExcerptLink.href = foundTitleLink.href;
      }

      const h5 = document.createElement('h5');
      if (titleCell) {
        h5.textContent = titleCell.textContent.trim();
      }
      titleAndExcerptLink.append(h5);

      const p = document.createElement('p');
      if (excerptCell) {
        p.innerHTML = excerptCell.innerHTML;
      }
      titleAndExcerptLink.append(p);
      blogCard.append(titleAndExcerptLink);

      // Date and Read More
      const dateReadDiv = document.createElement('div');
      dateReadDiv.classList.add('d-flex', 'date-read', 'justify-content-between', 'align-items-center');

      const time = document.createElement('time');
      if (dateCell) {
        const dateText = dateCell.textContent.trim();
        time.setAttribute('datetime', dateText);
        time.textContent = dateText;
      }
      dateReadDiv.append(time);

      const readMoreLink = document.createElement('a');
      readMoreLink.classList.add('btn', 'btn-primary');
      const foundReadMoreLink = readMoreLinkCell?.querySelector('a');
      if (foundReadMoreLink) {
        readMoreLink.href = foundReadMoreLink.href;
      }
      if (readMoreLabelCell) {
        readMoreLink.textContent = readMoreLabelCell.textContent.trim();
      }
      dateReadDiv.append(readMoreLink);
      blogCard.append(dateReadDiv);

      rowDiv.append(blogCard);
    });

  containerDiv.append(rowDiv);
  section.append(containerDiv);

  block.replaceChildren(section);
}
