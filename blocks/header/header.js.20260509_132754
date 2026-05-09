import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
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
  });
}

export default async function decorate(block) {
  const children = [...block.children].filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  const [
    logoRow,
    logoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    ...itemRows
  ] = children;

  const header = document.createElement('header');
  header.classList.add('main-header', 'solid'); // nav-up added by JS
  header.setAttribute('data-once', 'header-hover');

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
  const primaryLogoAnchor = logoLinkRow?.querySelector('a');
  if (primaryLogoAnchor) {
    logoLink.href = primaryLogoAnchor.href;
  }
  const primaryLogoPicture = logoRow?.querySelector('picture');
  if (primaryLogoPicture) {
    const img = primaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
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
  const ulNav = document.createElement('ul');
  ulNav.setAttribute('itemscope', '');
  ulNav.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(ulNav);
  wrap.append(nav);

  // Reorder filters to prevent TDZ and ensure correct item type detection
  // Item type detection: use row.children.length (cell count) and cell.querySelector('picture')/querySelector('a').
  // When two item types share identical cell structure, separate by POSITION using the sub-component order below.
  const megaMenuAboutSections = itemRows.filter((row) => row.children.length === 3 && row.querySelector('div:first-child')?.textContent.trim() && !row.querySelector('div:nth-child(2)')?.querySelector('a') && row.querySelector('div:nth-child(2)')?.innerHTML.includes('<p>'));
  const megaMenuKeyFactsItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('div:first-child')?.textContent.trim() && row.querySelector('div:nth-child(2)')?.textContent.trim());
  const megaMenuInvestorSections = itemRows.filter((row) => row.children.length === 8 && row.querySelector('div:first-child')?.textContent.trim());
  const megaMenuNewsroomPressItems = itemRows.filter((row) => row.children.length === 4 && row.querySelector('div:first-child')?.querySelector('a'));
  const megaMenuCareerSections = itemRows.filter((row) => row.children.length === 3 && row.querySelector('div:first-child')?.textContent.trim() && !row.querySelector('div:nth-child(2)')?.querySelector('a') && row.querySelector('div:nth-child(2)')?.innerHTML.includes('<p>'));
  const iconLinkItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('picture') && row.querySelector('div:nth-child(2)')?.querySelector('a'));
  const navigationItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('div:first-child')?.textContent.trim() && row.querySelector('div:nth-child(2)')?.querySelector('a'));


  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell?.textContent.trim();
    li.append(anchor);

    const svgSpan = document.createElement('span');
    svgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
    li.append(svgSpan);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrapContainer = document.createElement('div');
    megaMenuWrapContainer.classList.add('wrap', 'container');
    megaMenu.append(megaMenuWrapContainer);
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrapContainer.append(centerDiv);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    centerDiv.append(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    centerDiv.append(subNavWrap);

    const hierarchyTree = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyTree) {
      if (labelCell?.textContent.trim() === 'Who We Are') {
        leftDiv.classList.add('about-us-left-div');
        const heading = document.createElement('h4');
        heading.classList.add('left-div-heading');
        const headingLink = document.createElement('a');
        // Read heading text from the first aboutSection row's heading cell
        const firstAboutSectionHeading = megaMenuAboutSections[0]?.children[0]?.textContent.trim();
        if (firstAboutSectionHeading) {
          headingLink.textContent = firstAboutSectionHeading;
        } else {
          headingLink.textContent = 'Our Purpose'; // Fallback if no data
        }
        heading.append(headingLink);
        leftDiv.append(heading);

        megaMenuAboutSections.forEach((aboutRow) => {
          const [aboutHeadingCell, aboutDescriptionCell, aboutSubDescriptionCell] = [...aboutRow.children];
          const desc = document.createElement('p');
          desc.classList.add('left-div-desc');
          desc.innerHTML = aboutDescriptionCell?.innerHTML || '';
          leftDiv.append(desc);

          const subDesc = document.createElement('p');
          subDesc.classList.add('left-div-subdesc');
          subDesc.textContent = aboutSubDescriptionCell?.textContent.trim();
          leftDiv.append(subDesc);
          moveInstrumentation(aboutRow, leftDiv);
        });
        subNavWrap.classList.add('about-us-sub-nav');
      } else if (labelCell?.textContent.trim() === 'What we do') {
        leftDiv.classList.add('what-we-do-left-div');
        const heading = document.createElement('h4');
        heading.classList.add('left-div-heading');
        const headingLink = document.createElement('a');
        // Read heading text from the first keyFacts row's heading cell
        const firstKeyFactsHeading = megaMenuKeyFactsItems[0]?.children[0]?.textContent.trim(); // Assuming first cell of key facts is the heading
        if (firstKeyFactsHeading) {
          headingLink.textContent = 'Key Facts'; // The model doesn't have a heading field for key facts, so hardcode as per original HTML
        } else {
          headingLink.textContent = 'Key Facts'; // Fallback if no data
        }
        heading.append(headingLink);
        leftDiv.append(heading);

        const ulFacts = document.createElement('ul');
        megaMenuKeyFactsItems.forEach((factRow) => {
          const [factCell, factLabelCell] = [...factRow.children];
          const liFact = document.createElement('li');
          liFact.classList.add('list-text-red');
          liFact.innerHTML = `${factCell?.textContent.trim()} <span>${factLabelCell?.textContent.trim()}</span>`;
          ulFacts.append(liFact);
          moveInstrumentation(factRow, liFact);
        });
        leftDiv.append(ulFacts);
        subNavWrap.classList.add('what-we-do');
      } else if (labelCell?.textContent.trim() === 'Investor Relations') {
        leftDiv.classList.add('ir-left-div');
        const heading = document.createElement('h4');
        heading.classList.add('left-div-heading');
        const headingLink = document.createElement('a');
        // Read heading text from the first investorSection row's heading cell
        const firstInvestorSectionHeading = megaMenuInvestorSections[0]?.children[0]?.textContent.trim();
        if (firstInvestorSectionHeading) {
          headingLink.textContent = firstInvestorSectionHeading;
        } else {
          headingLink.textContent = 'Investor Relations'; // Fallback if no data
        }
        heading.append(headingLink);
        leftDiv.append(heading);

        const pDesc = document.createElement('p');
        // Read description from the first investorSection row's description cell
        const firstInvestorSectionDesc = megaMenuInvestorSections[0]?.children[1]?.textContent.trim();
        if (firstInvestorSectionDesc) {
          pDesc.textContent = firstInvestorSectionDesc;
        } else {
          pDesc.textContent = 'Group Highlights - Q4 F26'; // Fallback if no data
        }
        leftDiv.append(pDesc);

        const ulFacts = document.createElement('ul');
        megaMenuInvestorSections.forEach((investorRow) => {
          const [
            investorHeadingCell, // Not used for individual facts
            investorDescriptionCell, // Not used for individual facts
            factOneCell,
            factOneLabelCell,
            factTwoCell,
            factTwoLabelCell,
            factThreeCell,
            factThreeLabelCell,
          ] = [...investorRow.children];

          const liFactOne = document.createElement('li');
          liFactOne.classList.add('list-text-red');
          liFactOne.innerHTML = `${factOneCell?.textContent.trim()} <span>${factOneLabelCell?.textContent.trim()}</span>`;
          ulFacts.append(liFactOne);

          const liFactTwo = document.createElement('li');
          liFactTwo.classList.add('list-text-red');
          liFactTwo.innerHTML = `${factTwoCell?.textContent.trim()} <span>${factTwoLabelCell?.textContent.trim()}</span>`;
          ulFacts.append(liFactTwo);

          const liFactThree = document.createElement('li');
          liFactThree.classList.add('list-text-red');
          liFactThree.innerHTML = `${factThreeCell?.textContent.trim()} <span>${factThreeLabelCell?.textContent.trim()}</span>`;
          ulFacts.append(liFactThree);
          moveInstrumentation(investorRow, ulFacts);
        });
        leftDiv.append(ulFacts);
        subNavWrap.classList.add('element-block');
      } else if (labelCell?.textContent.trim() === 'newsroom') {
        leftDiv.classList.add('newsroom-left-div');
        const heading = document.createElement('h4');
        heading.classList.add('left-div-heading');
        const headingLink = document.createElement('a');
        headingLink.textContent = 'Newsroom'; // Hardcoded as per original HTML
        heading.append(headingLink);
        leftDiv.append(heading);

        const latestPressReleaseDiv = document.createElement('div');
        latestPressReleaseDiv.classList.add('latest-two-press-release');
        megaMenuNewsroomPressItems.forEach((pressRow) => {
          const [pressLinkCell, pressTitleCell, pressDateCell, pressCategoryCell] = [...pressRow.children];
          const slidesDiv = document.createElement('div');
          slidesDiv.classList.add('slides');
          const wrapDiv = document.createElement('div');
          wrapDiv.classList.add('wrap');
          slidesDiv.append(wrapDiv);
          const contentDiv = document.createElement('div');
          contentDiv.classList.add('content');
          wrapDiv.append(contentDiv);
          const descDiv = document.createElement('div');
          descDiv.classList.add('desc');
          contentDiv.append(descDiv);

          const pLink = document.createElement('p');
          const anchorPress = document.createElement('a');
          const foundPressLink = pressLinkCell?.querySelector('a');
          if (foundPressLink) anchorPress.href = foundPressLink.href;
          anchorPress.textContent = pressTitleCell?.textContent.trim();
          pLink.append(anchorPress);
          descDiv.append(pLink);

          const dateDiv = document.createElement('div');
          dateDiv.classList.add('date');
          const emDate = document.createElement('em');
          emDate.textContent = pressDateCell?.textContent.trim();
          dateDiv.append(emDate);
          const emCategory = document.createElement('em');
          emCategory.textContent = pressCategoryCell?.textContent.trim();
          dateDiv.append(emCategory);
          descDiv.append(dateDiv);
          latestPressReleaseDiv.append(slidesDiv);
          moveInstrumentation(pressRow, slidesDiv);
        });
        leftDiv.append(latestPressReleaseDiv);
      } else if (labelCell?.textContent.trim() === 'careers') {
        leftDiv.classList.add('career-left-div');
        const heading = document.createElement('h4');
        heading.classList.add('left-div-heading');
        const headingLink = document.createElement('a');
        // Read heading text from the first careerSection row's heading cell
        const firstCareerSectionHeading = megaMenuCareerSections[0]?.children[0]?.textContent.trim();
        if (firstCareerSectionHeading) {
          headingLink.textContent = firstCareerSectionHeading;
        } else {
          headingLink.textContent = 'careers'; // Fallback if no data
        }
        heading.append(headingLink);
        leftDiv.append(heading);

        megaMenuCareerSections.forEach((careerRow) => {
          const [careerHeadingCell, careerDescriptionCell, careerSubDescriptionCell] = [...careerRow.children];
          const desc = document.createElement('p');
          desc.classList.add('left-div-desc');
          desc.innerHTML = careerDescriptionCell?.innerHTML || '';
          leftDiv.append(desc);

          const subDesc = document.createElement('p');
          subDesc.classList.add('left-div-subdesc');
          subDesc.textContent = careerSubDescriptionCell?.textContent.trim();
          leftDiv.append(subDesc);
          moveInstrumentation(careerRow, leftDiv);
        });
        subNavWrap.classList.add('careers-div');
      }

      const clonedHierarchy = hierarchyTree.cloneNode(true);
      // Add class to all <li> elements within the hierarchy tree for styling
      clonedHierarchy.querySelectorAll('li').forEach(liElement => {
        liElement.classList.add('top-level-li'); // Add this class as seen in original HTML for top-level LIs
      });
      transformNestedLists(clonedHierarchy);
      subNavWrap.append(clonedHierarchy);
    }
    moveInstrumentation(row, li);
    li.append(megaMenu);
    ulNav.append(li);
  });

  // Icon Links
  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const ulIconMobile = document.createElement('ul');
  iconNavMobile.append(ulIconMobile);

  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const ulIconDesktop = document.createElement('ul');
  iconNavDesktop.append(ulIconDesktop);

  iconLinkItems.forEach((row) => {
    const [iconCell, linkCell, labelCell] = [...row.children];
    const li = document.createElement('li');
    // Check if the icon is a mail icon based on original HTML, if not, it's a generic icon
    if (labelCell?.textContent.trim() === 'Contact Us') {
      li.classList.add('mail');
    }
    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell?.textContent.trim();

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '21' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      anchor.prepend(optimizedPic);
    }
    li.append(anchor);
    moveInstrumentation(row, li);
    ulIconMobile.append(li.cloneNode(true)); // Add to mobile
    ulIconDesktop.append(li); // Add to desktop
  });

  nav.append(iconNavMobile);
  nav.append(iconNavDesktop);

  // Search functionality (simplified)
  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  searchLiMobile.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const searchAnchorMobile = document.createElement('a');
  searchAnchorMobile.href = '#';
  searchAnchorMobile.setAttribute('data-once', 'search-stop-propagation');
  searchAnchorMobile.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
    </svg>
    <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
    </svg>
    <span data-once="search-stop-propagation"> Search</span>
  `;
  searchLiMobile.append(searchAnchorMobile);
  ulIconMobile.append(searchLiMobile);

  const searchLiDesktop = document.createElement('li');
  searchLiDesktop.classList.add('search');
  searchLiDesktop.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const searchAnchorDesktop = document.createElement('a');
  searchAnchorDesktop.href = '#';
  searchAnchorDesktop.setAttribute('data-once', 'search-stop-propagation');
  searchAnchorDesktop.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
    </svg>
    <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
    </svg>
  `;
  searchLiDesktop.append(searchAnchorDesktop);
  ulIconDesktop.append(searchLiDesktop);

  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
  searchScreenWrap.innerHTML = `
    <div class="wrap" data-once="search-stop-propagation">
      <form action="https://www.mahindra.com/search" method="get" id="search-block-form" accept-charset="UTF-8" data-drupal-form-fields="edit-keys" data-once="search-stop-propagation">
        <div class="search-wrap" data-once="search-stop-propagation">
          <div class="search-icon" data-once="search-stop-propagation">
            <svg viewBox="0 0 21 21" fill="none" data-once="search-stop-propagation">
              <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
            </svg>
          </div>
          <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off" data-once="search-stop-propagation"/>
          <button class="submit-button" data-once="search-stop-propagation">
            <div class="label" data-once="search-stop-propagation"> Submit </div>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation">
              <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path>
            </svg>
          </button>
        </div>
        <div class="searchResultBox" style="display: none;" data-once="search-stop-propagation">
          <div class="swiper scrollSwiper" data-once="search-stop-propagation">
            <div class="swiper-wrapper" data-once="search-stop-propagation">
              <div class="swiper-slide" data-once="search-stop-propagation">
              </div>
            </div>
          </div>
          <div class="swiper-scrollbar" data-once="search-stop-propagation"></div>
        </div>
      </form>
      <div class="search-suggestions-wrap" data-once="search-stop-propagation">
        <div class="label" data-once="search-stop-propagation">Popular Keywords:</div>
        <div class="tokens-wrap" data-once="search-stop-propagation">
          <ul data-once="search-stop-propagation">
            <li data-once="search-stop-propagation">Business</li>
            <li data-once="search-stop-propagation">FY 21</li>
            <li data-once="search-stop-propagation">Brands</li>
            <li data-once="search-stop-propagation">XUV700</li>
            <li data-once="search-stop-propagation">Global</li>
            <li data-once="search-stop-propagation">Nanhi Kali</li>
          </ul>
        </div>
      </div>
      <div class="search-suggestions-wrap" data-once="search-stop-propagation">
        <div class="label" data-once="search-stop-propagation">Recommended for you:</div>
        <div class="tokens-wrap" data-once="search-stop-propagation">
          <ul data-once="search-stop-propagation">
            <li data-once="search-stop-propagation">Annual Report 2021 - 2022</li>
            <li data-once="search-stop-propagation">Leadership Announcement</li>
            <li data-once="search-stop-propagation">Latest Press Release</li>
            <li data-once="search-stop-propagation">Brand Guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  searchLiMobile.append(searchScreenWrap.cloneNode(true));
  searchLiDesktop.append(searchScreenWrap);

  // Anniversary Logo
  const anniversaryLogoDiv = document.createElement('div');
  anniversaryLogoDiv.classList.add('logo', 'year-80-logo');
  const anniversaryLogoLink = document.createElement('a');
  const anniversaryLogoAnchor = anniversaryLogoLinkRow?.querySelector('a');
  if (anniversaryLogoAnchor) {
    anniversaryLogoLink.href = anniversaryLogoAnchor.href;
  }
  const anniversaryLogoPicture = anniversaryLogoRow?.querySelector('picture');
  if (anniversaryLogoPicture) {
    const img = anniversaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    anniversaryLogoLink.append(optimizedPic);
  }
  moveInstrumentation(anniversaryLogoRow, anniversaryLogoLink);
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoLink);
  anniversaryLogoDiv.append(anniversaryLogoLink);
  wrap.append(anniversaryLogoDiv);

  block.replaceChildren(header);

  // Event Listeners for Hamburger and Search
  const searchToggle = header.querySelector('.search');
  const searchScreen = header.querySelector('.search-screen-wrap');
  const hamburgerToggle = header.querySelector('.hamburger');
  const mainNav = header.querySelector('.main-nav');

  if (hamburgerToggle && mainNav) {
    hamburgerToggle.addEventListener('click', () => {
      hamburgerToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
      document.body.classList.toggle('overflow-hidden');
    });
  }

  if (searchToggle && searchScreen) {
    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchToggle.classList.toggle('active');
      searchScreen.classList.toggle('active');
      document.body.classList.toggle('overflow-hidden');
    });

    searchScreen.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
      if (!searchToggle.contains(e.target) && !searchScreen.contains(e.target) && searchScreen.classList.contains('active')) {
        searchToggle.classList.remove('active');
        searchScreen.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
      }
    });
  }

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
