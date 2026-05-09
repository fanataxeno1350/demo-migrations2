import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children].filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  const root = document.createElement('section');
  root.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');
  root.append(container);

  const [headingRow, ...faqItemRows] = children;

  if (headingRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    moveInstrumentation(headingRow, sectionHeader);

    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos', 'fade-up');
    // FIX: Replaced direct row.children[0] with destructuring for headingRow
    const [headingCell] = [...headingRow.children];
    heading.textContent = headingCell?.textContent.trim() || '';
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  if (faqItemRows.length > 0) {
    const accoDiv = document.createElement('div');
    accoDiv.classList.add('acco-div');
    container.append(accoDiv);

    const ul = document.createElement('ul');
    accoDiv.append(ul);

    faqItemRows.forEach((row, index) => {
      const [questionCell, answerCell] = [...row.children];

      const li = document.createElement('li');
      li.classList.add('aos-init', 'aos-animate');
      li.setAttribute('data-aos', 'fade-up');
      moveInstrumentation(row, li);

      if (index === 0) {
        li.classList.add('active');
      }

      const question = document.createElement('h2');
      question.setAttribute('data-once', 'faqsAccordion');
      question.textContent = questionCell?.textContent.trim() || '';
      li.append(question);

      const answerDiv = document.createElement('div');
      answerDiv.classList.add('acco-content-div');
      if (index === 0) {
        answerDiv.classList.add('show');
      }
      answerDiv.innerHTML = answerCell?.innerHTML || '';
      li.append(answerDiv);

      question.addEventListener('click', () => {
        const currentlyActive = ul.querySelector('li.active');
        if (currentlyActive && currentlyActive !== li) {
          currentlyActive.classList.remove('active');
          currentlyActive.querySelector('.acco-content-div')?.classList.remove('show');
        }
        li.classList.toggle('active');
        answerDiv.classList.toggle('show');
      });

      ul.append(li);
    });
  }

  block.replaceChildren(root);

  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
