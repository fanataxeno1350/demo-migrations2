import { createOptimizedPicture, moveInstrumentation } from '../../scripts/aem.js';

export default function decorate(block) {
  const [headlineRow, videoPosterRow, videoSrcRow] = [...block.children];

  const root = document.createElement('div');
  // The block itself already has the 'hero-banner' class from AEM.
  // The original HTML shows 'text-align-center' on an inner div, not the root.
  // The root element should match the outer div structure from ORIGINAL HTML.
  // Based on ORIGINAL HTML, the immediate wrapper inside the block is not 'text-align-center'.
  // The 'text-align-center' class is on the div with id 'front-web-banner-content-wrapper'.
  // Let's create the correct outer wrapper structure.
  // The block is <div class="hero-banner">.
  // The original HTML has <div id="front-web-banner"> as the immediate child of the block's content.
  // So, the root should be this div.
  root.id = 'front-web-banner'; // From ORIGINAL HTML

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('text-align-center'); // From ORIGINAL HTML
  contentWrapper.id = 'front-web-banner-content-wrapper'; // From ORIGINAL HTML
  root.append(contentWrapper);

  const caption = document.createElement('div');
  caption.id = 'front-web-banner-content-caption'; // From ORIGINAL HTML
  contentWrapper.append(caption);

  const headline = document.createElement('h2');
  headline.id = 'front-web-banner-content'; // From ORIGINAL HTML
  moveInstrumentation(headlineRow, headline);
  // FIX: headlineRow.children[0] is a div, its innerHTML is "<p>Headline text content</p>".
  // Assigning this to an <h2> creates <h2><p>...</p></h2>, which is invalid HTML.
  // We need to extract the content of the <p> tag.
  headline.innerHTML = headlineRow.querySelector('p')?.innerHTML || '';
  caption.append(headline);

  const video = document.createElement('video');
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.preload = 'metadata'; // From ORIGINAL HTML

  // Handle video poster image
  const posterPicture = videoPosterRow.querySelector('picture');
  if (posterPicture) {
    const posterImg = posterPicture.querySelector('img');
    if (posterImg) {
      // Create optimized picture for the poster
      const optimizedPosterPic = createOptimizedPicture(posterImg.src, posterImg.alt, false, [{ width: '750' }]);
      // The poster attribute expects a URL, not a picture element.
      // We need to get the src from the optimized picture's img.
      video.poster = optimizedPosterPic.querySelector('img').src;
      // Move instrumentation from the original row to the video element for the poster.
      moveInstrumentation(videoPosterRow, video);
    }
  }

  // Handle video source
  const videoSourcePicture = videoSrcRow.querySelector('picture');
  if (videoSourcePicture) {
    const videoSourceImg = videoSourcePicture.querySelector('img');
    if (videoSourceImg) {
      // Create optimized picture for the video source.
      // Note: createOptimizedPicture is typically for images, but we can use it to get an optimized URL if needed.
      // For video sources, we usually just take the direct src.
      // If the original image src is already a video file, we use it directly.
      const source = document.createElement('source');
      source.src = videoSourceImg.src; // Assuming img.src here is the video URL
      source.type = 'video/mp4'; // Assuming all video sources are mp4 as per original HTML
      video.append(source);
      // Move instrumentation from the original row to the video element for the source.
      moveInstrumentation(videoSrcRow, video);
    }
  }

  root.append(video);

  block.replaceChildren(root);

  // The original image optimization loop is redundant if createOptimizedPicture is used above.
  // However, if there are other images in the block not handled above, this would catch them.
  // In this specific block, all images are handled for video poster/source.
  // Keeping it for general safety, but it won't find anything here.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
