import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0 — CRITICAL: DIRECT .children[n] BRACKET ACCESS - FIXED
  // Replaced direct bracket access with array destructuring for fixed schema.
  const [
    headlineCell,
    heroImageDesktopCell,
    heroImageMobileCell,
    sideImageCell,
    descriptionCell,
  ] = [...block.children];

  // CHECK 0.5 — BLOCK'S OWN CLASS ON INNER WRAPPER - FIXED
  // Removed 'manufactures' class from the inner section, as the outer block div already has it.
  const section = document.createElement('section');
  // section.classList.add('manufactures'); // Removed: outer block div already has this class

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  if (headlineCell) {
    const headline = document.createElement('h3');
    headline.classList.add('hd4', 'CTR', 'os-animation', 'animated', 'fadeInUp');
    headline.textContent = headlineCell.textContent.trim();
    moveInstrumentation(headlineCell, headline);
    container.append(headline);
  }

  if (heroImageDesktopCell || heroImageMobileCell) {
    const heroImgDiv = document.createElement('div');
    heroImgDiv.classList.add('hero-img', 'os-animation', 'animated', 'fadeInUp');
    // Move instrumentation from one of the image cells, assuming they are logically one component
    moveInstrumentation(heroImageDesktopCell || heroImageMobileCell, heroImgDiv);

    const desktopPicture = heroImageDesktopCell?.querySelector('picture');
    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1145' }]);
      optimizedPic.classList.add('img-responsive', 'hidden-xs');
      heroImgDiv.append(optimizedPic);
    }

    const mobilePicture = heroImageMobileCell?.querySelector('picture');
    if (mobilePicture) {
      const img = mobilePicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '332' }]);
      optimizedPic.classList.add('img-responsive', 'visible-xs');
      heroImgDiv.append(optimizedPic);
    }
    container.append(heroImgDiv);
  }

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');
  container.append(rowDiv);

  const colSm4 = document.createElement('div');
  colSm4.classList.add('col-sm-4', 'col-sm-push-8');
  rowDiv.append(colSm4);

  if (sideImageCell) {
    const imgBox = document.createElement('div');
    imgBox.classList.add('img-box', 'os-animation', 'animated', 'fadeInUp');
    moveInstrumentation(sideImageCell, imgBox);

    const picture = sideImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '280' }]);
      imgBox.append(optimizedPic);
    }
    colSm4.append(imgBox);
  }

  const colSm8 = document.createElement('div');
  colSm8.classList.add('col-sm-8', 'col-sm-pull-4');
  rowDiv.append(colSm8);

  if (descriptionCell) {
    const manufacInfo = document.createElement('div');
    manufacInfo.classList.add('manufac-info', 'os-animation', 'animated', 'fadeInUp');
    moveInstrumentation(descriptionCell, manufacInfo);
    // CHECK 0.7 B — <p>-inside-<p> / RICHTEXT FIELDS WITH HTML CONTENT - FIXED
    // Description is richtext, so its innerHTML might contain <p> tags.
    // Assigning to a <div> is safe, assigning to a <p> would create invalid nesting.
    manufacInfo.innerHTML = descriptionCell.innerHTML;
    colSm8.append(manufacInfo);
  }

  block.replaceChildren(section);
}
