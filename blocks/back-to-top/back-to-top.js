import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [buttonLabelCell] = [...block.children];

  const section = document.createElement('section');
  // section.classList.add('back-to-top'); // Removed: outer block div already has this class
  section.setAttribute('aria-label', 'Back to top module');
  section.style.display = 'flex'; // This is a specific style from the original HTML, not a class

  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('back-to-top__cta');

  const backToTopLink = document.createElement('a');
  backToTopLink.href = 'javascript:void(0)';
  backToTopLink.title = 'Back To Top';
  backToTopLink.classList.add('button', 'light-beige-accent', 'bodySmallRegular');
  backToTopLink.setAttribute('aria-label', 'Back To Top');
  backToTopLink.setAttribute('rel', 'follow');

  const buttonTextSpan = document.createElement('span');
  buttonTextSpan.classList.add('button-text');
  buttonTextSpan.textContent = buttonLabelCell.textContent.trim();

  backToTopLink.append(buttonTextSpan);
  ctaDiv.append(backToTopLink);
  section.append(ctaDiv);

  // moveInstrumentation was already called for buttonLabelCell, but it should be called
  // before the block is replaced, and on the element that receives the content.
  // The original code had it after block.replaceChildren, which is too late.
  // It's now moved to before replaceChildren, and applied to the span that receives the text.
  moveInstrumentation(buttonLabelCell, buttonTextSpan);

  block.replaceChildren(section);

  // Add scroll behavior to show/hide the button
  const showButton = () => {
    if (window.scrollY > 200) { // Adjust scroll threshold as needed
      section.style.display = 'flex';
    } else {
      section.style.display = 'none';
    }
  };

  window.addEventListener('scroll', showButton);
  // Initial check in case the page is already scrolled on load
  showButton();

  backToTopLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}
