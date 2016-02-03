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
  const $modalContent = $('.modal__content');
  const $modalBtnClose = $('.modal__btn-close');

  $modalWindow[0].addEventListener('click', (event) => {
    if ((event.target === $modalWindow[0]) || (event.target === $modalBtnClose[0])) {
      this.close();
    }
  });

  $body.toggleClass('u-overflow--hidden');
  $modalWindow.toggleClass('u-display--none', false);

  $modalContent.append(modalContent);

  $modalContent.toggleClass('u-display--none', false);
}

export function update(content) {
  const $modalContent = $('.modal__content');

  $modalContent.html(content);
}

export function close() {
  const $modalWindow = $('#modal');

  $modalWindow.toggleClass('u-display--none', true);

  $body.toggleClass('u-overflow--hidden');

  $modalWindow.remove();
}
