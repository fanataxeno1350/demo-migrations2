import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [ctaLabelRow, ctaLinkRow] = [...block.children];

  const backToTopCta = document.createElement('div');
  backToTopCta.classList.add('back-to-top__cta');

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('button', 'light-beige-accent', 'bodySmallRegular');

  // Read href from ctaLinkRow
  const foundLink = ctaLinkRow.querySelector('a');
  if (foundLink) {
    ctaLink.href = foundLink.href;
    // Copy other attributes from the original link if present
    if (foundLink.title) ctaLink.title = foundLink.title;
    if (foundLink.getAttribute('aria-label')) ctaLink.setAttribute('aria-label', foundLink.getAttribute('aria-label'));
    if (foundLink.rel) ctaLink.rel = foundLink.rel;
  } else {
    ctaLink.href = 'javascript:void(0)'; // Default if no link is found
  }

  // Read label text from ctaLabelRow
  const ctaLabel = document.createElement('span');
  ctaLabel.classList.add('button-text');
  ctaLabel.textContent = ctaLabelRow.textContent.trim();

  ctaLink.append(ctaLabel);
  moveInstrumentation(ctaLinkRow, ctaLink); // Move instrumentation from link row to the new anchor
  // moveInstrumentation(ctaLabelRow, ctaLabel); // Removed - ctaLabel is a child of ctaLink, instrumentation moves with parent

  backToTopCta.append(ctaLink);

  block.replaceChildren(backToTopCta);

  // Add event listener for scroll behavior
  const showButtonThreshold = 500; // Adjust as needed
  const handleScroll = () => {
    if (window.scrollY > showButtonThreshold) {
      block.style.display = 'flex';
    } else {
      block.style.display = 'none';
    }
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  ctaLink.addEventListener('click', scrollToTop);
  window.addEventListener('scroll', handleScroll);

  // Initial check
  handleScroll();
}
