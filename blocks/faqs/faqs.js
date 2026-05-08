import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const root = document.createElement('section');
  // root.classList.add('faqs'); // Removed: block already has this class from AEM

  const titleRow = children.shift(); // First row is always the title
  if (titleRow) {
    const h2 = document.createElement('h2');
    moveInstrumentation(titleRow, h2);
    h2.textContent = titleRow.textContent.trim();
    root.append(h2);
  }

  const container = document.createElement('div');
  container.classList.add('container', 'faq-accordion');

  const accordion = document.createElement('div');
  accordion.classList.add('accordion');
  accordion.id = 'accordionExample';

  children.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children];

    const accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item', 'shadow');

    const headingId = `heading${index + 1}`;
    const collapseId = `collapse${index + 1}`;

    const h2 = document.createElement('h2');
    h2.classList.add('accordion-header');
    h2.id = headingId;

    const button = document.createElement('button');
    button.classList.add('accordion-button', 'd-flex', 'align-items-center');
    button.type = 'button';
    // Implement toggle behavior manually as data-bs-toggle is inert
    button.addEventListener('click', () => {
      const targetCollapse = document.getElementById(collapseId);
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !isExpanded);
      button.classList.toggle('collapsed', isExpanded);
      targetCollapse.classList.toggle('show', !isExpanded);
    });
    button.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
    button.setAttribute('aria-controls', collapseId);
    if (index !== 0) {
      button.classList.add('collapsed');
    }

    // SVG from ORIGINAL HTML, not hardcoded in template literal
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
    button.append(svg); // Append SVG element directly

    const p = document.createElement('p');
    p.classList.add('m-0', 'ms-3');
    p.textContent = questionCell.textContent.trim();
    button.append(p);

    h2.append(button);
    accordionItem.append(h2);

    const collapseDiv = document.createElement('div');
    collapseDiv.id = collapseId;
    collapseDiv.classList.add('accordion-collapse', 'collapse');
    if (index === 0) {
      collapseDiv.classList.add('show');
    }
    collapseDiv.setAttribute('aria-labelledby', headingId);
    collapseDiv.setAttribute('data-bs-parent', '#accordionExample');

    const accordionBody = document.createElement('div');
    accordionBody.classList.add('accordion-body');
    accordionBody.innerHTML = answerCell.innerHTML;
    collapseDiv.append(accordionBody);
    accordionItem.append(collapseDiv);

    moveInstrumentation(row, accordionItem);
    accordion.append(accordionItem);
  });

  container.append(accordion);
  root.append(container);

  block.replaceChildren(root);
}
