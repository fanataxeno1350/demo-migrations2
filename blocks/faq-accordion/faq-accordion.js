import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');
  // moveInstrumentation(block, section); // Instrumentation should be moved to the root element that replaces 'block'

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Section Heading
  const [headingRow, ...faqItemRows] = children; // Destructuring to get headingRow and remaining faqItemRows
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.children[0]?.textContent.trim() || ''; // Access content from the cell
  sectionHeader.append(heading);
  container.append(sectionHeader);

  // FAQs Container
  const faqsWrapper = document.createElement('div');
  faqsWrapper.classList.add('acco-div');
  container.append(faqsWrapper);

  const ul = document.createElement('ul');
  faqsWrapper.append(ul);

  // FAQ Items
  faqItemRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    if (index === 0) {
      li.classList.add('active'); // First item is active by default in original HTML
    }
    moveInstrumentation(row, li);

    const question = document.createElement('h2');
    question.textContent = questionCell.textContent.trim();
    li.append(question);

    const answer = document.createElement('div');
    answer.classList.add('acco-content-div');
    if (index === 0) {
      answer.classList.add('show');
    }
    answer.innerHTML = answerCell.innerHTML; // richtext content
    li.append(answer);

    ul.append(li);

    question.addEventListener('click', () => {
      const isActive = li.classList.contains('active');
      // Close all other open accordions
      ul.querySelectorAll('li.active').forEach((activeLi) => {
        activeLi.classList.remove('active');
        activeLi.querySelector('.acco-content-div').classList.remove('show');
      });

      // Toggle current accordion
      if (!isActive) {
        li.classList.add('active');
        answer.classList.add('show');
      }
    });
  });

  block.replaceChildren(section); // Instrumentation moved here

  // Optimize images
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
