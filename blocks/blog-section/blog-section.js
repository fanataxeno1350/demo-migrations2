import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [sectionTitleRow, ...blogCardRows] = [...block.children];

  const section = document.createElement('section');
  // The outer block div already has 'blog-section' from AEM.
  // No need to add it again to the inner wrapper 'section'.

  // Section Title
  const sectionTitle = document.createElement('h2');
  moveInstrumentation(sectionTitleRow, sectionTitle);
  // Access the cell via destructuring or querySelector for robustness
  const [titleCell] = [...sectionTitleRow.children];
  sectionTitle.textContent = titleCell?.textContent.trim() || '';
  section.append(sectionTitle);

  // Blog Cards Container
  const container = document.createElement('div');
  container.classList.add('container', 'mt-6');
  const row = document.createElement('div');
  row.classList.add('row', 'justify-content-around');

  blogCardRows.forEach((blogCardRow) => {
    // Destructuring for fixed schema item rows is correct
    const [
      imageCell,
      imageLinkCell,
      categoryLinkCell,
      categoryLabelCell,
      blogLinkCell,
      blogTitleCell,
      blogDescriptionCell,
      publishDateCell,
      readMoreLinkCell,
      readMoreLabelCell,
    ] = [...blogCardRow.children];

    const blogCard = document.createElement('div');
    blogCard.classList.add('blog-card', 'col-lg-4', 'col-md-6', 'col-12');
    moveInstrumentation(blogCardRow, blogCard);

    // Image Link and Image
    const imageLink = document.createElement('a');
    const originalImageLink = imageLinkCell?.querySelector('a');
    if (originalImageLink) {
      imageLink.href = originalImageLink.href;
    }

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid');
        imageLink.append(optimizedPic);
      }
    }
    blogCard.append(imageLink);

    // Categories
    const categoriesDiv = document.createElement('div');
    categoriesDiv.classList.add('categories', 'align-items-center', 'gap-3', 'flex-wrap');

    const categoryLink = document.createElement('a');
    const originalCategoryLink = categoryLinkCell?.querySelector('a');
    if (originalCategoryLink) {
      categoryLink.href = originalCategoryLink.href;
    }
    categoryLink.textContent = categoryLabelCell?.textContent.trim() || '';
    categoriesDiv.append(categoryLink);
    blogCard.append(categoriesDiv);

    // Blog Title and Description Link
    const blogContentLink = document.createElement('a');
    const originalBlogLink = blogLinkCell?.querySelector('a');
    if (originalBlogLink) {
      blogContentLink.href = originalBlogLink.href;
    }

    const blogTitle = document.createElement('h5');
    blogTitle.textContent = blogTitleCell?.textContent.trim() || '';
    blogContentLink.append(blogTitle);

    const blogDescription = document.createElement('p');
    blogDescription.textContent = blogDescriptionCell?.textContent.trim() || '';
    blogContentLink.append(blogDescription);
    blogCard.append(blogContentLink);

    // Date and Read More
    const dateReadDiv = document.createElement('div');
    dateReadDiv.classList.add('d-flex', 'date-read', 'justify-content-between', 'align-items-center');

    const publishDate = document.createElement('time');
    publishDate.setAttribute('datetime', publishDateCell?.textContent.trim() || '');
    publishDate.textContent = publishDateCell?.textContent.trim() || '';
    dateReadDiv.append(publishDate);

    const readMoreLink = document.createElement('a');
    readMoreLink.classList.add('btn', 'btn-primary');
    const originalReadMoreLink = readMoreLinkCell?.querySelector('a');
    if (originalReadMoreLink) {
      readMoreLink.href = originalReadMoreLink.href;
    }
    readMoreLink.textContent = readMoreLabelCell?.textContent.trim() || '';
    dateReadDiv.append(readMoreLink);
    blogCard.append(dateReadDiv);

    row.append(blogCard);
  });

  container.append(row);
  section.append(container);

  block.replaceChildren(section);
}
