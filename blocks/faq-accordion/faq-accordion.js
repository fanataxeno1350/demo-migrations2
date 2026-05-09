import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [sectionHeaderRow] = children; // Fixed: Use destructuring for fixed schema root rows
  const faqItemRows = children.slice(1); // All subsequent rows are FAQ items

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(sectionHeaderRow, heading);
  // Fixed: Access the first cell of the sectionHeaderRow using destructuring or direct access after destructuring
  const [headingCell] = [...sectionHeaderRow.children];
  heading.textContent = headingCell?.textContent.trim() || '';
  heading.setAttribute('data-aos', 'fade-up');
  sectionHeader.append(heading);
  container.append(sectionHeader);

  // Accordion Div
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');

  const ul = document.createElement('ul');

  faqItemRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children]; // Correct: Destructuring for fixed schema item rows

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up');

    // Make the first item active by default, matching original HTML
    if (index === 0) {
      li.classList.add('active');
    }

    const h2 = document.createElement('h2');
    moveInstrumentation(questionCell, h2);
    h2.textContent = questionCell?.textContent.trim() || '';
    h2.setAttribute('data-once', 'faqsAccordion');

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    moveInstrumentation(answerCell, accoContentDiv);
    accoContentDiv.innerHTML = answerCell?.innerHTML || '';

    // Make the first item's content visible by default, matching original HTML
    if (index === 0) {
      accoContentDiv.classList.add('show');
    }

    h2.addEventListener('click', () => {
      const isActive = li.classList.contains('active');
      // Close all other open accordions
      ul.querySelectorAll('li.active').forEach((activeLi) => {
        activeLi.classList.remove('active');
        activeLi.querySelector('.acco-content-div').classList.remove('show');
      });

      // Toggle current accordion
      if (!isActive) {
        li.classList.add('active');
        accoContentDiv.classList.add('show');
      }
    });

    li.append(h2, accoContentDiv);
    ul.append(li);
  });

  accoDiv.append(ul);
  container.append(accoDiv);
  section.append(container);

  block.replaceChildren(section);

  // Removed: Image optimization is not needed as per block structure and original HTML
  // block.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });
}
