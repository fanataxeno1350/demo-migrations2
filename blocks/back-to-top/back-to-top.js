import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [ctaLabelCell] = [...block.children];

  const backToTopCta = document.createElement('div');
  backToTopCta.classList.add('back-to-top__cta');
  moveInstrumentation(ctaLabelCell, backToTopCta);

  const ctaLink = document.createElement('a');
  ctaLink.href = 'javascript:void(0)';
  ctaLink.title = 'Back To Top';
  ctaLink.classList.add('button', 'light-beige-accent', 'bodySmallRegular');
  ctaLink.setAttribute('aria-label', 'Back To Top');
  ctaLink.setAttribute('rel', 'follow');

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('button-text');
  ctaSpan.textContent = ctaLabelCell.textContent.trim();
  ctaLink.append(ctaSpan);
  backToTopCta.append(ctaLink);

  // Add scroll event listener for back to top functionality
  ctaLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  block.replaceChildren(backToTopCta);
}
