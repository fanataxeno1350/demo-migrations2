import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];
  const headlineRow = children[0];
  const allItemRows = children.slice(1);

  const socialChannelRows = [];
  const facebookEmbedRows = [];
  const instagramPostRows = [];

  allItemRows.forEach((row) => {
    const cells = [...row.children];
    // Social Channel Item: 2 cells (logo, label)
    if (cells.length === 2 && cells[0].querySelector('picture')) {
      socialChannelRows.push(row);
    }
    // Facebook Embed Item: 3 cells (data-embed-url, data-embed-kind, data-embed-config)
    // The model states 'data-embed-kind' is a text field, so we check its content.
    // The original HTML has a div with data-embed-kind="facebook-embed", so we look for that.
    // The block structure indicates cell[1] is 'data-embed-kind'.
    else if (cells.length === 3 && cells[1].textContent.trim() === 'facebook-embed') {
      facebookEmbedRows.push(row);
    }
    // Instagram Post Item: 2 cells (postLink, image)
    else if (cells.length === 2 && cells[0].querySelector('a') && cells[1].querySelector('picture')) {
      instagramPostRows.push(row);
    }
  });

  const section = document.createElement('section');
  section.id = 'ctl00_ContentPlaceHolder1_socialbrand';
  section.classList.add('parle-social');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  if (headlineRow) {
    const h2 = document.createElement('h2');
    moveInstrumentation(headlineRow, h2);
    h2.textContent = headlineRow.textContent.trim();
    container.append(h2);
  }

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');
  container.append(rowDiv);

  // Render Social Channels and Facebook Embeds
  socialChannelRows.forEach((row, index) => {
    const [logoCell, labelCell] = [...row.children]; // Destructuring for fixed schema

    const col = document.createElement('div');
    col.classList.add('col-md-4');
    rowDiv.append(col);

    const socialLogo = document.createElement('div');
    socialLogo.classList.add('social_logo');
    moveInstrumentation(row, socialLogo); // Move instrumentation from the social channel row

    const picture = logoCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        socialLogo.append(optimizedPic);
      }
    }
    socialLogo.append(` ${labelCell.textContent.trim()}`);
    col.append(socialLogo);

    // If there's a corresponding Facebook embed, render it here
    const facebookEmbedRow = facebookEmbedRows[index];
    if (facebookEmbedRow) {
      const [embedUrlCell, embedKindCell, embedConfigCell] = [...facebookEmbedRow.children]; // Destructuring for fixed schema
      const embedKind = embedKindCell.textContent.trim();
      const embedUrl = embedUrlCell.textContent.trim();
      const embedConfig = embedConfigCell.textContent.trim();

      const embedDiv = document.createElement('div');
      embedDiv.setAttribute('data-embed-kind', embedKind);
      embedDiv.setAttribute('data-embed-url', embedUrl);
      embedDiv.setAttribute('data-embed-config', embedConfig);
      embedDiv.textContent = '[facebook-embed placeholder]'; // Placeholder text

      // Hydrate the embed
      if (embedKind === 'facebook-embed') {
        const fbRoot = document.createElement('div');
        fbRoot.id = 'fb-root';
        fbRoot.classList.add('fb_reset');
        fbRoot.innerHTML = '&nbsp;<div style="position: absolute; top: -10000px; width: 0px; height: 0px;"><div></div></div>';
        col.append(fbRoot);
        // Facebook SDK is usually loaded globally, but if not, it would be here
        // await loadScript('https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v10.0');
      }
      moveInstrumentation(facebookEmbedRow, embedDiv); // Move instrumentation from the facebook embed row
      col.append(embedDiv);
    }
  });

  // Render Instagram Posts
  if (instagramPostRows.length > 0) {
    const col = document.createElement('div');
    col.classList.add('col-md-4');
    rowDiv.append(col);

    // Find the Instagram social channel row to get its logo and label
    const instagramSocialChannelRow = socialChannelRows.find(row => {
      const [logoCell, labelCell] = [...row.children];
      return labelCell.textContent.trim().toLowerCase() === 'instagram';
    });

    if (instagramSocialChannelRow) {
      const [logoCell, labelCell] = [...instagramSocialChannelRow.children];
      const socialLogo = document.createElement('div');
      socialLogo.classList.add('social_logo');
      moveInstrumentation(instagramSocialChannelRow, socialLogo);

      const picture = logoCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          socialLogo.append(optimizedPic);
        }
      }
      socialLogo.append(` ${labelCell.textContent.trim()}`);
      col.append(socialLogo);
    } else {
      // Fallback if Instagram social channel row is not found, but avoid hardcoding
      // This scenario indicates a missing content row for Instagram in the block.
      // For now, we'll create a placeholder, but ideally, content should drive this.
      const socialLogo = document.createElement('div');
      socialLogo.classList.add('social_logo');
      socialLogo.textContent = 'Instagram (Logo Missing)';
      col.append(socialLogo);
    }

    const instagramCarousel = document.createElement('div');
    instagramCarousel.classList.add('parleg-insta', 'owl-carousel', 'owl-theme'); // Removed owl-loaded, owl-drag as they are added by Owl Carousel
    col.append(instagramCarousel);

    const owlStageOuter = document.createElement('div');
    owlStageOuter.classList.add('owl-stage-outer');
    instagramCarousel.append(owlStageOuter);

    const owlStage = document.createElement('div');
    owlStage.classList.add('owl-stage');
    // Styles for Owl Carousel are usually set by the library, not hardcoded
    // owlStage.style.transform = 'translate3d(-4560px, 0px, 0px)';
    // owlStage.style.transition = '1s';
    // owlStage.style.width = `${instagramPostRows.length * 380}px`;
    owlStageOuter.append(owlStage);

    instagramPostRows.forEach((row) => {
      const [postLinkCell, imageCell] = [...row.children]; // Destructuring for fixed schema

      const owlItem = document.createElement('div');
      owlItem.classList.add('owl-item');
      // Styles for Owl Carousel are usually set by the library, not hardcoded
      // owlItem.style.width = '350px';
      // owlItem.style.marginRight = '30px';
      moveInstrumentation(row, owlItem); // Move instrumentation from the instagram post row
      owlStage.append(owlItem);

      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item');
      owlItem.append(itemDiv);

      const link = document.createElement('a');
      const foundLink = postLinkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.target = '_blank';
      }
      itemDiv.append(link);

      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '350' }]);
          optimizedPic.querySelector('img').classList.add('img-fluid');
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          link.append(optimizedPic);
        }
      }
    });

    // Add navigation and dots
    const owlNav = document.createElement('div');
    owlNav.classList.add('owl-nav', 'disabled');
    owlNav.innerHTML = '<div class="owl-prev">prev</div><div class="owl-next">next</div>';
    instagramCarousel.append(owlNav);

    const owlDots = document.createElement('div');
    owlDots.classList.add('owl-dots');
    instagramPostRows.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('owl-dot');
      if (i === 0) dot.classList.add('active'); // First dot active
      dot.innerHTML = '<span></span>';
      owlDots.append(dot);
    });
    instagramCarousel.append(owlDots);

    // Load Owl Carousel assets and initialize
    await loadCSS('/blocks/social-feeds/owl.carousel.min.css'); // Assuming CSS is local or from CDN
    await loadScript('/blocks/social-feeds/owl.carousel.min.js'); // Assuming JS is local or from CDN

    // eslint-disable-next-line no-undef
    $(instagramCarousel).owlCarousel({
      loop: true,
      margin: 30,
      nav: true,
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

  // Image optimization for all images within the block
  // This loop is redundant if createOptimizedPicture is used directly for each image.
  // It's better to optimize images as they are created.
  // Keeping it for now, but ideally, it should be removed if all images are handled above.
  section.querySelectorAll('picture > img').forEach((img) => {
    // Check if the image is already part of an optimized picture
    if (!img.closest('picture').dataset.optimised) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
      optimizedPic.dataset.optimised = 'true'; // Mark as optimized to prevent re-processing
    }
  });
}
