import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqItemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  if (headingRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    moveInstrumentation(headingRow, sectionHeader);

    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos', 'fade-up');
    heading.textContent = headingRow.children[0]?.textContent.trim() || '';
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');

  const ul = document.createElement('ul');
  faqItemRows
    .filter((row) => row.children.length === 2)
    .forEach((row, index) => {
      const [questionCell, answerCell] = [...row.children];

      const li = document.createElement('li');
      li.classList.add('aos-init', 'aos-animate');
      li.setAttribute('data-aos', 'fade-up');
      if (index === 0) {
        li.classList.add('active');
      }
      moveInstrumentation(row, li);

      const h2 = document.createElement('h2');
      h2.setAttribute('data-once', 'faqsAccordion');
      h2.textContent = questionCell?.textContent.trim() || '';
      li.append(h2);

      const accoContentDiv = document.createElement('div');
      accoContentDiv.classList.add('acco-content-div');
      if (index === 0) {
        accoContentDiv.classList.add('show');
      }
      accoContentDiv.innerHTML = answerCell?.innerHTML || '';
      li.append(accoContentDiv);

      h2.addEventListener('click', () => {
        const currentlyActive = ul.querySelector('li.active');
        if (currentlyActive && currentlyActive !== li) {
          currentlyActive.classList.remove('active');
          currentlyActive.querySelector('.acco-content-div').classList.remove('show');
        }
        li.classList.toggle('active');
        accoContentDiv.classList.toggle('show');
      });

      ul.append(li);
    });

  accoDiv.append(ul);
  container.append(accoDiv);

  block.replaceChildren(section);

  // Image optimization (if any images were present in richtext, though not expected for this block)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
