import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // CHECK 0: Replaced direct bracket access for sectionHeaderRow
  const [sectionHeaderRow, ...faqItemRows] = children;

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate'); // Added aos classes from ORIGINAL HTML
  heading.setAttribute('data-aos', 'fade-up'); // Added data-aos attribute from ORIGINAL HTML
  moveInstrumentation(sectionHeaderRow, heading);
  heading.textContent = sectionHeaderRow.children[0].textContent.trim(); // Access content from the cell, not the row
  sectionHeader.append(heading);
  container.append(sectionHeader);

  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');

  const ul = document.createElement('ul');

  faqItemRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up'); // Added data-aos attribute from ORIGINAL HTML
    if (index === 0) {
      li.classList.add('active');
    }

    const h2 = document.createElement('h2');
    h2.setAttribute('data-once', 'faqsAccordion'); // Added data-once attribute from ORIGINAL HTML
    moveInstrumentation(questionCell, h2);
    h2.textContent = questionCell.textContent.trim();
    h2.addEventListener('click', () => {
      const parentLi = h2.closest('li');
      const accoContentDiv = parentLi.querySelector('.acco-content-div');

      if (parentLi.classList.contains('active')) {
        parentLi.classList.remove('active');
        accoContentDiv.classList.remove('show');
      } else {
        // Close all other open accordions
        ul.querySelectorAll('li.active').forEach((activeLi) => {
          activeLi.classList.remove('active');
          activeLi.querySelector('.acco-content-div').classList.remove('show');
        });

        // Open current accordion
        parentLi.classList.add('active');
        accoContentDiv.classList.add('show');
      }
    });
    li.append(h2);

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show');
    }
    moveInstrumentation(answerCell, accoContentDiv);
    accoContentDiv.innerHTML = answerCell.innerHTML;
    li.append(accoContentDiv);

    ul.append(li);
  });

  accoDiv.append(ul);
  container.append(accoDiv);
  section.append(container);

  block.replaceChildren(section);
}
