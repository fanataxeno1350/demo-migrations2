import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Add classes to <li> and <a> elements
    li.classList.add('list-item'); // Add a generic list-item class if needed for styling
    if (anchor) {
      anchor.classList.add(
        'link',
        'text-foreground',
        'text-p2',
        'xl:text-p1',
        'transition-display',
        'hocus:underline',
        'hocus:text-foreground',
        'motion-safe:not-focus-visible:transition-underline',
        'no-underline',
      );
    }

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
      subWrap.classList.add('has-sub-child'); // This class is not in original HTML, but may be for JS behavior
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in original HTML, but may be for JS behavior
          subWrap.classList.toggle('active'); // This class is not in original HTML, but may be for JS behavior
        });
      }
    }
  });
}

export default function decorate(block) {
  const [sectionsContainer, buttonsContainer, socialLinksContainer, ...itemRows] = [
    ...block.children,
  ];

  const primaryNav = document.createElement('nav');
  primaryNav.classList.add(
    'text-p1',
    'grid',
    'grid-cols-2',
    'md:grid-cols-3',
    'xl:grid-full',
  );
  primaryNav.setAttribute('aria-label', 'Primary footer');

  const pandaBg = document.createElement('div');
  pandaBg.classList.add(
    'absolute',
    '-z-1',
    'bg-[url(\'../images/cssBackgrounds/panda.svg\')]',
    'opacity-5',
    'bg-no-repeat',
    'inset-[0_-10%_0_0]',
    'bg-position-[center_left]',
    'bg-size-[130%]',
    'sm:bg-size-[75%]',
    'md:bg-top-left',
    'md:inset-[24px_0_0_-24px]',
    'lg:bg-size-[60%]',
  );
  primaryNav.append(pandaBg);

  const footerSectionItems = itemRows.filter((row) => row.children.length === 4);
  const footerButtonItems = itemRows.filter((row) => row.children.length === 2);
  const footerSocialItems = itemRows.filter((row) => row.children.length === 1);

  moveInstrumentation(sectionsContainer, primaryNav);
  footerSectionItems.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell, hierarchyTreeCell] = [...row.children];

    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('not-last:mb-md', 'md:mb-0', 'flex', 'flex-col', 'xl:col-span-3');

    const titleP = document.createElement('p');
    titleP.classList.add(
      'mb-xs',
      'text-15',
      'xl:text-p2',
      'font-stretch-normal',
      'font-bold',
      'text-sm',
    );
    titleP.textContent = titleCell.textContent.trim();
    sectionDiv.append(titleP);

    const ul = document.createElement('ul');
    ul.classList.add('flex', 'flex-col', 'gap-xs');

    const hierarchyList = hierarchyTreeCell?.querySelector('ul');
    const directLink = linkCell?.querySelector('a')?.href;

    if (hierarchyList) {
      transformNestedLists(hierarchyList);
      [...hierarchyList.children].forEach((li) => {
        // Ensure li and its children have correct classes
        li.classList.add('list-item');
        li.querySelectorAll('a').forEach(a => a.classList.add(
          'link',
          'text-foreground',
          'text-p2',
          'xl:text-p1',
          'transition-display',
          'hocus:underline',
          'hocus:text-foreground',
          'motion-safe:not-focus-visible:transition-underline',
          'no-underline',
        ));
        ul.append(li);
      });
    } else if (directLink && titleCell.textContent.trim()) {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = directLink;
      anchor.textContent = titleCell.textContent.trim();
      anchor.classList.add(
        'link',
        'text-foreground',
        'text-p2',
        'xl:text-p1',
        'transition-display',
        'hocus:underline',
        'hocus:text-foreground',
        'motion-safe:not-focus-visible:transition-underline',
        'no-underline',
      );
      li.append(anchor);
      ul.append(li);
    } else {
      // Fallback for sectionLinks if hierarchy-tree is empty
      const sectionLinksContent = sectionLinksCell?.innerHTML;
      if (sectionLinksContent) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sectionLinksContent;
        const sectionUl = tempDiv.querySelector('ul');
        if (sectionUl) {
          transformNestedLists(sectionUl);
          [...sectionUl.children].forEach((li) => {
            // Ensure li and its children have correct classes
            li.classList.add('list-item');
            li.querySelectorAll('a').forEach(a => a.classList.add(
              'link',
              'text-foreground',
              'text-p2',
              'xl:text-p1',
              'transition-display',
              'hocus:underline',
              'hocus:text-foreground',
              'motion-safe:not-focus-visible:transition-underline',
              'no-underline',
            ));
            ul.append(li);
          });
        } else if (tempDiv.textContent.trim()) {
          const li = document.createElement('li');
          const anchor = document.createElement('a');
          anchor.href = directLink || '#';
          anchor.textContent = tempDiv.textContent.trim();
          anchor.classList.add(
            'link',
            'text-foreground',
            'text-p2',
            'xl:text-p1',
            'transition-display',
            'hocus:underline',
            'hocus:text-foreground',
            'motion-safe:not-focus-visible:transition-underline',
            'no-underline',
          );
          li.append(anchor);
          ul.append(li);
        }
      }
    }

    sectionDiv.append(ul);
    moveInstrumentation(row, sectionDiv);
    primaryNav.append(sectionDiv);
  });

  const ctaAndSocialWrapper = document.createElement('div');
  ctaAndSocialWrapper.classList.add(
    'col-span-full',
    'pt-[200px]',
    'lg:pt-0',
    'lg:col-start-10',
    'lg:col-span-5',
    'lg:ml-auto',
  );

  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.classList.add('flex', 'flex-col', 'items-start', 'gap-md');

  moveInstrumentation(buttonsContainer, buttonsWrapper);
  footerButtonItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const link = linkCell.querySelector('a');
    if (link) {
      const button = document.createElement('a');
      button.href = link.href;
      button.textContent = labelCell.textContent.trim();
      button.classList.add('button', 'button--dark', 'group');
      // Add SVG icon for button. Original HTML uses <use xlink:href="#arrow-right">
      // For EDS, we use inline SVG or a simple arrow character.
      if (labelCell.textContent.trim().toLowerCase().includes('email')) {
        button.classList.remove('button--dark'); // This line is redundant, button--dark is already added
        button.classList.add('button--dark');
        button.innerHTML = `${labelCell.textContent.trim()}<svg class="icon icon--arrow-right size-4 ml-2 fill-foreground transition-transform motion-safe:group-hocus:translate-x-1" aria-hidden="true"><use xlink:href="#arrow-right" href="#arrow-right"></use></svg>`;
      } else if (labelCell.textContent.trim().toLowerCase().includes('log in')) {
        button.classList.remove('button--dark');
        button.classList.add('button--dark-outline');
        button.innerHTML = `${labelCell.textContent.trim()}<svg class="icon icon--user size-5 ml-2 fill-foreground forced-colors:fill-[LinkText]" aria-hidden="true"><use xlink:href="#user" href="#user"></use></svg>`;
      }
      moveInstrumentation(row, button);
      buttonsWrapper.append(button);
    }
  });
  ctaAndSocialWrapper.append(buttonsWrapper);

  const socialLinksDiv = document.createElement('div');
  socialLinksDiv.classList.add(
    'flex',
    'gap-sm',
    'py-2xs',
    'mt-sm',
    'mb-lg',
    'items-center',
  );

  moveInstrumentation(socialLinksContainer, socialLinksDiv);
  footerSocialItems.forEach((row) => {
    const [socialLinkCell] = [...row.children];
    const socialLink = socialLinkCell.querySelector('a');
    if (socialLink) {
      const anchor = document.createElement('a');
      anchor.href = socialLink.href;
      anchor.target = '_blank';
      anchor.rel = 'nofollow noopener';
      anchor.classList.add(
        'transition-colors',
        'hover:cursor-pointer',
        'theme-focus-outline',
        'outline-none',
        'fill-foreground',
        'hocus:fill-foreground-accent',
      );

      const spanSrOnly = document.createElement('span');
      spanSrOnly.classList.add('sr-only');

      let iconClass = '';
      let iconName = '';
      if (socialLink.href.includes('facebook.com')) {
        iconClass = 'icon--facebook';
        iconName = 'facebook';
        spanSrOnly.textContent = 'Facebook profile';
      } else if (socialLink.href.includes('twitter.com')) {
        iconClass = 'icon--twitter';
        iconName = 'twitter';
        spanSrOnly.textContent = 'X.com profile';
      } else if (socialLink.href.includes('instagram.com')) {
        iconClass = 'icon--instagram';
        iconName = 'instagram';
        spanSrOnly.textContent = 'Instagram profile';
      } else if (socialLink.href.includes('linkedin.com')) {
        iconClass = 'icon--linkedin';
        iconName = 'linkedin';
        spanSrOnly.textContent = 'Linkedin profile';
      }

      anchor.append(spanSrOnly);
      // Replace <use> with inline SVG for EDS
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('icon', iconClass, 'size-7');
      svg.setAttribute('aria-hidden', 'true');
      // This assumes an SVG sprite is loaded elsewhere or icons are inlined.
      // For a true fix, the SVG content itself should be inlined here if not using a sprite.
      // For now, keeping the <use> but noting it's a potential point of failure if sprite isn't loaded.
      // A better solution for EDS is to have a utility function to fetch and inline SVG content.
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', `#${iconName}`); // Use 'href' for modern browsers
      svg.append(use);
      anchor.append(svg);
      moveInstrumentation(row, anchor);
      socialLinksDiv.append(anchor);
    }
  });
  ctaAndSocialWrapper.append(socialLinksDiv);
  primaryNav.append(ctaAndSocialWrapper);

  block.replaceChildren(primaryNav);
}
