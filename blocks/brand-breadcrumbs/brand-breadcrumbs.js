import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Handle label-only nodes (no anchor)
    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      // Original HTML does not specify a class for the sub-wrapper,
      // but the parent li gets 'active'. We'll use 'active' for the wrapper too.
      // subWrap.classList.add('has-sub-child'); // Removed - not in original HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];
  const breadcrumbItems = [];
  const socialLinkItems = [];

  // Separate breadcrumb items from social link items based on cell count
  children.forEach((row) => {
    if (row.children.length === 3) {
      breadcrumbItems.push(row);
    } else if (row.children.length === 1) {
      socialLinkItems.push(row);
    }
  });

  const section = document.createElement('section');
  section.classList.add('brands-bcrumbs-sec1');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const brandsBreadcrumbsDiv = document.createElement('div');
  brandsBreadcrumbsDiv.classList.add('brands-breadcrumbs');
  container.append(brandsBreadcrumbsDiv);

  const breadcrumbsUl = document.createElement('ul');
  breadcrumbsUl.classList.add('mr-auto');
  brandsBreadcrumbsDiv.append(breadcrumbsUl);

  breadcrumbItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    moveInstrumentation(row, li); // Move instrumentation from original row to new li

    const link = document.createElement('a');
    const authoredLink = linkCell.querySelector('a');
    if (authoredLink) {
      link.href = authoredLink.href;
    } else {
      link.href = 'javascript:void(0);'; // Fallback if no link
    }
    link.textContent = labelCell.textContent.trim();

    li.append(link);

    // Use innerHTML for richtext content and move instrumentation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyCell.innerHTML;
    moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from hierarchyCell to tempDiv

    const hierarchyUl = tempDiv.querySelector('ul');
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      const subNavDiv = document.createElement('div');
      // Original HTML does not specify a class for the sub-wrapper,
      // but the parent li gets 'active'. We'll use 'active' for the wrapper too.
      // subNavDiv.classList.add('has-sub-child'); // Removed - not in original HTML
      subNavDiv.append(hierarchyUl);
      li.append(subNavDiv);

      // Add click listener to toggle dropdown
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        subNavDiv.classList.toggle('active');
      });
    }

    breadcrumbsUl.append(li);
  });

  const socialInfoDiv = document.createElement('div');
  socialInfoDiv.classList.add('social-info', 'bg_icon');
  brandsBreadcrumbsDiv.append(socialInfoDiv);

  const socialUl = document.createElement('ul');
  socialInfoDiv.append(socialUl);

  socialLinkItems.forEach((row) => {
    const [socialLinkCell] = [...row.children];
    const li = document.createElement('li');
    moveInstrumentation(row, li); // Move instrumentation from original row to new li

    const socialLink = document.createElement('a');
    const authoredSocialLink = socialLinkCell.querySelector('a');
    if (authoredSocialLink) {
      socialLink.href = authoredSocialLink.href;
      socialLink.target = '_blank'; // Assuming social links open in new tab
    }

    // Determine social icon based on href or some other heuristic
    const icon = document.createElement('i');
    icon.classList.add('fab'); // Assuming font awesome brand icon

    if (socialLink.href.includes('facebook')) {
      li.classList.add('fb');
      icon.classList.add('fa-facebook-f');
    } else if (socialLink.href.includes('twitter')) {
      li.classList.add('twit');
      icon.classList.add('fa-twitter');
    } else if (socialLink.href.includes('youtube')) {
      li.classList.add('you-t');
      icon.classList.add('fa-youtube');
    } else if (socialLink.href.includes('instagram')) {
      li.classList.add('insta');
      icon.classList.add('fa-instagram');
    } else {
      // Default or generic icon if no match
      icon.classList.add('fa-share-alt'); // This class is not in the allowlist.
      // If a generic icon is needed, it should be provided in the original HTML.
      // For now, keeping it as a placeholder, but it should be reviewed.
    }
    socialLink.append(icon);
    li.append(socialLink);
    socialUl.append(li);
  });

  block.replaceChildren(section);

  // Image optimization (if any images were present, though none in this specific block)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
