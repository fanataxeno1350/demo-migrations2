import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [copyrightTextRow, footerNoteRow] = [...block.children];

  const siteFooterBottom = document.createElement('div');
  siteFooterBottom.classList.add('site-footer__bottom');

  const textCenter = document.createElement('div');
  textCenter.classList.add('text-center');

  if (copyrightTextRow) {
    // richtext cells render content directly inside the cell <div>, no inner <div> wrapper
    // so, read innerHTML directly from the row's first child (the cell itself)
    const copyrightTextCell = copyrightTextRow.children[0];
    if (copyrightTextCell) {
      const copyrightP = document.createElement('p');
      moveInstrumentation(copyrightTextRow, copyrightP); // Move instrumentation before setting innerHTML
      copyrightP.innerHTML = copyrightTextCell.innerHTML;
      textCenter.append(copyrightP);
    }
  }

  if (footerNoteRow) {
    // richtext cells render content directly inside the cell <div>, no inner <div> wrapper
    // so, read innerHTML directly from the row's first child (the cell itself)
    const footerNoteCell = footerNoteRow.children[0];
    if (footerNoteCell) {
      const footerNoteP = document.createElement('p');
      moveInstrumentation(footerNoteRow, footerNoteP); // Move instrumentation before setting innerHTML
      // Wrap the entire content of the cell in <small> tags
      footerNoteP.innerHTML = `<small>${footerNoteCell.innerHTML}</small>`;
      textCenter.append(footerNoteP);
    }
  }

  siteFooterBottom.append(textCenter);
  block.replaceChildren(siteFooterBottom);
}
