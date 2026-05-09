import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [sectionHeaderRow, ...faqItemRows] = children; // Fixed: Destructuring for sectionHeaderRow

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Section Header
  if (sectionHeaderRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    moveInstrumentation(sectionHeaderRow, sectionHeader);

    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos', 'fade-up');
    // Fixed: Accessing the first cell of the sectionHeaderRow
    heading.textContent = sectionHeaderRow.children[0]?.textContent.trim() || '';
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  // FAQ Accordion
  if (faqItemRows.length > 0) {
    const accoDiv = document.createElement('div');
    accoDiv.classList.add('acco-div');

    const ul = document.createElement('ul');

    // Fixed: Removed redundant filter predicate as faqItemRows are already filtered by slice(1)
    // and the model guarantees content for faq-accordion-item rows.
    faqItemRows.forEach((row, index) => {
      const [questionCell, answerCell] = [...row.children]; // Correct: Destructuring for fixed schema

      const li = document.createElement('li');
      li.classList.add('aos-init', 'aos-animate');
      li.setAttribute('data-aos', 'fade-up');
      if (index === 0) {
        li.classList.add('active'); // First item is active by default
      }
      moveInstrumentation(row, li);

      const questionHeading = document.createElement('h2');
      questionHeading.setAttribute('data-once', 'faqsAccordion');
      questionHeading.textContent = questionCell?.textContent.trim() || '';
      li.append(questionHeading);

      const accoContentDiv = document.createElement('div');
      accoContentDiv.classList.add('acco-content-div');
      if (index === 0) {
        accoContentDiv.classList.add('show'); // First item content is shown
      }
      // Correct: answerCell is richtext, so innerHTML is appropriate
      accoContentDiv.innerHTML = answerCell?.innerHTML || '';
      li.append(accoContentDiv);

      questionHeading.addEventListener('click', () => {
        const currentActive = ul.querySelector('li.active');
        if (currentActive && currentActive !== li) {
          currentActive.classList.remove('active');
          currentActive.querySelector('.acco-content-div').classList.remove('show');
        }
        li.classList.toggle('active');
        accoContentDiv.classList.toggle('show');
      });

      ul.append(li);
    });
    accoDiv.append(ul);
    container.append(accoDiv);
  }

  block.replaceChildren(section);

  // Image optimization (if any images were present, though not in this block's model)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
