'use strict';

import VTCart from './modules/cart';

/**
 * Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  const currentState = window.location.pathname;
  switch (currentState) {
    case '/':
      const cart = new VTCart('cart-widjet');
      break;
    default:
      console.log('Error: missing state');
      break;
  }
});
