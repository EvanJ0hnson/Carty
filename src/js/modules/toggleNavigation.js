/**
 * Toggle Navigation
 */
import * as $u from './utilites';

export function toggleNavigationBar() {
  const $btnToggleNav = $u.getElement('.js-toggleNav');
  const $menuList = $u.getElement('.js-menuList');

  $btnToggleNav.addEventListener('click', () => {
    $u.toggleClass($menuList, 'u-display--flex');
  });

  $menuList.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      $u.toggleClass($menuList, 'u-display--flex');
    }
  });
}
