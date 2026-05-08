import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [buttonLabelCell] = [...block.children];

  const backToTopSection = document.createElement('section');
  backToTopSection.classList.add('back-to-top');
  backToTopSection.setAttribute('aria-label', 'Back to top module');

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
  buttonTextSpan.textContent = buttonLabelCell?.textContent.trim();

  backToTopLink.append(buttonTextSpan);
  ctaDiv.append(backToTopLink);
  backToTopSection.append(ctaDiv);

  moveInstrumentation(buttonLabelCell, backToTopLink);

  backToTopLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  block.replaceChildren(backToTopSection);
}
