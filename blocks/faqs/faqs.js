import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [sectionHeadingRow, ...faqItemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  if (sectionHeadingRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    moveInstrumentation(sectionHeadingRow, sectionHeader);

    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos', 'fade-up');
    heading.textContent = sectionHeadingRow.children[0]?.textContent.trim();
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  if (faqItemRows.length > 0) {
    const accoDiv = document.createElement('div');
    accoDiv.classList.add('acco-div');

    const ul = document.createElement('ul');
    accoDiv.append(ul);

    faqItemRows.forEach((row, index) => {
      const [questionCell, answerCell] = [...row.children];

      const li = document.createElement('li');
      li.classList.add('aos-init', 'aos-animate');
      li.setAttribute('data-aos', 'fade-up');
      if (index === 0) {
        li.classList.add('active'); // First item is active by default
      }
      moveInstrumentation(row, li);

      const questionHeading = document.createElement('h2');
      questionHeading.setAttribute('data-once', 'faqsAccordion');
      questionHeading.textContent = questionCell?.textContent.trim();
      li.append(questionHeading);

      const accoContentDiv = document.createElement('div');
      accoContentDiv.classList.add('acco-content-div');
      if (index === 0) {
        accoContentDiv.classList.add('show');
      }
      accoContentDiv.innerHTML = answerCell?.innerHTML;
      li.append(accoContentDiv);

      ul.append(li);

      questionHeading.addEventListener('click', () => {
        const isActive = li.classList.contains('active');

        // Close all other active items
        ul.querySelectorAll('li.active').forEach((activeLi) => {
          activeLi.classList.remove('active');
          activeLi.querySelector('.acco-content-div').classList.remove('show');
        });

        // Toggle current item
        if (!isActive) {
          li.classList.add('active');
          accoContentDiv.classList.add('show');
        }
      });
    });
    container.append(accoDiv);
  }

  block.replaceChildren(section);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
