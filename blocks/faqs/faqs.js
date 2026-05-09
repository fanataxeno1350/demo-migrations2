import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const [titleRow, containerRow, ...faqRows] = children;

  const section = document.createElement('section');
  // section.classList.add('faqs'); // REMOVED: Block's own class 'faqs' is already on the outer block div.
  moveInstrumentation(block, section);

  // Title
  if (titleRow) {
    const h2 = document.createElement('h2');
    moveInstrumentation(titleRow, h2);
    h2.textContent = titleRow.textContent.trim();
    section.append(h2);
  }

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'faq-accordion');
  // moveInstrumentation(containerRow, containerDiv); // This row is not directly rendered, its children are.
                                                    // Instrumentation should be moved from block to section,
                                                    // and then from individual faqRows to their respective items.

  const accordionDiv = document.createElement('div');
  accordionDiv.classList.add('accordion');
  accordionDiv.id = 'accordionExample';
  containerDiv.append(accordionDiv);

  faqRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children];

    const accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item', 'shadow');
    moveInstrumentation(row, accordionItem); // Move instrumentation from the faqRow to its accordion item

    const accordionHeader = document.createElement('h2');
    accordionHeader.classList.add('accordion-header');
    accordionHeader.id = `heading${index + 1}`;

    const button = document.createElement('button');
    button.classList.add('accordion-button', 'd-flex', 'align-items-center');
    button.type = 'button';
    button.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
    button.setAttribute('aria-controls', `collapse${index + 1}`);
    if (index !== 0) { // Add 'collapsed' class for non-first items
      button.classList.add('collapsed');
    }

    // Add event listener for collapse behavior
    button.addEventListener('click', () => {
      const targetCollapse = document.getElementById(`collapse${index + 1}`);
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        button.classList.add('collapsed');
        targetCollapse.classList.remove('show');
        button.setAttribute('aria-expanded', 'false');
      } else {
        // Close all other open accordions
        accordionDiv.querySelectorAll('.accordion-collapse.show').forEach((openCollapse) => {
          openCollapse.classList.remove('show');
          openCollapse.previousElementSibling.querySelector('.accordion-button').classList.add('collapsed');
          openCollapse.previousElementSibling.querySelector('.accordion-button').setAttribute('aria-expanded', 'false');
        });

        button.classList.remove('collapsed');
        targetCollapse.classList.add('show');
        button.setAttribute('aria-expanded', 'true');
      }
    });

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('fill', 'currentColor');
    svg.classList.add('bi', 'bi-question-circle');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.innerHTML = `
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
      <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"></path>
    `;
    button.append(svg);

    const p = document.createElement('p');
    p.classList.add('m-0', 'ms-3');
    moveInstrumentation(questionCell, p);
    p.textContent = questionCell.textContent.trim();
    button.append(p);

    accordionHeader.append(button);

    const collapseDiv = document.createElement('div');
    collapseDiv.id = `collapse${index + 1}`;
    collapseDiv.classList.add('accordion-collapse', 'collapse');
    if (index === 0) {
      collapseDiv.classList.add('show');
    }
    collapseDiv.setAttribute('aria-labelledby', `heading${index + 1}`);
    collapseDiv.setAttribute('data-bs-parent', '#accordionExample');

    const accordionBody = document.createElement('div');
    accordionBody.classList.add('accordion-body');
    moveInstrumentation(answerCell, accordionBody);
    accordionBody.innerHTML = answerCell.innerHTML;
    collapseDiv.append(accordionBody);

    accordionItem.append(accordionHeader, collapseDiv);
    accordionDiv.append(accordionItem);
  });

  section.append(containerDiv);
  block.replaceChildren(section);
}
