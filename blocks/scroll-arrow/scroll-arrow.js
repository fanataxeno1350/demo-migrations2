export default function decorate(block) {
  const scrollArrowWrapper = document.createElement('div');
  scrollArrowWrapper.classList.add('cmp-scroll-arrow');
  scrollArrowWrapper.dataset.component = 'scroll-arrow';

  const indicatorUp = document.createElement('div');
  indicatorUp.classList.add('cmp-scroll-arrow__indicator', 'cmp-scroll-arrow__indicator-up');
  indicatorUp.style.display = 'none';
  indicatorUp.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="70" height="70" viewBox="0 0 70 70">
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
    </svg>`;

  const indicatorDown = document.createElement('div');
  indicatorDown.classList.add('cmp-scroll-arrow__indicator', 'cmp-scroll-arrow__indicator-down');
  indicatorDown.style.display = 'block';
  indicatorDown.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="70" height="70" viewBox="0 0 70 70">
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
    </svg>`;

  scrollArrowWrapper.append(indicatorUp);
  scrollArrowWrapper.append(indicatorDown);

  block.replaceChildren(scrollArrowWrapper);

  // No need for lastScrollY as we only care about current position
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    // document.documentElement.scrollHeight is the total height of the content
    // window.innerHeight is the height of the viewport
    // scrollHeight is the maximum scrollable distance from the top
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Show/hide up arrow
    // If scrolled down at all, show the up arrow
    if (currentScrollY > 0) {
      indicatorUp.style.display = 'block';
    } else {
      indicatorUp.style.display = 'none';
    }

    // Show/hide down arrow
    // If not at the very bottom, show the down arrow
    // A small buffer (e.g., 10px) is good for browser rendering differences
    if (currentScrollY < scrollHeight - 10) {
      indicatorDown.style.display = 'block';
    } else {
      indicatorDown.style.display = 'none';
    }
  };

  indicatorUp.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  indicatorDown.addEventListener('click', () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  });

  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleScroll); // Recalculate on resize
  handleScroll(); // Initial check on load
}
