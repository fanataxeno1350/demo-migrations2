import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  // Fixed schema for the first 7 rows based on BlockJson model
  const [
    sectionTitleCell,
    facebookLogoCell,
    facebookLabelCell,
    // facebookEmbed container starts here, handled by slicing below
    twitterLogoCell,
    twitterLabelCell,
    instagramLogoCell,
    instagramLabelCell,
    // instagramFeed container starts here, handled by slicing below
  ] = children.slice(0, 7); // Destructure the first 7 known rows

  const facebookEmbedRows = [];
  const instagramFeedItemRows = [];

  // Separate item rows based on cell count and position after the fixed 7 rows
  children.slice(7).forEach((row) => {
    if (row.children.length === 3) { // facebook-embed has 3 cells
      facebookEmbedRows.push(row);
    } else if (row.children.length === 2) { // instagram-feed-item has 2 cells
      instagramFeedItemRows.push(row);
    }
  });

  const section = document.createElement('section');
  section.classList.add('parle-social');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const h2 = document.createElement('h2');
  moveInstrumentation(sectionTitleCell, h2);
  h2.textContent = sectionTitleCell.textContent.trim();
  container.append(h2);

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');
  container.append(rowDiv);

  // Facebook Section
  const facebookCol = document.createElement('div');
  facebookCol.classList.add('col-md-4');
  rowDiv.append(facebookCol);

  const facebookSocialLogo = document.createElement('div');
  facebookSocialLogo.classList.add('social_logo');
  moveInstrumentation(facebookLogoCell, facebookSocialLogo);
  const facebookPicture = facebookLogoCell.querySelector('picture');
  if (facebookPicture) {
    const facebookImg = facebookPicture.querySelector('img');
    if (facebookImg) {
      const optimizedFacebookPicture = createOptimizedPicture(facebookImg.src, facebookImg.alt, false, [{ width: '750' }]);
      optimizedFacebookPicture.querySelector('img').classList.add('img-fluid');
      facebookSocialLogo.append(optimizedFacebookPicture);
    }
  }
  moveInstrumentation(facebookLabelCell, facebookSocialLogo);
  facebookSocialLogo.append(document.createTextNode(` ${facebookLabelCell.textContent.trim()}`));
  facebookCol.append(facebookSocialLogo);

  if (facebookEmbedRows.length > 0) {
    facebookEmbedRows.forEach((embedRow) => {
      // Fixed schema for facebook-embed item rows
      const [embedUrlCell, embedKindCell, embedConfigCell] = [...embedRow.children];

      const embedDiv = document.createElement('div');
      moveInstrumentation(embedRow, embedDiv);
      embedDiv.dataset.embedKind = embedKindCell.textContent.trim();
      embedDiv.dataset.embedUrl = embedUrlCell.textContent.trim();
      embedDiv.dataset.embedConfig = embedConfigCell.textContent.trim();

      const kind = embedDiv.dataset.embedKind;
      const embedUrl = embedDiv.dataset.embedUrl;
      const embedConfig = embedDiv.dataset.embedConfig;

      switch (kind) {
        case 'facebook-embed': {
          const fbRoot = document.createElement('div');
          fbRoot.id = 'fb-root';
          fbRoot.classList.add('fb_reset');
          facebookCol.append(fbRoot);

          const fbPlaceholder = document.createElement('div');
          fbPlaceholder.textContent = '[facebook-embed placeholder]';
          fbPlaceholder.setAttribute('data-embed-kind', kind);
          fbPlaceholder.setAttribute('data-embed-url', embedUrl);
          fbPlaceholder.setAttribute('data-embed-config', embedConfig);
          facebookCol.append(fbPlaceholder);
          break;
        }
        default:
          // Handle other embed kinds if necessary
          break;
      }
    });
  }

  // Twitter Section
  const twitterCol = document.createElement('div');
  twitterCol.classList.add('col-md-4');
  rowDiv.append(twitterCol);

  const twitterSocialLogo = document.createElement('div');
  twitterSocialLogo.classList.add('social_logo');
  moveInstrumentation(twitterLogoCell, twitterSocialLogo);
  const twitterPicture = twitterLogoCell.querySelector('picture');
  if (twitterPicture) {
    const twitterImg = twitterPicture.querySelector('img');
    if (twitterImg) {
      const optimizedTwitterPicture = createOptimizedPicture(twitterImg.src, twitterImg.alt, false, [{ width: '750' }]);
      optimizedTwitterPicture.querySelector('img').classList.add('img-fluid');
      twitterSocialLogo.append(optimizedTwitterPicture);
    }
  }
  moveInstrumentation(twitterLabelCell, twitterSocialLogo);
  twitterSocialLogo.append(document.createTextNode(` ${twitterLabelCell.textContent.trim()}`));
  twitterCol.append(twitterSocialLogo);

  // Instagram Section
  const instagramCol = document.createElement('div');
  instagramCol.classList.add('col-md-4');
  rowDiv.append(instagramCol);

  const instagramSocialLogo = document.createElement('div');
  instagramSocialLogo.classList.add('social_logo');
  moveInstrumentation(instagramLogoCell, instagramSocialLogo);
  const instagramPicture = instagramLogoCell.querySelector('picture');
  if (instagramPicture) {
    const instagramImg = instagramPicture.querySelector('img');
    if (instagramImg) {
      const optimizedInstagramPicture = createOptimizedPicture(instagramImg.src, instagramImg.alt, false, [{ width: '750' }]);
      optimizedInstagramPicture.querySelector('img').classList.add('img-fluid');
      instagramSocialLogo.append(optimizedInstagramPicture);
    }
  }
  moveInstrumentation(instagramLabelCell, instagramSocialLogo);
  instagramSocialLogo.append(document.createTextNode(` ${instagramLabelCell.textContent.trim()}`));
  instagramCol.append(instagramSocialLogo);

  if (instagramFeedItemRows.length > 0) {
    const owlCarouselDiv = document.createElement('div');
    // Removed owl-loaded and owl-drag as they are added by Owl Carousel JS
    owlCarouselDiv.classList.add('parleg-insta', 'owl-carousel', 'owl-theme');
    instagramCol.append(owlCarouselDiv);

    const owlStageOuter = document.createElement('div');
    owlStageOuter.classList.add('owl-stage-outer');
    owlCarouselDiv.append(owlStageOuter);

    const owlStage = document.createElement('div');
    owlStage.classList.add('owl-stage');
    owlStageOuter.append(owlStage);

    instagramFeedItemRows.forEach((itemRow) => {
      // Fixed schema for instagram-feed-item rows
      const [postLinkCell, postImageCell] = [...itemRow.children];

      const owlItem = document.createElement('div');
      owlItem.classList.add('owl-item');
      moveInstrumentation(itemRow, owlItem);

      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item');
      owlItem.append(itemDiv);

      const link = document.createElement('a');
      const foundLink = postLinkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.target = '_blank';
      }

      const picture = postImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          optimizedPicture.querySelector('img').classList.add('img-fluid');
          link.append(optimizedPicture);
        }
      }
      itemDiv.append(link);
      owlStage.append(owlItem);
    });

    // Load Owl Carousel CSS and JS
    await loadCSS('/styles/owl.carousel.min.css'); // Assuming owl.carousel.min.css is in styles folder
    await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
    await loadScript('/scripts/owl.carousel.min.js'); // Assuming owl.carousel.min.js is in scripts folder
    // Removed redundant loadScript('/scripts/owl.carousel.js') as min.js is sufficient

    // eslint-disable-next-line no-undef
    $(owlCarouselDiv).owlCarousel({
      loop: true,
      margin: 30,
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
}
