import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('brands-bcrumbs-sec1');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const brandsBreadcrumbs = document.createElement('div');
  brandsBreadcrumbs.classList.add('brands-breadcrumbs');
  container.append(brandsBreadcrumbs);

  const breadcrumbsList = document.createElement('ul');
  breadcrumbsList.classList.add('mr-auto');
  brandsBreadcrumbs.append(breadcrumbsList);

  const socialInfo = document.createElement('div');
  socialInfo.classList.add('social-info', 'bg_icon');
  brandsBreadcrumbs.append(socialInfo);

  const socialList = document.createElement('ul');
  socialInfo.append(socialList);

  const allRows = [...block.children];

  // Breadcrumb items have 3 cells, social links have 1 cell
  const breadcrumbRows = allRows.filter((row) => row.children.length === 3);
  const socialLinkRows = allRows.filter((row) => row.children.length === 1);

  breadcrumbRows.forEach((row) => {
    // Fixed schema for breadcrumb-item: label, link, hierarchy-tree
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    } else {
      anchor.href = 'javascript:void(0);'; // Fallback if no link
    }
    anchor.textContent = labelCell?.textContent.trim() || '';

    // The hierarchyTreeCell contains nested ULs, but the original HTML
    // for this block shows flat breadcrumbs. We will ignore the nested
    // hierarchy for the purpose of rendering the breadcrumbs in this block,
    // as per the original HTML structure.
    // If a future requirement needs the hierarchy as a dropdown,
    // this section would be expanded to build that structure.

    li.append(anchor);
    breadcrumbsList.append(li);
  });

  // Mark the last breadcrumb as active if there are any
  if (breadcrumbsList.lastElementChild) {
    breadcrumbsList.lastElementChild.classList.add('active');
  }

  socialLinkRows.forEach((row) => {
    // Fixed schema for social-link-item: link
    const [linkCell] = [...row.children];
    const foundLink = linkCell?.querySelector('a');
    const linkHref = foundLink?.href || '';

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const socialAnchor = document.createElement('a');
    socialAnchor.href = linkHref;
    socialAnchor.target = '_blank'; // As per original HTML

    const icon = document.createElement('i');

    // Determine social icon based on href and add classes from ORIGINAL HTML
    if (linkHref.includes('facebook.com')) {
      li.classList.add('fb');
      icon.classList.add('fab', 'fa-facebook-f');
    } else if (linkHref.includes('twitter.com')) {
      li.classList.add('twit');
      icon.classList.add('fab', 'fa-twitter');
    } else if (linkHref.includes('youtube.com')) {
      li.classList.add('you-t');
      icon.classList.add('fab', 'fa-youtube');
    } else if (linkHref.includes('instagram.com')) {
      li.classList.add('insta');
      icon.classList.add('fab', 'fa-instagram');
    }
    icon.setAttribute('aria-hidden', 'true');
    socialAnchor.append(icon);
    li.append(socialAnchor);
    socialList.append(li);
  });

  block.replaceChildren(section);
}
