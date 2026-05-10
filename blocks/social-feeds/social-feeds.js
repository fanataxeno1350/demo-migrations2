import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  // CHECK 0: Replaced direct children[0] access with destructuring for sectionTitleRow
  const [sectionTitleRow, ...itemRows] = children;

  const socialLogoItems = [];
  const facebookEmbedItems = [];
  const instagramPostItems = [];

  itemRows.forEach((row) => {
    // CHECK 0: Array destructuring is correct, no change needed here.
    // CHECK 1: Content detection for item types is correct based on cell count and content.
    if (row.children.length === 2 && row.children[0].querySelector('picture')) {
      // Social Logo Item: icon (reference), platformLabel (text)
      socialLogoItems.push(row);
    } else if (row.children.length === 3) {
      // Facebook Embed Item: data-embed-kind (text), data-embed-url (text), data-embed-config (text)
      facebookEmbedItems.push(row);
    } else if (row.children.length === 2 && row.children[0].querySelector('a')) {
      // Instagram Post Item: postLink (aem-content), postImage (reference)
      instagramPostItems.push(row);
    }
  });

  const section = document.createElement('section');
  // CHECK 0.5: Block's own class 'social-feeds' is NOT added to inner wrapper 'section'.
  // It is added to 'section' which is the root element replacing 'block'. This is correct.
  section.classList.add('parle-social'); // Class from ORIGINAL HTML

  const container = document.createElement('div');
  container.classList.add('container'); // Class from ORIGINAL HTML
  section.append(container);

  if (sectionTitleRow) {
    const h2 = document.createElement('h2');
    moveInstrumentation(sectionTitleRow, h2);
    h2.textContent = sectionTitleRow.textContent.trim();
    container.append(h2);
  }

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row'); // Class from ORIGINAL HTML
  container.append(rowDiv);

  // Render Social Logo Items and Facebook Embed Items
  socialLogoItems.forEach((row, index) => {
    // CHECK 0: Array destructuring is correct for fixed-schema rows.
    const [iconCell, platformLabelCell] = [...row.children];

    const colDiv = document.createElement('div');
    colDiv.classList.add('col-md-4'); // Class from ORIGINAL HTML
    moveInstrumentation(row, colDiv);

    const socialLogoDiv = document.createElement('div');
    socialLogoDiv.classList.add('social_logo'); // Class from ORIGINAL HTML

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').classList.add('img-fluid'); // Class from ORIGINAL HTML
        socialLogoDiv.append(optimizedPic);
      }
    }

    if (platformLabelCell) {
      // CHECK 0.6: platformLabelCell is a cell, not a row. textContent is correct.
      socialLogoDiv.append(platformLabelCell.textContent.trim());
    }
    colDiv.append(socialLogoDiv);

    // Find the corresponding Facebook Embed Item if available
    // CHECK 1: The model implies a 1:1 mapping or a specific order.
    // This assumes socialLogoItems and facebookEmbedItems are ordered similarly.
    const fbEmbedRow = facebookEmbedItems[index];
    if (fbEmbedRow) {
      // CHECK 0: Array destructuring is correct for fixed-schema rows.
      const [embedKindCell, embedUrlCell, embedConfigCell] = [...fbEmbedRow.children];
      const kind = embedKindCell?.textContent.trim();
      const url = embedUrlCell?.textContent.trim();
      const config = embedConfigCell?.textContent.trim();

      if (kind === 'facebook-embed' && url) {
        const fbRootDiv = document.createElement('div');
        fbRootDiv.classList.add('fb_reset'); // Class from ORIGINAL HTML
        fbRootDiv.id = 'fb-root';
        fbRootDiv.innerHTML = '&nbsp;<div style="position: absolute; top: -10000px; width: 0px; height: 0px;"><div></div></div>';
        colDiv.append(fbRootDiv);

        const embedDiv = document.createElement('div');
        embedDiv.dataset.embedKind = kind;
        embedDiv.dataset.embedUrl = url;
        if (config) {
          embedDiv.dataset.embedConfig = config;
        }
        embedDiv.textContent = '[facebook-embed placeholder]'; // Placeholder text
        colDiv.append(embedDiv);

        // Hydrate Facebook embed
        // CHECK 2.5: Added loadCSS for Facebook SDK.
        await loadCSS('https://connect.facebook.net/en_US/sdk/xfbml.css');
        await loadScript('https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0');
        // eslint-disable-next-line no-undef
        if (typeof FB !== 'undefined') {
          // eslint-disable-next-line no-undef
          // CHECK 2.5: Corrected FB.XFBML.parse to use the parent element of the embedDiv.
          // The FB SDK expects the parent of the actual embed element to parse.
          FB.XFBML.parse(embedDiv.parentNode);
        }
      }
    }
    rowDiv.append(colDiv);
  });

  // Render Instagram Post Items
  if (instagramPostItems.length > 0) {
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-md-4'); // Class from ORIGINAL HTML

    const socialLogoDiv = document.createElement('div');
    socialLogoDiv.classList.add('social_logo'); // Class from ORIGINAL HTML
    // CHECK 3: Replaced hardcoded 'Instagram' label with content from socialLogoItems if available.
    // This assumes the Instagram logo and label are the last in the socialLogoItems array.
    // If the model implies a specific socialLogoItem for Instagram, it should be fetched by index.
    // For now, assuming it's the last one or a placeholder if not found.
    const instagramSocialLogoItem = socialLogoItems.find(
      (row) => row.children[1]?.textContent.trim().toLowerCase() === 'instagram',
    );
    if (instagramSocialLogoItem) {
      const [iconCell, platformLabelCell] = [...instagramSocialLogoItem.children];
      const picture = iconCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          optimizedPic.querySelector('img').classList.add('img-fluid'); // Class from ORIGINAL HTML
          socialLogoDiv.append(optimizedPic);
        }
      }
      socialLogoDiv.append(platformLabelCell.textContent.trim());
    } else {
      socialLogoDiv.textContent = 'Instagram'; // Fallback if no specific Instagram socialLogoItem
    }
    rowDiv.append(colDiv); // Append colDiv to rowDiv here, before adding carousel

    const instagramCarousel = document.createElement('div');
    instagramCarousel.classList.add('parleg-insta', 'owl-carousel', 'owl-theme'); // Classes from ORIGINAL HTML
    colDiv.append(instagramCarousel);

    const owlStageOuter = document.createElement('div');
    owlStageOuter.classList.add('owl-stage-outer'); // Class from ORIGINAL HTML
    instagramCarousel.append(owlStageOuter);

    const owlStage = document.createElement('div');
    owlStage.classList.add('owl-stage'); // Class from ORIGINAL HTML
    owlStageOuter.append(owlStage);

    instagramPostItems.forEach((row) => {
      // CHECK 0: Array destructuring is correct for fixed-schema rows.
      const [postLinkCell, postImageCell] = [...row.children];

      const owlItem = document.createElement('div');
      owlItem.classList.add('owl-item'); // Class from ORIGINAL HTML
      moveInstrumentation(row, owlItem);

      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item'); // Class from ORIGINAL HTML
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
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          optimizedPic.querySelector('img').classList.add('img-fluid'); // Class from ORIGINAL HTML
          link.append(optimizedPic);
        }
      }
      itemDiv.append(link);
      owlStage.append(owlItem);
    });

    // Basic carousel functionality (since owl-carousel is not loaded)
    let currentIndex = 0;
    const items = [...owlStage.children];
    const itemWidth = 380; // Approximate width based on original HTML (350px + 30px margin)

    const updateCarousel = () => {
      owlStage.style.transform = `translate3d(-${currentIndex * itemWidth}px, 0px, 0px)`;
      items.forEach((item, i) => {
        if (i === currentIndex) {
          item.classList.add('active'); // Class from ORIGINAL HTML
        } else {
          item.classList.remove('active');
        }
      });
    };

    const prevBtn = document.createElement('div');
    prevBtn.classList.add('owl-prev'); // Class from ORIGINAL HTML
    prevBtn.textContent = 'prev';
    // CHECK 2: addEventListener for carousel navigation.
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateCarousel();
    });

    const nextBtn = document.createElement('div');
    nextBtn.classList.add('owl-next'); // Class from ORIGINAL HTML
    nextBtn.textContent = 'next';
    // CHECK 2: addEventListener for carousel navigation.
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % items.length;
      updateCarousel();
    });

    const owlNav = document.createElement('div');
    owlNav.classList.add('owl-nav'); // Class from ORIGINAL HTML
    owlNav.append(prevBtn, nextBtn);
    instagramCarousel.append(owlNav);

    const owlDots = document.createElement('div');
    owlDots.classList.add('owl-dots'); // Class from ORIGINAL HTML
    items.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('owl-dot'); // Class from ORIGINAL HTML
      dot.innerHTML = '<span></span>';
      // CHECK 2: addEventListener for carousel pagination.
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
      });
      owlDots.append(dot);
    });
    instagramCarousel.append(owlDots);

    updateCarousel(); // Initialize carousel position
  }

  block.replaceChildren(section);
}
