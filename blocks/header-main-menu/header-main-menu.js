import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, sourceCell) {
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
      subWrap.classList.add('has-sub-child');
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
    // Move instrumentation for the li element itself if it originated from a source cell
    // This assumes the li itself might have instrumentation if it was a direct child of the richtext cell
    // For deeply nested lists, instrumentation is typically on the outer cell, not individual li's
    // However, if the original HTML had data-aue-resource on <li>, this would be needed.
    // For now, we assume instrumentation is on the main hierarchyTreeCell.
  });
  // Move instrumentation for the entire transformed UL if it originated from a source cell
  if (sourceCell && rootUl) {
    moveInstrumentation(sourceCell, rootUl);
  }
}

export default function decorate(block) {
  const children = [...block.children];

  const menuItems = children.filter((row) => row.children.length === 3);
  const aboutColumns = children.filter((row) => row.children.length === 4);
  const brandCategories = children.filter(
    (row) => row.children.length === 2 && row.querySelector('a') && !row.querySelector('picture'),
  );
  const brandProducts = children.filter(
    (row) => row.children.length === 2 && !row.querySelector('picture') && !row.querySelector('ul'),
  );
  const recipeColumns = children.filter(
    (row) => row.children.length === 2 && !row.querySelector('picture') && !row.querySelector('a'),
  );
  const mobileMenuIcons = children.filter(
    (row) => row.children.length === 2 && row.querySelector('picture'),
  );

  const mainMenu = document.createElement('div');
  mainMenu.classList.add('main-menu', 'cl-effect-5');

  const ul = document.createElement('ul');

  menuItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('position-static', 'dropdown');

    const link = document.createElement('a');
    const authoredLink = linkCell.querySelector('a');
    if (authoredLink) {
      link.href = authoredLink.href;
    } else {
      link.href = 'javascript:void(0)';
    }
    link.innerHTML = `<abbr><span data-hover="${labelCell.textContent.trim()}">${labelCell.textContent.trim()}</span></abbr>`;
    moveInstrumentation(row, link); // Instrumentation for the main menu item row
    li.append(link);

    const hierarchyTree = hierarchyTreeCell.querySelector('ul');
    if (hierarchyTree) {
      const megaMenu = document.createElement('div');
      megaMenu.classList.add('megamenu');
      const mMenu2 = document.createElement('div');
      mMenu2.classList.add('m-menu2');
      const rowDiv = document.createElement('div');
      rowDiv.classList.add('row', 'mega_menu_link');

      const colDiv = document.createElement('div');
      colDiv.classList.add('col-md-4', 'hyper-link');
      const bgWhite = document.createElement('div');
      bgWhite.classList.add('bg-white');
      const menuAbout = document.createElement('div');
      menuAbout.classList.add('menu_about', 'menu_sec1');
      const aboutMenuHead = document.createElement('div');
      aboutMenuHead.classList.add('about_menu_head');
      aboutMenuHead.textContent = labelCell.textContent.trim();
      menuAbout.append(aboutMenuHead);

      const menuText = document.createElement('div'); // Changed from <p> to <div> to prevent <p> inside <p>
      menuText.classList.add('menu_text');
      // Create a temporary div to hold the hierarchyTree content for transformation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      const innerUl = tempDiv.querySelector('ul');

      if (innerUl) {
        transformNestedLists(innerUl, hierarchyTreeCell); // Pass the source cell for instrumentation
        menuText.append(innerUl);
      }
      menuAbout.append(menuText);
      bgWhite.append(menuAbout);
      colDiv.append(bgWhite);
      rowDiv.append(colDiv);

      mMenu2.append(rowDiv);
      megaMenu.append(mMenu2);

      const menuClosed = document.createElement('div');
      menuClosed.classList.add('menu-closed');
      // Use a Unicode character or CSS for the close icon instead of a hardcoded path
      menuClosed.innerHTML = '&#x2715;'; // Unicode 'X' mark
      megaMenu.append(menuClosed);

      li.append(megaMenu);

      link.addEventListener('click', (e) => {
        e.preventDefault();
        megaMenu.classList.toggle('active');
        link.classList.toggle('active');
      });
      menuClosed.addEventListener('click', () => {
        megaMenu.classList.remove('active');
        link.classList.remove('active');
      });
    }

    ul.append(li);
  });

  const aboutUsLi = ul.querySelector('a[data-hover="About Us"]')?.closest('li');
  if (aboutUsLi) {
    const megamenu = aboutUsLi.querySelector('.megamenu');
    const mMenu2 = megamenu.querySelector('.m-menu2');
    const rowDiv = mMenu2.querySelector('.row');

    aboutColumns.forEach((row) => {
      const [columnTitleCell, columnContentCell, imageCell, imageLinkCell] = [...row.children];

      const colDiv = document.createElement('div');
      colDiv.classList.add('col-md-4', 'hyper-link');
      const bgWhite = document.createElement('div');
      bgWhite.classList.add('bg-white');

      const imageLink = imageLinkCell.querySelector('a');
      if (imageLink && imageCell.querySelector('picture')) {
        const imgLink = document.createElement('a');
        imgLink.href = imageLink.href;
        const picture = imageCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imgLink.append(optimizedPic);
        }
        imgLink.classList.add('img-fluid', 'lozad', 'w-100');
        bgWhite.append(imgLink);
      }

      const menuAbout = document.createElement('div');
      menuAbout.classList.add('menu_about', 'menu_sec1');
      const aboutMenuHead = document.createElement('div');
      aboutMenuHead.classList.add('about_menu_head');
      aboutMenuHead.textContent = columnTitleCell.textContent.trim();
      menuAbout.append(aboutMenuHead);

      const menuText = document.createElement('div'); // Changed from <p> to <div> to prevent <p> inside <p>
      menuText.classList.add('menu_text');
      menuText.innerHTML = columnContentCell.innerHTML; // richtext content
      menuAbout.append(menuText);
      bgWhite.append(menuAbout);
      colDiv.append(bgWhite);
      moveInstrumentation(row, colDiv);
      rowDiv.append(colDiv);
    });
  }

  const brandsLi = ul.querySelector('a[data-hover="Brands"]')?.closest('li');
  if (brandsLi) {
    const megamenu = brandsLi.querySelector('.megamenu');
    const mMenu2 = megamenu.querySelector('.m-menu2');
    const rowDiv = mMenu2.querySelector('.row');

    const colMd5 = document.createElement('div');
    colMd5.classList.add('col-md-5');
    const innerRow = document.createElement('div');
    innerRow.classList.add('row');
    colMd5.append(innerRow);

    brandCategories.forEach((categoryRow) => {
      const [categoryTitleCell, categoryLinkCell] = [...categoryRow.children];
      const colMd6 = document.createElement('div');
      colMd6.classList.add('col-md-6');
      const h4 = document.createElement('h4');
      const categoryLink = document.createElement('a');
      categoryLink.href = categoryLinkCell.querySelector('a')?.href || '#';
      categoryLink.textContent = categoryTitleCell.textContent.trim();
      h4.append(categoryLink);
      colMd6.append(h4);

      const paddingDiv = document.createElement('div');
      paddingDiv.classList.add('padding_top');
      const productUl = document.createElement('ul');

      brandProducts
        .filter((productRow) => {
          const [productLabelCell] = [...productRow.children];
          return productLabelCell.textContent.trim().includes(categoryTitleCell.textContent.trim());
        })
        .forEach((productRow) => {
          const [productLabelCell, productLinkCell] = [...productRow.children];
          const li = document.createElement('li');
          const productLink = document.createElement('a');
          productLink.href = productLinkCell.querySelector('a')?.href || '#';
          productLink.textContent = productLabelCell.textContent.trim();
          li.append(productLink);
          moveInstrumentation(productRow, li);
          productUl.append(li);
        });
      paddingDiv.append(productUl);
      colMd6.append(paddingDiv);
      moveInstrumentation(categoryRow, colMd6);
      innerRow.append(colMd6);
    });
    rowDiv.append(colMd5);
  }

  const parleRecipesLi = ul.querySelector('a[data-hover="PARLE RECIPES"]')?.closest('li');
  if (parleRecipesLi) {
    const megamenu = parleRecipesLi.querySelector('.megamenu');
    const mMenu2 = megamenu.querySelector('.m-menu2');
    const rowDiv = mMenu2.querySelector('.row');

    recipeColumns.forEach((row) => {
      const [recipeLabelCell, recipeLinkCell] = [...row.children];
      const colDiv = document.createElement('div');
      colDiv.classList.add('col-md-4');
      const recipeMenu = document.createElement('div');
      recipeMenu.classList.add('parle_recipes_menu');
      const recipeLink = document.createElement('a');
      recipeLink.href = recipeLinkCell.querySelector('a')?.href || '#';
      recipeLink.innerHTML = recipeLabelCell.textContent.trim();
      recipeMenu.append(recipeLink);
      colDiv.append(recipeMenu);
      moveInstrumentation(row, colDiv);
      rowDiv.append(colDiv);
    });
  }

  const mobileNavIconLi = document.createElement('li');
  mobileNavIconLi.classList.add('no_sticky');
  const mobileNavIconLink = document.createElement('a');
  mobileNavIconLink.href = 'javascript:void(0);';
  mobileNavIconLink.classList.add('mobile_nav_icon', 'desktop-mobile_nav');

  const mobileIcon = document.createElement('img');
  mobileIcon.classList.add('img-fluid');
  mobileIcon.alt = 'Menu';

  if (mobileMenuIcons.length > 0) {
    const [iconCell] = [...mobileMenuIcons[0].children];
    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      mobileIcon.src = img.src;
    } else {
      // Fallback if no picture is provided, use a default icon
      mobileIcon.src = '/icons/mobile-menu.svg'; // Hardcoded fallback, consider making this configurable
    }
    moveInstrumentation(mobileMenuIcons[0], mobileNavIconLink);
  } else {
    mobileIcon.src = '/icons/mobile-menu.svg'; // Hardcoded fallback
  }
  mobileNavIconLink.append(mobileIcon);
  mobileNavIconLi.append(mobileNavIconLink);
  ul.append(mobileNavIconLi);

  const stickyMobileNavIconLi = document.createElement('li');
  stickyMobileNavIconLi.classList.add('sticky');
  const stickyMobileNavIconLink = document.createElement('a');
  stickyMobileNavIconLink.href = 'javascript:void(0);';
  stickyMobileNavIconLink.classList.add('mobile_nav_icon', 'desktop-mobile_nav');

  const stickyMobileIcon = document.createElement('img');
  stickyMobileIcon.classList.add('img-fluid');
  stickyMobileIcon.alt = 'Menu';

  if (mobileMenuIcons.length > 1) {
    const [iconCell] = [...mobileMenuIcons[1].children];
    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      stickyMobileIcon.src = img.src;
    } else {
      // Fallback if no picture is provided, use a default icon
      stickyMobileIcon.src = '/icons/menu-black.svg'; // Hardcoded fallback, consider making this configurable
    }
    moveInstrumentation(mobileMenuIcons[1], stickyMobileNavIconLink);
  } else {
    stickyMobileIcon.src = '/icons/menu-black.svg'; // Hardcoded fallback
  }
  stickyMobileNavIconLink.append(stickyMobileIcon);
  stickyMobileNavIconLi.append(stickyMobileNavIconLink);
  ul.append(stickyMobileNavIconLi);

  mainMenu.append(ul);
  block.replaceChildren(mainMenu);

  mainMenu.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
