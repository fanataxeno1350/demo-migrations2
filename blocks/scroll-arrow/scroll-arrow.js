import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const scrollArrowWrapper = document.createElement('div');
  scrollArrowWrapper.classList.add('cmp-scroll-arrow');
  scrollArrowWrapper.setAttribute('data-component', 'scroll-arrow');

  // Up arrow indicator
  const upIndicator = document.createElement('div');
  upIndicator.classList.add('cmp-scroll-arrow__indicator', 'cmp-scroll-arrow__indicator-up');
  upIndicator.style.display = 'none';
  upIndicator.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="70" height="70" viewBox="0 0 70 70">
        <defs>
            <filter id="a" x="0" y="0" width="70" height="70" filterUnits="userSpaceOnUse">
                <feOffset dy="4" input="SourceAlpha"></feOffset>
                <feGaussianBlur stdDeviation="5" result="b"></feGaussianBlur>
                <feFlood flood-opacity="0.161"></feFlood>
                <feComposite operator="in" in2="b"></feComposite>
                <feComposite in="SourceGraphic"></feComposite>
            </filter>
            <clipPath id="c">
                <rect width="24" height="24" fill="none"></rect>
            </clipPath>
        </defs>
        <g transform="translate(15 11)">
            <g transform="matrix(1, 0, 0, 1, -15, -11)" filter="url(#a)">
                <circle cx="20" cy="20" r="20" transform="translate(15 11)" fill="#fff"></circle>
            </g>
            <g transform="translate(8 8)">
                <g clip-path="url(#c)">
                    <path d="M10.586,21.415l-8.293-8.3A1,1,0,0,1,3.707,11.7L11,19V3a1,1,0,1,1,2,0V19l7.293-7.3a1,1,0,0,1,1.414,1.415l-8.293,8.3a2,2,0,0,1-2.828,0" fill="#146614"></path>
                </g>
            </g>
        </g>
    </svg>
  `;
  scrollArrowWrapper.append(upIndicator);
  // No authored rows in this block, so moveInstrumentation from block to its new root.
  moveInstrumentation(block, scrollArrowWrapper);

  // Down arrow indicator
  const downIndicator = document.createElement('div');
  downIndicator.classList.add('cmp-scroll-arrow__indicator', 'cmp-scroll-arrow__indicator-down');
  downIndicator.style.display = 'block';
  downIndicator.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="70" height="70" viewBox="0 0 70 70">
        <defs>
            <filter id="a" x="0" y="0" width="70" height="70" filterUnits="userSpaceOnUse">
                <feOffset dy="4" input="SourceAlpha"></feOffset>
                <feGaussianBlur stdDeviation="5" result="b"></feGaussianBlur>
                <feFlood flood-opacity="0.161"></feFlood>
                <feComposite operator="in" in2="b"></feComposite>
                <feComposite in="SourceGraphic"></feComposite>
            </filter>
            <clipPath id="c">
                <rect width="24" height="24" fill="none"></rect>
            </clipPath>
        </defs>
        <g transform="translate(15 11)">
            <g transform="matrix(1, 0, 0, 1, -15, -11)" filter="url(#a)">
                <circle cx="20" cy="20" r="20" transform="translate(15 11)" fill="#fff"></circle>
            </g>
            <g transform="translate(8 8)">
                <g clip-path="url(#c)">
                    <path d="M10.586,21.415l-8.293-8.3A1,1,0,0,1,3.707,11.7L11,19V3a1,1,0,1,1,2,0V19l7.293-7.3a1,1,0,0,1,1.414,1.415l-8.293,8.3a2,2,0,0,1-2.828,0" fill="#146614"></path>
                </g>
            </g>
        </g>
    </svg>
  `;
  scrollArrowWrapper.append(downIndicator);

  block.replaceChildren(scrollArrowWrapper);

  let lastScrollY = 0;
  const showHideArrows = () => {
    const currentScrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    // Show/hide up arrow
    if (currentScrollY > 0) {
      upIndicator.style.display = 'block';
    } else {
      upIndicator.style.display = 'none';
    }

    // Show/hide down arrow
    if (currentScrollY + windowHeight < documentHeight) {
      downIndicator.style.display = 'block';
    } else {
      downIndicator.style.display = 'none';
    }

    lastScrollY = currentScrollY;
  };

  upIndicator.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  downIndicator.addEventListener('click', () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  });

  window.addEventListener('scroll', showHideArrows);
  window.addEventListener('resize', showHideArrows); // Recalculate on resize
  showHideArrows(); // Initial check
}
