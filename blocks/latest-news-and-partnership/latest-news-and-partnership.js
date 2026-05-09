import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Root-level fields as per BlockJson model
  // block.children[0]: sectionTitle
  // block.children[1]: newsList (container, no content here, its items are below)
  // block.children[2]: moreNewsLink
  // block.children[3]: moreNewsLabel
  // block.children[4]: topNewsList (container, no content here, its items are below)
  // block.children[5]: partnershipCtaLink
  // block.children[6]: partnershipCtaLabel

  // Destructure the fixed root-level rows
  const [
    sectionTitleRow,
    newsListContainerRow, // This is a placeholder row for the container, its items are below
    moreNewsLinkRow,
    moreNewsLabelRow,
    topNewsListContainerRow, // This is a placeholder row for the container, its items are below
    partnershipCtaLinkRow,
    partnershipCtaLabelRow,
    ...itemRows // All subsequent rows are item rows
  ] = children;

  // Separate item rows based on cell count as per BlockJson model
  // news-list-item has 3 cells: newsTitle, newsLink, newsBody
  // top-news-item has 4 cells: newsTitle, newsLink, newsSubHeading, newsImage
  const newsListItems = itemRows.filter((row) => row.children.length === 3);
  const topNewsItems = itemRows.filter((row) => row.children.length === 4);

  const root = document.createElement('div');
  root.classList.add('row', 'row-pad', 'align-items-center');
  root.id = 'front-latest-news';

  const col1 = document.createElement('div');
  col1.classList.add('col-md-4');
  root.append(col1);

  const col1Content = document.createElement('div');
  col1Content.classList.add('field', 'field--name-field-column-1-widgets', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__item');
  col1.append(col1Content);

  const col1Paragraph = document.createElement('div');
  col1Paragraph.classList.add('paragraph', 'paragraph--type--column-content', 'paragraph--view-mode--default');
  col1Content.append(col1Paragraph);

  const col1Items = document.createElement('div');
  col1Items.classList.add('field', 'field--name-field-column-content', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__items');
  col1Paragraph.append(col1Items);

  // Section Title
  const sectionTitleItem = document.createElement('div');
  sectionTitleItem.classList.add('field__item');
  col1Items.append(sectionTitleItem);

  const sectionTitleParagraph = document.createElement('div');
  sectionTitleParagraph.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
  sectionTitleItem.append(sectionTitleParagraph);

  const sectionTitleDiv = document.createElement('div');
  sectionTitleDiv.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
  const sectionTitleH3 = document.createElement('h3');
  sectionTitleH3.classList.add('front-section-title');
  // sectionTitle is type=text, read from cell.textContent.trim()
  sectionTitleH3.textContent = sectionTitleRow.children[0]?.textContent.trim() || '';
  moveInstrumentation(sectionTitleRow, sectionTitleH3);
  sectionTitleDiv.append(sectionTitleH3);
  sectionTitleParagraph.append(sectionTitleDiv);

  // News List
  const newsListItem = document.createElement('div');
  newsListItem.classList.add('field__item');
  col1Items.append(newsListItem);

  const newsListParagraph = document.createElement('div');
  newsListParagraph.classList.add('paragraph', 'paragraph--type--content-list', 'paragraph--view-mode--default');
  newsListItem.append(newsListParagraph);

  const newsListViewField = document.createElement('div');
  newsListViewField.classList.add('field', 'field--name-field-content-view', 'field--type-viewfield', 'field--label-visually_hidden');
  newsListParagraph.append(newsListViewField);

  const newsViewLabel = document.createElement('div');
  newsViewLabel.classList.add('field__label', 'visually-hidden');
  newsViewLabel.textContent = 'Content View';
  newsListViewField.append(newsViewLabel);

  const newsViewItem = document.createElement('div');
  newsViewItem.classList.add('field__item', 'field__item-label-hidden');
  newsListViewField.append(newsViewItem);

  const newsViewsElementContainer = document.createElement('div');
  newsViewsElementContainer.classList.add('views-element-container');
  newsViewItem.append(newsViewsElementContainer);

  const newsView = document.createElement('div');
  newsView.classList.add('view', 'view-content-article-list', 'view-id-content_article_list', 'view-display-id-thumb_title_body', 'js-view-dom-id-9df85f8c7a11c3e297d075ddacce2c335dcc286876ca80ceb2017324e6b2ee45');
  newsViewsElementContainer.append(newsView);

  const newsViewContent = document.createElement('div');
  newsViewContent.classList.add('view-content', 'row');
  // newsListContainerRow is a placeholder, move instrumentation from it
  moveInstrumentation(newsListContainerRow, newsViewContent);
  newsView.append(newsViewContent);

  newsListItems.forEach((row) => {
    // news-list-item has 3 cells: newsTitle, newsLink, newsBody
    const [newsTitleCell, newsLinkCell, newsBodyCell] = [...row.children];

    const newsRowDiv = document.createElement('div');
    newsRowDiv.classList.add('col-md-12', 'frontpage-sidebar-news', 'views-row');
    moveInstrumentation(row, newsRowDiv);
    newsViewContent.append(newsRowDiv);

    const titleField = document.createElement('div');
    titleField.classList.add('views-field', 'views-field-title');
    const titleH4 = document.createElement('h4');
    titleH4.classList.add('field-content');
    const titleLink = document.createElement('a');
    // newsLink is type=aem-content, read from cell.querySelector('a').href
    titleLink.href = newsLinkCell?.querySelector('a')?.href || '#';
    // newsTitle is type=text, read from cell.textContent.trim()
    titleLink.textContent = newsTitleCell?.textContent.trim() || '';
    titleH4.append(titleLink);
    titleField.append(titleH4);
    newsRowDiv.append(titleField);

    const bodyField = document.createElement('div');
    bodyField.classList.add('views-field', 'views-field-body');
    const bodyContent = document.createElement('div');
    bodyContent.classList.add('field-content');
    // newsBody is type=richtext, read from cell.innerHTML
    bodyContent.innerHTML = newsBodyCell?.innerHTML || '';
    bodyField.append(bodyContent);
    newsRowDiv.append(bodyField);

    const hrField = document.createElement('div');
    hrField.classList.add('views-field', 'views-field-nothing');
    const hrSpan = document.createElement('span');
    hrSpan.classList.add('field-content');
    hrSpan.innerHTML = '<hr/>';
    hrField.append(hrSpan);
    newsRowDiv.append(hrField);
  });

  // More News Link
  const moreNewsItem = document.createElement('div');
  moreNewsItem.classList.add('field__item');
  col1Items.append(moreNewsItem);

  const moreNewsParagraph = document.createElement('div');
  moreNewsParagraph.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
  moreNewsItem.append(moreNewsParagraph);

  const moreNewsDiv = document.createElement('div');
  moreNewsDiv.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
  const moreNewsP = document.createElement('p');
  const moreNewsLink = document.createElement('a');
  moreNewsLink.classList.add('btn', 'btn-primary');
  // moreNewsLink is type=aem-content, read from cell.querySelector('a').href
  moreNewsLink.href = moreNewsLinkRow.children[0]?.querySelector('a')?.href || '#';
  const moreNewsSpan = document.createElement('span');
  moreNewsSpan.classList.add('text');
  // moreNewsLabel is type=text, read from cell.textContent.trim()
  moreNewsSpan.textContent = moreNewsLabelRow.children[0]?.textContent.trim() || '';
  moreNewsLink.append(moreNewsSpan);
  moveInstrumentation(moreNewsLinkRow, moreNewsLink);
  moveInstrumentation(moreNewsLabelRow, moreNewsSpan);
  moreNewsP.append(document.createElement('br'));
  moreNewsP.append(moreNewsLink);
  moreNewsDiv.append(moreNewsP);
  moreNewsParagraph.append(moreNewsDiv);

  const col2 = document.createElement('div');
  col2.classList.add('col-md-8');
  root.append(col2);

  const col2Content = document.createElement('div');
  col2Content.classList.add('field', 'field--name-field-column-2-widgets', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__item');
  col2.append(col2Content);

  const col2Paragraph = document.createElement('div');
  col2Paragraph.classList.add('paragraph', 'paragraph--type--column-content', 'paragraph--view-mode--default');
  col2Content.append(col2Paragraph);

  const col2Items = document.createElement('div');
  col2Items.classList.add('field', 'field--name-field-column-content', 'field--type-entity-reference-revisions', 'field--label-hidden', 'field__items');
  col2Paragraph.append(col2Items);

  // Top News List
  const topNewsListItem = document.createElement('div');
  topNewsListItem.classList.add('field__item');
  col2Items.append(topNewsListItem);

  const topNewsListParagraph = document.createElement('div');
  topNewsListParagraph.classList.add('paragraph', 'paragraph--type--content-list', 'paragraph--view-mode--default');
  topNewsListItem.append(topNewsListParagraph);

  const topNewsListViewField = document.createElement('div');
  topNewsListViewField.classList.add('field', 'field--name-field-content-view', 'field--type-viewfield', 'field--label-visually_hidden');
  topNewsListParagraph.append(topNewsListViewField);

  const topNewsViewLabel = document.createElement('div');
  topNewsViewLabel.classList.add('field__label', 'visually-hidden');
  topNewsViewLabel.textContent = 'Content View';
  topNewsListViewField.append(topNewsViewLabel);

  const topNewsViewItem = document.createElement('div');
  topNewsViewItem.classList.add('field__item', 'field__item-label-hidden');
  topNewsListViewField.append(topNewsViewItem);

  const topNewsViewsElementContainer = document.createElement('div');
  topNewsViewsElementContainer.classList.add('views-element-container');
  topNewsViewItem.append(topNewsViewsElementContainer);

  const topNewsView = document.createElement('div');
  topNewsView.classList.add('view', 'view-content-article-list', 'view-id-content_article_list', 'view-display-id-block_1', 'js-view-dom-id-821b1d6116b29c47fef52a5ac7e0c7b3c4c8fdf42de0e9fcad9d736674c40c7b');
  topNewsViewsElementContainer.append(topNewsView);

  const topNewsViewContent = document.createElement('div');
  topNewsViewContent.classList.add('view-content', 'row');
  // topNewsListContainerRow is a placeholder, move instrumentation from it
  moveInstrumentation(topNewsListContainerRow, topNewsViewContent);
  topNewsView.append(topNewsViewContent);

  topNewsItems.forEach((row) => {
    // top-news-item has 4 cells: newsTitle, newsLink, newsSubHeading, newsImage
    const [newsTitleCell, newsLinkCell, newsSubHeadingCell, newsImageCell] = [...row.children];

    const topNewsRowDiv = document.createElement('div');
    topNewsRowDiv.classList.add('col-md-12', 'frontpage-top-news', 'views-row');
    moveInstrumentation(row, topNewsRowDiv);
    topNewsViewContent.append(topNewsRowDiv);

    const titleField = document.createElement('div');
    titleField.classList.add('views-field', 'views-field-title');
    const titleH4 = document.createElement('h4');
    titleH4.classList.add('field-content');
    const titleLink = document.createElement('a');
    // newsLink is type=aem-content, read from cell.querySelector('a').href
    titleLink.href = newsLinkCell?.querySelector('a')?.href || '#';
    // newsTitle is type=text, read from cell.textContent.trim()
    titleLink.textContent = newsTitleCell?.textContent.trim() || '';
    titleH4.append(titleLink);
    titleField.append(titleH4);
    topNewsRowDiv.append(titleField);

    const subHeadingField = document.createElement('div');
    subHeadingField.classList.add('views-field', 'views-field-field-news-sub-heading');
    const subHeadingH5 = document.createElement('h5');
    subHeadingH5.classList.add('field-content');
    // newsSubHeading is type=text, read from cell.textContent.trim()
    subHeadingH5.textContent = newsSubHeadingCell?.textContent.trim() || '';
    subHeadingField.append(subHeadingH5);
    topNewsRowDiv.append(subHeadingField);

    const mediaField = document.createElement('div');
    mediaField.classList.add('views-field', 'views-field-field-add-media');
    const mediaContent = document.createElement('div');
    mediaContent.classList.add('field-content');
    // newsImage is type=reference, read from cell.querySelector('picture')
    const picture = newsImageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      mediaContent.append(optimizedPic);
    }
    mediaField.append(mediaContent);
    topNewsRowDiv.append(mediaField);
  });

  // Partnership CTA
  const partnershipCtaItem = document.createElement('div');
  partnershipCtaItem.classList.add('field__item');
  col2Items.append(partnershipCtaItem);

  const partnershipCtaParagraph = document.createElement('div');
  partnershipCtaParagraph.classList.add('paragraph', 'paragraph--type--text', 'paragraph--view-mode--default');
  partnershipCtaItem.append(partnershipCtaParagraph);

  const partnershipCtaDiv = document.createElement('div');
  partnershipCtaDiv.classList.add('clearfix', 'text-formatted', 'field', 'field--name-field-longtext', 'field--type-text-long', 'field--label-hidden', 'field__item');
  const partnershipCtaP = document.createElement('p');
  partnershipCtaP.innerHTML = '<hr/>'; // Add the <hr/> as seen in original HTML

  const partnershipCtaLink = document.createElement('a');
  partnershipCtaLink.classList.add('btn', 'btn-primary', 'btn-lg');
  // partnershipCtaLink is type=aem-content, read from cell.querySelector('a').href
  partnershipCtaLink.href = partnershipCtaLinkRow.children[0]?.querySelector('a')?.href || '#';

  const svgLeft = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgLeft.classList.add('svg-inline--fa', 'fa-hand-point-right', 'fa-w-16');
  svgLeft.setAttribute('aria-hidden', 'true');
  svgLeft.setAttribute('focusable', 'false');
  svgLeft.setAttribute('data-prefix', 'fas');
  svgLeft.setAttribute('data-icon', 'hand-point-right');
  svgLeft.setAttribute('role', 'img');
  svgLeft.setAttribute('viewBox', '0 0 512 512');
  svgLeft.setAttribute('data-fa-i2svg', '');
  svgLeft.innerHTML = '<path fill="currentColor" d="M512 199.652c0 23.625-20.65 43.826-44.8 43.826h-99.851c16.34 17.048 18.346 49.766-6.299 70.944 14.288 22.829 2.147 53.017-16.45 62.315C353.574 425.878 322.654 448 272 448c-2.746 0-13.276-.203-16-.195-61.971.168-76.894-31.065-123.731-38.315C120.596 407.683 112 397.599 112 385.786V214.261l.002-.001c.011-18.366 10.607-35.889 28.464-43.845 28.886-12.994 95.413-49.038 107.534-77.323 7.797-18.194 21.384-29.084 40-29.092 34.222-.014 57.752 35.098 44.119 66.908-3.583 8.359-8.312 16.67-14.153 24.918H467.2c23.45 0 44.8 20.543 44.8 43.826zM96 200v192c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V200c0-13.255 10.745-24 24-24h48c13.255 0 24 10.745 24 24zM68 368c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z"></path>';

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('text');
  // partnershipCtaLabel is type=text, read from cell.textContent.trim()
  ctaSpan.innerHTML = `&nbsp;&nbsp;${partnershipCtaLabelRow.children[0]?.textContent.trim() || ''}&nbsp;&nbsp;`;

  const svgRight = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgRight.classList.add('svg-inline--fa', 'fa-hand-point-left', 'fa-w-16');
  svgRight.setAttribute('aria-hidden', 'true');
  svgRight.setAttribute('focusable', 'false');
  svgRight.setAttribute('data-prefix', 'fas');
  svgRight.setAttribute('data-icon', 'hand-point-left');
  svgRight.setAttribute('role', 'img');
  svgRight.setAttribute('viewBox', '0 0 512 512');
  svgRight.setAttribute('data-fa-i2svg', '');
  svgRight.innerHTML = '<path fill="currentColor" d="M44.8 155.826h149.234c-5.841-8.248-10.57-16.558-14.153-24.918C166.248 99.098 189.778 63.986 224 64c18.616.008 32.203 10.897 40 29.092 12.122 28.286 78.648 64.329 107.534 77.323 17.857 7.956 28.453 25.479 28.464 43.845l.002.001v171.526c0 11.812-8.596 21.897-20.269 23.703-46.837 7.25-61.76 38.483-123.731 38.315-2.724-.007-13.254.195-16 .195-50.654 0-81.574-22.122-72.6-71.263-18.597-9.297-30.738-39.486-16.45-62.315-24.645-21.177-22.639-53.896-6.299-70.944H44.8c-24.15 0-44.8-20.201-44.8-43.826 0-23.283 21.35-43.826 44.8-43.826zM440 176h48c13.255 0 24 10.745 24 24v192c0 13.255-10.745 24-24 24h-48c-13.255 0-24-10.745-24-24V200c0-13.255 10.745-24 24-24zm24 212c11.046 0 20-8.954-20-20s-8.954-20-20-20-20 8.954-20 20 8.954 20 20 20z"></path>';

  partnershipCtaLink.append(svgLeft, ctaSpan, svgRight);
  moveInstrumentation(partnershipCtaLinkRow, partnershipCtaLink);
  moveInstrumentation(partnershipCtaLabelRow, ctaSpan);
  partnershipCtaP.append(partnershipCtaLink);
  partnershipCtaDiv.append(partnershipCtaP);
  partnershipCtaParagraph.append(partnershipCtaDiv);

  block.replaceChildren(root);
}
