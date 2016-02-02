/**
 * showAjaxSpinner
 */
import hbsLoader from '../../templates/loader.hbs';
const $document = $(document);
const $body = $('body');

export default function loader() {
  $body.append(hbsLoader());

  const $spinner = $('#spinner');

  $document.ajaxStart(() => {
    $spinner.show();
  });

  $document.ajaxComplete(() => {
    $spinner.hide();
  });
}
