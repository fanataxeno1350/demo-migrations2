import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRowElement, ...faqRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  if (headingRowElement) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    moveInstrumentation(headingRowElement, sectionHeader);

    // Destructure heading cell from headingRowElement
    const [headingCell] = [...headingRowElement.children];
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.textContent = headingCell?.textContent.trim();
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  if (faqRows.length > 0) {
    const accoDiv = document.createElement('div');
    accoDiv.classList.add('acco-div');
    container.append(accoDiv);

    const ul = document.createElement('ul');
    accoDiv.append(ul);

    faqRows.forEach((row, index) => {
      const [questionCell, answerCell] = [...row.children];

      const li = document.createElement('li');
      li.classList.add('aos-init', 'aos-animate');
      if (index === 0) {
        li.classList.add('active');
      }
      moveInstrumentation(row, li);

      const h2 = document.createElement('h2');
      h2.textContent = questionCell?.textContent.trim();
      h2.dataset.once = 'faqsAccordion';
      li.append(h2);

      const accoContentDiv = document.createElement('div');
      accoContentDiv.classList.add('acco-content-div');
      if (index === 0) {
        accoContentDiv.classList.add('show');
      }
      accoContentDiv.innerHTML = answerCell?.innerHTML;
      li.append(accoContentDiv);

      h2.addEventListener('click', () => {
        const isActive = li.classList.contains('active');
        // Close all other active items
        ul.querySelectorAll('li.active').forEach((activeLi) => {
          activeLi.classList.remove('active');
          activeLi.querySelector('.acco-content-div')?.classList.remove('show');
        });

        if (!isActive) {
          li.classList.add('active');
          accoContentDiv.classList.add('show');
        }
      });

      ul.append(li);
    });
  }

  block.replaceChildren(section);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
