import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  // Consume the container placeholder row for 'cards' field
  const containerPlaceholder = allRows.shift();
  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('cmp-card__container');
  moveInstrumentation(containerPlaceholder, cardsWrapper);

  allRows
    .filter((row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''))
    .forEach((row) => {
      const [
        postLinkCell,
        brandLogoDesktopCell,
        brandLogoMobileCell,
        brandTitleCell,
        brandHandleCell,
        socialIconDesktopCell,
        socialIconMobileCell,
        descriptionCell,
        mainImageDesktopCell,
        mainImageMobileCell,
        ctaLabelCell,
      ] = [...row.children];

      const anchor = document.createElement('a');
      const foundPostLink = postLinkCell.querySelector('a');
      if (foundPostLink) {
        anchor.href = foundPostLink.href;
        anchor.target = '_self';
      }
      moveInstrumentation(row, anchor);

      const cardContent = document.createElement('div');
      cardContent.classList.add('cmp-card__content');
      cardContent.setAttribute('tabindex', '0');

      const cardInfo = document.createElement('div');
      cardInfo.classList.add('cmp-card__info');

      const cardItem = document.createElement('div');
      cardItem.classList.add('cmp-card__item');

      // Brand Logo (Desktop/Mobile)
      const brandLogoPictureDesktop = brandLogoDesktopCell.querySelector('picture');
      const brandLogoPictureMobile = brandLogoMobileCell.querySelector('picture');

      if (brandLogoPictureDesktop || brandLogoPictureMobile) {
        const brandLogoPicture = document.createElement('picture');
        if (brandLogoPictureMobile) {
          const sourceMobile = document.createElement('source');
          sourceMobile.media = '(max-width:767px)';
          sourceMobile.srcset = brandLogoPictureMobile.querySelector('img')?.src;
          brandLogoPicture.append(sourceMobile);
        }
        if (brandLogoPictureDesktop) {
          const img = brandLogoDesktopCell.querySelector('img'); // Fixed typo here
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '360' }]);
          optimizedPic.querySelector('img').classList.add('cmp-card__logo');
          optimizedPic.querySelector('img').setAttribute('itemprop', 'contentUrl');
          optimizedPic.querySelector('img').setAttribute('title', brandTitleCell.textContent.trim());
          brandLogoPicture.append(optimizedPic); // Append the whole picture element
        }
        cardItem.append(brandLogoPicture);
      }

      const cardTitle = document.createElement('div');
      cardTitle.classList.add('cmp-card__title');
      if (brandTitleCell.textContent.trim()) {
        const h3 = document.createElement('h3');
        h3.textContent = brandTitleCell.textContent.trim();
        cardTitle.append(h3);
      }
      if (brandHandleCell.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = brandHandleCell.textContent.trim();
        cardTitle.append(p);
      }
      cardItem.append(cardTitle);
      cardInfo.append(cardItem);

      // Social Icon (Desktop/Mobile)
      const socialIconPictureDesktop = socialIconDesktopCell.querySelector('picture');
      const socialIconPictureMobile = socialIconMobileCell.querySelector('picture');

      if (socialIconPictureDesktop || socialIconPictureMobile) {
        const socialIconPicture = document.createElement('picture');
        if (socialIconPictureMobile) {
          const sourceMobile = document.createElement('source');
          sourceMobile.media = '(max-width:767px)';
          sourceMobile.srcset = socialIconPictureMobile.querySelector('img')?.src;
          socialIconPicture.append(sourceMobile);
        }
        if (socialIconPictureDesktop) {
          const img = socialIconDesktopCell.querySelector('img');
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '360' }]);
          optimizedPic.querySelector('img').classList.add('cmp-card__facebook');
          optimizedPic.querySelector('img').setAttribute('itemprop', 'contentUrl');
          optimizedPic.querySelector('img').setAttribute('title', 'accesibility'); // Assuming a generic title
          socialIconPicture.append(optimizedPic); // Append the whole picture element
        }
        cardInfo.append(socialIconPicture);
      }

      cardContent.append(cardInfo);

      // Description
      const cardDescription = document.createElement('div');
      cardDescription.classList.add('cmp-card__description');
      if (descriptionCell.innerHTML.trim()) {
        const div = document.createElement('div'); // Changed from <p> to <div> to avoid <p> inside <p>
        div.classList.add('body-2');
        div.innerHTML = descriptionCell.innerHTML;
        cardDescription.append(div);
      }
      cardContent.append(cardDescription);

      // Main Image (Desktop/Mobile)
      const cardMedia = document.createElement('div');
      cardMedia.classList.add('cmp-card__media', 'youtube-url-wrapper');
      const mainImagePictureDesktop = mainImageDesktopCell.querySelector('picture');
      const mainImagePictureMobile = mainImageMobileCell.querySelector('picture');

      if (mainImagePictureDesktop || mainImagePictureMobile) {
        const mainImagePicture = document.createElement('picture');
        if (mainImagePictureMobile) {
          const sourceMobile = document.createElement('source');
          sourceMobile.media = '(max-width:767px)';
          sourceMobile.srcset = mainImagePictureMobile.querySelector('img')?.src;
          mainImagePicture.append(sourceMobile);
        }
        if (mainImagePictureDesktop) {
          const img = mainImageDesktopCell.querySelector('img');
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '360' }]);
          optimizedPic.querySelector('img').classList.add('cmp-card__product');
          optimizedPic.querySelector('img').setAttribute('itemprop', 'contentUrl');
          optimizedPic.querySelector('img').setAttribute('title', 'accessibility'); // Assuming generic title
          mainImagePicture.append(optimizedPic); // Append the whole picture element
        }
        cardMedia.append(mainImagePicture);
      }
      cardContent.append(cardMedia);

      // CTA Button
      if (ctaLabelCell.textContent.trim()) {
        const buttonWrapper = document.createElement('div');
        buttonWrapper.classList.add('button', 'cmp-button--primary-anchor-straight');
        const button = document.createElement('div');
        button.classList.add('cmp-button');
        const span = document.createElement('span');
        span.classList.add('cmp-button__text');
        span.textContent = ctaLabelCell.textContent.trim();
        button.append(span);
        buttonWrapper.append(button);
        cardContent.append(buttonWrapper);
      }

      anchor.append(cardContent);

      const cardContainer = document.createElement('div');
      cardContainer.classList.add('cmp-card--join-conversation', 'cmp-card--default');
      cardContainer.append(anchor);
      cardsWrapper.append(cardContainer);
    });

  const root = document.createElement('div');
  root.classList.add('cards');
  root.append(cardsWrapper);

  block.replaceChildren(root);
}
