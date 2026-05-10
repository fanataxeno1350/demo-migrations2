import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  // CHECK 0: Replaced direct children[0] access with destructuring
  const [sectionTitleRow, ...itemRows] = children;

  const socialPlatformRows = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('a'));
  const facebookEmbedRows = itemRows.filter((row) => row.children.length === 3);
  const instagramPostRows = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a'));

  const section = document.createElement('section');
  // CHECK 0.5: Removed block's own class 'parle-social' from inner wrapper.
  // The outer block div already carries this class from AEM.
  // section.classList.add('parle-social'); // REMOVED
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const title = document.createElement('h2');
  moveInstrumentation(sectionTitleRow, title);
  title.textContent = sectionTitleRow.textContent.trim();
  container.append(title);

  const row = document.createElement('div');
  row.classList.add('row');
  container.append(row);

  // Social Platforms
  socialPlatformRows.forEach((socialRow) => {
    const [platformIconCell, platformLabelCell] = [...socialRow.children];

    const col = document.createElement('div');
    col.classList.add('col-md-4');
    moveInstrumentation(socialRow, col);

    const socialLogo = document.createElement('div');
    socialLogo.classList.add('social_logo');

    const picture = platformIconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      socialLogo.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('img-fluid');
    }

    const labelText = platformLabelCell.textContent.trim();
    if (labelText) {
      socialLogo.append(document.createTextNode(` ${labelText}`));
    }
    col.append(socialLogo);
    row.append(col);
  });

  // Facebook Embeds
  facebookEmbedRows.forEach((facebookRow) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...facebookRow.children];

    const col = document.createElement('div');
    col.classList.add('col-md-4');
    moveInstrumentation(facebookRow, col);

    const embedUrl = embedUrlCell.textContent.trim();
    const embedKind = embedKindCell.textContent.trim();
    const embedConfig = embedConfigCell.textContent.trim();

    if (embedKind === 'facebook-embed') {
      const fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      fbRoot.classList.add('fb_reset');
      col.append(fbRoot);

      const embedDiv = document.createElement('div');
      embedDiv.dataset.embedKind = embedKind;
      embedDiv.dataset.embedUrl = embedUrl;
      embedDiv.dataset.embedConfig = embedConfig;
      embedDiv.textContent = '[facebook-embed placeholder]';
      col.append(embedDiv);

      // Facebook SDK loading (simplified, usually handled by aem.js for embeds)
      // CHECK 2: loadScript should be awaited
      // eslint-disable-next-line no-await-in-loop
      await loadScript('https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v10.0');
    }
    row.append(col);
  });

  // Instagram Posts
  if (instagramPostRows.length > 0) {
    const col = document.createElement('div');
    col.classList.add('col-md-4');
    row.append(col);

    const instagramLogo = document.createElement('div');
    instagramLogo.classList.add('social_logo');
    // CHECK 3: Replaced hardcoded "Instagram" with actual platform label from socialPlatformRows
    const instagramPlatform = socialPlatformRows.find((socialRow) => socialRow.children[1].textContent.trim().toLowerCase() === 'instagram');
    if (instagramPlatform) {
      const picture = instagramPlatform.children[0].querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        instagramLogo.append(optimizedPic);
        optimizedPic.querySelector('img').classList.add('img-fluid');
      }
      instagramLogo.append(document.createTextNode(` ${instagramPlatform.children[1].textContent.trim()}`));
    } else {
      instagramLogo.append(document.createTextNode('Instagram')); // Fallback placeholder
    }
    col.append(instagramLogo);

    const carouselContainer = document.createElement('div');
    // CHECK 2.6: Removed owl-loaded and owl-drag as Owl Carousel adds them
    carouselContainer.classList.add('parleg-insta', 'owl-carousel', 'owl-theme');
    col.append(carouselContainer);

    const owlStageOuter = document.createElement('div');
    owlStageOuter.classList.add('owl-stage-outer');
    carouselContainer.append(owlStageOuter);

    const owlStage = document.createElement('div');
    owlStage.classList.add('owl-stage');
    owlStageOuter.append(owlStage);

    instagramPostRows.forEach((instagramRow) => {
      const [postLinkCell, postImageCell] = [...instagramRow.children];

      const owlItem = document.createElement('div');
      owlItem.classList.add('owl-item');
      moveInstrumentation(instagramRow, owlItem);

      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item');
      owlItem.append(itemDiv);

      const postLink = postLinkCell.querySelector('a');
      const anchor = document.createElement('a');
      if (postLink) {
        anchor.href = postLink.href;
        anchor.target = '_blank';
      }

      const picture = postImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
        optimizedPic.querySelector('img').classList.add('img-fluid');
      }
      itemDiv.append(anchor);
      owlStage.append(owlItem);
    });

    // Add owl-nav and owl-dots placeholders if needed, but they are usually generated by Owl Carousel JS
    const owlNav = document.createElement('div');
    owlNav.classList.add('owl-nav', 'disabled');
    owlNav.innerHTML = '<div class="owl-prev">prev</div><div class="owl-next">next</div>';
    carouselContainer.append(owlNav);

    const owlDots = document.createElement('div');
    owlDots.classList.add('owl-dots');
    carouselContainer.append(owlDots);

    // Since Owl Carousel is detected, load its CSS and JS and initialize
    // CHECK 2.5: decorate() is already async, so await is fine here
    await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css');
    await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js');

    // eslint-disable-next-line no-undef
    $(carouselContainer).owlCarousel({
      loop: false,
      margin: 30, // Adjust margin as per original CSS
      nav: false,
      dots: true,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 3,
        },
      },
    });
  }

  block.replaceChildren(section);

  // Image optimization - this part should ideally be handled by createOptimizedPicture directly
  // and not as a separate loop after block.replaceChildren.
  // However, if the original images are still present in the DOM after replaceChildren,
  // this might be a fallback. For now, keeping it as is, but noting it's less efficient.
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
