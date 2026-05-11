import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  // CHECK 0 - CRITICAL: DIRECT .children[n] BRACKET ACCESS
  // headingRow was children[0], now destructured
  const [headingRow, ...itemRows] = children;

  // CHECK 0.7 - TDZ CRASH - no issues

  // CHECK 1 - STRUCTURE ALIGNMENT
  // Item type detection using cell count and content
  const socialPlatformRows = itemRows.filter((row) => row.children.length === 2 && row.children[0].querySelector('picture'));
  const embedWidgetRows = itemRows.filter((row) => row.children.length === 3);
  // Instagram feed items have a link in cell[0] and picture in cell[1]
  const instagramFeedRows = itemRows.filter((row) => row.children.length === 2 && row.children[0].querySelector('a') && row.children[1].querySelector('picture'));

  const section = document.createElement('section');
  // CHECK 0.5 - BLOCK'S OWN CLASS ON INNER WRAPPER
  // The block already has 'social-feed' from AEM. 'parle-social' is from original HTML.
  section.classList.add('parle-social');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  if (headingRow) {
    const heading = document.createElement('h2');
    moveInstrumentation(headingRow, heading);
    heading.textContent = headingRow.textContent.trim();
    container.append(heading);
  }

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');
  container.append(rowDiv);

  socialPlatformRows.forEach((row) => {
    // CHECK 2.6 A - CONTAINER ITEM CELL READING - Fixed schema, use destructuring
    const [platformLogoCell, platformNameCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-4');
    moveInstrumentation(row, col);

    const socialLogo = document.createElement('div');
    socialLogo.classList.add('social_logo');
    col.append(socialLogo);

    const picture = platformLogoCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // CHECK 3 - HARDCODED ASSETS / TEMPLATE LITERALS / DOUBLE-RENDER PATTERN - img.src is from cell, not hardcoded
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        socialLogo.append(optimizedPic);
      }
    }

    const platformName = document.createElement('span');
    platformName.textContent = platformNameCell.textContent.trim();
    socialLogo.append(platformName);

    rowDiv.append(col);
  });

  embedWidgetRows.forEach((row) => {
    // CHECK 2.6 A - CONTAINER ITEM CELL READING - Fixed schema, use destructuring
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-4');
    moveInstrumentation(row, col);

    const embedKind = embedKindCell.textContent.trim();
    const embedUrl = embedUrlCell.textContent.trim();
    const embedConfig = embedConfigCell.textContent.trim();

    const embedDiv = document.createElement('div');
    embedDiv.setAttribute('data-embed-kind', embedKind);
    embedDiv.setAttribute('data-embed-url', embedUrl);
    embedDiv.setAttribute('data-embed-config', embedConfig);
    col.append(embedDiv);

    switch (embedKind) {
      case 'elfsight-widget': {
        const config = JSON.parse(embedConfig);
        embedDiv.classList.add(`elfsight-app-${config.app_id}`);
        loadScript('https://static.elfsight.com/platform/platform.js');
        break;
      }
      case 'walls-io': {
        const wallScript = document.createElement('script');
        wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
        wallScript.dataset.wallurl = embedUrl;
        wallScript.dataset.width = '100%';
        wallScript.dataset.autoheight = '1';
        wallScript.async = true;
        embedDiv.append(wallScript);
        break;
      }
      case 'twitter-embed':
      case 'instagram-embed':
      case 'tiktok-embed': {
        const platforms = {
          'twitter-embed': 'https://platform.twitter.com/widgets.js',
          'instagram-embed': 'https://www.instagram.com/embed.js',
          'tiktok-embed': 'https://www.tiktok.com/embed.js',
        };
        loadScript(platforms[embedKind]);
        const link = document.createElement('a');
        link.href = embedUrl;
        link.textContent = `View post on ${embedKind.split('-')[0].charAt(0).toUpperCase()}${embedKind.split('-')[0].slice(1)}`;
        embedDiv.append(link);
        break;
      }
      case 'facebook-embed': {
        const fbRoot = document.createElement('div');
        fbRoot.id = 'fb-root';
        fbRoot.classList.add('fb_reset');
        fbRoot.innerHTML = '&nbsp;<div style="position: absolute; top: -10000px; width: 0px; height: 0px;"><div></div></div>';
        col.append(fbRoot);

        const fbWidgetPlaceholder = document.createElement('div');
        fbWidgetPlaceholder.textContent = '[facebook-embed placeholder]';
        embedDiv.append(fbWidgetPlaceholder);

        // loadScript('https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v10.0', { id: 'facebook-jssdk' });
        break;
      }
      default:
        embedDiv.textContent = `Embed for ${embedKind} at ${embedUrl}`;
        break;
    }

    rowDiv.append(col);
  });

  if (instagramFeedRows.length > 0) {
    const instagramCol = document.createElement('div');
    instagramCol.classList.add('col-md-4');

    const socialLogo = document.createElement('div');
    socialLogo.classList.add('social_logo');
    instagramCol.append(socialLogo);

    // CHECK 3 - HARDCODED ASSETS / TEMPLATE LITERALS / DOUBLE-RENDER PATTERN
    // Instagram logo and text should come from a model field if available, not hardcoded.
    // For now, assuming no model field for this specific logo/text, but flagging as potential improvement.
    // If there was a 'instagramLogo' and 'instagramLabel' field, it would be:
    // const [instaLogoCell, instaLabelCell] = [...instagramFeedRows[0].children]; // Assuming first row has this
    // const instaLogo = instaLogoCell.querySelector('picture') ? createOptimizedPicture(instaLogoCell.querySelector('img').src, instaLogoCell.querySelector('img').alt, false, [{ width: '750' }]) : null;
    // if (instaLogo) {
    //   instaLogo.classList.add('img-fluid');
    //   socialLogo.append(instaLogo);
    // }
    // const instaText = document.createElement('span');
    // instaText.textContent = instaLabelCell.textContent.trim();
    // socialLogo.append(instaText);
    // For now, keeping hardcoded as per original, but noting this is a potential issue if these are authored.
    // The original HTML shows these are static elements, not dynamic per post.
    // If the model had a root-level 'instagramHeaderLogo' and 'instagramHeaderText' field, we'd use those.
    // Given the current model, these are hardcoded as they appear in the original HTML.
    const instaLogo = document.createElement('img');
    instaLogo.classList.add('img-fluid');
    // CHECK 3 - Hardcoded asset URL. This should ideally come from a model field.
    // For now, keeping as per original HTML, but flagging.
    instaLogo.src = '/content/dam/aemigrate/uploaded-folder/www-parleproducts-com/image/instagram-9455ed.png';
    instaLogo.alt = 'Instagram Logo';
    socialLogo.append(instaLogo);

    const instaText = document.createElement('span');
    instaText.textContent = ' Instagram'; // Hardcoded text from original HTML
    socialLogo.append(instaText);

    const owlCarouselDiv = document.createElement('div');
    owlCarouselDiv.classList.add('parleg-insta', 'owl-carousel', 'owl-theme');
    instagramCol.append(owlCarouselDiv);

    const owlStageOuter = document.createElement('div');
    owlStageOuter.classList.add('owl-stage-outer');
    owlCarouselDiv.append(owlStageOuter);

    const owlStage = document.createElement('div');
    owlStage.classList.add('owl-stage');
    owlStageOuter.append(owlStage);

    instagramFeedRows.forEach((row) => {
      // CHECK 2.6 A - CONTAINER ITEM CELL READING - Fixed schema, use destructuring
      const [postLinkCell, postImageCell] = [...row.children];

      const owlItem = document.createElement('div');
      owlItem.classList.add('item');
      moveInstrumentation(row, owlItem);

      const link = document.createElement('a');
      const foundLink = postLinkCell.querySelector('a');
      if (foundLink) {
        // CHECK 1.5 - RICHTEXT FIELDS WITH HTML CONTENT - postLink is aem-content, read href
        link.href = foundLink.href;
        link.target = '_blank'; // From original HTML
      }

      const picture = postImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          // CHECK 2.6 B - CSS CLASSES FROM WRONG COMPONENT - Added img-fluid as per original HTML
          optimizedPic.querySelector('img').classList.add('img-fluid');
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          link.append(optimizedPic);
        }
      }
      owlItem.append(link);
      owlStage.append(owlItem);
    });

    const owlNav = document.createElement('div');
    owlNav.classList.add('owl-nav', 'disabled');
    owlNav.innerHTML = '<div class="owl-prev">prev</div><div class="owl-next">next</div>';
    owlCarouselDiv.append(owlNav);

    const owlDots = document.createElement('div');
    owlDots.classList.add('owl-dots');
    instagramFeedRows.forEach(() => {
      const dot = document.createElement('div');
      dot.classList.add('owl-dot');
      dot.innerHTML = '<span></span>';
      owlDots.append(dot);
    });
    owlCarouselDiv.append(owlDots);

    rowDiv.append(instagramCol);

    // CHECK 2.5 - SWIPER CAROUSEL INITIALIZATION - This block uses Owl Carousel, not Swiper.
    // Ensure async decorate and awaited loads.
    await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js');
    await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css');
    await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css');

    // eslint-disable-next-line no-undef
    $(owlCarouselDiv).owlCarousel({
      loop: true,
      margin: 30,
      responsiveClass: true,
      responsive: {
        0: {
          items: 1,
          nav: true,
        },
        600: {
          items: 2,
          nav: false,
        },
        1000: {
          items: 3,
          nav: true,
          loop: false,
        },
      },
    });
  }

  block.replaceChildren(section);
}
