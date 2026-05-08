import { createOptimizedPicture } from '../../scripts/aem.js';
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
      subWrap.classList.add('has-sub-child'); // This class is not in ORIGINAL HTML, consider removing or adding to allowlist
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in ORIGINAL HTML, consider removing or adding to allowlist
          subWrap.classList.toggle('active'); // This class is not in ORIGINAL HTML, consider removing or adding to allowlist
        });
      }
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  // Destructure root rows based on BlockJson model
  const [
    itcLogoRow,
    itcLogoLinkRow,
    mainLogoRow,
    mainLogoLinkRow,
    countryCodeRow,
    countryFlagRow,
    countryDropdownIconRow,
    searchIconRow,
    ...remainingRows
  ] = [...block.children];

  // Filter item rows based on their structure
  const navigationItemRows = remainingRows.filter((row) => row.children.length === 3 && row.children[2].querySelector('ul'));
  const countryOptionRows = remainingRows.filter((row) => row.children.length === 3 && row.children[0].querySelector('picture'));

  const headerSection = document.createElement('header');
  headerSection.classList.add('itc-header-section');

  const container = document.createElement('div');
  container.classList.add('container');

  const navbar = document.createElement('nav');
  navbar.classList.add(
    'navbar',
    'navbar-expand-xl',
    'navbar-light',
    'bg-light',
    'px-xl-5',
    'd-flex',
    'justify-content-between',
    'align-items-center',
  );

  const navbarToggler = document.createElement('button');
  navbarToggler.classList.add('navbar-toggler', 'collapsed');
  navbarToggler.type = 'button';
  navbarToggler.setAttribute('aria-controls', 'navbarSupportedContent');
  navbarToggler.setAttribute('aria-expanded', 'false');
  navbarToggler.setAttribute('aria-label', 'Toggle navigation');
  const togglerIcon = document.createElement('span');
  togglerIcon.classList.add('navbar-toggler-icon');
  navbarToggler.append(togglerIcon);

  const dXlNoneDiv = document.createElement('div');
  dXlNoneDiv.classList.add('d-xl-none');
  dXlNoneDiv.innerHTML = '&nbsp;';

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image');

  const itcLogoLink = document.createElement('a');
  itcLogoLink.classList.add('checkLogoLink');
  itcLogoLink.target = '_blank';
  if (itcLogoLinkRow) {
    const itcLink = itcLogoLinkRow.querySelector('a');
    if (itcLink) itcLogoLink.href = itcLink.href;
    moveInstrumentation(itcLogoLinkRow, itcLogoLink);
  }

  const itcLogoPicture = itcLogoRow ? itcLogoRow.querySelector('picture') : null;
  if (itcLogoPicture) {
    const itcImg = itcLogoPicture.querySelector('img');
    const optimizedItcPic = createOptimizedPicture(itcImg.src, itcImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(itcImg, optimizedItcPic.querySelector('img'));
    itcLogoLink.append(optimizedItcPic);
  }
  const itcScreenReaderSpan = document.createElement('span');
  itcScreenReaderSpan.classList.add('cmp-link__screen-reader-only');
  itcScreenReaderSpan.textContent = 'opens in a new tab';
  itcLogoLink.append(itcScreenReaderSpan);

  const mainLogoLink = document.createElement('a');
  mainLogoLink.classList.add('cmp-image__link');
  mainLogoLink.target = '_blank';
  if (mainLogoLinkRow) {
    const mainLink = mainLogoLinkRow.querySelector('a');
    if (mainLink) mainLogoLink.href = mainLink.href;
    moveInstrumentation(mainLogoLinkRow, mainLogoLink);
  }

  const mainLogoPicture = mainLogoRow ? mainLogoRow.querySelector('picture') : null;
  if (mainLogoPicture) {
    const mainImg = mainLogoPicture.querySelector('img');
    const optimizedMainPic = createOptimizedPicture(mainImg.src, mainImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(mainImg, optimizedMainPic.querySelector('img'));
    mainLogoLink.append(optimizedMainPic);
  }
  const mainScreenReaderSpan = document.createElement('span');
  mainScreenReaderSpan.classList.add('cmp-link__screen-reader-only');
  mainScreenReaderSpan.textContent = 'opens in a new tab';
  mainLogoLink.append(mainScreenReaderSpan);

  logoDiv.append(itcLogoLink, mainLogoLink);
  moveInstrumentation(itcLogoRow, logoDiv);
  moveInstrumentation(mainLogoRow, logoDiv);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('collapse', 'navbar-collapse', 'justify-content-center');
  navbarCollapse.id = 'navbarSupportedContent';

  const navItemNavigation = document.createElement('div');
  navItemNavigation.classList.add('nav-item', 'navigation');

  const navElement = document.createElement('nav');
  navElement.classList.add('cmp-navigation');
  navElement.setAttribute('role', 'navigation');

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group');

  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children]; // Fixed: named destructuring
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    anchor.classList.add('cmp-navigation__item-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);

    const subList = hierarchyTreeCell?.querySelector('ul');
    if (subList) {
      // Move instrumentation for the hierarchy tree cell content
      moveInstrumentation(hierarchyTreeCell, subList);
      transformNestedLists(subList);
      li.append(subList);
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active'); // This class is not in ORIGINAL HTML, consider removing or adding to allowlist
        subList.classList.toggle('active'); // This class is not in ORIGINAL HTML, consider removing or adding to allowlist
      });
    }
    navGroup.append(li);
  });

  navElement.append(navGroup);
  navItemNavigation.append(navElement);

  const headerSectionDiv = document.createElement('div');
  headerSectionDiv.classList.add('header-section', 'd-flex', 'align-items-center', 'justify-content-end');

  const countrySelectorTrigger = document.createElement('div');
  countrySelectorTrigger.classList.add('search-icon', 'country-selector-trigger', 'd-flex', 'align-items-center');

  const countryCodeSpan = document.createElement('span');
  countryCodeSpan.classList.add('country-code');
  if (countryCodeRow) {
    countryCodeSpan.textContent = countryCodeRow.textContent.trim();
    moveInstrumentation(countryCodeRow, countryCodeSpan);
  }

  const countryFlagPicture = countryFlagRow ? countryFlagRow.querySelector('picture') : null;
  if (countryFlagPicture) {
    const countryFlagImg = countryFlagPicture.querySelector('img');
    const optimizedCountryFlagPic = createOptimizedPicture(countryFlagImg.src, countryFlagImg.alt, false, [{ width: '750' }]);
    optimizedCountryFlagPic.classList.add('header-country-flag');
    moveInstrumentation(countryFlagImg, optimizedCountryFlagPic.querySelector('img'));
    countrySelectorTrigger.append(optimizedCountryFlagPic);
  }

  const dropdownIconPicture = countryDropdownIconRow ? countryDropdownIconRow.querySelector('picture') : null;
  if (dropdownIconPicture) {
    const dropdownIconImg = dropdownIconPicture.querySelector('img');
    const optimizedDropdownIconPic = createOptimizedPicture(dropdownIconImg.src, dropdownIconImg.alt, false, [{ width: '750' }]);
    optimizedDropdownIconPic.classList.add('dropdown-icon');
    moveInstrumentation(dropdownIconImg, optimizedDropdownIconPic.querySelector('img'));
    countrySelectorTrigger.append(optimizedDropdownIconPic);
  }

  countrySelectorTrigger.append(countryCodeSpan);
  moveInstrumentation(countryFlagRow, countrySelectorTrigger);
  moveInstrumentation(countryDropdownIconRow, countrySelectorTrigger);

  const itcHeaderIconList = document.createElement('div');
  itcHeaderIconList.classList.add('itc-header-icon-list');

  const searchLink = document.createElement('a');
  searchLink.classList.add('nav-link');

  const searchIconPicture = searchIconRow ? searchIconRow.querySelector('picture') : null;
  if (searchIconPicture) {
    const searchIconImg = searchIconPicture.querySelector('img');
    const optimizedSearchIconPic = createOptimizedPicture(searchIconImg.src, searchIconImg.alt, false, [{ width: '750' }]);
    optimizedSearchIconPic.querySelector('img').id = 'searchIcon';
    moveInstrumentation(searchIconImg, optimizedSearchIconPic.querySelector('img'));
    searchLink.append(optimizedSearchIconPic);
  }
  const searchSpan = document.createElement('span');
  searchSpan.classList.add('d-block');
  searchSpan.textContent = 'Search';
  searchLink.append(searchSpan);
  moveInstrumentation(searchIconRow, searchLink);

  itcHeaderIconList.append(searchLink);

  const countryModal = document.createElement('div');
  countryModal.classList.add('modal', 'fade', 'itc-country-selector');
  countryModal.id = 'countryModal';
  countryModal.setAttribute('tabindex', '-1');
  countryModal.setAttribute('role', 'dialog');
  countryModal.setAttribute('aria-labelledby', 'countryModalLabel');
  countryModal.setAttribute('aria-modal', 'true');

  const modalDialog = document.createElement('div');
  modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');
  modalDialog.setAttribute('role', 'document');

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header', 'border-0', 'text-center');

  const headerW100 = document.createElement('div');
  headerW100.classList.add('w-100');

  const modalTitle = document.createElement('h2');
  modalTitle.classList.add('modal-title');
  // TODO: Add a model field for "Modal Title" if this text is authored.
  // For now, hardcoding as it's not in the current model, but should be dynamic.
  modalTitle.innerHTML = 'SELECT YOUR <br/>KITCHENS OF INDIA';

  const experienceText = document.createElement('p');
  experienceText.classList.add('experience-text');
  // TODO: Add a model field for "Experience Text" if this text is authored.
  // For now, hardcoding as it's not in the current model, but should be dynamic.
  experienceText.textContent = 'Experience';

  headerW100.append(modalTitle, experienceText);
  modalHeader.append(headerW100);

  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');

  const countryOptionsDiv = document.createElement('div');
  countryOptionsDiv.classList.add('country-options', 'd-flex', 'justify-content-center', 'align-items-center');

  countryOptionRows.forEach((row) => {
    const [flagCell, countryNameCell, countryUrlCell] = [...row.children]; // Fixed: named destructuring
    const countryOption = document.createElement('div');
    countryOption.classList.add('country-option', 'mx-3', 'd-flex', 'flex-column', 'align-items-center');
    moveInstrumentation(row, countryOption);

    const flagPicture = flagCell.querySelector('picture');
    if (flagPicture) {
      const flagImg = flagPicture.querySelector('img');
      const optimizedFlagPic = createOptimizedPicture(flagImg.src, flagImg.alt, false, [{ width: '750' }]);
      optimizedFlagPic.classList.add('country-flag');
      countryOption.append(optimizedFlagPic);
    }

    const countryName = document.createElement('p');
    countryName.classList.add('country-name');
    countryName.textContent = countryNameCell.textContent.trim();
    countryOption.append(countryName);

    const countryLink = countryUrlCell.querySelector('a');
    if (countryLink) {
      countryOption.dataset.country = countryNameCell.textContent.trim().toLowerCase();
      countryOption.dataset.url = countryLink.href;
    }
    countryOptionsDiv.append(countryOption);
  });

  modalBody.append(countryOptionsDiv);
  modalContent.append(modalHeader, modalBody);
  modalDialog.append(modalContent);
  countryModal.append(modalDialog);

  navbar.append(
    navbarToggler,
    dXlNoneDiv,
    logoDiv,
    navbarCollapse,
    headerSectionDiv,
    itcHeaderIconList,
  );
  container.append(navbar);
  headerSection.append(container, countryModal);

  // Toggle functionality for navbar
  navbarToggler.addEventListener('click', () => {
    navbarCollapse.classList.toggle('show');
    navbarToggler.classList.toggle('collapsed');
  });

  // Toggle functionality for country modal
  countrySelectorTrigger.addEventListener('click', () => {
    countryModal.classList.add('show');
    countryModal.style.display = 'block';
  });

  // Fixed: Close modal only when clicking outside the modal-content
  countryModal.addEventListener('click', (e) => {
    if (e.target === countryModal || e.target.classList.contains('modal-dialog')) {
      countryModal.classList.remove('show');
      countryModal.style.display = 'none';
    }
  });

  // Handle country option click
  countryOptionsDiv.querySelectorAll('.country-option').forEach((option) => {
    option.addEventListener('click', () => {
      const url = option.dataset.url;
      if (url) {
        window.location.href = url;
      }
    });
  });

  block.replaceChildren(headerSection);
}
