import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0.5: The block already has 'blog-section' class from AEM.
  // Do not add it to an inner wrapper.
  const section = document.createElement('section');
  // section.classList.add('blog-section'); // Removed - outer block div already has this class

  const [sectionTitleRow, ...blogCardRows] = [...block.children]; // CHECK 0: Fixed direct children[0] access

  // Section Title
  const sectionTitle = document.createElement('h2');
  moveInstrumentation(sectionTitleRow, sectionTitle);
  // CHECK 0: sectionTitleRow.children[0] is now handled by destructuring
  const [titleCell] = [...sectionTitleRow.children];
  sectionTitle.textContent = titleCell?.textContent.trim() || '';
  section.append(sectionTitle);

  const container = document.createElement('div');
  container.classList.add('container', 'mt-6');

  const row = document.createElement('div');
  row.classList.add('row', 'justify-content-around');

  blogCardRows.forEach((blogCardRow) => {
    // CHECK 0: Array destructuring is correct for fixed schema rows
    const [
      imageCell,
      imageLinkCell,
      categoryCell,
      categoryLinkCell,
      titleCell,
      titleLinkCell,
      descriptionCell,
      dateCell,
      readMoreLinkCell,
      readMoreLabelCell,
    ] = [...blogCardRow.children];

    const blogCard = document.createElement('div');
    blogCard.classList.add('blog-card', 'col-lg-4', 'col-md-6', 'col-12');
    moveInstrumentation(blogCardRow, blogCard);

    // Image and Image Link
    const imageLink = document.createElement('a');
    const foundImageLink = imageLinkCell?.querySelector('a');
    if (foundImageLink) {
      imageLink.href = foundImageLink.href;
      // CHECK 1.5: moveInstrumentation for aem-content links
      moveInstrumentation(foundImageLink, imageLink);
    } else {
      imageLink.href = '#';
    }

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // createOptimizedPicture returns a <picture> element, not an <img>
        // moveInstrumentation should be called on the original img, and the new picture's img
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img')); // Corrected instrumentation target
        imageLink.append(optimizedPic);
      }
    }
    blogCard.append(imageLink);

    // Categories
    const categoriesDiv = document.createElement('div');
    categoriesDiv.classList.add('categories', 'align-items-center', 'gap-3', 'flex-wrap');

    const categoryLink = document.createElement('a');
    const foundCategoryLink = categoryLinkCell?.querySelector('a');
    if (foundCategoryLink) {
      categoryLink.href = foundCategoryLink.href;
      // CHECK 1.5: moveInstrumentation for aem-content links
      moveInstrumentation(foundCategoryLink, categoryLink);
    } else {
      categoryLink.href = '#';
    }
    // CHECK 1.5: categoryCell is type=text, read textContent.trim()
    categoryLink.textContent = categoryCell?.textContent.trim() || '';
    categoriesDiv.append(categoryLink);
    blogCard.append(categoriesDiv);

    // Title and Title Link, Description
    const titleLink = document.createElement('a');
    const foundTitleLink = titleLinkCell?.querySelector('a');
    if (foundTitleLink) {
      titleLink.href = foundTitleLink.href;
      // CHECK 1.5: moveInstrumentation for aem-content links
      moveInstrumentation(foundTitleLink, titleLink);
    } else {
      titleLink.href = '#';
    }

    const title = document.createElement('h5');
    // CHECK 1.5: titleCell is type=text, read textContent.trim()
    title.textContent = titleCell?.textContent.trim() || '';
    titleLink.append(title);

    const description = document.createElement('p');
    // CHECK 1.5: descriptionCell is type=text, read textContent.trim()
    description.textContent = descriptionCell?.textContent.trim() || '';
    titleLink.append(description);
    blogCard.append(titleLink);

    // Date and Read More Link
    const dateReadDiv = document.createElement('div');
    dateReadDiv.classList.add('d-flex', 'date-read', 'justify-content-between', 'align-items-center');

    const time = document.createElement('time');
    // CHECK 1.5: dateCell is type=text, read textContent.trim()
    time.setAttribute('datetime', dateCell?.textContent.trim() || '');
    time.textContent = dateCell?.textContent.trim() || '';
    dateReadDiv.append(time);

    const readMoreLink = document.createElement('a');
    readMoreLink.classList.add('btn', 'btn-primary');
    const foundReadMoreLink = readMoreLinkCell?.querySelector('a');
    if (foundReadMoreLink) {
      readMoreLink.href = foundReadMoreLink.href;
      // CHECK 1.5: moveInstrumentation for aem-content links
      moveInstrumentation(foundReadMoreLink, readMoreLink);
    } else {
      readMoreLink.href = '#';
    }
    // CHECK 1.5: readMoreLabelCell is type=text, read textContent.trim()
    readMoreLink.textContent = readMoreLabelCell?.textContent.trim() || '';
    dateReadDiv.append(readMoreLink);
    blogCard.append(dateReadDiv);

    row.append(blogCard);
  });

  container.append(row);
  section.append(container);

  block.replaceChildren(section);
}
