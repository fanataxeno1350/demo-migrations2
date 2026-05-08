import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // First row is the heading
  const [headingRow] = children; // Destructuring for the first row
  const [headingCell] = [...headingRow.children]; // Destructuring for the heading cell
  if (headingCell) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    moveInstrumentation(headingRow, sectionHeader);

    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos', 'fade-up');
    heading.textContent = headingCell.textContent.trim();
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  container.append(accoDiv);

  const ul = document.createElement('ul');
  accoDiv.append(ul);

  // Remaining rows are faq items
  const faqRows = children.slice(1);
  faqRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up');
    moveInstrumentation(row, li);

    const question = document.createElement('h2');
    question.setAttribute('data-once', 'faqsAccordion');
    question.textContent = questionCell.textContent.trim();
    li.append(question);

    const answerDiv = document.createElement('div');
    answerDiv.classList.add('acco-content-div');
    answerDiv.innerHTML = answerCell.innerHTML;
    li.append(answerDiv);

    // Add click listener for accordion behavior
    question.addEventListener('click', () => {
      const isActive = li.classList.contains('active');
      // Close all other active accordions
      ul.querySelectorAll('li.active').forEach((activeLi) => {
        activeLi.classList.remove('active');
        activeLi.querySelector('.acco-content-div').classList.remove('show');
      });

      // Toggle current accordion
      if (!isActive) {
        li.classList.add('active');
        answerDiv.classList.add('show');
      }
    });

    // Set first item as active by default if no other is active
    if (index === 0) {
      li.classList.add('active');
      answerDiv.classList.add('show');
    }

    ul.append(li);
  });

  block.replaceChildren(section);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
