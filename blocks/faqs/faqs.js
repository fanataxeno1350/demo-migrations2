import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Heading
  const headingRow = children[0];
  if (headingRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');

    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate'); // Add aos classes as per original HTML
    heading.setAttribute('data-aos', 'fade-up'); // Add data-aos attribute
    
    // Fix: Use destructuring for heading cell
    const [headingCell] = [...headingRow.children];
    moveInstrumentation(headingCell, heading); // Move instrumentation from the cell, not the row
    heading.textContent = headingCell?.textContent.trim();
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  // FAQs List
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  const ul = document.createElement('ul');
  accoDiv.append(ul);

  children.slice(1).forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate'); // Add aos classes as per original HTML
    li.setAttribute('data-aos', 'fade-up'); // Add data-aos attribute

    const question = document.createElement('h2');
    question.setAttribute('data-once', 'faqsAccordion'); // Add data-once attribute
    moveInstrumentation(questionCell, question);
    question.textContent = questionCell.textContent.trim();
    li.append(question);

    const answerDiv = document.createElement('div');
    answerDiv.classList.add('acco-content-div');
    moveInstrumentation(answerCell, answerDiv);
    answerDiv.innerHTML = answerCell.innerHTML;
    li.append(answerDiv);

    // Set the first item as active and show its content
    if (index === 0) {
      li.classList.add('active');
      answerDiv.classList.add('show');
    }

    question.addEventListener('click', () => {
      const parentLi = question.closest('li');
      const contentDiv = parentLi.querySelector('.acco-content-div');

      // Toggle active state on the clicked item
      parentLi.classList.toggle('active');
      contentDiv.classList.toggle('show');

      // Close other active items
      ul.querySelectorAll('li.active').forEach((otherLi) => {
        if (otherLi !== parentLi) {
          otherLi.classList.remove('active');
          otherLi.querySelector('.acco-content-div').classList.remove('show');
        }
      });
    });

    ul.append(li);
  });

  container.append(accoDiv);

  block.replaceChildren(section);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
