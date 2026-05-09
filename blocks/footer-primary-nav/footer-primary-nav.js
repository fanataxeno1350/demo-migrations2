import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, originalCell) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

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
      // Using a generic class as 'has-sub-child' is not in original HTML
      // If original HTML had a specific class for this, it should be used.
      subWrap.classList.add('nested-list-wrapper'); // Generic class, consider if a specific one is needed from original HTML
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
    // Move instrumentation for each list item if it originated from an authored cell
    // This assumes the li elements themselves might have instrumentation from the richtext cell
    // If li elements are generated, this call is not strictly necessary for them,
    // but ensures any instrumentation on the original <li> is preserved.
    // For hierarchy-tree, the entire hierarchyTreeCell is instrumented,
    // so individual <li> elements might not have direct instrumentation.
    // However, if the original HTML had instrumentation on <li>, this would move it.
    // For now, we'll assume the instrumentation is on the parent cell and its direct children.
  });
}

export default function decorate(block) {
  const [sectionsContainer, buttonsContainer, socialLinksContainer, ...itemRows] = [...block.children];

  const nav = document.createElement('nav');
  nav.classList.add('text-p1', 'grid', 'grid-cols-2', 'md:grid-cols-3', 'xl:grid-full');
  nav.setAttribute('aria-label', 'Primary footer');

  const backgroundDiv = document.createElement('div');
  backgroundDiv.classList.add('absolute', '-z-1', 'bg-[url(\'../images/cssBackgrounds/panda.svg\')]', 'opacity-5', 'bg-no-repeat', 'inset-[0_-10%_0_0]', 'bg-position-[center_left]', 'bg-size-[130%]', 'sm:bg-size-[75%]', 'md:bg-top-left', 'md:inset-[24px_0_0_-24px]', 'lg:bg-size-[60%]');
  nav.append(backgroundDiv);

  // Consume container placeholders
  moveInstrumentation(sectionsContainer, nav);
  moveInstrumentation(buttonsContainer, nav);
  moveInstrumentation(socialLinksContainer, nav);

  const sectionRows = itemRows.filter((row) => row.children.length === 3);
  const buttonRows = itemRows.filter((row) => row.children.length === 2);
  const socialRows = itemRows.filter((row) => row.children.length === 1);

  sectionRows.forEach((row) => {
    const [titleCell, sectionLinksCell, hierarchyTreeCell] = [...row.children];

    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('not-last:mb-md', 'md:mb-0', 'flex', 'flex-col', 'xl:col-span-3');

    const titleP = document.createElement('p');
    titleP.classList.add('mb-xs', 'text-15', 'xl:text-p2', 'font-stretch-normal', 'font-bold', 'text-sm');
    titleP.textContent = titleCell.textContent.trim();
    sectionDiv.append(titleP);

    const ul = document.createElement('ul');
    ul.classList.add('flex', 'flex-col', 'gap-xs');

    // Use a temporary div to parse the richtext HTML and preserve instrumentation
    const tempHierarchyDiv = document.createElement('div');
    tempHierarchyDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
    const hierarchyTree = tempHierarchyDiv.querySelector('ul');

    if (hierarchyTree) {
      // Move instrumentation from the original cell to the temporary div before processing
      moveInstrumentation(hierarchyTreeCell, tempHierarchyDiv);
      transformNestedLists(hierarchyTree, hierarchyTreeCell); // Pass original cell for context if needed

      [...hierarchyTree.children].forEach((li) => {
        const anchor = li.querySelector(':scope > a');
        const span = li.querySelector(':scope > span');
        const linkEl = document.createElement('a');
        linkEl.classList.add('link', 'text-foreground', 'text-p2', 'xl:text-p1', 'transition-display', 'hocus:underline', 'hocus:text-foreground', 'motion-safe:not-focus-visible:transition-underline', 'no-underline');
        if (anchor) {
          linkEl.href = anchor.href;
          linkEl.textContent = anchor.textContent.trim();
          // Move instrumentation from the original anchor to the new link element
          moveInstrumentation(anchor, linkEl);
          anchor.replaceWith(linkEl);
        } else if (span) {
          linkEl.href = 'javascript:void(0)'; // No direct link, act as a trigger
          linkEl.textContent = span.textContent.trim();
          // Move instrumentation from the original span to the new link element
          moveInstrumentation(span, linkEl);
          span.replaceWith(linkEl);
        }
        ul.append(li);
      });
    } else {
      // If no hierarchy-tree, use sectionLinks (if it contains actual links)
      const tempSectionLinksDiv = document.createElement('div');
      tempSectionLinksDiv.innerHTML = sectionLinksCell?.innerHTML || '';
      const sectionLinksUl = tempSectionLinksDiv.querySelector('ul');

      if (sectionLinksUl) {
        // Move instrumentation from the original cell to the temporary div before processing
        moveInstrumentation(sectionLinksCell, tempSectionLinksDiv);
        [...sectionLinksUl.querySelectorAll('li')].forEach((li) => {
          const anchor = li.querySelector('a');
          if (anchor) {
            const linkEl = document.createElement('a');
            linkEl.classList.add('link', 'text-foreground', 'text-p2', 'xl:text-p1', 'transition-display', 'hocus:underline', 'hocus:text-foreground', 'motion-safe:not-focus-visible:transition-underline', 'no-underline');
            linkEl.href = anchor.href;
            linkEl.textContent = anchor.textContent.trim();
            // Move instrumentation from the original anchor to the new link element
            moveInstrumentation(anchor, linkEl);
            const newLi = document.createElement('li');
            newLi.append(linkEl);
            // Move instrumentation from the original li to the new li element
            moveInstrumentation(li, newLi);
            ul.append(newLi);
          }
        });
      }
    }
    sectionDiv.append(ul);
    moveInstrumentation(row, sectionDiv);
    nav.append(sectionDiv);
  });

  const ctaAndSocialWrapper = document.createElement('div');
  ctaAndSocialWrapper.classList.add('col-span-full', 'pt-[200px]', 'lg:pt-0', 'lg:col-start-10', 'lg:col-span-5', 'lg:ml-auto');

  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add('flex', 'flex-col', 'items-start', 'gap-md');

  buttonRows.forEach((row) => {
    const [linkCell, labelCell] = [...row.children];
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      moveInstrumentation(foundLink, anchor); // Move instrumentation from original link
    }
    anchor.textContent = labelCell.textContent.trim();
    anchor.classList.add('button', 'button--dark', 'group'); // Assuming button--dark is for primary, adjust if needed

    // Add SVG icon for button (example: arrow-right for 'Get WWF email and texts')
    if (anchor.textContent.includes('Get WWF email')) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('icon', 'icon--arrow-right', 'size-4', 'ml-2', 'fill-foreground', 'transition-transform', 'motion-safe:group-hocus:translate-x-1');
      svg.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('xlink:href', '#arrow-right');
      use.setAttribute('href', '#arrow-right');
      svg.append(use);
      anchor.append(svg);
    } else if (anchor.textContent.includes('Supporter log in')) {
      anchor.classList.remove('button--dark');
      anchor.classList.add('button--dark-outline');
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('icon', 'icon--user', 'size-5', 'ml-2', 'fill-foreground', 'forced-colors:fill-[LinkText]');
      svg.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('xlink:href', '#user');
      use.setAttribute('href', '#user');
      svg.append(use);
      anchor.append(svg);
    }

    moveInstrumentation(row, anchor);
    ctaWrapper.append(anchor);
  });
  ctaAndSocialWrapper.append(ctaWrapper);

  const socialLinksDiv = document.createElement('div');
  socialLinksDiv.classList.add('flex', 'gap-sm', 'py-2xs', 'mt-sm', 'mb-lg', 'items-center');

  socialRows.forEach((row) => {
    const [socialLinkCell] = [...row.children];
    const socialAnchor = document.createElement('a');
    const foundSocialLink = socialLinkCell.querySelector('a');
    if (foundSocialLink) {
      socialAnchor.href = foundSocialLink.href;
      socialAnchor.target = '_blank';
      socialAnchor.rel = 'nofollow noopener';
      moveInstrumentation(foundSocialLink, socialAnchor); // Move instrumentation from original link
    }
    socialAnchor.classList.add('transition-colors', 'hover:cursor-pointer', 'theme-focus-outline', 'outline-none', 'fill-foreground', 'hocus:fill-foreground-accent');

    const srOnlySpan = document.createElement('span');
    srOnlySpan.classList.add('sr-only');
    socialAnchor.append(srOnlySpan);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('icon', 'size-7');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svg.append(use);

    if (socialAnchor.href.includes('facebook.com')) {
      srOnlySpan.textContent = 'Facebook profile';
      svg.classList.add('icon--facebook');
      use.setAttribute('xlink:href', '#facebook');
      use.setAttribute('href', '#facebook');
    } else if (socialAnchor.href.includes('twitter.com')) {
      srOnlySpan.textContent = 'X.com profile';
      svg.classList.add('icon--twitter');
      use.setAttribute('xlink:href', '#twitter');
      use.setAttribute('href', '#twitter');
      const twitterSpan = document.createElement('span'); // Extra span for twitter icon in original HTML
      twitterSpan.append(svg);
      socialAnchor.append(twitterSpan);
    } else if (socialAnchor.href.includes('instagram.com')) {
      srOnlySpan.textContent = 'Instagram profile';
      svg.classList.add('icon--instagram');
      use.setAttribute('xlink:href', '#instagram');
      use.setAttribute('href', '#instagram');
    } else if (socialAnchor.href.includes('linkedin.com')) {
      srOnlySpan.textContent = 'Linkedin profile';
      svg.classList.add('icon--linkedin');
      use.setAttribute('xlink:href', '#linkedin');
      use.setAttribute('href', '#linkedin');
    }
    if (!socialAnchor.querySelector('span > svg')) { // Avoid double appending for twitter
      socialAnchor.append(svg);
    }

    moveInstrumentation(row, socialAnchor);
    socialLinksDiv.append(socialAnchor);
  });
  ctaAndSocialWrapper.append(socialLinksDiv);
  nav.append(ctaAndSocialWrapper);

  block.replaceChildren(nav);
}
