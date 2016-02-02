/**
 * [modalWindow description]
 * @return {[type]} [description]
 */
// import loader from './loader';
// import {disable_scroll, enable_scroll} from './scrollControl';
import hbsModal from '../../templates/modal.hbs';

const $body = $('body');

export function open(modalContent) {
  $body.append(hbsModal({}));

  const $modalWindow = $('#modal');
  const $modalBody = $('.modal__body');
  const $modalBtnClose = $('.modal__btn-close');

  $modalWindow[0].addEventListener('click', (event) => {
    if ((event.target === $modalWindow[0]) || (event.target === $modalBtnClose[0])) {
      this.close();
    }
  });

  $body.toggleClass('u-overflow--hidden');
  $modalWindow.toggleClass('u-display--none', false);

  $modalBody.append(modalContent);

  $modalBody.toggleClass('u-display--none', false);
}

export function close() {
  const $modalWindow = $('#modal');

  $modalWindow.toggleClass('u-display--none', true);

  $body.toggleClass('u-overflow--hidden');

  $modalWindow.remove();
}
