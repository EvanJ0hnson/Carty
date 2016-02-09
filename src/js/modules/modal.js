/**
 * modalWindow
 */
// import loader from './loader';
import * as $u from './utilites';

import hbsModal from '../../templates/modal.hbs';

const uBody = $u.getElement('body');
let uModalWindow = null;
let uModalContent = null;
let uModalBtnClose = null;

export function open(content) {
  $u.appendString(uBody, hbsModal());

  uModalWindow = $u.getElement('#modal');
  uModalContent = $u.getElement('.modal__content');
  uModalBtnClose = $u.getElement('.modal__btn-close');

  uModalWindow.addEventListener('click', (event) => {
    if ((event.target === uModalWindow) || (event.target === uModalBtnClose)) {
      this.close();
    }
  });

  this.update(content);

  $u.removeClass(uModalWindow, 'u-display--none');
  $u.addClass(uBody, 'u-overflow--hidden');
}

export function close() {
  $u.removeClass(uBody, 'u-overflow--hidden');
  $u.addClass(uModalWindow, 'u-display--none');

  $u.remove(uModalWindow);
}

export function update(content) {
  uModalContent.innerHTML = content;
}
