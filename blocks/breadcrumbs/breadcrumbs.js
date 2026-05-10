import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const breadcrumbItems = [];
  const socialLinkItems = [];

  children.forEach((row) => {
    // Breadcrumb item has 3 cells: label, link, hierarchy-tree
    // However, the original HTML and block structure for rendering breadcrumbs only uses label and link.
    // The hierarchy-tree is a richtext field that is not rendered as part of the breadcrumb path itself.
    // We filter based on the number of cells for the breadcrumb-item model.
    if (row.children.length === 3) {
      breadcrumbItems.push(row);
    }
    // Social link item has 1 cell: link
    else if (row.children.length === 1 && row.querySelector('a')) {
      socialLinkItems.push(row);
    }
  });

  const section = document.createElement('section');
  section.classList.add('brands-bcrumbs-sec1');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const brandsBreadcrumbs = document.createElement('div');
  brandsBreadcrumbs.classList.add('brands-breadcrumbs');
  container.append(brandsBreadcrumbs);

  const breadcrumbsUl = document.createElement('ul');
  breadcrumbsUl.classList.add('mr-auto');
  brandsBreadcrumbs.append(breadcrumbsUl);

  breadcrumbItems.forEach((row) => {
    // According to the model, breadcrumb-item has: label, link, hierarchy-tree
    const [labelCell, linkCell] = [...row.children]; // Only use label and link for rendering
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');

    if (foundLink) {
      anchor.href = foundLink.href;
    } else {
      anchor.href = 'javascript:void(0);'; // Fallback for missing link
    }
    anchor.textContent = labelCell.textContent.trim();

    // Mark the last breadcrumb item as 'active' as per original HTML pattern
    if (breadcrumbItems.indexOf(row) === breadcrumbItems.length - 1) {
      li.classList.add('active');
    }

    moveInstrumentation(row, li);
    li.append(anchor);
    breadcrumbsUl.append(li);
  });

  const socialInfo = document.createElement('div');
  socialInfo.classList.add('social-info', 'bg_icon');
  brandsBreadcrumbs.append(socialInfo);

  const socialUl = document.createElement('ul');
  socialInfo.append(socialUl);

  socialLinkItems.forEach((row) => {
    const [linkCell] = [...row.children]; // Social link item has only one cell: link
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');

    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.target = '_blank'; // From original HTML
    }

    // Determine social icon based on href or some other indicator
    // This is a heuristic based on common social media URLs
    let iconClass = '';
    let liClass = '';
    if (anchor.href.includes('facebook.com')) {
      iconClass = 'fa-facebook-f';
      liClass = 'fb';
    } else if (anchor.href.includes('twitter.com')) {
      iconClass = 'fa-twitter';
      liClass = 'twit';
    } else if (anchor.href.includes('youtube.com')) {
      iconClass = 'fa-youtube';
      liClass = 'you-t';
    } else if (anchor.href.includes('instagram.com')) {
      iconClass = 'fa-instagram';
      liClass = 'insta';
    }

    if (iconClass) {
      li.classList.add(liClass);
      const icon = document.createElement('i');
      icon.classList.add('fab', iconClass);
      icon.setAttribute('aria-hidden', 'true');
      anchor.append(icon);
    }

    moveInstrumentation(row, li);
    li.append(anchor);
    socialUl.append(li);
  });

  block.replaceChildren(section);

  // Removed image optimization as there are no images in the original HTML or block structure
  // that require createOptimizedPicture.
}
