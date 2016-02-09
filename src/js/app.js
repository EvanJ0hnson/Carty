'use strict';

import {Cart} from './modules/cart';

/**
 * Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  const currentState = window.location.pathname;
  switch (currentState) {
    case '/':
      const cartInstance = new Cart('cart-widjet');
      cartInstance.init();
      break;
    default:
      console.log('Error: missing state');
      break;
  }
});
