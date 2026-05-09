import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // CHECK 0: Replaced direct children[0] access with destructuring
  const [sectionHeadingRow, ...faqItemsRows] = children;

  const root = document.createElement('section');
  root.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  root.append(container);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(sectionHeadingRow, sectionHeader);
  container.append(sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = sectionHeadingRow.children[0]?.textContent.trim() || ''; // Access content from the cell
  sectionHeader.append(heading);

  // Accordion Div
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  container.append(accoDiv);

  const ul = document.createElement('ul');
  accoDiv.append(ul);

  faqItemsRows
    .filter(row =>
      row.children.length > 0 &&
      [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== '')
    )
    .forEach((row, index) => {
      const [questionCell, answerCell] = [...row.children];

      const li = document.createElement('li');
      li.classList.add('aos-init', 'aos-animate');
      if (index === 0) {
        li.classList.add('active');
      }
      moveInstrumentation(row, li);
      ul.append(li);

      const questionHeading = document.createElement('h2');
      questionHeading.textContent = questionCell.textContent.trim();
      li.append(questionHeading);

      // CHECK 0.7 C: Declare accoContentDiv before it's used in the event listener
      const accoContentDiv = document.createElement('div');
      accoContentDiv.classList.add('acco-content-div');
      if (index === 0) {
        accoContentDiv.classList.add('show');
      }
      // CHECK 0.7 B: Use div as container for richtext, not p
      accoContentDiv.innerHTML = answerCell.innerHTML;
      li.append(accoContentDiv);

      questionHeading.addEventListener('click', () => {
        const isActive = li.classList.contains('active');
        // Close all other open accordions
        ul.querySelectorAll('li.active').forEach((activeLi) => {
          activeLi.classList.remove('active');
          // CHECK 2: Ensure correct variable is used for toggling
          activeLi.querySelector('.acco-content-div').classList.remove('show');
        });

        // Toggle current accordion
        if (!isActive) {
          li.classList.add('active');
          // CHECK 2: Ensure correct variable is used for toggling
          accoContentDiv.classList.add('show');
        }
      });
    });

  block.replaceChildren(root);

  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
