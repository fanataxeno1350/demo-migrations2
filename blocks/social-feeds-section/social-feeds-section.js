import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const sectionTitleRow = children[0];
  // Use destructuring for fixed schema rows, content detection for variable schema
  const socialLogoRows = children.filter((row) => row.children.length === 2 && row.querySelector('picture'));
  const facebookEmbedRows = children.filter((row) => row.children.length === 3);
  const instagramFeedRows = children.filter((row) => row.children.length === 2 && row.querySelector('a') && row.querySelector('picture'));

  const root = document.createElement('section');
  root.classList.add('parle-social'); // From ORIGINAL HTML

  const container = document.createElement('div');
  container.classList.add('container'); // From ORIGINAL HTML
  root.append(container);

  // Section Title
  if (sectionTitleRow) {
    const title = document.createElement('h2');
    moveInstrumentation(sectionTitleRow, title);
    title.textContent = sectionTitleRow.textContent.trim();
    container.append(title);
  }

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row'); // From ORIGINAL HTML
  container.append(rowDiv);

  // Social Logos and Facebook Embed
  const socialSection = document.createElement('div');
  socialSection.classList.add('col-md-4'); // From ORIGINAL HTML
  rowDiv.append(socialSection);

  socialLogoRows.forEach((row) => {
    const [iconCell, labelCell] = [...row.children]; // Destructuring for fixed schema
    const socialLogoDiv = document.createElement('div');
    socialLogoDiv.classList.add('social_logo'); // From ORIGINAL HTML
    moveInstrumentation(row, socialLogoDiv);

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: 'auto' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      socialLogoDiv.append(optimizedPic);
    }

    const labelText = document.createTextNode(labelCell.textContent.trim());
    socialLogoDiv.append(labelText);
    socialSection.append(socialLogoDiv);
  });

  facebookEmbedRows.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children]; // Destructuring for fixed schema
    const embedKind = embedKindCell.textContent.trim();
    const embedUrl = embedUrlCell.textContent.trim();
    const embedConfig = embedConfigCell.textContent.trim();

    const embedDiv = document.createElement('div');
    embedDiv.dataset.embedKind = embedKind;
    embedDiv.dataset.embedUrl = embedUrl;
    embedDiv.dataset.embedConfig = embedConfig;
    moveInstrumentation(row, embedDiv);

    if (embedKind === 'facebook-embed') {
      const fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      fbRoot.classList.add('fb_reset'); // From ORIGINAL HTML
      embedDiv.prepend(fbRoot); // Prepend to embedDiv, not block

      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v10.0&appId=YOUR_APP_ID&autoLogAppEvents=1'; // Placeholder for appId
      embedDiv.append(script);

      const pagePlugin = document.createElement('div');
      pagePlugin.classList.add('fb-page');
      pagePlugin.dataset.href = embedUrl;
      pagePlugin.dataset.tabs = 'timeline';
      pagePlugin.dataset.width = '380';
      pagePlugin.dataset.height = '200';
      pagePlugin.dataset.smallHeader = 'false';
      pagePlugin.dataset.adaptContainerWidth = 'true';
      pagePlugin.dataset.hideCover = 'false';
      pagePlugin.dataset.showFacepile = 'true';
      embedDiv.append(pagePlugin);
    }
    socialSection.append(embedDiv);
  });

  // Instagram Feed
  const instagramSection = document.createElement('div');
  instagramSection.classList.add('col-md-4'); // From ORIGINAL HTML
  rowDiv.append(instagramSection);

  if (instagramFeedRows.length > 0) {
    const instagramLogoDiv = document.createElement('div');
    instagramLogoDiv.classList.add('social_logo'); // From ORIGINAL HTML

    // Read Instagram logo image and text from the first instagramFeedRow if available, or hardcode if not
    // Assuming the Instagram logo is part of the first instagramFeedRow's image/link or a separate row.
    // For now, let's assume it's a hardcoded asset in the original HTML, but we should extract it from content if possible.
    // As per the original HTML, the logo and text are directly inside social_logo div.
    // We need to extract the image and text from the content or hardcode if not available in model.
    // For now, let's create a placeholder for the image and text, as the original HTML has a hardcoded image.
    // TODO: Add a field for Instagram logo and text in the block model if it's meant to be editable.
    // For now, we'll replicate the original HTML structure for the logo.
    const instagramLogoImg = document.createElement('img');
    instagramLogoImg.classList.add('img-fluid');
    instagramLogoImg.src = '/content/dam/aemigrate/uploaded-folder/www-parleproducts-com/image/instagram-9455ed.png'; // Hardcoded as per original HTML structure
    instagramLogoDiv.append(instagramLogoImg);
    instagramLogoDiv.append(document.createTextNode(' Instagram')); // Hardcoded text as per original HTML structure
    instagramSection.append(instagramLogoDiv);

    // Load Swiper.js assets
    await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

    const instagramCarousel = document.createElement('div');
    instagramCarousel.classList.add('parleg-insta', 'owl-carousel', 'owl-theme'); // From ORIGINAL HTML

    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('owl-stage-outer'); // Mimic original structure
    instagramCarousel.append(swiperWrapper);

    const swiperStage = document.createElement('div');
    swiperStage.classList.add('owl-stage', 'swiper-wrapper'); // Mimic original structure, add swiper-wrapper
    swiperWrapper.append(swiperStage);

    instagramFeedRows.forEach((row) => {
      const [linkCell, imageCell] = [...row.children]; // Destructuring for fixed schema
      const owlItem = document.createElement('div');
      owlItem.classList.add('owl-item', 'swiper-slide'); // From ORIGINAL HTML, add swiper-slide

      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item'); // From ORIGINAL HTML
      moveInstrumentation(row, itemDiv);

      const link = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.target = '_blank';
      }

      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: 'auto' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        link.append(optimizedPic);
      }
      itemDiv.append(link);
      owlItem.append(itemDiv);
      swiperStage.append(owlItem);
    });

    // Swiper Navigation
    const owlNav = document.createElement('div');
    owlNav.classList.add('owl-nav'); // From ORIGINAL HTML

    const prevButton = document.createElement('div');
    prevButton.classList.add('owl-prev'); // From ORIGINAL HTML
    prevButton.textContent = 'prev'; // Placeholder text, consider using SVG or CSS for icons
    owlNav.append(prevButton);

    const nextButton = document.createElement('div');
    nextButton.classList.add('owl-next'); // From ORIGINAL HTML
    nextButton.textContent = 'next'; // Placeholder text, consider using SVG or CSS for icons
    owlNav.append(nextButton);
    instagramCarousel.append(owlNav);

    // Swiper Pagination (dots)
    const owlDots = document.createElement('div');
    owlDots.classList.add('owl-dots'); // From ORIGINAL HTML
    instagramCarousel.append(owlDots);

    instagramSection.append(instagramCarousel);

    // Initialize Swiper
    // eslint-disable-next-line no-undef
    new Swiper(instagramCarousel, {
      slidesPerView: 'auto',
      loop: false, // Original HTML doesn't show explicit loop, assuming false
      navigation: {
        prevEl: prevButton,
        nextEl: nextButton,
      },
      pagination: {
        el: owlDots,
        clickable: true,
        renderBullet: (index, className) => `<div class="${className}"><span></span></div>`,
      },
    });
  }

  // Replace all block content with the new structure
  block.replaceChildren(root);

  // Remove redundant image optimization as createOptimizedPicture is used directly
  // block.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });
}
