import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Filter out empty rows to prevent errors
  const nonEmptyChildren = children.filter(
    (row) =>
      row.children.length > 0 &&
      [...row.children].some(
        (c) => c.children.length > 0 || c.textContent.trim() !== '',
      ),
  );

  const [headingRow, ...faqRows] = nonEmptyChildren;

  // The outer block div already has the 'faq-accordion' class from AEM.
  // The 'section' element should not add 'section' or 'faqs-section' again.
  // It should only add classes from ORIGINAL HTML that are on the <section> tag itself.
  // In this case, the original HTML has <section class="section faqs-section">,
  // so the inner wrapper should carry these.
  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section'); // These are correct as they are on the <section> in ORIGINAL HTML

  const container = document.createElement('div');
  container.classList.add('container');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  heading.setAttribute('data-aos', 'fade-up');

  sectionHeader.append(heading);
  container.append(sectionHeader);

  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');

  const ul = document.createElement('ul');

  faqRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children]; // Correct: named destructuring for fixed schema

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up');
    if (index === 0) {
      li.classList.add('active');
    }

    const questionH2 = document.createElement('h2');
    questionH2.setAttribute('data-once', 'faqsAccordion');
    questionH2.textContent = questionCell.textContent.trim();
    moveInstrumentation(questionCell, questionH2);

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show');
    }
    // Richtext content is directly inside the cell div, no extra wrapper
    // Correctly using innerHTML for richtext cell
    accoContentDiv.innerHTML = answerCell?.innerHTML || '';
    moveInstrumentation(answerCell, accoContentDiv);

    questionH2.addEventListener('click', () => {
      const parentLi = questionH2.closest('li');
      const contentDiv = parentLi.querySelector('.acco-content-div');

      const isActive = parentLi.classList.contains('active');

      // Close all other active accordions
      ul.querySelectorAll('li.active').forEach((activeLi) => {
        if (activeLi !== parentLi) {
          activeLi.classList.remove('active');
          activeLi.querySelector('.acco-content-div').classList.remove('show');
        }
      });

      // Toggle current accordion
      parentLi.classList.toggle('active', !isActive);
      contentDiv.classList.toggle('show', !isActive);
    });

    li.append(questionH2, accoContentDiv);
    ul.append(li);
  });

  accoDiv.append(ul);
  container.append(accoDiv);
  section.append(container);

  block.replaceChildren(section);

  // Optimize images if any are present (though not expected in this specific block)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '750' }],
    );
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
