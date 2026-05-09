import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function getCaretSVG() {
  return `<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>`;
}

function getMailSVG() {
  return `<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
              C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
              L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
  </svg>`;
}

function getSearchSVG() {
  return `<svg viewBox="0 0 21 21" fill="none" class="lens">
    <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
  </svg>`;
}

function getCloseSVG() {
  return `<svg viewBox="0 0 50 50" class="close">
    <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
  </svg>`;
}

function getSubmitArrowSVG() {
  return `<svg width="12" height="8" viewBox="0 0 12 8" fill="none">
    <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
  </svg>`;
}

function transformNestedLists(rootUl) {
  if (!rootUl) return;
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
    // Add classes to nested <li> and <a> elements if they exist
    if (li.parentElement.classList.contains('has-sub-child')) {
      li.classList.add('first-level-li');
      const innerNested = li.querySelector(':scope > div > ul');
      if (innerNested) {
        innerNested.classList.add('has-inner-sub-child');
      }
    } else if (li.parentElement === rootUl) {
      li.classList.add('top-level-li');
    }
  });
}

export default async function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    navigationMenuContainer,
    iconNavItemsContainer,
    ...itemRows
  ] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // nav-up is a scroll state class, do not add initially

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoDiv.append(logoLink);
  wrap.append(logoDiv);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  const ulHamburger = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    ulHamburger.append(document.createElement('li'));
  }
  hamburger.append(ulHamburger);
  wrap.append(hamburger);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrap.append(nav);

  // Separate item rows by type
  const navigationItems = [];
  const megaMenuAboutUsItems = [];
  const megaMenuWhatWeDoItems = [];
  const megaMenuInvestorRelationsItems = [];
  const megaMenuNewsroomItems = [];
  const megaMenuCareersItems = [];
  const newsroomSlideItems = [];
  const iconNavItems = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 4 && cells[2].textContent.trim() === 'Mega Menu Type value' && cells[3].querySelector('ul')) {
      navigationItems.push(row);
    } else if (cells.length === 4 && cells[0].textContent.trim() && cells[1].querySelector('p') && cells[2].textContent.trim() && cells[3].querySelector('p')) {
      megaMenuAboutUsItems.push(row);
    } else if (cells.length === 3 && cells[0].textContent.trim() && cells[1].querySelector('p') && cells[2].querySelector('ul')) {
      megaMenuWhatWeDoItems.push(row);
    } else if (cells.length === 4 && cells[0].textContent.trim() && cells[1].textContent.trim() && cells[2].querySelector('p') && cells[3].querySelector('p')) {
      megaMenuInvestorRelationsItems.push(row);
    } else if (cells.length === 2 && cells[0].textContent.trim() && cells[1].querySelector('p')) {
      megaMenuNewsroomItems.push(row);
    } else if (cells.length === 4 && cells[0].textContent.trim() && cells[1].querySelector('p') && cells[2].textContent.trim() && cells[3].querySelector('ul')) {
      megaMenuCareersItems.push(row);
    } else if (cells.length === 4 && cells[0].textContent.trim() && cells[1].querySelector('a') && cells[2].textContent.trim() && cells[3].textContent.trim()) {
      newsroomSlideItems.push(row);
    } else if (cells.length === 2 && cells[0].textContent.trim() && cells[1].querySelector('a')) {
      iconNavItems.push(row);
    } else {
      // Move instrumentation for any unhandled rows to prevent double rendering
      const tempDiv = document.createElement('div');
      moveInstrumentation(row, tempDiv);
      // Optionally append to a hidden element or log for debugging if rows are unexpectedly unhandled
    }
  });

  // Navigation Menu
  navigationItems.forEach((row) => {
    const [labelCell, linkCell, megaMenuTypeCell, hierarchyTreeCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');

    const link = document.createElement('a');
    link.setAttribute('itemprop', 'url');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, link);

    const span = document.createElement('span');
    span.innerHTML = getCaretSVG();
    link.append(span);
    li.append(link);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.append(megaMenuWrap);
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);

    const megaMenuType = megaMenuTypeCell.textContent.trim();
    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');

    if (megaMenuType === 'mega-menu-about-us') {
      const aboutUsItem = megaMenuAboutUsItems.shift(); // Get the first matching item
      if (aboutUsItem) {
        const [headingCell, descriptionCell, subDescriptionCell, sectionLinksCell] = [...aboutUsItem.children];
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        const heading = document.createElement('h4');
        heading.classList.add('left-div-heading');
        const headingLink = document.createElement('a');
        headingLink.textContent = headingCell.textContent.trim();
        heading.append(headingLink);
        leftDiv.append(heading);

        const description = document.createElement('p');
        description.classList.add('left-div-desc');
        description.innerHTML = descriptionCell.innerHTML; // Correctly read richtext
        leftDiv.append(description);

        const subDescription = document.createElement('p');
        subDescription.classList.add('left-div-subdesc');
        subDescription.textContent = subDescriptionCell.textContent.trim();
        leftDiv.append(subDescription);
        centerDiv.append(leftDiv);

        subNavWrap.classList.add('about-us-sub-nav');
        const sectionLinksTempDiv = document.createElement('div');
        sectionLinksTempDiv.innerHTML = sectionLinksCell.innerHTML;
        const sectionLinksUl = sectionLinksTempDiv.querySelector('ul');
        if (sectionLinksUl) {
          const firstUl = document.createElement('ul');
          const secondUl = document.createElement('ul');
          const liElements = [...sectionLinksUl.children];
          liElements.forEach((item, idx) => {
            if (idx < Math.ceil(liElements.length / 2)) {
              firstUl.append(item);
            } else {
              secondUl.append(item);
            }
          });
          subNavWrap.append(firstUl, secondUl);
        } else {
          // Fallback for non-ul content, though model specifies richtext
          const p = sectionLinksTempDiv.querySelector('p');
          if (p) {
            const ul = document.createElement('ul');
            const li = document.createElement('li');
            li.textContent = p.textContent.trim();
            ul.append(li);
            subNavWrap.append(ul);
          }
        }
        moveInstrumentation(aboutUsItem, leftDiv);
      }
    } else if (megaMenuType === 'mega-menu-what-we-do') {
      const whatWeDoItem = megaMenuWhatWeDoItems.shift();
      if (whatWeDoItem) {
        const [headingCell, factsListCell, hierarchyTreeCellWhatWeDo] = [...whatWeDoItem.children];
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        const heading = document.createElement('h4');
        heading.classList.add('left-div-heading');
        const headingLink = document.createElement('a');
        headingLink.textContent = headingCell.textContent.trim();
        heading.append(headingLink);
        leftDiv.append(heading);

        const factsListTempDiv = document.createElement('div');
        factsListTempDiv.innerHTML = factsListCell.innerHTML;
        const factsListUl = factsListTempDiv.querySelector('ul');
        if (factsListUl) {
          leftDiv.append(factsListUl);
          [...factsListUl.children].forEach((factLi) => {
            factLi.classList.add('list-text-red');
          });
        }
        centerDiv.append(leftDiv);

        subNavWrap.classList.add('what-we-do');
        const hierarchyTreeTempDiv = document.createElement('div');
        hierarchyTreeTempDiv.innerHTML = hierarchyTreeCellWhatWeDo.innerHTML;
        const hierarchyTreeUl = hierarchyTreeTempDiv.querySelector('ul');
        if (hierarchyTreeUl) {
          moveInstrumentation(hierarchyTreeCellWhatWeDo, hierarchyTreeTempDiv);
          transformNestedLists(hierarchyTreeUl);
          while (hierarchyTreeUl.firstChild) {
            subNavWrap.append(hierarchyTreeUl.firstChild);
          }
        }
        moveInstrumentation(whatWeDoItem, leftDiv);
      }
    } else if (megaMenuType === 'mega-menu-investor-relations') {
      const investorRelationsItem = megaMenuInvestorRelationsItems.shift();
      if (investorRelationsItem) {
        const [headingCell, subHeadingCell, factsListCell, sectionLinksCell] = [...investorRelationsItem.children];
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div', 'ir-left-div');
        const heading = document.createElement('h4');
        heading.classList.add('left-div-heading');
        const headingLink = document.createElement('a');
        headingLink.textContent = headingCell.textContent.trim();
        heading.append(headingLink);
        leftDiv.append(heading);

        const subHeading = document.createElement('p');
        subHeading.textContent = subHeadingCell.textContent.trim();
        leftDiv.append(subHeading);

        const factsListTempDiv = document.createElement('div');
        factsListTempDiv.innerHTML = factsListCell.innerHTML;
        const factsListUl = factsListTempDiv.querySelector('ul');
        if (factsListUl) {
          leftDiv.append(factsListUl);
          [...factsListUl.children].forEach((factLi) => {
            factLi.classList.add('list-text-red');
          });
        }
        centerDiv.append(leftDiv);

        subNavWrap.classList.add('element-block');
        const sectionLinksTempDiv = document.createElement('div');
        sectionLinksTempDiv.innerHTML = sectionLinksCell.innerHTML;
        const sectionLinksUl = sectionLinksTempDiv.querySelector('ul');
        if (sectionLinksUl) {
          const subNavWrapOneLink = document.createElement('ul');
          subNavWrapOneLink.classList.add('sub-nav-wrap-one-link');
          const innerSubNavWrapList = document.createElement('div');
          innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
          const innerUl1 = document.createElement('ul');
          const innerUl2 = document.createElement('ul');

          const liElements = [...sectionLinksUl.children];
          if (liElements.length > 0) {
            subNavWrapOneLink.append(liElements.shift()); // First item goes to sub-nav-wrap-one-link
          }
          liElements.forEach((item, idx) => {
            if (idx < Math.ceil(liElements.length / 2)) {
              innerUl1.append(item);
            } else {
              innerUl2.append(item);
            }
          });
          innerSubNavWrapList.append(innerUl1, innerUl2);
          subNavWrap.append(subNavWrapOneLink, innerSubNavWrapList);
        } else {
          const p = sectionLinksTempDiv.querySelector('p');
          if (p) {
            const ul = document.createElement('ul');
            const li = document.createElement('li');
            li.textContent = p.textContent.trim();
            ul.append(li);
            subNavWrap.append(ul);
          }
        }
        moveInstrumentation(investorRelationsItem, leftDiv);
      }
    } else if (megaMenuType === 'mega-menu-newsroom') {
      const newsroomItem = megaMenuNewsroomItems.shift();
      if (newsroomItem) {
        const [headingCell, sectionLinksCell] = [...newsroomItem.children];
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div', 'newsroom-left-div');
        const heading = document.createElement('h4');
        heading.classList.add('left-div-heading');
        const headingLink = document.createElement('a');
        headingLink.textContent = headingCell.textContent.trim();
        heading.append(headingLink);
        leftDiv.append(heading);

        const latestPressReleaseDiv = document.createElement('div');
        latestPressReleaseDiv.classList.add('latest-two-press-release');

        const newsroomSlidesWrapper = document.createElement('div');
        newsroomSlidesWrapper.classList.add('slides');
        const newsroomSlidesWrap = document.createElement('div');
        newsroomSlidesWrap.classList.add('wrap');
        newsroomSlidesWrapper.append(newsroomSlidesWrap);

        newsroomSlideItems.forEach((slideRow) => {
          const [titleCell, slideLinkCell, dateCell, categoryCell] = [...slideRow.children];
          const contentDiv = document.createElement('div');
          contentDiv.classList.add('content');
          const descDiv = document.createElement('div');
          descDiv.classList.add('desc');
          const p = document.createElement('p');
          const slideLink = document.createElement('a');
          const foundSlideLink = slideLinkCell.querySelector('a');
          if (foundSlideLink) {
            slideLink.href = foundSlideLink.href;
          }
          slideLink.textContent = titleCell.textContent.trim();
          p.append(slideLink);
          descDiv.append(p);

          const dateDiv = document.createElement('div');
          dateDiv.classList.add('date');
          const emDate = document.createElement('em');
          emDate.textContent = dateCell.textContent.trim();
          const emCategory = document.createElement('em');
          emCategory.textContent = categoryCell.textContent.trim();
          dateDiv.append(emDate, emCategory);
          descDiv.append(dateDiv);
          contentDiv.append(descDiv);
          newsroomSlidesWrap.append(contentDiv);
          moveInstrumentation(slideRow, contentDiv);
        });

        latestPressReleaseDiv.append(newsroomSlidesWrapper);
        leftDiv.append(latestPressReleaseDiv);
        centerDiv.append(leftDiv);

        const sectionLinksTempDiv = document.createElement('div');
        sectionLinksTempDiv.innerHTML = sectionLinksCell.innerHTML;
        const sectionLinksUl = sectionLinksTempDiv.querySelector('ul');
        if (sectionLinksUl) {
          subNavWrap.append(sectionLinksUl);
        } else {
          const p = sectionLinksTempDiv.querySelector('p');
          if (p) {
            const ul = document.createElement('ul');
            const li = document.createElement('li');
            li.textContent = p.textContent.trim();
            ul.append(li);
            subNavWrap.append(ul);
          }
        }
        moveInstrumentation(newsroomItem, leftDiv);
      }
    } else if (megaMenuType === 'mega-menu-careers') {
      const careersItem = megaMenuCareersItems.shift();
      if (careersItem) {
        const [headingCell, descriptionCell, subDescriptionCell, hierarchyTreeCellCareers] = [...careersItem.children];
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div', 'career-left-div');
        const heading = document.createElement('h4');
        heading.classList.add('left-div-heading');
        const headingLink = document.createElement('a');
        headingLink.textContent = headingCell.textContent.trim();
        heading.append(headingLink);
        leftDiv.append(heading);

        const description = document.createElement('p');
        description.classList.add('left-div-desc');
        description.innerHTML = descriptionCell.innerHTML; // Correctly read richtext
        leftDiv.append(description);

        const subDescription = document.createElement('p');
        subDescription.classList.add('left-div-subdesc');
        subDescription.textContent = subDescriptionCell.textContent.trim();
        leftDiv.append(subDescription);
        centerDiv.append(leftDiv);

        subNavWrap.classList.add('careers-div');
        const hierarchyTreeTempDiv = document.createElement('div');
        hierarchyTreeTempDiv.innerHTML = hierarchyTreeCellCareers.innerHTML;
        const hierarchyTreeUl = hierarchyTreeTempDiv.querySelector('ul');
        if (hierarchyTreeUl) {
          moveInstrumentation(hierarchyTreeCellCareers, hierarchyTreeTempDiv);
          transformNestedLists(hierarchyTreeUl);
          while (hierarchyTreeUl.firstChild) {
            subNavWrap.append(hierarchyTreeUl.firstChild);
          }
        }
        moveInstrumentation(careersItem, leftDiv);
      }
    }

    centerDiv.append(subNavWrap);
    li.append(megaMenu);
    navUl.append(li);
  });
  moveInstrumentation(navigationMenuContainer, navUl);

  // Icon Navigation (Mobile)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconNavUl = document.createElement('ul');
  mobileIconNav.append(mobileIconNavUl);

  // Contact Us (Mail)
  const mobileMailLi = document.createElement('li');
  mobileMailLi.classList.add('mail');
  const mobileMailLink = document.createElement('a');
  mobileMailLink.href = 'https://www.mahindra.com/contact-us';
  mobileMailLink.textContent = 'Contact Us';
  mobileIconNavUl.append(mobileMailLink); // Append link directly to ul, not li
  mobileIconNavUl.append(mobileMailLi); // Then append li to ul

  // Search (Mobile)
  const mobileSearchLi = document.createElement('li');
  mobileSearchLi.classList.add('search');
  mobileSearchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const mobileSearchLink = document.createElement('a');
  mobileSearchLink.href = '#';
  mobileSearchLink.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchLink.innerHTML = getSearchSVG() + getCloseSVG();
  const mobileSearchSpan = document.createElement('span');
  mobileSearchSpan.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchSpan.textContent = ' Search';
  mobileSearchLink.append(mobileSearchSpan);
  mobileSearchLi.append(mobileSearchLink);

  const mobileSearchScreenWrap = document.createElement('div');
  mobileSearchScreenWrap.classList.add('search-screen-wrap');
  mobileSearchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
  const mobileSearchWrapInner = document.createElement('div');
  mobileSearchWrapInner.classList.add('wrap');
  mobileSearchWrapInner.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchScreenWrap.append(mobileSearchWrapInner);

  const mobileSearchForm = document.createElement('form');
  mobileSearchForm.action = 'https://www.mahindra.com/search';
  mobileSearchForm.method = 'get';
  mobileSearchForm.id = 'search-block-form';
  mobileSearchForm.setAttribute('accept-charset', 'UTF-8');
  mobileSearchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
  mobileSearchForm.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchWrapInner.append(mobileSearchForm);

  const mobileSearchInputWrap = document.createElement('div');
  mobileSearchInputWrap.classList.add('search-wrap');
  mobileSearchInputWrap.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchForm.append(mobileSearchInputWrap);

  const mobileSearchIconDiv = document.createElement('div');
  mobileSearchIconDiv.classList.add('search-icon');
  mobileSearchIconDiv.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchIconDiv.innerHTML = getSearchSVG();
  mobileSearchInputWrap.append(mobileSearchIconDiv);

  const mobileSearchInput = document.createElement('input');
  mobileSearchInput.type = 'text';
  mobileSearchInput.classList.add('input-text', 'searchtext');
  mobileSearchInput.required = true;
  mobileSearchInput.name = 'key';
  mobileSearchInput.id = 'searchInput';
  mobileSearchInput.autocomplete = 'off';
  mobileSearchInput.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchInputWrap.append(mobileSearchInput);

  const mobileSubmitButton = document.createElement('button');
  mobileSubmitButton.classList.add('submit-button');
  mobileSubmitButton.setAttribute('data-once', 'search-stop-propagation');
  const mobileSubmitLabel = document.createElement('div');
  mobileSubmitLabel.classList.add('label');
  mobileSubmitLabel.setAttribute('data-once', 'search-stop-propagation');
  mobileSubmitLabel.textContent = ' Submit ';
  mobileSubmitButton.append(mobileSubmitLabel, getSubmitArrowSVG());
  mobileSearchInputWrap.append(mobileSubmitButton);

  const mobileSearchResultBox = document.createElement('div');
  mobileSearchResultBox.classList.add('searchResultBox');
  mobileSearchResultBox.style.display = 'none';
  mobileSearchResultBox.setAttribute('data-once', 'search-stop-propagation');
  const mobileSwiper = document.createElement('div');
  mobileSwiper.classList.add('swiper', 'scrollSwiper');
  mobileSwiper.setAttribute('data-once', 'search-stop-propagation');
  const mobileSwiperWrapper = document.createElement('div');
  mobileSwiperWrapper.classList.add('swiper-wrapper');
  mobileSwiperWrapper.setAttribute('data-once', 'search-stop-propagation');
  const mobileSwiperSlide = document.createElement('div');
  mobileSwiperSlide.classList.add('swiper-slide');
  mobileSwiperSlide.setAttribute('data-once', 'search-stop-propagation');
  mobileSwiperWrapper.append(mobileSwiperSlide);
  mobileSwiper.append(mobileSwiperWrapper);
  mobileSearchResultBox.append(mobileSwiper);
  const mobileSwiperScrollbar = document.createElement('div');
  mobileSwiperScrollbar.classList.add('swiper-scrollbar');
  mobileSwiperScrollbar.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchResultBox.append(mobileSwiperScrollbar);
  mobileSearchForm.append(mobileSearchResultBox);

  const mobileSearchSuggestionsWrap1 = document.createElement('div');
  mobileSearchSuggestionsWrap1.classList.add('search-suggestions-wrap');
  mobileSearchSuggestionsWrap1.setAttribute('data-once', 'search-stop-propagation');
  const mobileLabel1 = document.createElement('div');
  mobileLabel1.classList.add('label');
  mobileLabel1.setAttribute('data-once', 'search-stop-propagation');
  mobileLabel1.textContent = 'Popular Keywords:';
  mobileSearchSuggestionsWrap1.append(mobileLabel1);
  const mobileTokensWrap1 = document.createElement('div');
  mobileTokensWrap1.classList.add('tokens-wrap');
  mobileTokensWrap1.setAttribute('data-once', 'search-stop-propagation');
  const mobileUl1 = document.createElement('ul');
  mobileUl1.setAttribute('data-once', 'search-stop-propagation');
  ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'].forEach((text) => {
    const li = document.createElement('li');
    li.setAttribute('data-once', 'search-stop-propagation');
    li.textContent = text;
    mobileUl1.append(li);
  });
  mobileTokensWrap1.append(mobileUl1);
  mobileSearchSuggestionsWrap1.append(mobileTokensWrap1);
  mobileSearchWrapInner.append(mobileSearchSuggestionsWrap1);

  const mobileSearchSuggestionsWrap2 = document.createElement('div');
  mobileSearchSuggestionsWrap2.classList.add('search-suggestions-wrap');
  mobileSearchSuggestionsWrap2.setAttribute('data-once', 'search-stop-propagation');
  const mobileLabel2 = document.createElement('div');
  mobileLabel2.classList.add('label');
  mobileLabel2.setAttribute('data-once', 'search-stop-propagation');
  mobileLabel2.textContent = 'Recommended for you:';
  mobileSearchSuggestionsWrap2.append(mobileLabel2);
  const mobileTokensWrap2 = document.createElement('div');
  mobileTokensWrap2.classList.add('tokens-wrap');
  mobileTokensWrap2.setAttribute('data-once', 'search-stop-propagation');
  const mobileUl2 = document.createElement('ul');
  mobileUl2.setAttribute('data-once', 'search-stop-propagation');
  ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'].forEach((text) => {
    const li = document.createElement('li');
    li.setAttribute('data-once', 'search-stop-propagation');
    li.textContent = text;
    mobileUl2.append(li);
  });
  mobileTokensWrap2.append(mobileUl2);
  mobileSearchSuggestionsWrap2.append(mobileTokensWrap2);
  mobileSearchWrapInner.append(mobileSearchSuggestionsWrap2);

  mobileSearchLi.append(mobileSearchScreenWrap);
  mobileIconNavUl.append(mobileSearchLi);
  navUl.append(mobileIconNav);

  // Icon Navigation (Desktop)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconNavUl = document.createElement('ul');
  desktopIconNav.append(desktopIconNavUl);

  // Contact Us (Mail)
  const desktopMailLi = document.createElement('li');
  desktopMailLi.classList.add('mail');
  const desktopMailLink = document.createElement('a');
  desktopMailLink.href = 'https://www.mahindra.com/contact-us';
  desktopMailLink.innerHTML = getMailSVG();
  desktopMailLi.append(desktopMailLink);
  desktopIconNavUl.append(desktopMailLi);

  // Search (Desktop)
  const desktopSearchLi = document.createElement('li');
  desktopSearchLi.classList.add('search');
  desktopSearchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const desktopSearchLink = document.createElement('a');
  desktopSearchLink.href = '#';
  desktopSearchLink.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchLink.innerHTML = getSearchSVG() + getCloseSVG();
  desktopSearchLi.append(desktopSearchLink);

  const desktopSearchScreenWrap = document.createElement('div');
  desktopSearchScreenWrap.classList.add('search-screen-wrap');
  desktopSearchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
  const desktopSearchWrapInner = document.createElement('div');
  desktopSearchWrapInner.classList.add('wrap');
  desktopSearchWrapInner.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchScreenWrap.append(desktopSearchWrapInner);

  const desktopSearchForm = document.createElement('form');
  desktopSearchForm.action = 'https://www.mahindra.com/search';
  desktopSearchForm.method = 'get';
  desktopSearchForm.id = 'search-block-form';
  desktopSearchForm.setAttribute('accept-charset', 'UTF-8');
  desktopSearchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
  desktopSearchForm.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchWrapInner.append(desktopSearchForm);

  const desktopSearchInputWrap = document.createElement('div');
  desktopSearchInputWrap.classList.add('search-wrap');
  desktopSearchInputWrap.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchForm.append(desktopSearchInputWrap);

  const desktopSearchIconDiv = document.createElement('div');
  desktopSearchIconDiv.classList.add('search-icon');
  desktopSearchIconDiv.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchIconDiv.innerHTML = getSearchSVG();
  desktopSearchInputWrap.append(desktopSearchIconDiv);

  const desktopSearchInput = document.createElement('input');
  desktopSearchInput.type = 'text';
  desktopSearchInput.classList.add('input-text', 'searchtext');
  desktopSearchInput.required = true;
  desktopSearchInput.name = 'key';
  desktopSearchInput.id = 'searchInput';
  desktopSearchInput.autocomplete = 'off';
  desktopSearchInput.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchInputWrap.append(desktopSearchInput);

  const desktopSubmitButton = document.createElement('button');
  desktopSubmitButton.classList.add('submit-button');
  desktopSubmitButton.setAttribute('data-once', 'search-stop-propagation');
  const desktopSubmitLabel = document.createElement('div');
  desktopSubmitLabel.classList.add('label');
  desktopSubmitLabel.setAttribute('data-once', 'search-stop-propagation');
  desktopSubmitLabel.textContent = ' Submit ';
  desktopSubmitButton.append(desktopSubmitLabel, getSubmitArrowSVG());
  desktopSearchInputWrap.append(desktopSubmitButton);

  const desktopSearchResultBox = document.createElement('div');
  desktopSearchResultBox.classList.add('searchResultBox');
  desktopSearchResultBox.style.display = 'none';
  desktopSearchResultBox.setAttribute('data-once', 'search-stop-propagation');
  const desktopSwiper = document.createElement('div');
  desktopSwiper.classList.add('swiper', 'scrollSwiper');
  desktopSwiper.setAttribute('data-once', 'search-stop-propagation');
  const desktopSwiperWrapper = document.createElement('div');
  desktopSwiperWrapper.classList.add('swiper-wrapper');
  desktopSwiperWrapper.setAttribute('data-once', 'search-stop-propagation');
  const desktopSwiperSlide = document.createElement('div');
  desktopSwiperSlide.classList.add('swiper-slide');
  desktopSwiperSlide.setAttribute('data-once', 'search-stop-propagation');
  desktopSwiperWrapper.append(desktopSwiperSlide);
  desktopSwiper.append(desktopSwiperWrapper);
  desktopSearchResultBox.append(desktopSwiper);
  const desktopSwiperScrollbar = document.createElement('div');
  desktopSwiperScrollbar.classList.add('swiper-scrollbar');
  desktopSwiperScrollbar.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchResultBox.append(desktopSwiperScrollbar);
  desktopSearchForm.append(desktopSearchResultBox);

  const desktopSearchSuggestionsWrap1 = document.createElement('div');
  desktopSearchSuggestionsWrap1.classList.add('search-suggestions-wrap');
  desktopSearchSuggestionsWrap1.setAttribute('data-once', 'search-stop-propagation');
  const desktopLabel1 = document.createElement('div');
  desktopLabel1.classList.add('label');
  desktopLabel1.setAttribute('data-once', 'search-stop-propagation');
  desktopLabel1.textContent = 'Popular Keywords:';
  desktopSearchSuggestionsWrap1.append(desktopLabel1);
  const desktopTokensWrap1 = document.createElement('div');
  desktopTokensWrap1.classList.add('tokens-wrap');
  desktopTokensWrap1.setAttribute('data-once', 'search-stop-propagation');
  const desktopUl1 = document.createElement('ul');
  desktopUl1.setAttribute('data-once', 'search-stop-propagation');
  ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'].forEach((text) => {
    const li = document.createElement('li');
    li.setAttribute('data-once', 'search-stop-propagation');
    li.textContent = text;
    desktopUl1.append(li);
  });
  desktopTokensWrap1.append(desktopUl1);
  desktopSearchSuggestionsWrap1.append(desktopTokensWrap1);
  desktopSearchWrapInner.append(desktopSearchSuggestionsWrap1);

  const desktopSearchSuggestionsWrap2 = document.createElement('div');
  desktopSearchSuggestionsWrap2.classList.add('search-suggestions-wrap');
  desktopSearchSuggestionsWrap2.setAttribute('data-once', 'search-stop-propagation');
  const desktopLabel2 = document.createElement('div');
  desktopLabel2.classList.add('label');
  desktopLabel2.setAttribute('data-once', 'search-stop-propagation');
  desktopLabel2.textContent = 'Recommended for you:';
  desktopSearchSuggestionsWrap2.append(desktopLabel2);
  const desktopTokensWrap2 = document.createElement('div');
  desktopTokensWrap2.classList.add('tokens-wrap');
  desktopTokensWrap2.setAttribute('data-once', 'search-stop-propagation');
  const desktopUl2 = document.createElement('ul');
  desktopUl2.setAttribute('data-once', 'search-stop-propagation');
  ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'].forEach((text) => {
    const li = document.createElement('li');
    li.setAttribute('data-once', 'search-stop-propagation');
    li.textContent = text;
    desktopUl2.append(li);
  });
  desktopTokensWrap2.append(desktopUl2);
  desktopSearchSuggestionsWrap2.append(desktopTokensWrap2);
  desktopSearchWrapInner.append(desktopSearchSuggestionsWrap2);

  desktopSearchLi.append(desktopSearchScreenWrap);
  desktopIconNavUl.append(desktopSearchLi);
  nav.append(desktopIconNav);
  moveInstrumentation(iconNavItemsContainer, desktopIconNavUl);

  // Anniversary Logo
  const anniversaryLogoDiv = document.createElement('div');
  anniversaryLogoDiv.classList.add('logo', 'year-80-logo');
  const anniversaryLink = document.createElement('a');
  const anniversaryAnchor = anniversaryLogoLinkRow.querySelector('a');
  if (anniversaryAnchor) {
    anniversaryLink.href = anniversaryAnchor.href;
  }
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLink);

  const anniversaryPicture = anniversaryLogoRow.querySelector('picture');
  if (anniversaryPicture) {
    const img = anniversaryPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    moveInstrumentation(anniversaryLogoRow, optimizedPic.querySelector('img'));
    anniversaryLink.append(optimizedPic);
  }
  anniversaryLogoDiv.append(anniversaryLink);
  wrap.append(anniversaryLogoDiv);

  block.replaceChildren(header);

  // Add event listeners for hamburger and search functionality
  const mainNav = block.querySelector('.main-nav');
  const hamburgerBtn = block.querySelector('.hamburger');
  const searchToggleLinks = block.querySelectorAll('.search > a');
  const searchScreenWraps = block.querySelectorAll('.search-screen-wrap');
  const searchInputs = block.querySelectorAll('.searchtext');

  hamburgerBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburgerBtn.classList.toggle('active');
    block.querySelector('.container').classList.toggle('active');
  });

  searchToggleLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const searchLi = link.closest('.search');
      searchLi.classList.toggle('active');
      searchScreenWraps.forEach((wrapEl) => {
        if (searchLi.contains(wrapEl)) {
          wrapEl.style.display = searchLi.classList.contains('active') ? 'block' : 'none';
        }
      });
      if (searchLi.classList.contains('active')) {
        searchInputs.forEach((input) => input.focus());
      }
    });
  });

  document.addEventListener('click', (e) => {
    const isClickInsideSearch = e.target.closest('.search');
    if (!isClickInsideSearch) {
      searchToggleLinks.forEach((link) => {
        const searchLi = link.closest('.search');
        if (searchLi.classList.contains('active')) {
          searchLi.classList.remove('active');
          searchScreenWraps.forEach((wrapEl) => {
            if (searchLi.contains(wrapEl)) {
              wrapEl.style.display = 'none';
            }
          });
        }
      });
    }
  });

  // Mega menu hover functionality
  const hasChildLIs = block.querySelectorAll('li.has-child');
  hasChildLIs.forEach((li) => {
    const megaMenu = li.querySelector('.mega-menu');
    if (megaMenu) {
      li.addEventListener('mouseenter', () => {
        megaMenu.style.display = 'block';
      });
      li.addEventListener('mouseleave', () => {
        megaMenu.style.display = 'none';
      });
    }
  });

  // Scroll behavior for header
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 0) {
      header.classList.add('nav-up');
    } else {
      header.classList.remove('nav-up');
    }
    lastScrollY = window.scrollY;
  });
}
