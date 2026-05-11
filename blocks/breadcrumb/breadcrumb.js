import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const breadcrumbItems = [];
  const socialLinkItems = [];

  // Separate breadcrumb items from social link items based on cell count
  children.forEach((row) => {
    // breadcrumb-item has 3 cells: label, link, hierarchy-tree
    if (row.children.length === 3) {
      breadcrumbItems.push(row);
    }
    // social-link-item has 1 cell: link
    else if (row.children.length === 1) {
      socialLinkItems.push(row);
    }
  });

  const section = document.createElement('section');
  section.classList.add('brands-bcrumbs-sec1');
  moveInstrumentation(block, section); // Move instrumentation from block to section

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const brandsBreadcrumbs = document.createElement('div');
  brandsBreadcrumbs.classList.add('brands-breadcrumbs');
  container.append(brandsBreadcrumbs);

  // Breadcrumbs
  if (breadcrumbItems.length > 0) {
    const ul = document.createElement('ul');
    ul.classList.add('mr-auto');
    brandsBreadcrumbs.append(ul);

    breadcrumbItems.forEach((row, index) => {
      // Destructure cells according to 'breadcrumb-item' model: label, link, hierarchy-tree
      const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
      const li = document.createElement('li');
      moveInstrumentation(row, li); // Move instrumentation from row to li

      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      } else {
        anchor.href = 'javascript:void(0);';
      }
      anchor.textContent = labelCell.textContent.trim();
      li.append(anchor);

      if (index === breadcrumbItems.length - 1) {
        li.classList.add('active');
      }

      ul.append(li);

      // Although hierarchyTreeCell is not rendered in the final structure,
      // its instrumentation must be moved to prevent double rendering in UE.
      // We can move it to a temporary div or directly to the li if it's not
      // going to be used, but for safety, we'll move it to a detached element.
      // If it were to be rendered, we'd process its innerHTML.
      const tempHierarchyDiv = document.createElement('div');
      moveInstrumentation(hierarchyTreeCell, tempHierarchyDiv);
    });
  }

  // Social Links
  if (socialLinkItems.length > 0) {
    const socialInfo = document.createElement('div');
    socialInfo.classList.add('social-info', 'bg_icon');
    brandsBreadcrumbs.append(socialInfo);

    const socialUl = document.createElement('ul');
    socialInfo.append(socialUl);

    socialLinkItems.forEach((row) => {
      // Destructure cells according to 'social-link-item' model: link
      const [linkCell] = [...row.children];
      const li = document.createElement('li');
      moveInstrumentation(row, li); // Move instrumentation from row to li

      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
        anchor.target = '_blank'; // Social links typically open in new tab
      }

      let iconClass = '';
      let liClass = '';

      const href = foundLink ? foundLink.href.toLowerCase() : '';
      if (href.includes('facebook')) {
        iconClass = 'fab fa-facebook-f';
        liClass = 'fb';
      } else if (href.includes('twitter')) {
        iconClass = 'fab fa-twitter';
        liClass = 'twit';
      } else if (href.includes('youtube')) {
        iconClass = 'fab fa-youtube';
        liClass = 'you-t';
      } else if (href.includes('instagram')) {
        iconClass = 'fab fa-instagram';
        liClass = 'insta';
      }

      if (liClass) li.classList.add(liClass);
      if (iconClass) { // Only create icon if a specific class is found
        const icon = document.createElement('i');
        icon.classList.add(...iconClass.split(' '));
        icon.setAttribute('aria-hidden', 'true');
        anchor.append(icon);
      }
      li.append(anchor);
      socialUl.append(li);
    });
  }

  block.replaceChildren(section);
}
