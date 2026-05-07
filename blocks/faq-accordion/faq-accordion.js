import { moveInstrumentation, createOptimizedPicture } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('faqs-section'); // Removed 'section' as outer block already has it

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // First row is the heading
  const [headingRow, ...faqItems] = children; // Destructuring for headingRow and remaining faqItems
  if (headingRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    moveInstrumentation(headingRow, sectionHeader);

    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular');
    heading.textContent = headingRow.textContent.trim();
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  // Remaining rows are faq items
  if (faqItems.length > 0) {
    const accoDiv = document.createElement('div');
    accoDiv.classList.add('acco-div');
    container.append(accoDiv);

    const ul = document.createElement('ul');
    accoDiv.append(ul);

    faqItems.forEach((row) => { // Removed index as it's not used
      const [questionCell, answerCell] = [...row.children];

      const li = document.createElement('li');
      moveInstrumentation(row, li);

      const question = document.createElement('h2');
      question.textContent = questionCell?.textContent.trim() || '';
      li.append(question);

      const answerContentDiv = document.createElement('div');
      answerContentDiv.classList.add('acco-content-div');
      answerContentDiv.innerHTML = answerCell?.innerHTML || '';
      li.append(answerContentDiv);

      // Add accordion functionality
      question.addEventListener('click', () => {
        const isActive = li.classList.contains('active');
        // Close all other open accordions
        ul.querySelectorAll('li.active').forEach((activeLi) => {
          activeLi.classList.remove('active');
          activeLi.querySelector('.acco-content-div').classList.remove('show');
        });

        if (!isActive) {
          li.classList.add('active');
          answerContentDiv.classList.add('show');
        }
      });

      ul.append(li);
    });
  }

  block.replaceChildren(section);

  // Image optimization (if any images are present in the rich text)
  // The block model does not define any image fields, so this code is likely unnecessary
  // and could lead to issues if images are not expected or handled correctly within rich text.
  // Keeping it commented out for now.
  /*
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  */
}
