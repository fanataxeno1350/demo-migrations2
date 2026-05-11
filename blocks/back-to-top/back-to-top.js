import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [ctaLabelCell] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('back-to-top');
  section.setAttribute('aria-label', 'Back to top module');

  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add('back-to-top__cta');

  const ctaLink = document.createElement('a');
  ctaLink.href = 'javascript:void(0)';
  ctaLink.title = 'Back To Top';
  ctaLink.classList.add('button', 'light-beige-accent', 'bodySmallRegular');
  ctaLink.setAttribute('aria-label', 'Back To Top');
  ctaLink.setAttribute('rel', 'follow');

  const buttonTextSpan = document.createElement('span');
  buttonTextSpan.classList.add('button-text');
  buttonTextSpan.textContent = ctaLabelCell.textContent.trim();

  moveInstrumentation(ctaLabelCell, buttonTextSpan);

  ctaLink.append(buttonTextSpan);
  ctaWrapper.append(ctaLink);
  section.append(ctaWrapper);

  block.replaceChildren(section);

  // Add scroll event listener for back-to-top functionality
  const handleScroll = () => {
    if (window.scrollY > 200) { // Show button after scrolling 200px
      section.style.display = 'flex';
    } else {
      section.style.display = 'none';
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  window.addEventListener('scroll', handleScroll);
  ctaLink.addEventListener('click', scrollToTop);

  // Initial check on load
  handleScroll();
}
