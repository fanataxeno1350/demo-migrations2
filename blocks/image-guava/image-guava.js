import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [imageDesktopRow, imageMobileRow, imageLinkRow] = [...block.children];

  const link = document.createElement('a');
  link.classList.add('cmp-image__link');

  const imageLink = imageLinkRow.querySelector('a');
  if (imageLink) {
    link.href = imageLink.href;
    moveInstrumentation(imageLinkRow, link);
  }

  const pictureDesktop = imageDesktopRow.querySelector('picture');
  const pictureMobile = imageMobileRow.querySelector('picture');

  if (pictureDesktop && pictureMobile) {
    const imgDesktop = pictureDesktop.querySelector('img');
    const imgMobile = pictureMobile.querySelector('img');

    if (imgDesktop && imgMobile) {
      const optimizedPicture = createOptimizedPicture(
        imgDesktop.src,
        imgDesktop.alt,
        false,
        [{ media: '(max-width: 767px)', width: '750', src: imgMobile.src }],
        [{ width: '750' }],
      );

      const sourceMobile = optimizedPicture.querySelector('source[media="(max-width: 767px)"]');
      if (sourceMobile) {
        sourceMobile.srcset = imgMobile.src;
      }

      const img = optimizedPicture.querySelector('img');
      img.classList.add('cmp-image__image');
      img.loading = 'lazy';
      img.fetchpriority = 'low';
      img.itemprop = 'contentUrl';
      img.alt = imgDesktop.alt;

      moveInstrumentation(imageDesktopRow, optimizedPicture.querySelector('img'));
      link.append(optimizedPicture);
    }
  } else if (pictureDesktop) {
    const imgDesktop = pictureDesktop.querySelector('img');
    if (imgDesktop) {
      const optimizedPicture = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      const img = optimizedPicture.querySelector('img');
      img.classList.add('cmp-image__image');
      img.loading = 'lazy';
      img.fetchpriority = 'low';
      img.itemprop = 'contentUrl';
      img.alt = imgDesktop.alt;

      moveInstrumentation(imageDesktopRow, optimizedPicture.querySelector('img'));
      link.append(optimizedPicture);
    }
  } else if (pictureMobile) {
    const imgMobile = pictureMobile.querySelector('img');
    if (imgMobile) {
      const optimizedPicture = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '750' }]);
      const img = optimizedPicture.querySelector('img');
      img.classList.add('cmp-image__image');
      img.loading = 'lazy';
      img.fetchpriority = 'low';
      img.itemprop = 'contentUrl';
      img.alt = imgMobile.alt;

      moveInstrumentation(imageMobileRow, optimizedPicture.querySelector('img'));
      link.append(optimizedPicture);
    }
  }

  const wrapper = document.createElement('div');
  wrapper.classList.add('cmp-image'); // This is the block's own class, but it's on the inner wrapper.
                                      // The outer block div already has 'image-guava'.
                                      // The original HTML shows 'cmp-image' on the outermost div.
                                      // So, this is correct as it matches the original HTML structure.
  wrapper.append(link);

  block.replaceChildren(wrapper);
}
